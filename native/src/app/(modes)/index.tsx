import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { Body, Card, NoteDot, Overline } from '@/components/soh-ui';
import { usePalette } from '@/constants/palette';
import { BaseKey, computeScale, Family } from '@/lib/music';
import { KEYS12, PARENT_WORLDS, ParentWorld, buildScaleContext } from '@/lib/modes-data';

export default function ModesScreen() {
  const pal = usePalette();
  const [keyName, setKeyName] = useState('C');
  const [world, setWorld] = useState<ParentWorld>(PARENT_WORLDS[0]);
  const [active, setActive] = useState(0);

  const ctx = useMemo(() => buildScaleContext(keyName, world), [keyName, world]);
  const mode = ctx.modes[active];
  const tone = pal.m[world.toneIndex];
  const modeTone = pal.m[mode.rootIndex % 7];

  const fam: Family = {
    key: world.key, name: world.name, cat: world.key, formula: world.formula,
    related: '', mood: '', good: [],
  };
  const harpRows = (['E♭', 'C'] as BaseKey[]).map((base) => {
    const r = computeScale(base, keyName, fam);
    return { base, ok: !!r, up: r && r.leversUp.length ? r.leversUp.join(' · ') : 'none' };
  });

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: pal.bg0 }}
      contentContainerStyle={{ paddingBottom: 120, gap: 18 }}>
      {/* Key selector */}
      <View style={{ gap: 8 }}>
        <Overline style={{ marginLeft: 18 }}>What key are you tuned to?</Overline>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 18, gap: 8 }}>
          {KEYS12.map((k) => {
            const on = k === keyName;
            return (
              <Pressable
                key={k}
                onPress={() => {
                  setKeyName(k);
                }}
                style={{
                  minWidth: 46,
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  borderRadius: 14,
                  borderCurve: 'continuous',
                  alignItems: 'center',
                  backgroundColor: on ? pal.gold : pal.surface2,
                  borderWidth: 1,
                  borderColor: on ? pal.gold : pal.line,
                }}>
                <Text style={{ color: on ? pal.onAccent : pal.ink, fontWeight: '700', fontSize: 16 }}>{k}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* World selector */}
      <View style={{ gap: 8 }}>
        <Overline style={{ marginLeft: 18 }}>Parent world</Overline>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 18, gap: 8 }}>
          {PARENT_WORLDS.map((w) => {
            const on = w.key === world.key;
            const c = pal.m[w.toneIndex];
            return (
              <Pressable
                key={w.key}
                onPress={() => {
                  setWorld(w);
                  setActive(0);
                }}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 999,
                  backgroundColor: on ? c : pal.surface2,
                  borderWidth: 1,
                  borderColor: on ? c : pal.line,
                }}>
                <Text style={{ color: on ? pal.onAccent : pal.ink, fontWeight: '600', fontSize: 15 }}>
                  {w.name.split(' · ')[0]}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <Body style={{ marginHorizontal: 18, marginTop: 2 }}>{world.blurb}</Body>
      </View>

      {/* Parent scale ring of notes */}
      <View style={{ paddingHorizontal: 18, gap: 10 }}>
        <Overline style={{ color: tone }}>
          {keyName} {world.name.split(' · ')[0]} — the mother scale
        </Overline>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {ctx.parentNotes.map((n, i) => (
            <NoteDot key={i} label={n} accent={tone} active={i === mode.rootIndex} size={40} />
          ))}
        </View>
      </View>

      {/* Mode selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 18, gap: 8 }}>
        {ctx.modes.map((m, i) => {
          const on = i === active;
          const c = pal.m[m.rootIndex % 7];
          return (
            <Pressable
              key={i}
              onPress={() => setActive(i)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 9,
                borderRadius: 999,
                backgroundColor: on ? c : 'transparent',
                borderWidth: 1.5,
                borderColor: on ? c : pal.line2,
              }}>
              <Text style={{ color: on ? pal.onAccent : pal.inkSoft, fontWeight: '600', fontSize: 14 }}>
                {m.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Active mode detail */}
      <Animated.View key={`${keyName}-${world.key}-${active}`} entering={FadeInDown.duration(280)} style={{ paddingHorizontal: 18 }}>
        <Card style={{ gap: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <NoteDot label={mode.root} accent={modeTone} active size={54} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: modeTone, fontSize: 24, fontWeight: '800', letterSpacing: -0.4 }}>
                {mode.name}
              </Text>
              <Body style={{ marginTop: 2 }}>{mode.mood}</Body>
            </View>
          </View>

          {/* Scale notes with character highlights */}
          <View style={{ gap: 10 }}>
            <Overline style={{ color: modeTone }}>The scale</Overline>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {mode.notes.map((n, i) => {
                const ch = mode.character.find((c) => c.deg === i + 1);
                return (
                  <View key={i} style={{ alignItems: 'center', gap: 4 }}>
                    <NoteDot label={n} accent={modeTone} active={i === 0 || !!ch} size={40} />
                    <Text style={{ color: ch ? modeTone : 'transparent', fontSize: 11, fontWeight: '700' }}>
                      {ch ? ch.sym : '·'}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Character note line */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: modeTone }} />
            <Text style={{ color: pal.inkSoft, fontSize: 14, flex: 1 }}>
              {mode.character.length
                ? `Flavor vs the major scale: ${mode.character.map((c) => c.sym).join(', ')}`
                : `No altered tones — the pure ${mode.ref}.`}
            </Text>
          </View>

          {/* Home chord */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={{ color: pal.inkFaint, fontSize: 13, fontWeight: '600' }}>Home chord</Text>
            <Text
              style={{
                color: pal.ink,
                fontWeight: '700',
                fontSize: 15,
                backgroundColor: pal.surface2,
                borderRadius: 8,
                paddingHorizontal: 10,
                paddingVertical: 4,
                overflow: 'hidden',
              }}>
              {mode.chord}
            </Text>
            <Text style={{ color: pal.inkFaint, fontSize: 13 }}>{mode.chordNotes.join(' · ')}</Text>
          </View>
        </Card>
      </Animated.View>

      {/* On your harp */}
      <Animated.View entering={FadeIn.duration(300)} style={{ paddingHorizontal: 18 }}>
        <Card style={{ gap: 12, backgroundColor: pal.surface2 }}>
          <Overline>On your harp</Overline>
          {harpRows.map((r) => (
            <View key={r.base} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ color: pal.ink, fontWeight: '700', fontSize: 15 }}>{r.base} harp</Text>
              {r.ok ? (
                <Text style={{ color: pal.inkSoft, fontSize: 14 }}>
                  levers up: <Text style={{ color: pal.gold, fontWeight: '700' }}>{r.up}</Text>
                </Text>
              ) : (
                <Text style={{ color: pal.inkFaint, fontSize: 14, fontStyle: 'italic' }}>needs retuning</Text>
              )}
            </View>
          ))}
        </Card>
      </Animated.View>
    </ScrollView>
  );
}
