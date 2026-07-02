import numpy as np, scipy.io.wavfile as wav, scipy.signal as sig
sr, main = wav.read('samples/main48.wav'); main = main.astype(np.float32)/32768.0
sr2, zoom = wav.read('samples/zoom48.wav'); zoom = zoom.astype(np.float32)/32768.0
n = min(len(main), len(zoom)); main=main[:n]; zoom=zoom[:n]
mm = main.mean(1); zm = zoom.mean(1)
# control-rate envelopes (1000 Hz): block-max of |x|
CR=1000; bs=sr//CR
def env(x):
    m=len(x)//bs*bs
    e=np.abs(x[:m]).reshape(-1,bs).max(1)
    # one-pole smooth (release) so it follows speech
    return sig.lfilter([0.3],[1,-0.7], e)
me=env(mm); ze=env(zm); L=min(len(me),len(ze)); me=me[:L]; ze=ze[:L]
THR_M=0.012; THR_Z=0.012
gate = ((me<THR_M) & (ze>THR_Z)).astype(np.float32)   # open only: Simcha silent AND participant talking
# require sustained (avoid chatter): hold-open small, and smooth ramps
# fast close when main active is implicit (gate=0 immediately). smooth edges ~40ms
k=int(0.04*CR); gate=sig.lfilter(np.ones(k)/k,[1],gate)
gate=np.clip(gate*1.2,0,1)
# upsample gate to audio rate
g = np.repeat(gate, bs)[:n]
g = np.column_stack([g,g])
out = main + zoom*g
# headroom
peak=np.abs(out).max(); 
if peak>0.99: out*=0.99/peak
wav.write('samples/C2_gated.wav', sr, (out*32767).astype(np.int16))
# verification: per 4s, compare main vs out (should match when Simcha talks; differ when participant)
def rms(x): return np.sqrt((x**2).mean())*100
print(f"{'sec':>4} {'MAIN':>6} {'OUT':>6} {'diff':>6}  note")
for s in range(0,48,4):
    a=main[s*sr:(s+4)*sr]; o=out[s*sr:(s+4)*sr]
    d=rms(o-a[:len(o)])
    note="participant filled in" if d>2 else "matches main (no bleed)"
    print(f"{s:>4} {rms(a):>6.2f} {rms(o):>6.2f} {d:>6.2f}  {note}")
