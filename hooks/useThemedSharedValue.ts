import { useCallback, useEffect, useRef } from 'react';
import { useSharedValue } from 'react-native-reanimated';

import useThemeValues from './useThemeValues';

type ThemedValue = string | `@${keyof AppTheme}`;

export default function useThemedSharedValue(initialValue: ThemedValue) {
  const theme = useThemeValues();

  const processValue = useCallback(
    (value: ThemedValue) => (value.startsWith('@') ? theme[value.substring(1)] : value),
    [theme],
  );

  const sharedValue = useSharedValue(processValue(initialValue));
  const originalValueRef = useRef(initialValue);
  const setSharedValue = useCallback(
    (value: ThemedValue) => {
      originalValueRef.current = value;

      sharedValue.value = processValue(value);
    },
    [processValue, sharedValue],
  );

  useEffect(() => {
    const lastBackgroundColorValue = originalValueRef.current;
    sharedValue.value = processValue(lastBackgroundColorValue);
  }, [sharedValue, processValue, theme]);

  return [sharedValue, setSharedValue] as const;
}
