import { useNavigation, useRoute } from '@react-navigation/native';
import { ForwardedRef, forwardRef, ReactElement, useCallback, useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CHANNEL_METADATA_KEYS } from '../../constants';
import alert from '../../utils/alert';
import { sendbird } from '../../utils/sendbird';
import CircleProgress from '../CircleProgress';
import ListItemWrapper from '../ListItemWrapper';
import NotificationCard from '../NotificationCard';
import Spacer from '../Spacer';

const QUERY_LIMIT = 100;

function createListQuery(channel: SendBird.GroupChannel) {
  const listQuery = channel.createPreviousMessageListQuery();
  listQuery.limit = QUERY_LIMIT;
  listQuery.includeReactions = true;
  listQuery.reverse = true;
  return listQuery;
}

function getMessageId(message) {
  return message.reqId || message.messageId;
}

function fetchNextMessages(listQuery: SendBird.PreviousMessageListQuery) {
  return new Promise<{
    messages: (SendBird.UserMessage | SendBird.FileMessage | SendBird.AdminMessage)[];
    hasMore: boolean;
  }>((resolve, reject) => {
    listQuery.load((fetchedMessages, err) => {
      if (err) {
        reject(err);
        return;
      }

      const hasMore = fetchedMessages.length === QUERY_LIMIT;

      resolve({ messages: fetchedMessages, hasMore });
    });
  });
}

const NotificationFeed = forwardRef(
  (
    {
      channelUrl,
      listFooter,
    }: {
      channelUrl: string;
      listFooter?: ReactElement;
    },
    ref: ForwardedRef<FlatList>,
  ) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [channel, setChannel] = useState<SendBird.GroupChannel | null>(null);
    const navigation = useNavigation();

    const [{ messages }, setFetchMessageState] = useState({
      messages: [] as (SendBird.UserMessage | SendBird.AdminMessage | SendBird.FileMessage)[],
      hasMore: false,
      status: 'loading',
      error: null as unknown,
    });

    const deleteMessage = useCallback((id) => {
      setFetchMessageState((state) => {
        const newMessages = state.messages.filter(
          (message) => message.messageId !== id && (message as SendBird.UserMessage).reqId !== id,
        );
        return { ...state, messages: newMessages };
      });
    }, []);

    const upsertMessage = useCallback((newMessage) => {
      setFetchMessageState(({ messages, ...state }) => {
        const newMessageId = getMessageId(newMessage);
        const existingMessageIndex = messages.findIndex((m) => getMessageId(m) === newMessageId);
        if (existingMessageIndex > -1) {
          const newMessages = [...messages];
          newMessages[existingMessageIndex] = newMessage;
          return {
            ...state,
            messages: newMessages,
          };
        } else {
          return {
            ...state,
            messages: [newMessage, ...messages].sort((message1, message2) => message2.createdAt - message1.createdAt),
          };
        }
      });
    }, []);

    const [listQuery, setListQuery] = useState<SendBird.PreviousMessageListQuery | null>(null);

    useEffect(() => {
      if (!listQuery || !channel) {
        return;
      }

      async function refresh() {
        try {
          if (!listQuery || !channel) {
            return;
          }

          const { messages, hasMore } = await fetchNextMessages(listQuery);
          setFetchMessageState({
            messages,
            hasMore,
            status: 'success',
            error: null,
          });
          channel.markAsRead();
        } catch (error) {
          console.error(error);
          setFetchMessageState({
            messages: [],
            hasMore: false,
            status: 'error',
            error: error,
          });
        }
      }

      refresh();
    }, [listQuery, channel]);

    useEffect(() => {
      async function prepare() {
        if (!channelUrl) {
          return;
        }

        setIsInitialized(false);
        try {
          const channel = await sendbird.GroupChannel.getChannel(channelUrl);
          setChannel(channel);
          setListQuery(createListQuery(channel));
        } catch (error) {
          alert(String(error));
          navigation.navigate('Inbox' as any);
        } finally {
          setIsInitialized(true);
        }
      }

      prepare();
    }, [channelUrl, navigation]);

    useEffect(() => {
      if (!channel) {
        return;
      }
      const channelUrl = channel.url;
      const channelHandler = new sendbird.ChannelHandler();
      const isChannelMatching = (targetChannel): targetChannel is SendBird.GroupChannel =>
        targetChannel.url === channel.url && channel.isGroupChannel();

      channelHandler.onMessageReceived = async (targetChannel, message) => {
        if (isChannelMatching(targetChannel)) {
          const updateChannel = () => {
            setChannel(targetChannel);
            channel.markAsRead();
            upsertMessage(message);
          };

          updateChannel();
        }
      };

      channelHandler.onMessageUpdated = (targetChannel, message) => {
        if (isChannelMatching(targetChannel)) {
          setChannel(targetChannel);
          upsertMessage(message);
        }
      };

      channelHandler.onReactionUpdated = (targetChannel, event) => {
        if (isChannelMatching(targetChannel)) {
          setChannel(targetChannel);
          setFetchMessageState(({ messages, ...state }) => {
            return {
              ...state,
              messages: messages.map((message) => {
                if (message.messageId === event.messageId) {
                  message.applyReactionEvent(event);
                }
                return message;
              }),
            };
          });
        }
      };

      channelHandler.onReadReceiptUpdated = (targetChannel) => {
        if (isChannelMatching(targetChannel)) {
          setChannel(targetChannel);
          setFetchMessageState(({ messages, ...state }) => ({
            ...state,
            messages: [...messages],
          }));
        }
      };

      channelHandler.onMessageDeleted = (targetChannel, messageId) => {
        if (isChannelMatching(targetChannel)) {
          setChannel(targetChannel);
          deleteMessage(messageId);
        }
      };

      channelHandler.onUserLeft = (targetChannel, user) => {
        if (isChannelMatching(targetChannel) && user.userId === sendbird.currentUser?.userId) {
          //@ts-ignore
          navigation.navigate('Inbox', { action: 'leave', data: { channelUrl } });
        }
      };

      channelHandler.onChannelDeleted = (deletedChannelUrl, channelType) => {
        if (deletedChannelUrl === channelUrl && channelType === 'group') {
          //@ts-ignore
          navigation.navigate('Inbox', {
            action: 'delete',
            data: { channelUrl },
          });
        }
      };

      const channelHandlerId = `NOTIFICATION_FEED_${channelUrl}`;
      sendbird.addChannelHandler(channelHandlerId, channelHandler);

      return () => {
        sendbird.removeChannelHandler(channelHandlerId);
      };
    }, [channel, deleteMessage, navigation, upsertMessage]);

    return (
      <>
        {isInitialized ? (
          <FlatList
            ref={ref}
            style={{ flex: 1, backgroundColor: 'white' }}
            data={messages.filter((item) => item.isUserMessage())}
            contentContainerStyle={{ flexGrow: 1, paddingVertical: 16 }}
            ItemSeparatorComponent={() => <Spacer size={16} />}
            ListFooterComponent={
              messages.length > 0 ? <SafeAreaView edges={['bottom']}>{listFooter}</SafeAreaView> : null
            }
            renderItem={({ item: message }) => {
              if (!channel) {
                return null;
              }

              return (
                <ListItemWrapper style={{ paddingHorizontal: 16 }}>
                  <NotificationCard message={message as SendBird.UserMessage} />
                </ListItemWrapper>
              );
            }}
          />
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircleProgress size={32} />
          </View>
        )}
      </>
    );
  },
);

export default NotificationFeed;
