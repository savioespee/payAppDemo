import { useMemo } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

import useThemeValues from './useThemeValues';

export default function useThemedStyle<T extends ViewStyle>(originalStyle?: StyleProp<T>) {
  const theme = useThemeValues();
  const style = useMemo(() => {
    const flattenedStyle = StyleSheet.flatten(originalStyle) as T;

    const styleToOverride = {} as T;
    Object.entries(flattenedStyle || {}).forEach(([key, value]) => {
      if (typeof value === 'string' && value.startsWith('@')) {
        styleToOverride[key] = theme[value.substring(1)];
      }
    });
    return StyleSheet.flatten([flattenedStyle, styleToOverride]) as T;
  }, [originalStyle, theme]);

  return style;
}
