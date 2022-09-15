import { ImageSourcePropType, View } from 'react-native';

import { primitive } from '../constants';
import styles from '../styles';
import Image from './Image';
import Text from './Text';

export default function BlackBubbleHeader({ iconSource, title }: { iconSource: ImageSourcePropType; title: string }) {
  return (
    <View
      style={[
        styles.rowStack,
        {
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 10,
          backgroundColor: primitive.neutral[10],
        },
      ]}
    >
      <Image source={iconSource} style={{ width: 14, height: 14, marginRight: 4, tintColor: 'white' }} />
      <Text style={[styles.textXSmall, { color: 'white', fontWeight: '500' }]}>{title}</Text>
    </View>
  );
}
