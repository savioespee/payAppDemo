import { useCallback } from 'react';
import { ImageProps, ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';

import { botUserIds, colors, localImageMap, USER_METADATA_KEYS } from '../constants';
import { getRandomAvatarUrl } from '../utils/common';
import BrandAvatar from './BrandAvatar';
import BrandLogoAvatar from './BrandLogoAvatar';
import Image from './Image';

function isSourcePropValid(source) {
  if (source && typeof source === 'object' && !source.uri) {
    return false;
  }
  return !!source;
}

export default function Avatar({
  size,
  style,
  user,
  source: sourceProp,
  fallbackAvatarKey,
  ...props
}: {
  size: number;
  style?: StyleProp<ViewStyle>;
  user?: SendBird.User;
  source?: ImageSourcePropType;
  fallbackAvatarKey?: string;
} & Omit<ImageProps, 'source'>) {
  const getSource = useCallback(() => {
    if (user) {
      const localImageName = (user.metaData as any)?.localImageName;
      if (localImageName) {
        return localImageMap[localImageName];
      }
      const profileUrl = user.profileUrl || user.plainProfileUrl;
      if (profileUrl) {
        return { uri: profileUrl };
      }
      return { uri: getRandomAvatarUrl(user.userId) };
    }

    if (isSourcePropValid(sourceProp)) {
      return sourceProp;
    }
  }, [sourceProp, user]);

  if (!user) {
    return fallbackAvatarKey ? (
      <Image
        source={{ uri: getRandomAvatarUrl(fallbackAvatarKey) }}
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors.avatarBackground,
          },
          style,
        ]}
        {...props}
      />
    ) : (
      <BrandLogoAvatar size={size} style={style} />
    );
  }

  if (user.metaData[USER_METADATA_KEYS.brandAvatarType] === 'notifications') {
    return <BrandAvatar type="notifications" style={style} size={size} />;
  }
  if (user.metaData[USER_METADATA_KEYS.brandAvatarType] === 'support') {
    return <BrandAvatar type="support" style={style} size={size} />;
  }

  if (user.metaData[USER_METADATA_KEYS.brandAvatarType] === 'promotions') {
    return <BrandAvatar type="promotions" style={style} size={size} />;
  }
  if (user.metaData[USER_METADATA_KEYS.brandAvatarType] === 'delivery') {
    return <BrandAvatar type="delivery" style={style} size={size} />;
  }

  return (
    <Image
      source={getSource()}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.avatarBackground,
        },
        style,
      ]}
      {...props}
    />
  );
}
