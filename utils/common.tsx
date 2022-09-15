import { formatDistanceToNowStrict, isSameDay, isSameYear } from 'date-fns';
import { es, ko } from 'date-fns/locale';
import { ComponentProps } from 'react';
import { ImageSourcePropType, ImageStyle, StyleProp } from 'react-native';
import SendBird from 'sendbird';

import Image from '../components/Image';
import { channelCustomTypes, USER_METADATA_KEYS } from '../constants';
import { parseChannelData, parseMessageData } from './dataUtils';
import { intlDateDifferentYearFormat, intlDateFormat } from './intl';
import { sendbird } from './sendbird';

const channelNameMaxMembers = 3;

export function getChannelCounterpart(channel: SendBird.GroupChannel) {
  if (channel.members.length !== 2 || !sendbird.currentUser) {
    return null;
  }
  const otherUser = channel.members.find((member) => member.userId !== sendbird.currentUser?.userId);
  return otherUser;
}

const verifiedChannelCustomTypes = [
  channelCustomTypes.notifications,
  channelCustomTypes.promotions,
  channelCustomTypes.support,
  channelCustomTypes.delivery,
  channelCustomTypes.airport,
  channelCustomTypes.bookings,
];

export function isChannelVerified(channel: SendBird.GroupChannel) {
  const otherUser = getChannelCounterpart(channel);

  return (
    verifiedChannelCustomTypes.includes(channel.customType as any) || (otherUser?.metaData as any)?.badge === 'verified'
  );
}

export function getChannelTitle({
  channel,
  isChannelList = false,
}: {
  channel: SendBird.GroupChannel;
  isChannelList?: boolean;
}) {
  const currentUserId = sendbird.currentUser?.userId;

  if (isChannelVerified(channel)) {
    return channel.name;
  }

  if (channel.name && channel.name !== 'Group Channel') {
    return channel.members.length < 3
      ? channel.name
      : `${channel.name}${isChannelList ? ` (${channel.members.length})` : ''}`;
  }

  const nicknames = channel.members.filter((m) => m.userId !== currentUserId).map((m) => m.nickname);

  if (nicknames.length > channelNameMaxMembers) {
    return `${nicknames.slice(0, channelNameMaxMembers + 1).join(', ')} and ${
      nicknames.length - channelNameMaxMembers
    } others`;
  }
  return `${nicknames.join(', ')}`;
}

export function getRandomAvatarUrl(userId) {
  return `https://avatars.dicebear.com/api/miniavs/${userId}.png`;
}

const formatDistanceLocale = {
  lessThanXSeconds: {
    one: 'just now',
    other: 'less than {{count}}s',
  },

  xSeconds: {
    one: '1s',
    other: '{{count}}s',
  },

  halfAMinute: 'half a minute',

  lessThanXMinutes: {
    one: 'less than a minute',
    other: 'less than {{count}} minutes',
  },

  xMinutes: {
    one: '1m',
    other: '{{count}}m',
  },

  aboutXHours: {
    one: 'about 1 hour',
    other: 'about {{count}} hours',
  },

  xHours: {
    one: '1h',
    other: '{{count}}h',
  },

  xDays: {
    one: '1 day',
    other: '{{count}} days',
  },

  aboutXWeeks: {
    one: 'about 1 week',
    other: 'about {{count}} weeks',
  },

  xWeeks: {
    one: '1 week',
    other: '{{count}} weeks',
  },

  aboutXMonths: {
    one: 'about 1 month',
    other: 'about {{count}} months',
  },

  xMonths: {
    one: '1 month',
    other: '{{count}} months',
  },

  aboutXYears: {
    one: 'about 1 year',
    other: 'about {{count}} years',
  },

  xYears: {
    one: '1 year',
    other: '{{count}} years',
  },

  overXYears: {
    one: 'over 1 year',
    other: 'over {{count}} years',
  },

  almostXYears: {
    one: 'almost 1 year',
    other: 'almost {{count}} years',
  },
};

