import { ComponentProps } from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export default function OpacityPressable({
  children,
  viewStyle,
  ...props
}: ComponentProps<typeof Pressable> & { viewStyle?: StyleProp<ViewStyle> }) {
  const opacity = useSharedValue(1);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, {
        duration: opacity.value < 1 ? 0 : 200,
      }),
    };
  });

  return (
    <Pressable
      onPressIn={() => {
        opacity.value = 0.3;
      }}
      onPressOut={() => {
        opacity.value = 1;
      }}
      {...props}
    >
      <Animated.View style={StyleSheet.flatten([animatedStyles, viewStyle])}>{children}</Animated.View>
    </Pressable>
  );
}
