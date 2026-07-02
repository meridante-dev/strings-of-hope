import { ReactNode } from 'react';
import { Text, TextProps, View, ViewProps } from 'react-native';

import { Palette, usePalette } from '@/constants/palette';

/** Card surface — soft, premium, continuous corners. */
export function Card({ style, children, ...rest }: ViewProps & { children?: ReactNode }) {
  const pal = usePalette();
  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: pal.surface,
          borderRadius: 22,
          borderCurve: 'continuous',
          borderWidth: 1,
          borderColor: pal.line,
          padding: 18,
          boxShadow: pal.isDark ? '0 8px 24px rgba(0,0,0,0.45)' : '0 8px 22px rgba(54,40,14,0.07)',
        },
        style,
      ]}>
      {children}
    </View>
  );
}

/** Small overline / section label in gold. */
export function Overline({ children, style, ...rest }: TextProps & { children?: ReactNode }) {
  const pal = usePalette();
  return (
    <Text
      {...rest}
      style={[
        { color: pal.gold, fontSize: 12, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase' },
        style,
      ]}>
      {children}
    </Text>
  );
}

export function Title({ children, style, ...rest }: TextProps & { children?: ReactNode }) {
  const pal = usePalette();
  return (
    <Text {...rest} style={[{ color: pal.ink, fontSize: 22, fontWeight: '700', letterSpacing: -0.4 }, style]}>
      {children}
    </Text>
  );
}

export function Body({ children, style, ...rest }: TextProps & { children?: ReactNode }) {
  const pal = usePalette();
  return (
    <Text {...rest} style={[{ color: pal.inkSoft, fontSize: 15, lineHeight: 22 }, style]}>
      {children}
    </Text>
  );
}

/** A single note token — circular, optionally accented (the flavor / character note). */
export function NoteDot({
  label,
  accent,
  active,
  size = 38,
}: {
  label: string;
  accent?: string;
  active?: boolean;
  size?: number;
}) {
  const pal = usePalette();
  const tint = accent ?? pal.gold;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: active ? tint : pal.surface2,
        borderWidth: 1.5,
        borderColor: active ? tint : pal.line2,
      }}>
      <Text
        style={{
          color: active ? pal.onAccent : pal.ink,
          fontWeight: '700',
          fontSize: size * 0.36,
          fontVariant: ['tabular-nums'],
        }}>
        {label}
      </Text>
    </View>
  );
}

/** Selectable chip used for keys / worlds. */
export function Chip({
  label,
  selected,
  tint,
  onPress,
}: {
  label: string;
  selected?: boolean;
  tint?: string;
  onPress?: () => void;
}) {
  const pal = usePalette();
  const c = tint ?? pal.gold;
  return (
    <Text
      onPress={onPress}
      style={{
        color: selected ? pal.onAccent : pal.ink,
        backgroundColor: selected ? c : pal.surface2,
        borderWidth: 1,
        borderColor: selected ? c : pal.line,
        overflow: 'hidden',
        borderRadius: 999,
        paddingHorizontal: 16,
        paddingVertical: 9,
        fontSize: 15,
        fontWeight: '600',
      }}>
      {label}
    </Text>
  );
}

export type { Palette };