const formatDistance = (token, count, options) => {
  let result;

  const tokenValue = formatDistanceLocale[token];
  if (typeof tokenValue === 'string') {
    result = tokenValue;
  } else if (count === 1) {
    result = tokenValue.one;
  } else {
    result = tokenValue.other.replace('{{count}}', count.toString());
  }

  if (options?.addSuffix) {
    if (options.comparison && options.comparison > 0) {
      return `in ${result}`;
    } else {
      return `${result} ago`;
    }
  }

  return result;
};

export function formatDistanceToNow(timestamp) {
  const userLanguage = sendbird.currentUser?.metaData?.[USER_METADATA_KEYS.language];

  if (userLanguage === 'ko') {
    return formatDistanceToNowStrict(timestamp, {
      addSuffix: true,
      locale: ko,
    });
  }
  if (userLanguage === 'es') {
    return formatDistanceToNowStrict(timestamp, {
      addSuffix: true,
      locale: es,
    });
  }
  return formatDistanceToNowStrict(timestamp, {
    addSuffix: true,
    locale: { formatDistance },
  });
}

export function getChannelUpdatedAt(channel: SendBird.GroupChannel) {
  return channel.lastMessage?.createdAt ?? channel.createdAt;
}

export function formatChannelUpdatedAt(updatedAt) {
  const formatDistanceToNowResult = formatDistanceToNow(updatedAt);
  const relativeTime = formatDistanceToNowResult === '0s ago' ? 'Now' : formatDistanceToNowResult;

  if (isSameDay(updatedAt, new Date())) {
    return relativeTime;
  }
  if (isSameYear(updatedAt, new Date())) {
    return intlDateFormat.format(updatedAt);
  }
  return intlDateDifferentYearFormat.format(updatedAt);
}

export function getChannelUpdatedAtLabel(channel: SendBird.GroupChannel) {
  const updatedAt = getChannelUpdatedAt(channel);
  return formatChannelUpdatedAt(updatedAt);
}

const Badge = ({
  size = 16,
  style,
  source,
}: {
  size?: number;
  style?: StyleProp<ImageStyle>;
  source: ImageSourcePropType;
}) => <Image source={source} style={[{ width: size, height: size }, style]} />;

const VerifiedBadge = (props: Omit<ComponentProps<typeof Badge>, 'source'>) => (
  <Badge source={require('../assets/ic-badge-verified.png')} {...props} />
);

const StoreBadge = (props: Omit<ComponentProps<typeof Badge>, 'source'>) => (
  <Badge source={require('../assets/ic-badge-store.png')} {...props} />
);

export function getUserBadge(user?: SendBird.User) {
  const userType = user?.metaData?.[USER_METADATA_KEYS.userType] as BotUserType | undefined;
  if (userType === 'official') {
    return <VerifiedBadge />;
  }
  if (userType === 'store') {
    return <StoreBadge />;
  }

  return null;
}

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function replaceNickname(text, nickname) {
  return text.replace(/\{nickname\}/g, nickname);
}

export function getMessagePreviewText(message: Message) {
  const messageData = parseMessageData(message.data);
  if (messageData?.previewText) {
    return messageData.previewText;
  }
  if (message.isFileMessage()) {
    if (message.type?.includes('image')) {
      return 'Sent an image';
    }
    if (message.type?.includes('audio')) {
      return 'Sent a voice memo';
    }
    return 'Sent a file';
  }
  return message.message?.split('\n')?.join(' ') ?? '';
}

export function getLastMessage(channel: SendBird.GroupChannel) {
  return channel.lastMessage && getMessagePreviewText(channel.lastMessage);
}

export function getChannelBadge(channel: SendBird.GroupChannel) {
  const channelData = parseChannelData(channel.data);

  if (channel.customType === channelCustomTypes.flight) {
    switch (channelData?.flightType) {
      case 'current':
        return <Image source={require('../assets/airlines/ic-flying.png')} style={{ width: 16, height: 16 }} />;
      case 'upcoming':
        return (
          <Image
            source={require('../assets/airlines/ic-flying.png')}
            style={{ width: 16, height: 16, tintColor: '#CCCCCC' }}
          />
        );
      default:
        return null;
    }
  }

  if (isChannelVerified(channel)) {
    return <VerifiedBadge />;
  }

  const otherUser = getChannelCounterpart(channel);

  return otherUser ? getUserBadge(otherUser) : null;
}
