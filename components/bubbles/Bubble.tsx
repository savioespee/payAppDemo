import { ComponentProps } from 'react';
import { useWindowDimensions, View } from 'react-native';
import Animated from 'react-native-reanimated';

export default function Bubble({ style, ...props }: ComponentProps<typeof Animated.View>) {
  const { width: screenWidth } = useWindowDimensions();

  return (
    <Animated.View
      style={[
        {
          borderRadius: 16,
          overflow: 'hidden',
          backgroundColor: '#F2F3F5',
          maxWidth: Math.min(480, (screenWidth * 2) / 3),
        } as const,
        style,
      ].flat()}
      {...props}
    />
  );
}
