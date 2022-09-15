import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PlusSvg from '../../assets/ic_plus.svg';
import BackButton from '../../components/BackButton';
import CircleProgress from '../../components/CircleProgress';
import InboxItem from '../../components/InboxItem';
import ListItemWrapper from '../../components/ListItemWrapper';
import OpacityPressable from '../../components/OpacityPressable';
import PromotionCarousel from '../../components/PromotionCarousel';
import Spacer from '../../components/Spacer';
import Text from '../../components/Text';
import { channelCustomTypes, colors } from '../../constants';
import theme from '../../constants/theme';
import { AuthContext } from '../../contexts';
import useInbox from '../../hooks/useInbox';
import { getInboxItemChannel } from '../../hooks/useInbox/utils';

const bannerChannelCustomTypes = [channelCustomTypes.banner];

function isBannerChannel(channel: SendBird.GroupChannel) {
  return bannerChannelCustomTypes.includes(channel.customType as any);
}

const NavigationHeader = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
      <View
        style={{
          position: 'relative',
          height: 44,
          justifyContent: 'center',
        }}
      >
        <Text style={{ marginStart: 46, fontSize: 22, fontWeight: '500', color: 'rgba(0, 0, 0, 0.88)' }}>Inbox</Text>
        <BackButton onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 10 }} />
        <View
          style={{
            position: 'absolute',
            right: 12,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <OpacityPressable
            style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => navigation.navigate('NewConversation')}
          >
            <PlusSvg width={20} height={20} fill={theme.navigationTintColor} />
          </OpacityPressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default function InboxScreen() {
  const { currentUser, isInitializingUser } = useContext(AuthContext);
  const currentUserId = currentUser?.userId;
  const { data, isLoading, refetch, error } = useInbox({
    shouldIncludeRecentMessages: isBannerChannel,
    enabled: !isInitializingUser && !!currentUserId,
  });

  const [isPullToRefreshOngoing, setIsPullToRefreshOngoing] = useState(false);
  const navigation = useNavigation<StackNavigationProp<any>>();

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <NavigationHeader />,
    });
  }, [navigation]);

  const ListEmptyComponent = isLoading ? (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircleProgress size={32} />
    </View>
  ) : null;

  const onRefresh = useCallback(async () => {
    if (isLoading) {
      refetch();
      return;
    }
    setIsPullToRefreshOngoing(true);
    await refetch();
    setIsPullToRefreshOngoing(false);
  }, [isLoading, refetch]);

  const chatSections = useMemo(() => {
    if (isLoading && data.length === 0) {
      return [];
    }

    const { promotions, conversations } = data.reduce(
      (acc, cur) => {
        const channel = getInboxItemChannel(cur);
        if (isBannerChannel(channel)) {
          acc.promotions.push(cur);
        } else {
          acc.conversations.push(cur);
        }
        return acc;
      },
      {
        promotions: [] as InboxItem[],
        conversations: [] as InboxItem[],
      },
    );

    const keyExtractor = (item) =>
      item.inboxItemType === 'channel' ? `channel_${item.channel.url}` : `ticket_${item.ticket.id}`;

    return [
      {
        key: 'promotions',
        keyExtractor: () => 'promotion',
        data: [{ items: promotions }],
        renderItem: ({ item }) => (
          <>
            <PromotionCarousel data={item} />
            <Spacer size={16} />
          </>
        ),
      },
      {
        key: 'conversations',
        keyExtractor,
        data: conversations,
        renderItem: (props) => {
          const { item } = props;
          const channel = getInboxItemChannel(item);
          return (
            <ListItemWrapper>
              <InboxItem
                item={item}
                onPress={() => {
                  navigation.push('Chat', { channelUrl: channel.url });
                }}
              />
            </ListItemWrapper>
          );
        },
      },
    ];
  }, [isLoading, data, navigation]);

  const listRef = useRef<SectionList>(null);

  return (
    <View
      style={{
        backgroundColor: colors.background,
        flex: 1,
      }}
    >
      <StatusBar style="dark" />
      <SectionList<any>
        ref={listRef}
        stickySectionHeadersEnabled={false}
        style={{ flex: 1 }}
        sections={chatSections}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={_styles.listContentContainer}
        onRefresh={onRefresh}
        refreshing={isPullToRefreshOngoing}
      />
    </View>
  );
}

const _styles = StyleSheet.create({
  menu: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  bold: { fontWeight: '700' },
  badge: {
    backgroundColor: colors.badge,
    height: 20,
    minWidth: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 24,
  },
  listContentContainer: {
    flexGrow: 1,
    paddingBottom: 48,
  },
  inboxItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
