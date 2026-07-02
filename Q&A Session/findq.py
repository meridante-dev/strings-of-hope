import numpy as np, subprocess
def aud(path,sr=8000):
    raw=subprocess.run(['ffmpeg','-v','error','-i',path,'-ac','1','-ar',str(sr),'-f','s16le','-'],capture_output=True).stdout
    return np.frombuffer(raw,np.int16).astype(np.float32)/32768.0
SR=8000; OFF=36.76
MAIN="Video to Use/Video to UseQ&A 22.6 Am improv - chord structure and ethnic.mp4"
ZOOM="GMT20260622-170942_Recording.m4a"
m=aud(MAIN); z=aud(ZOOM)
hz=4; hop=SR//hz
def env(a): return np.sqrt(np.maximum(0,np.add.reduceat(a*a,np.arange(0,len(a)-hop,hop))/hop))
em=env(m); ez=env(z)
mmed=np.median(em); zmed=np.median(ez)
# participant question: main quiet, zoom loud, sustained. zoom index = main_index - OFF
cands=[]
for i in range(int(60*hz), len(em)-int(20*hz)):
    zt=i-int(OFF*hz)
    if zt<0 or zt>=len(ez): continue
    # window 6s
    w=slice(i,i+6*hz); wz=slice(zt,zt+6*hz)
    if em[w].mean()<mmed*0.5 and ez[wz].mean()>zmed*1.3:
        cands.append((i/hz, em[w].mean()/mmed, ez[wz].mean()/zmed))
# merge nearby
merged=[]
for t,mr,zr in cands:
    if merged and t-merged[-1][0]<10: continue
    merged.append((t,mr,zr))
print(f"candidate participant-question moments (main quiet, zoom loud): {len(merged)}")
for t,mr,zr in merged[:15]:
    print(f"  main {int(t//60)}:{int(t%60):02d}  (mainLvl {mr:.2f}x  zoomLvl {zr:.2f}x)")
