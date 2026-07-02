import numpy as np, scipy.io.wavfile as wav, scipy.signal as sig
sr, main = wav.read('samples/main48.wav'); main=main.astype(np.float32)/32768.0
_, zoom = wav.read('samples/zoom48.wav'); zoom=zoom.astype(np.float32)/32768.0
n=min(len(main),len(zoom)); main=main[:n]; zoom=zoom[:n]
mm=main.mean(1); zm=zoom.mean(1)
CR=1000; bs=sr//CR
def env(x):
    m=len(x)//bs*bs; e=np.abs(x[:m]).reshape(-1,bs).max(1)
    return sig.lfilter([0.3],[1,-0.7],e)
me=env(mm); ze=env(zm); L=min(len(me),len(ze)); me=me[:L]; ze=ze[:L]
THR_M=0.012; THR_Z=0.012; HOLD=int(0.22*CR)
main_quiet=(me<THR_M).astype(np.float32)
# require quiet sustained for HOLD (min-filter): quiet_run = product over window
qrun=sig.lfilter(np.ones(HOLD),[1],main_quiet)  # counts quiet in last HOLD
open_allowed=(qrun>=HOLD-1).astype(np.float32)   # quiet for whole window
gate=open_allowed*((ze>THR_Z).astype(np.float32))
k=int(0.04*CR); gate=sig.lfilter(np.ones(k)/k,[1],gate); gate=np.clip(gate*1.2,0,1)
g=np.repeat(gate,bs)[:n]; g=np.column_stack([g,g])
out=main+zoom*g
peak=np.abs(out).max();  out= out*(0.99/peak) if peak>0.99 else out
wav.write('samples/C2_gated.wav', sr, (out*32767).astype(np.int16))
def rms(x): return np.sqrt((x**2).mean())*100
print("verify: OUT should == MAIN during Simcha (diff~0), fill in at 28s")
for s in range(0,48,4):
    a=main[s*sr:(s+4)*sr]; o=out[s*sr:(s+4)*sr]; d=rms(o-a[:len(o)])
    print(f"  {s:>2}s  main {rms(a):5.2f}  out {rms(o):5.2f}  diff {d:5.2f}")
# build the 3 comparison clips for listening
