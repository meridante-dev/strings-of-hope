import numpy as np, scipy.signal as sig, subprocess, os, sys
MAIN="Video to Use/Video to UseQ&A 22.6 Am improv - chord structure and ethnic.mp4"
ZOOM="GMT20260622-170942_Recording.m4a"
DELAY=36.76
def decode(path, args):
    return subprocess.run(['ffmpeg','-v','error','-i',path]+args+['-f','s16le','-'],capture_output=True).stdout
print("decoding envelopes (8k mono)...", flush=True)
m8=np.frombuffer(decode(MAIN,['-ac','1','-ar','8000']),np.int16).astype(np.float32)/32768.0
z8=np.frombuffer(decode(ZOOM,['-af',f'adelay={int(DELAY*1000)}','-ac','1','-ar','8000']),np.int16).astype(np.float32)/32768.0
CR=1000; bs8=8000//CR
def env(x):
    m=len(x)//bs8*bs8; e=np.abs(x[:m]).reshape(-1,bs8).max(1)
    return sig.lfilter([0.25],[1,-0.75],e)
me=env(m8); ze=env(z8); L=min(len(me),len(ze))
# pad ze to me length if zoom shorter
if len(ze)<len(me): ze=np.concatenate([ze,np.zeros(len(me)-len(ze),np.float32)])
me=me[:len(me)]; ze=ze[:len(me)]; L=len(me)
print(f"control samples={L} (~{L/CR/60:.1f}min). computing gate...", flush=True)
THR_M,THR_Z,HOLD=0.025,0.015,int(0.18*CR)
mq=(me<THR_M).astype(np.float32)
qrun=sig.lfilter(np.ones(HOLD),[1],mq)
raw=((qrun>=HOLD-1)&(ze>THR_Z)).astype(np.float32)
a_open=1-np.exp(-1/(0.045*CR)); a_close=1-np.exp(-1/(0.008*CR))
g=np.empty_like(raw); prev=0.0
for i,r in enumerate(raw):
    a=a_open if r>prev else a_close; prev+=a*(r-prev); g[i]=prev
g=np.clip(g*1.25,0,1).astype(np.float32)
np.save('gate_ctrl.npy',g)
print("gate done. decoding full 48k stereo...", flush=True)
SR=48000; bs=SR//CR
main_raw=decode(MAIN,['-ac','2','-ar','48000']); 
m=np.frombuffer(main_raw,np.int16).reshape(-1,2); del main_raw
zoom_raw=decode(ZOOM,['-af',f'adelay={int(DELAY*1000)}|{int(DELAY*1000)}','-ac','2','-ar','48000'])
z=np.frombuffer(zoom_raw,np.int16).reshape(-1,2); del zoom_raw
N=len(m)
gup=np.repeat(g,bs)
if len(gup)<N: gup=np.concatenate([gup,np.zeros(N-len(gup),np.float32)])
gup=gup[:N]
if len(z)<N: z=np.concatenate([z,np.zeros((N-len(z),2),np.int16)])
z=z[:N]
print(f"mixing {N/SR/60:.1f}min...", flush=True)
out=np.empty((N,2),np.int16)
CH=SR*120
for s in range(0,N,CH):
    e=min(N,s+CH)
    mf=m[s:e].astype(np.float32); zf=z[s:e].astype(np.float32); gf=gup[s:e,None]
    o=mf+zf*gf
    np.clip(o,-32767,32767,out=o)
    out[s:e]=o.astype(np.int16)
out.tofile('out_audio.raw')
print("audio written", flush=True)
