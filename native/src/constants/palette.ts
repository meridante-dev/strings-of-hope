/**
 * Strings of Hope — sacred-minimal premium palette.
 * Gold-led, light + dark (auto). Ported from the web design system.
 */
import { useColorScheme } from 'react-native';

export const SohLight = {
  bg0: '#FAF8F2',
  bg1: '#F1ECE1',
  bgGlow: '#FFFFFF',
  surface: '#FFFFFF',
  surface2: '#FBF9F3',
  ink: '#211C14',
  inkSoft: '#6B6356',
  inkFaint: '#9C9384',
  line: 'rgba(45,34,16,0.09)',
  line2: 'rgba(45,34,16,0.15)',
  gold: '#B28E47',
  goldDeep: '#8E6F31',
  goldGradA: '#D8BC7C',
  goldGradB: '#B08A40',
  onAccent: '#2B2008',
  petalRoot: '#F4E8CB',
  // gold-led quiet mode tones: Ionian..Locrian
  m: ['#B28E47', '#5E8C7E', '#86708F', '#AE7C72', '#BE9248', '#6E8398', '#838755'],
  isDark: false,
};

export const SohDark: typeof SohLight = {
  bg0: '#141109',
  bg1: '#1B1710',
  bgGlow: '#241d12',
  surface: '#1E190F',
  surface2: '#231D12',
  ink: '#EEE6D5',
  inkSoft: '#A99E87',
  inkFaint: '#7B7059',
  line: 'rgba(232,214,166,0.11)',
  line2: 'rgba(232,214,166,0.20)',
  gold: '#D7B463',
  goldDeep: '#E7CC86',
  goldGradA: '#E9CE85',
  goldGradB: '#C09A4C',
  onAccent: '#1a1304',
  petalRoot: '#3A2E18',
  m: ['#D7B463', '#7DB0A0', '#A892B2', '#CC9A8F', '#DCB068', '#8FA6BD', '#A9AC76'],
  isDark: true,
};

export type Palette = typeof SohLight;

export function usePalette(): Palette {
  const scheme = useColorScheme();
  return scheme === 'dark' ? SohDark : SohLight;
}
