import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { SohDark, SohLight } from '@/constants/palette';

export default function RootLayout() {
  const scheme = useColorScheme();
  const pal = scheme === 'dark' ? SohDark : SohLight;

  const navTheme = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const theme = {
    ...navTheme,
    colors: {
      ...navTheme.colors,
      primary: pal.gold,
      background: pal.bg0,
      card: pal.bg0,
      text: pal.ink,
      border: pal.line,
    },
  };

  return (
    <ThemeProvider value={theme}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <NativeTabs
        backgroundColor={pal.bg1}
        tintColor={pal.gold}
        iconColor={pal.inkFaint}
        labelStyle={{ color: pal.inkSoft }}>
        <NativeTabs.Trigger name="(today)">
          <NativeTabs.Trigger.Icon sf="sun.max" />
          <NativeTabs.Trigger.Label>Today</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="(modes)">
          <NativeTabs.Trigger.Icon sf="circle.hexagongrid" />
          <NativeTabs.Trigger.Label>Modes</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="(tune)">
          <NativeTabs.Trigger.Icon sf="tuningfork" />
          <NativeTabs.Trigger.Label>Tune</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="(more)">
          <NativeTabs.Trigger.Icon sf="square.grid.2x2" />
          <NativeTabs.Trigger.Label>More</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </ThemeProvider>
  );
}
