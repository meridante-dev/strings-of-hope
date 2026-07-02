import { Link } from 'expo-router';
import { Image } from 'expo-image';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Body, Card, NoteDot, Overline, Title } from '@/components/soh-ui';
import { usePalette } from '@/constants/palette';
import { PARENT_WORLDS, buildScaleContext, dayOfYear, verseOfDay } from '@/lib/modes-data';

function greeting(h: number) {
  if (h < 5) return 'Peace to you tonight';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 21) return 'Good evening';
  return 'Peace to you tonight';
}

export default function TodayScreen() {
  const pal = usePalette();
  const now = new Date();
  const verse = verseOfDay(now);
  const dateLine = now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  // Deterministic "mode of the day" across the 7 major modes.
  const doy = dayOfYear(now);
  const ctx = buildScaleContext('C', PARENT_WORLDS[0]);
  const focus = ctx.modes[doy % 7];
  const tone = pal.m[focus.rootIndex];

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: pal.bg0 }}
      contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 120, gap: 16 }}>
      {/* Greeting */}
      <View style={{ gap: 4, paddingTop: 4 }}>
        <Text style={{ color: pal.ink, fontSize: 26, fontWeight: '800', letterSpacing: -0.6 }}>
          {greeting(now.getHours())}
        </Text>
        <Text style={{ color: pal.inkFaint, fontSize: 14, fontWeight: '600' }}>{dateLine}</Text>
      </View>

      {/* Verse of the day — the threefold cord */}
      <Card
        style={{
          backgroundColor: pal.surface2,
          experimental_backgroundImage: `linear-gradient(150deg, ${pal.surface} 0%, ${pal.surface2} 60%, ${pal.petalRoot} 140%)`,
        }}>
        <Overline>Verse of the day</Overline>
        <Text
          selectable
          style={{
            color: pal.ink,
            fontSize: 20,
            lineHeight: 30,
            fontWeight: '500',
            marginTop: 10,
            letterSpacing: -0.2,
          }}>
          “{verse.text}”
        </Text>
        <Text style={{ color: pal.gold, fontSize: 14, fontWeight: '700', marginTop: 12 }}>{verse.ref}</Text>
      </Card>

      {/* Today's mode focus */}
      <Link href="/(modes)" asChild>
        <Pressable>
          <Card style={{ gap: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Overline style={{ color: tone }}>Today’s mode</Overline>
              <Image source="sf:chevron.right" tintColor={pal.inkFaint} style={{ width: 13, height: 16 }} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <NoteDot label={focus.root} accent={tone} active size={52} />
              <View style={{ flex: 1 }}>
                <Title style={{ color: tone }}>{focus.name}</Title>
                <Body style={{ marginTop: 2 }}>{focus.mood}</Body>
              </View>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {focus.notes.map((n, i) => (
                <NoteDot
                  key={i}
                  label={n}
                  accent={tone}
                  active={focus.character.some((c) => c.noteIndex === (focus.rootIndex + i) % 7)}
                  size={32}
                />
              ))}
            </View>
          </Card>
        </Pressable>
      </Link>

      {/* Quick actions */}
      <Overline style={{ marginTop: 6, marginLeft: 2 }}>Begin</Overline>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <QuickTile href="/(modes)" icon="circle.hexagongrid.fill" label="Modes" sub="Explore the wheel" tint={pal.m[0]} />
        <QuickTile href="/(tune)" icon="tuningfork" label="Tune" sub="Harp & drones" tint={pal.m[1]} />
      </View>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <QuickTile href="/(tune)" icon="metronome.fill" label="Rhythm" sub="Keep time" tint={pal.m[3]} />
        <QuickTile href="/(more)" icon="square.grid.2x2.fill" label="More" sub="All tools" tint={pal.m[5]} />
      </View>
    </ScrollView>
  );
}

function QuickTile({
  href,
  icon,
  label,
  sub,
  tint,
}: {
  href: string;
  icon: string;
  label: string;
  sub: string;
  tint: string;
}) {
  const pal = usePalette();
  return (
    <Link href={href as any} asChild>
      <Pressable style={{ flex: 1 }}>
        <Card style={{ gap: 10, padding: 16 }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              borderCurve: 'continuous',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: tint + '22',
            }}>
            <Image source={`sf:${icon}`} tintColor={tint} style={{ width: 22, height: 22 }} />
          </View>
          <View>
            <Text style={{ color: pal.ink, fontSize: 17, fontWeight: '700' }}>{label}</Text>
            <Text style={{ color: pal.inkFaint, fontSize: 13, fontWeight: '500', marginTop: 1 }}>{sub}</Text>
          </View>
        </Card>
      </Pressable>
    </Link>
  );
}
