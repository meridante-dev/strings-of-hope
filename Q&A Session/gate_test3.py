import numpy as np, scipy.io.wavfile as wav, scipy.signal as sig
sr, main = wav.read('samples/main48.wav'); main=main.astype(np.float32)/32768.0
_, zoom = wav.read('samples/zoom48.wav'); zoom=zoom.astype(np.float32)/32768.0
n=min(len(main),len(zoom)); main=main[:n]; zoom=zoom[:n]
mm=main.mean(1); zm=zoom.mean(1)
CR=1000; bs=sr//CR
def env(x):
    m=len(x)//bs*bs; e=np.abs(x[:m]).reshape(-1,bs).max(1)
    return sig.lfilter([0.25],[1,-0.75],e)
me=env(mm); ze=env(zm); L=min(len(me),len(ze)); me=me[:L]; ze=ze[:L]
def build(THR_M, THR_Z, HOLD_s):
    HOLD=int(HOLD_s*CR)
    mq=(me<THR_M).astype(np.float32)
    qrun=sig.lfilter(np.ones(HOLD),[1],mq)
    openA=(qrun>=HOLD-1).astype(np.float32)
    gate=openA*((ze>THR_Z).astype(np.float32))
    k=int(0.05*CR); gate=sig.lfilter(np.ones(k)/k,[1],gate); gate=np.clip(gate*1.3,0,1)
    g=np.repeat(gate,bs)[:n]; return np.column_stack([g,g])
def rms(x): return np.sqrt((x**2).mean())*100
for THR_M in [0.025,0.035]:
    g=build(THR_M,0.015,0.18); out=main+zoom*g
    print(f"--- THR_M={THR_M} ---")
    for s in [4,16,24,28,32,40]:
        a=main[s*sr:(s+4)*sr]; o=out[s*sr:(s+4)*sr]; d=rms(o-a[:len(o)])
        tag = "PARTICIPANT" if rms(a)<2.5 else "simcha"
        print(f"  {s:>2}s {tag:11s} main {rms(a):5.2f} out {rms(o):5.2f} diff {d:5.2f}")
# final choice
g=build(0.035,0.015,0.18); out=main+zoom*g
peak=np.abs(out).max(); out=out*(0.99/peak) if peak>0.99 else out
wav.write('samples/C2_gated.wav',sr,(out*32767).astype(np.int16))
print("saved THR_M=0.035")
