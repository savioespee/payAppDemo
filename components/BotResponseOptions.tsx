import { StyleSheet } from 'react-native';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedRef, useAnimatedStyle, useDerivedValue, useSharedValue } from 'react-native-reanimated';

import { BUBBLE_PADDING, core } from '../constants';
import styles from '../styles';
import ListItemWrapper from './ListItemWrapper';
import Spacer from './Spacer';
import SuggestedReplyOption from './SuggestedReplyOption';
import Text from './Text';

export default function BotResponseOptions({
  botResponseOptions: options,
  sendResponseToBot,
  style,
}: {
  botResponseOptions: string[];
  sendResponseToBot: (response: string) => void;
  style?: StyleProp<ViewStyle>;
}) {
  const ref = useAnimatedRef<Animated.View>();
  const opacity = useSharedValue(1);
  const marginTop = useDerivedValue(() => opacity.value * 24);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    marginTop: marginTop.value,
  }));

  const onSelectOption = (option) => {
    sendResponseToBot(option);
  };

  return (
    <ListItemWrapper>
      <Animated.View ref={ref} style={[componentStyles.container, animatedStyle, style]}>
        <Text style={[styles.textXSmall, componentStyles.title]}>Suggested replies</Text>
        {options.map((option, index) => {
          return (
            <SuggestedReplyOption
              key={option}
              style={{ marginTop: index > 0 ? 6 : 0 }}
              onPress={() => {
                onSelectOption(option);
              }}
            >
              {option}
            </SuggestedReplyOption>
          );
        })}
      </Animated.View>
    </ListItemWrapper>
  );
}

const componentStyles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'flex-end',
    paddingEnd: 12,
    minHeight: 0,
    marginStart: 64,
  },
  title: {
    color: core.content[3],
    paddingHorizontal: BUBBLE_PADDING,
    marginBottom: 4,
    fontWeight: '600',
  },
});
