import numpy as np, scipy.io.wavfile as wav, scipy.signal as sig, sys
def gate_signal(me, ze, CR, THR_M=0.025, THR_Z=0.015, HOLD_s=0.18):
    HOLD=int(HOLD_s*CR)
    mq=(me<THR_M).astype(np.float32)
    qrun=sig.lfilter(np.ones(HOLD),[1],mq)
    raw=((qrun>=HOLD-1)&(ze>THR_Z)).astype(np.float32)
    # asymmetric smoothing: fast close (~8ms), smooth open (~45ms)
    a_open=1-np.exp(-1/(0.045*CR)); a_close=1-np.exp(-1/(0.008*CR))
    g=np.empty_like(raw); prev=0.0
    for i,r in enumerate(raw):
        a=a_open if r>prev else a_close
        prev=prev+a*(r-prev); g[i]=prev
    return np.clip(g*1.25,0,1)

if __name__=="__main__":
    sr, main = wav.read('samples/main48.wav'); main=main.astype(np.float32)/32768.0
    _, zoom = wav.read('samples/zoom48.wav'); zoom=zoom.astype(np.float32)/32768.0
    n=min(len(main),len(zoom)); main=main[:n]; zoom=zoom[:n]
    CR=1000; bs=sr//CR
    def env(x):
        m=len(x)//bs*bs; e=np.abs(x[:m]).reshape(-1,bs).max(1)
        return sig.lfilter([0.25],[1,-0.75],e)
    me=env(main.mean(1)); ze=env(zoom.mean(1)); L=min(len(me),len(ze)); me=me[:L]; ze=ze[:L]
    g=gate_signal(me,ze,CR); g=np.repeat(g,bs)[:n]; g=np.column_stack([g,g])
    out=main+zoom*g; peak=np.abs(out).max(); out=out*(0.99/peak) if peak>0.99 else out
    wav.write('samples/C2_gated.wav',sr,(out*32767).astype(np.int16))
    def rms(x): return np.sqrt((x**2).mean())*100
    for s in range(0,48,4):
        a=main[s*sr:(s+4)*sr]; o=out[s*sr:(s+4)*sr]; d=rms(o-a[:len(o)])
        tag="PARTICIPANT" if rms(a)<2.5 else "simcha"
        print(f"  {s:>2}s {tag:11s} main {rms(a):5.2f} out {rms(o):5.2f} diff {d:5.2f}")
