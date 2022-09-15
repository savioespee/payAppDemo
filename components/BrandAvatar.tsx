import { ComponentProps } from 'react';
import { ImageSourcePropType, View } from 'react-native';

import useThemeValues from '../hooks/useThemeValues';
import Image from './Image';

type BrandAvatarType = 'notifications' | 'promotions' | 'support' | 'delivery' | 'sales';

const imageMap: Record<BrandAvatarType, ImageSourcePropType> = {
  notifications: require('../assets/avatar-notifications.png'),
  delivery: require('../assets/avatar-delivery.png'),
  support: require('../assets/avatar-support.png'),
  promotions: require('../assets/avatar-promotions.png'),
  sales: require('../assets/avatar-sales.png'),
};

export default function BrandAvatar({
  size,
  style,
  type,
}: {
  size: number;
  style?: ComponentProps<typeof Image>['style'];
  type: BrandAvatarType;
}) {
  const theme = useThemeValues();

  const backgroundColor = theme.brandAvatarBackground;

  const containerStyle = { width: size, height: size, borderRadius: size / 2 };

  return (
    <View style={[containerStyle, { backgroundColor }, style]}>
      <Image source={imageMap[type]} style={{ width: size, height: size, tintColor: theme.brandAvatarIcon }} />
    </View>
  );
}
