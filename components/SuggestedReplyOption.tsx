import { Platform, Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { BUBBLE_PADDING } from '../constants';
import useThemeValues from '../hooks/useThemeValues';
import styles from '../styles';
import Text from './Text';

export default function SuggestedReplyOption({
  children,
  onPress,
  style,
}: {
  children: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useThemeValues();
  const color = useSharedValue(0);
  const elevation = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    borderRadius: 18,
    paddingHorizontal: BUBBLE_PADDING,
    paddingVertical: BUBBLE_PADDING / 2,
    backgroundColor: withTiming(
      interpolateColor(
        color.value,
        [0, 1],
        [theme.suggestedReplyBackgroundDefault, theme.suggestedReplyBackgroundHover],
      ),
      { duration: 100 },
    ),
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: 'rgba(33, 33, 33)',
          shadowOpacity: 0.16,
          shadowRadius: elevation.value * 8,
          shadowOffset: { width: 0, height: elevation.value * 4 },
        }
      : {
          elevation: elevation.value * 4,
        }),
  }));
  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => {
        color.value = 1;
      }}
      onHoverOut={() => {
        color.value = 0;
      }}
      onPressIn={() => {
        elevation.value = withTiming(0, { duration: 100 });
        color.value = 1;
      }}
      onPressOut={() => {
        elevation.value = withTiming(1, { duration: 100 });
        color.value = 0;
      }}
      style={style}
    >
      <Animated.View style={animatedStyle}>
        <Text style={[styles.textSmedium, componentStyles.optionText]}>{children}</Text>
      </Animated.View>
    </Pressable>
  );
}

const componentStyles = StyleSheet.create({
  optionText: {
    color: '@suggestedReplyText',
    fontWeight: '500',
  },
});
