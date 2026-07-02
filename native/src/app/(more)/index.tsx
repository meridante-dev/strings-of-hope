import { Link } from 'expo-router';
import { Image } from 'expo-image';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Card, Overline } from '@/components/soh-ui';
import { usePalette } from '@/constants/palette';

interface Tool {
  icon: string;
  label: string;
  sub: string;
  href?: string;
  toneIndex: number;
}

const TOOLS: Tool[] = [
  { icon: 'book.closed.fill', label: 'Journey Through the Modes', sub: 'A guided lesson — mode by mode', toneIndex: 0, href: '/(modes)' },
  { icon: 'pianokeys', label: 'Scales & Chords', sub: 'Diatonic chords in every key', toneIndex: 4 },
  { icon: 'slider.horizontal.3', label: 'Lever Trainer', sub: 'Master your lever changes', toneIndex: 1 },
  { icon: 'magnifyingglass', label: 'Tuning Explorer', sub: 'Every clean scale your harp can reach', toneIndex: 3 },
  { icon: 'figure.mind.and.body', label: 'Practice Room', sub: 'Focused, timed sessions', toneIndex: 2 },
  { icon: 'music.note.list', label: 'Repertoire', sub: 'Pieces to learn and revisit', toneIndex: 5 },
  { icon: 'location.north.line.fill', label: 'Compass to Jerusalem', sub: 'Turn toward the holy city', toneIndex: 6 },
  { icon: 'sparkles', label: 'AI Coach', sub: 'Ask anything about your harp', toneIndex: 0 },
  { icon: 'person.crop.circle', label: 'Harp Profile', sub: 'Your strings, levers and tuning', toneIndex: 1 },
  { icon: 'calendar', label: 'Journal', sub: 'Your practice, over time', toneIndex: 4 },
];

export default function MoreScreen() {
  const pal = usePalette();
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: pal.bg0 }}
      contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 120, gap: 10 }}>
      <Overline style={{ marginLeft: 2, marginBottom: 4 }}>The full companion</Overline>
      {TOOLS.map((t) => {
        const tint = pal.m[t.toneIndex];
        const row = (
          <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14 }}>
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                borderCurve: 'continuous',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: tint + '22',
              }}>
              <Image source={`sf:${t.icon}`} tintColor={tint} style={{ width: 22, height: 22 }} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: pal.ink, fontSize: 16, fontWeight: '700' }}>{t.label}</Text>
              <Text style={{ color: pal.inkFaint, fontSize: 13, fontWeight: '500', marginTop: 1 }}>{t.sub}</Text>
            </View>
            <Image
              source={t.href ? 'sf:chevron.right' : 'sf:clock'}
              tintColor={pal.inkFaint}
              style={{ width: t.href ? 12 : 16, height: t.href ? 15 : 16 }}
            />
          </Card>
        );
        return t.href ? (
          <Link key={t.label} href={t.href as any} asChild>
            <Pressable>{row}</Pressable>
          </Link>
        ) : (
          <View key={t.label}>{row}</View>
        );
      })}
    </ScrollView>
  );
}
