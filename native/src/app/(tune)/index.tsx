import { Image } from 'expo-image';
import { ScrollView, Text, View } from 'react-native';

import { Body, Card, NoteDot, Overline } from '@/components/soh-ui';
import { usePalette } from '@/constants/palette';
import { BASE_TUNING } from '@/lib/modes-data';

const HARP_STRINGS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export default function TuneScreen() {
  const pal = usePalette();
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: pal.bg0 }}
      contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 120, gap: 16 }}>
      {/* Harp tuner */}
      <Card style={{ gap: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Image source="sf:tuningfork" tintColor={pal.gold} style={{ width: 22, height: 22 }} />
          <Text style={{ color: pal.ink, fontSize: 19, fontWeight: '700' }}>Harp Tuner</Text>
        </View>
        <Body>Your base tuning — three flats: E♭, A♭, B♭. Lever-down pitches for each string.</Body>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {HARP_STRINGS.map((L) => (
            <NoteDot key={L} label={BASE_TUNING[L]} accent={pal.gold} size={42} />
          ))}
        </View>
        <PendingNote pal={pal} text="Live pitch detection (microphone) arrives in the native audio pass." />
      </Card>

      {/* Drone */}
      <Card style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Image source="sf:waveform" tintColor={pal.m[1]} style={{ width: 22, height: 22 }} />
          <Text style={{ color: pal.ink, fontSize: 19, fontWeight: '700' }}>Drone</Text>
        </View>
        <Body>A breathing tonal pad to play over — peaceful, ancient, Celtic, Hebraic and more. Tunes to any key.</Body>
        <PendingNote pal={pal} text="Drone playback (expo-audio + your Shruti-box recordings) is next." />
      </Card>

      {/* Rhythm */}
      <Card style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Image source="sf:metronome" tintColor={pal.m[3]} style={{ width: 22, height: 22 }} />
          <Text style={{ color: pal.ink, fontSize: 19, fontWeight: '700' }}>Rhythm</Text>
        </View>
        <Body>A steady metronome with accents and grooves to keep your practice grounded.</Body>
        <PendingNote pal={pal} text="Click scheduling lands with the native audio pass." />
      </Card>
    </ScrollView>
  );
}

function PendingNote({ pal, text }: { pal: ReturnType<typeof usePalette>; text: string }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: pal.surface2,
        borderRadius: 12,
        borderCurve: 'continuous',
        padding: 10,
      }}>
      <Image source="sf:clock.badge" tintColor={pal.inkFaint} style={{ width: 16, height: 16 }} />
      <Text style={{ color: pal.inkFaint, fontSize: 13, flex: 1 }}>{text}</Text>
    </View>
  );
}
