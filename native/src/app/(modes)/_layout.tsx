import { Stack } from 'expo-router/stack';

import { stackScreenOptions } from '@/components/stack-options';

export default function Layout() {
  return (
    <Stack screenOptions={stackScreenOptions()}>
      <Stack.Screen name="index" options={{ title: 'Modes' }} />
    </Stack>
  );
}
