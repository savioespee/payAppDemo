import { StyleProp, View, ViewStyle } from 'react-native';

import { colors } from '../constants';
import styles from '../styles';
import Text from './Text';

export default function Tag({
  children,
  style,
  color = colors.tertiaryText,
}: {
  children: string;
  style?: StyleProp<ViewStyle>;
  color?: string;
}) {
  return (
    <View
      style={[
        styles.centerChildren,
        {
          paddingHorizontal: 3,
          borderRadius: 2,
          borderWidth: 1,
          borderColor: color,
          height: 16,
        },
        style,
      ]}
    >
      <Text
        style={[
          {
            fontSize: 10,
            lineHeight: 14,
            color,
            fontWeight: '500',
            textTransform: 'uppercase',
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );
}
