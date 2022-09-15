import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { BUBBLE_PADDING, colors } from '../constants';
import useThemeValues from '../hooks/useThemeValues';
import Bubble from './bubbles/Bubble';
import Text from './Text';

function FAQItem({ content, style }: { content: string; style?: StyleProp<ViewStyle> }) {
  const theme = useThemeValues();
  const backgroundOpacity = useSharedValue(0);
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(scale.value, { duration: 200 }) }],
    backgroundColor: withTiming(
      interpolateColor(backgroundOpacity.value, [0, 1], ['rgba(240, 240, 240, 0)', 'rgba(240, 240, 240, 1)']),
    ),
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.value = 0.98;
      }}
      onPressOut={() => {
        scale.value = 1;
      }}
      onHoverIn={() => {
        backgroundOpacity.value = 1;
      }}
      onHoverOut={() => {
        backgroundOpacity.value = 0;
      }}
    >
      <Bubble
        style={[
          {
            paddingHorizontal: BUBBLE_PADDING,
            paddingVertical: BUBBLE_PADDING / 2,
            borderWidth: 1,
            borderColor: theme.accent,
          },
          animatedStyle,
          style as any,
        ]}
      >
        <Text style={{ color: '@accent' }}>{content}</Text>
      </Bubble>
    </Pressable>
  );
}

export default function FAQArticles({ items }: { items: string[] }) {
  return (
    <View style={{ alignItems: 'flex-start' }}>
      {items.map((item, index) => (
        <FAQItem key={index} content={item} style={index > 0 && { marginTop: 8 }} />
      ))}
    </View>
  );
}
