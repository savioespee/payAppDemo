import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

export default function useBubbleMaxWidth() {
  const { width: screenWidth } = useWindowDimensions();
  return useMemo(() => Math.min(480, (screenWidth * 2) / 3), [screenWidth]);
}
