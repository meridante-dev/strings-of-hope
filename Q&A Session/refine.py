import numpy as np, subprocess
def aud(path, sr=48000, t0=0, dur=None):
    cmd=['ffmpeg','-v','error']
    if t0: cmd+=['-ss',str(t0)]
    if dur: cmd+=['-t',str(dur)]
    cmd+=['-i',path,'-ac','1','-ar',str(sr),'-f','s16le','-']
    raw=subprocess.run(cmd,capture_output=True).stdout
    return np.frombuffer(raw,np.int16).astype(np.float32)/32768.0
SR=48000
MAIN="Video to Use/Video to UseQ&A 22.6 Am improv - chord structure and ethnic.mp4"
ZOOM="GMT20260622-170942_Recording.m4a"
# precise offset near 34min (main) where corr was high
a=aud(MAIN,SR,2030,30); a=a-a.mean()
zb=aud(ZOOM,SR,2030-40,90)  # zoom around expected
best=(-9,0)
for d in np.arange(33.0,40.0,0.02):
    t=int((40-d)*SR)  # index into zb where main t=2030 maps; zb started at 2030-40
    b=zb[t:t+len(a)]
    if len(b)<len(a): continue
    b=b-b.mean()
    c=np.dot(a,b)/(np.linalg.norm(a)*np.linalg.norm(b)+1e-9)
    if c>best[0]: best=(c,d)
print(f"PRECISE offset = {best[1]:.2f}s (corr {best[0]:.2f})  [main = zoom + offset]")
off=best[1]
# quality: spectral high-band energy of Simcha speech, main vs zoom (same moment)
def hf_ratio(x):
    X=np.abs(np.fft.rfft(x*np.hanning(len(x))))
    f=np.fft.rfftfreq(len(x),1/SR)
    lo=X[(f>200)&(f<4000)].mean(); hi=X[(f>10000)&(f<20000)].mean()
    return hi/(lo+1e-9), f[np.where(np.cumsum(X)>0.99*X.sum())[0][0]]
am=aud(MAIN,SR,2050,8); az=aud(ZOOM,SR,2050-off,8)
rm,cm=hf_ratio(am); rz,cz=hf_ratio(az)
print(f"MAIN  : hi/lo={rm:.4f}  99% energy below {cm:.0f} Hz")
print(f"ZOOM  : hi/lo={rz:.4f}  99% energy below {cz:.0f} Hz")
print(f"main RMS {np.sqrt((am**2).mean()):.3f}  zoom RMS {np.sqrt((az**2).mean()):.3f}")
