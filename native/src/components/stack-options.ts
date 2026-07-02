import { Platform } from 'react-native';

/** Shared large-title transparent header options for every tab's stack. */
export function stackScreenOptions() {
  return {
    headerTransparent: true,
    headerShadowVisible: false,
    headerLargeTitle: true,
    headerLargeTitleShadowVisible: false,
    headerBlurEffect: (Platform.OS === 'ios' ? 'systemThinMaterial' : undefined) as any,
    headerLargeStyle: { backgroundColor: 'transparent' },
    headerBackButtonDisplayMode: 'minimal' as const,
    headerTitleStyle: { fontWeight: '700' as const },
    headerLargeTitleStyle: { fontWeight: '800' as const, fontSize: 34 },
  };
}
