import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { channelCustomTypes, colors, core } from '../constants';
import { getInboxItemChannel } from '../hooks/useInbox/utils';
import styles from '../styles';
import { getChannelBadge, getChannelTitle, getLastMessage } from '../utils/common';
import { parseChannelData } from '../utils/dataUtils';
import ChannelCover from './ChannelCover';
import ChannelUpdatedAt from './ChannelUpdatedAt';
import ListItem from './ListItem';
import Tag from './Tag';
import Text from './Text';

function getChannelTag(channel: SendBird.GroupChannel) {
  const channelData = parseChannelData(channel.data);

  if (channel.customType === channelCustomTypes.flight) {
    switch (channelData?.flightType) {
      case 'current':
        return <Tag color="#019C6E">Current</Tag>;
      case 'upcoming':
        return <Tag color="#A6A6A6">Upcoming</Tag>;
      case 'complete':
        return <Tag color="#A6A6A6">Complete</Tag>;
      default:
        return null;
    }
  }
  return null;
}

export default function InboxItem({ onPress, item }: { onPress: () => void; item: InboxItem }) {
  const channel = getInboxItemChannel(item);
  const badge = getChannelBadge(channel);
  const tag = getChannelTag(channel);
  const channelData = useMemo(() => parseChannelData(channel.data), [channel.data]);
  const isChannelTitleFaded =
    channel.customType === channelCustomTypes.flight && channelData?.flightType === 'complete';

  const handlePress = () => {
    if (channel.isFrozen) {
      return;
    }
    if (channel.customType === channelCustomTypes.flight) {
      if (channelData?.flightType === 'complete' || channelData?.flightType === 'upcoming') {
        return;
      }
    }
    if (channel.customType === channelCustomTypes.blocked) {
      return;
    }
    onPress();
  };

  return (
    <ListItem viewStyle={_styles.inboxItem} onPress={handlePress}>
      <ChannelCover channel={channel} size={60} style={{ position: 'relative', marginRight: 16 }} />
      <View style={{ flex: 1 }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}
        >
          <View
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              style={[
                styles.textMedium,
                {
                  color: isChannelTitleFaded ? '#A6A6A6' : colors.text,
                  fontWeight: '600',
                  lineHeight: 25,
                },
              ]}
            >
              {getChannelTitle({ channel: item.channel, isChannelList: true })}
            </Text>
            {!!badge && <View style={{ marginLeft: 4 }}>{badge}</View>}
            {!!tag && <View style={{ marginLeft: 4, position: 'relative', top: -1 }}>{tag}</View>}
          </View>
          <ChannelUpdatedAt channel={channel} style={[{ color: '#7F7F7F', fontSize: 12 }]} />
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}
        >
          <View style={[styles.colStack, { flex: 1 }]}>
            {channel.customType === channelCustomTypes.fakeClosedTicket && (
              <View
                style={[
                  styles.centerChildren,
                  {
                    paddingHorizontal: 6,
                    paddingVertical: 1,
                    backgroundColor: core.bg[3],
                    borderRadius: 2,
                    alignSelf: 'flex-start',
                  },
                ]}
              >
                <Text style={[styles.textXSmall, { color: colors.tertiaryText, fontWeight: '500' }]}>
                  Closed Ticket
                </Text>
              </View>
            )}
            <Text style={[styles.textSmall, { color: colors.tertiaryText }]} ellipsizeMode="tail" numberOfLines={2}>
              {getLastMessage(channel)}
            </Text>
          </View>
          {channel.unreadMessageCount > 0 && (
            <View style={[_styles.badge]}>
              <Text style={[styles.text, styles.textBold, styles.textXSmall, { color: 'white', textAlign: 'center' }]}>
                {channel.unreadMessageCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </ListItem>
  );
}

const _styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.badge,
    height: 20,
    minWidth: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 24,
  },
  inboxItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
