import { ReactNode, useEffect } from 'react';
import { Pressable, StyleProp, useWindowDimensions, ViewStyle } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { TABLET_LANDSCAPE_WIDTH } from '../constants';

export default function ListItem({
  children,
  onPress,
  viewStyle,
}: {
  children: ReactNode;
  onPress?: () => void;
  viewStyle?: StyleProp<ViewStyle>;
}) {
  const { width: screenWidth } = useWindowDimensions();
  const backgroundOpacity = useSharedValue(0);
  const scale = useSharedValue(1);
  const borderRadius = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(backgroundOpacity.value, [0, 1], ['rgba(236, 236, 236, 0)', '#F2F3F5']),
    transform: [{ scale: scale.value }],
    borderRadius: borderRadius.value,
  }));

  useEffect(() => {
    borderRadius.value = screenWidth >= TABLET_LANDSCAPE_WIDTH ? 8 : 0;
  }, [borderRadius, screenWidth]);

  return (
    <Pressable
      onHoverIn={() => {
        backgroundOpacity.value = withTiming(1);
      }}
      onHoverOut={() => {
        backgroundOpacity.value = withTiming(0);
      }}
      onPressIn={() => {
        backgroundOpacity.value = withTiming(1);
        scale.value = withTiming(0.95);
        borderRadius.value = withTiming(12);
      }}
      onPressOut={() => {
        backgroundOpacity.value = withTiming(0);
        scale.value = withTiming(1);
        borderRadius.value = 0;
      }}
      onPress={onPress}
    >
      <Animated.View style={[animatedStyles, viewStyle]}>{children}</Animated.View>
    </Pressable>
  );
}
