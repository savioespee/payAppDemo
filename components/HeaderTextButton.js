import { StyleSheet } from 'react-native';

import { colors, core, primitive } from '../constants';
import styles from '../styles';
import CircleProgress from './CircleProgress';
import OpacityPressable from './OpacityPressable';
import Text from './Text';

export default function HeaderTextButton({
  title,
  disabled,
  onPress,
  isLoading,
  textStyle,
}) {
  return (
    <OpacityPressable disabled={disabled || isLoading} onPress={onPress}>
      {isLoading ? (
        <CircleProgress size={20} />
      ) : (
        <Text
          style={StyleSheet.flatten([
            styles.textMedium,
            { color: '@navigationTintColor' },
            disabled && { color: primitive.neutral[4] },
            textStyle,
          ])}
        >
          {title}
        </Text>
      )}
    </OpacityPressable>
  );
}
