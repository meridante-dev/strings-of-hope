import numpy as np, subprocess
def env(path, hz=8, sr=8000):
    raw=subprocess.run(['ffmpeg','-v','error','-i',path,'-ac','1','-ar',str(sr),'-f','s16le','-'],capture_output=True).stdout
    a=np.frombuffer(raw,np.int16).astype(np.float32)/32768.0
    hop=sr//hz
    e=np.sqrt(np.maximum(0,np.add.reduceat(a*a,np.arange(0,len(a)-hop,hop))/hop))
    return e
HZ=8
MAIN="Video to Use/Video to UseQ&A 22.6 Am improv - chord structure and ethnic.mp4"
ZOOM="GMT20260622-170942_Recording.m4a"
em=env(MAIN,HZ); ez=env(ZOOM,HZ)
print(f"main env {len(em)/HZ:.0f}s, zoom env {len(ez)/HZ:.0f}s")
def xcorr_lag(a,b):
    n=1<<int(np.ceil(np.log2(len(a)+len(b))))
    fa=np.fft.rfft(a-a.mean(),n); fb=np.fft.rfft(b-b.mean(),n)
    c=np.fft.irfft(fa*np.conj(fb),n)
    c=np.concatenate([c[-(len(b)-1):],c[:len(a)]])
    lag=np.argmax(c)-(len(b)-1)
    return lag, c.max()/ (np.linalg.norm(a-a.mean())*np.linalg.norm(b-b.mean())+1e-9)
# global: find lag of zoom vs main
lag,score=xcorr_lag(em,ez)
print(f"GLOBAL best lag = {lag/HZ:.2f}s (zoom starts {lag/HZ:.1f}s into main), norm-corr peak={score:.3f}")
# drift check: correlate 3 chunks of main against zoom locally
def local(name, m0):
    seg=em[m0:m0+60*HZ]  # 60s window of main
    l,s=xcorr_lag(ez, seg)  # where does this main-window sit in zoom
    print(f"  {name}: main@{m0/HZ:.0f}s -> zoom@{l/HZ:.0f}s (implied offset {(m0-l)/HZ:+.1f}s) corr={s:.3f}")
local("start", 5*60*HZ)
local("mid",   50*60*HZ)
local("end",   95*60*HZ)
