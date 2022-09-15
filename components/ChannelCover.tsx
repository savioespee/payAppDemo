import { ComponentProps } from 'react';
import { View } from 'react-native';

import { channelCustomTypes, colors, localImageMap, USER_METADATA_KEYS } from '../constants';
import { getChannelCounterpart, getRandomAvatarUrl } from '../utils/common';
import { parseChannelData } from '../utils/dataUtils';
import { sendbird } from '../utils/sendbird';
import Avatar from './Avatar';
import BrandAvatar from './BrandAvatar';
import Image from './Image';

const flightDestinationImages = {
  newyork: require('../assets/avatar-newyork.jpeg'),
  houston: require('../assets/avatar-houston.jpeg'),
  vancouver: require('../assets/avatar-vancouver.jpeg'),
};

function getAvatarSourceOfUser(user) {
  return user.metaData?.localImageName
    ? localImageMap[user.metaData?.localImageName]
    : { uri: user.profileUrl || getRandomAvatarUrl(user.userId) };
}

const getChannelCoverImageSource = (channel: SendBird.GroupChannel) => {
  if (channel.customType === channelCustomTypes.flight) {
    const channelData = parseChannelData(channel.data);
    if (channelData?.flightDestination && flightDestinationImages[channelData.flightDestination]) {
      return flightDestinationImages[channelData.flightDestination];
    }
    return localImageMap['avatar-airplane.png'];
  }

  const currentUser = sendbird.currentUser;

  if (channel.members.length === 2) {
    const otherUser = channel.members.find((member) => member.userId !== currentUser?.userId);
    return getAvatarSourceOfUser(otherUser);
  }

  if (channel.members.length > 2) {
    return channel.members.slice(0, 4).map(getAvatarSourceOfUser);
  }

  return { uri: channel.coverUrl };
};

export default function ChannelCover({
  channel,
  size = 50,
  style,
}: {
  channel: SendBird.GroupChannel;
  size?: number;
  style?: ComponentProps<typeof BrandAvatar>['style'];
}) {
  const imageSource = getChannelCoverImageSource(channel);
  const channelCounterpart = getChannelCounterpart(channel);

  function renderAvatar() {
    if (channel.customType === channelCustomTypes.support) {
      return <BrandAvatar size={size} style={style} type="support" />;
    }
    if (channel.customType === channelCustomTypes.notifications || channel.customType === channelCustomTypes.bookings) {
      return <BrandAvatar size={size} style={style} type="notifications" />;
    }
    if (channel.customType === channelCustomTypes.promotions) {
      return <BrandAvatar size={size} style={style} type="promotions" />;
    }
    if (channel.customType === channelCustomTypes.delivery) {
      return <BrandAvatar size={size} style={style} type="delivery" />;
    }

    if (channel.members.length === 2) {
      return <Avatar size={size} style={style} user={channelCounterpart!} />;
    }

    if (!imageSource) {
      return <View style={{ width: size, height: size }} />;
    }

    if (Array.isArray(imageSource)) {
      return (
        <View
          style={{
            width: size,
            height: size,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            transform: [{ scale: 0.9 }],
          }}
        >
          {imageSource.map((source, index) => (
            <Image
              key={index}
              style={{
                width: size / 2,
                height: size / 2,
                borderRadius: size / 4,
                backgroundColor: colors.avatarBackground,
                transform: [{ scale: 1.3 }],
              }}
              source={source}
            />
          ))}
        </View>
      );
    }

    return (
      <Image
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.avatarBackground,
        }}
        source={imageSource}
      />
    );
  }

  function renderBadge() {
    const badgeSize = size * 0.32;
    const sharedStyle = {
      position: 'absolute',
      right: 0,
      bottom: 0,
      width: badgeSize,
      height: badgeSize,
    } as const;

    if ((channelCounterpart?.metaData?.[USER_METADATA_KEYS.userType] as BotUserType) === 'stock') {
      return <Image style={sharedStyle} source={require('../assets/avatar-badge-stock.png')} />;
    }

    if (channelCounterpart?.connectionStatus === 'online') {
      return (
        <View
          style={[
            sharedStyle,
            {
              backgroundColor: colors.onlineColor,
              borderColor: 'white',
              borderRadius: badgeSize / 2,
              borderWidth: 2,
            },
          ]}
        />
      );
    }
  }

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: channelCounterpart ? colors.avatarBackground : undefined,
        },
        style,
      ]}
    >
      {renderAvatar()}
      {renderBadge()}
    </View>
  );
}
