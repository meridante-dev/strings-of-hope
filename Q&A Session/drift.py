import numpy as np, subprocess
def aud(path, sr=8000):
    raw=subprocess.run(['ffmpeg','-v','error','-i',path,'-ac','1','-ar',str(sr),'-f','s16le','-'],capture_output=True).stdout
    return np.frombuffer(raw,np.int16).astype(np.float32)/32768.0
SR=8000
MAIN="Video to Use/Video to UseQ&A 22.6 Am improv - chord structure and ethnic.mp4"
ZOOM="GMT20260622-170942_Recording.m4a"
m=aud(MAIN); z=aud(ZOOM)
def best_local_offset(t_main, base_off=36.8, search=8.0, win=40.0):
    # main window
    a=m[int(t_main*SR):int((t_main+win)*SR)]
    if len(a)<win*SR*0.5: return None
    a=a-a.mean()
    best=(-9,0)
    for d in np.arange(base_off-search, base_off+search, 0.1):
        t_zoom=t_main-d
        if t_zoom<0: continue
        b=z[int(t_zoom*SR):int(t_zoom*SR)+len(a)]
        if len(b)<len(a): continue
        b=b-b.mean()
        c=np.dot(a,b)/(np.linalg.norm(a)*np.linalg.norm(b)+1e-9)
        if c>best[0]: best=(c,d)
    return best
print("scanning offset across the timeline (hypothesis ~36.8s):")
for tmin in range(2,110,8):
    r=best_local_offset(tmin*60)
    if r: print(f"  main {tmin:3d}min: best offset {r[1]:6.1f}s  corr={r[0]:.2f}")
