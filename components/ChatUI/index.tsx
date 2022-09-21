import { useNavigation, useRoute } from '@react-navigation/native';
import { isSameDay } from 'date-fns';
import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { FlatList, Keyboard, LayoutAnimation, Platform, StyleSheet, TextInputProps, View } from 'react-native';
import ImageView from 'react-native-image-viewing';
import { SafeAreaView } from 'react-native-safe-area-context';

import { setChannelState } from '../../api/ChannelStateUtils';
import handleUserSentMessage from '../../api/handleUserSentMessage';
import {
  CHANNEL_METADATA_KEYS,
  channelCustomTypes,
  colors,
  messageCustomTypes,
  nonCenteredAdminMessageCustomTypes,
} from '../../constants';
import { CallContext, ShareModalContext } from '../../contexts';
import useCurrentUserLanguage from '../../hooks/useCurrentUserLanguage';
import useTranslatedMessage from '../../hooks/useTranslatedMessage';
import alert from '../../utils/alert';
import { getChannelCounterpart } from '../../utils/common';
import { isFAQBotAnswer, isMessageVisible } from '../../utils/desk';
import { intlDateTimeFormat } from '../../utils/intl';
import safeJSONParse from '../../utils/safeJSONParse';
import { getScenarioDataFromCustomChannelType, handleChannelStateEvent } from '../../utils/scenarioUtils';
import { sendbird } from '../../utils/sendbird';
import BotResponseOptions from '../BotResponseOptions';
import ChatMessage from '../ChatMessage';
import CircleProgress from '../CircleProgress';
import KeyboardAvoidingView from '../KeyboardAvoidingView';
import KeypadModal from '../KeypadModal';
import ListItemWrapper from '../ListItemWrapper';
import RowStack from '../RowStack';
import ShareModal from '../ShareModal';
import Spacer from '../Spacer';
import SuggestedReplyOption from '../SuggestedReplyOption';
import CenteredAdminMessage from './CenteredAdminMessage';
import ChatInput from './ChatInput';
import CouldNotRecognizeMessage from './CouldNotRecognizeMessage';
import openImagePicker from './openImagePicker';
import SendButton from './SendButton';
import SendFileButton from './SendFileButton';

const QUERY_LIMIT = 100;

function createListQuery(channel: SendBird.GroupChannel) {
  const listQuery = channel.createPreviousMessageListQuery();
  listQuery.limit = QUERY_LIMIT;
  listQuery.includeReactions = true;
  listQuery.reverse = true;
  return listQuery;
}

function isSenderSame(message1?: Message, message2?: Message) {
  if (!message1 || !message2) {
    return false;
  }

  if (message1.isAdminMessage() !== message2.isAdminMessage()) {
    return false;
  }

  if (message1.isAdminMessage()) {
    return message1.customType === message2.customType;
  }

  const isUserIdEqual = message1.sender?.userId === (message2 as SendBird.UserMessage).sender?.userId;

  const isMessagesClose = Math.abs(message1.createdAt - message2.createdAt) < 1000 * 60 * 10;

  return isUserIdEqual && isMessagesClose;
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

function isCenteredAdminMessage(
  message: SendBird.UserMessage | SendBird.AdminMessage | SendBird.FileMessage,
  channel: SendBird.GroupChannel,
) {
  if (!message.isAdminMessage()) {
    return false;
  }
  if (
    message.customType === messageCustomTypes.notification &&
    channel.customType === channelCustomTypes.notifications
  ) {
    return false;
  }
  return !nonCenteredAdminMessageCustomTypes.includes(message.customType as any);
}

export type ChatUIImperativeHandle = { showCallScreen: () => void };

const ChatUI = forwardRef<ChatUIImperativeHandle>((props, ref) => {
  const language = useCurrentUserLanguage();
  const shareModalContext = useContext(ShareModalContext);
  const [isKeypadVisible, setIsKeypadVisible] = useState(false);
  const [imageModalUri, setImageModalUri] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [channel, setChannel] = useState<SendBird.GroupChannel | null>(null);
  const route = useRoute();
  const navigation = useNavigation();
  const { channelUrl } = route.params as { channelUrl: string };
  const [input, setInput] = useState('');

  const { startCall, addCallEventListener, removeCallEventListener } = useContext(CallContext);
  const [isSendingFileMessage, setIsSendingFileMessage] = useState(false);
  const [channelMetaData, setChannelMetaData] = useState<Record<string, string>>({});

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

  useEffect(() => {
    if (channel) {
      channel.getAllMetaData().then(((metadata: Record<string, string>) => {
        setChannelMetaData(metadata);
      }) as any);
    }
  }, [channel]);

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

  const [lastMessage] = messages;

  const sendUserMessage = useCallback(
    async (message: string, options?: { data?: any; customType?: string }) => {
      if (!channel || !message.trim()) {
        return;
      }

      const params = new sendbird.UserMessageParams();
      params.customType = options?.customType ?? '';
      params.data = JSON.stringify({
        version: 'mobile',
        ...(options?.data ? options.data : {}),
      });
      params.translationTargetLanguages = ['es', 'ko', 'en'];
      params.message = message.trim();

      return new Promise<void>((resolve) => {
        const tempMessage = channel.sendUserMessage(params, (newMessage, error) => {
          if (error) {
            console.error(error);
            deleteMessage(tempMessage.reqId);
          } else {
            upsertMessage(newMessage);
            handleUserSentMessage({ message: newMessage, channel });
          }
          resolve();
        });
        upsertMessage(tempMessage);
      });
    },
    [channel, deleteMessage, upsertMessage],
  );

  const otherUser = channel && getChannelCounterpart(channel);

  const showCallScreen = useCallback(() => {
    if (!otherUser) {
      return;
    }

    startCall({ user: otherUser });
  }, [otherUser, startCall]);

  useImperativeHandle(ref, () => ({ showCallScreen }));

  const refreshMessages = useCallback(async () => {
    try {
      if (!channel) {
        return;
      }

      const listQuery = createListQuery(channel);
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
  }, [channel]);

  useEffect(() => {
    refreshMessages();
  }, [refreshMessages]);

  useEffect(() => {
    addCallEventListener('chat', { onCallEnded: refreshMessages });
    return () => {
      removeCallEventListener('chat');
    };
  }, [addCallEventListener, refreshMessages, removeCallEventListener]);

  const channelScenario = useMemo(
    () => (channel?.customType ? getScenarioDataFromCustomChannelType(channel?.customType) : undefined),
    [channel?.customType],
  );
  const currentChannelState = channelMetaData[CHANNEL_METADATA_KEYS.state];

  useEffect(() => {
    async function prepare() {
      if (!channelUrl) {
        return;
      }

      setIsInitialized(false);
      try {
        const channel = await sendbird.GroupChannel.getChannel(channelUrl);
        setChannel(channel);
        const metadata = (await channel.getAllMetaData()) as Record<string, string>;
        setChannelMetaData(metadata);
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
    handleChannelStateEvent(channelScenario?.states?.[currentChannelState]?.onChannelEnter, undefined, {
      channelUrl,
    });
  }, [channelScenario?.states, channelUrl, currentChannelState]);

  const openImagePickerAsync = async () => {
    openImagePicker((params) => {
      setIsSendingFileMessage(true);
      channel?.sendFileMessage(params, (message, error) => {
        setIsSendingFileMessage(false);
        if (error) {
          console.error(error);
          return;
        }
        upsertMessage(message);
      });
    });
  };

  const [suggestedReplies, setSuggestedReplies] = useState<SuggestedReplyItem[]>([]);

  const lastMessageData = useMemo(() => safeJSONParse(lastMessage?.data), [lastMessage?.data]);

  useLayoutEffect(() => {
    const updateSuggestedReplies = (channelScenario: ChannelScenario) => {
      const suggestedReplies = channelScenario.states[currentChannelState]?.suggestedReplies ?? [];

      LayoutAnimation.easeInEaseOut();
      setSuggestedReplies(suggestedReplies);
    };

    if (channelScenario && currentChannelState) {
      updateSuggestedReplies(channelScenario);
    } else {
      setSuggestedReplies((currentValue) => (currentValue.length > 0 ? [] : currentValue));
    }
  }, [channelScenario, currentChannelState]);

  const isShowKeypadButtonVisible = useMemo(
    () => channelScenario?.states[currentChannelState]?.showPinPad ?? false,
    [channelScenario?.states, currentChannelState],
  );

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
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          upsertMessage(message);
        };

        updateChannel();
      }
    };

    channelHandler.onMessageUpdated = (targetChannel, message) => {
      if (isChannelMatching(targetChannel)) {
        setChannel(targetChannel);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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

    const metaDataEventHandler = (targetChannel, metaData) => {
      if (isChannelMatching(targetChannel)) {
        setChannelMetaData((currentMetaData) => ({
          ...currentMetaData,
          ...metaData,
        }));
      }
    };

    channelHandler.onMetaDataDeleted = (targetChannel, keys) => {
      if (isChannelMatching(targetChannel)) {
        setChannelMetaData((metadata) => {
          const newMetadata = { ...metadata };
          keys.forEach((key) => {
            delete newMetadata[key];
          });
          return newMetadata;
        });
      }
    };
    channelHandler.onMetaDataUpdated = metaDataEventHandler;
    channelHandler.onMetaDataCreated = metaDataEventHandler;

    const channelHandlerId = `CHAT_${channelUrl}`;
    sendbird.addChannelHandler(channelHandlerId, channelHandler);

    return () => {
      sendbird.removeChannelHandler(channelHandlerId);
    };
  }, [channel, deleteMessage, navigation, upsertMessage]);

  const sendInteractiveChatResponse = async (answer: string) => {
    if (!lastMessage) {
      return;
    }

    const currentChannelState = channelMetaData[CHANNEL_METADATA_KEYS.state];

    sendUserMessage(answer, {
      customType: messageCustomTypes.interactiveResponse,
      data: { channelState: currentChannelState },
    });
  };

  const sendUserMessageFromTextInput = () => {
    const trimmedMessage = input.trim();
    if (trimmedMessage.length === 0) {
      return;
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setInput('');
    sendUserMessage(trimmedMessage);
  };

  const isNicknameVisible = (item) => {
    return !item.isFollowedBySameSender;
  };

  const messageInputType = useMemo(() => {
    if (!channel || channel.customType === 'alerts') {
      return 'UNAVAILABLE';
    }

    return 'CHAT';
  }, [channel]);

  const inputPlaceholder = useMemo(() => {
    if (lastMessageData?.inputPlaceholder) {
      return lastMessageData?.inputPlaceholder;
    }

    return (
      {
        CHAT: 'Enter message',
      }[messageInputType] || 'Chat is unavailable with this channel.'
    );
  }, [lastMessageData?.inputPlaceholder, messageInputType]);

  const chatInputProps: TextInputProps = {
    value: input,
    multiline: true,
    blurOnSubmit: true,
    onSubmitEditing: sendUserMessageFromTextInput,
    returnKeyType: 'send',
    onChangeText: (text) => {
      if (text.length > 0) {
        channel?.startTyping();
      } else {
        channel?.endTyping();
      }
      if (!!text.trim() !== !!input.trim()) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      }
      setInput(text);
    },
    placeholder: inputPlaceholder,
    editable: isInitialized && messageInputType === 'CHAT',
  };

  const messageListItems = useMemo(() => {
    if (!channel) {
      return [];
    }

    const items = messages.filter(isMessageVisible).map((message, index, visibleMessages) => {
      const isFirstMessageOfDay =
        index === visibleMessages.length - 1 || !isSameDay(message.createdAt, visibleMessages[index + 1].createdAt);

      const isFollowingSameSender =
        index > 0 &&
        isSenderSame(visibleMessages[index - 1], message) &&
        isFAQBotAnswer(message) === isFAQBotAnswer(visibleMessages[index - 1]);

      const isFollowedBySameSender =
        index < visibleMessages.length - 1 &&
        isSenderSame(message, visibleMessages[index + 1]) &&
        isFAQBotAnswer(message) === isFAQBotAnswer(visibleMessages[index + 1]);

      const isFollowedBySameTimestamp =
        index < visibleMessages.length - 1 &&
        intlDateTimeFormat.format(message.createdAt) ===
          intlDateTimeFormat.format(visibleMessages[index + 1].createdAt);

      const isFollowingSameTimestamp =
        index > 0 &&
        intlDateTimeFormat.format(message.createdAt) ===
          intlDateTimeFormat.format(visibleMessages[index - 1].createdAt);

      const key = getMessageId(message);

      return {
        key,
        message,
        isFirstMessageOfDay,
        isFollowingSameSender,
        isFollowedBySameSender,
        isFollowedBySameTimestamp,
        isFollowingSameTimestamp,
        isTimestampVisible: false,
      };
    });

    items.forEach((item, index) => {
      if (item.isFirstMessageOfDay && item.isFollowedBySameSender) {
        item.isFollowedBySameSender = false;
      }
      if (item.isFollowingSameSender && items[index - 1]?.isFirstMessageOfDay) {
        item.isFollowingSameSender = false;
      }
    });

    [...items].reverse().forEach((item, index, reversedItems) => {
      const { message } = item;

      const isTimestampChanged =
        intlDateTimeFormat.format(message.createdAt) !==
        intlDateTimeFormat.format(reversedItems[index - 1]?.message.createdAt);

      const isSenderSame =
        index > 0 &&
        (message as SendBird.UserMessage).sender?.userId ===
          (reversedItems[index - 1].message as SendBird.UserMessage).sender?.userId;

      if ((item.message.messageId as any) === 'typing') {
        item.isTimestampVisible = false;
      } else if (isTimestampChanged || !isSenderSame) {
        item.isTimestampVisible = true;
      } else if (isSenderSame && reversedItems[index - 1].isTimestampVisible) {
        item.isTimestampVisible = true;
        reversedItems[index - 1].isTimestampVisible = false;
      }
    });

    return items;
  }, [channel, messages]);

  const isSendingFileDisabled = messageInputType !== 'CHAT' || !channel;
  const getTranslatedMessage = useTranslatedMessage();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const _keyboardWillShow = (event) => {
      Keyboard.scheduleLayoutAnimation(event);
      setIsKeyboardVisible(true);
    };
    const _keyboardWillHide = (event) => {
      Keyboard.scheduleLayoutAnimation(event);
      setIsKeyboardVisible(false);
    };

    Keyboard.addListener('keyboardWillShow', _keyboardWillShow);
    Keyboard.addListener('keyboardWillHide', _keyboardWillHide);

    // cleanup function
    return () => {
      Keyboard.removeAllListeners('keyboardWillShow');
      Keyboard.removeAllListeners('keyboardWillHide');
    };
  }, []);

  const [suggestedReplySelection, setSuggestedReplySelection] = useState<{
    channelUrl: string;
    state: string;
    replyText: string;
  } | null>(null);

  const isBotResponseOptionsVisible = useMemo(() => {
    const didSelectSuggestedReply =
      !!suggestedReplySelection &&
      suggestedReplySelection.channelUrl === channelUrl &&
      suggestedReplySelection.state === channelMetaData[CHANNEL_METADATA_KEYS.state];
    return suggestedReplies.length > 0 && !didSelectSuggestedReply;
  }, [channelMetaData, channelUrl, suggestedReplies.length, suggestedReplySelection]);

  const inputBarPaddingEnd = input.trim() ? 48 : 12;

  return (
    <KeyboardAvoidingView
      style={[
        {
          flex: 1,
          backgroundColor: colors.background,
        },
        Platform.OS === 'web' && {
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        },
      ]}
      contentContainerStyle={{ flex: 1 }}
    >
      {isInitialized ? (
        <FlatList
          style={{ flex: 1, backgroundColor: 'white' }}
          data={messageListItems}
          inverted={true}
          ItemSeparatorComponent={({ leadingItem }) => {
            return <Spacer size={isNicknameVisible(leadingItem) ? 16 : 4} />;
          }}
          contentContainerStyle={{
            flexGrow: 1,
            paddingVertical: 16,
          }}
          renderItem={({ item }) => {
            if (!channel) {
              return null;
            }

            if (item.message.isAdminMessage() && isCenteredAdminMessage(item.message, channel)) {
              return (
                <ListItemWrapper>
                  <CenteredAdminMessage message={getTranslatedMessage(item.message)} />
                </ListItemWrapper>
              );
            }

            if (
              item.message.isAdminMessage() &&
              [messageCustomTypes.couldNotRecognize, messageCustomTypes.adminMessageBox].includes(
                item.message.customType as any,
              )
            ) {
              return (
                <ListItemWrapper>
                  <CouldNotRecognizeMessage>{item.message.message}</CouldNotRecognizeMessage>
                </ListItemWrapper>
              );
            }

            return (
              <ListItemWrapper>
                <ChatMessage channel={channel} showImagePreview={setImageModalUri} {...item} />
              </ListItemWrapper>
            );
          }}
          ListHeaderComponentStyle={{ flex: 1, justifyContent: 'flex-end' }}
          ListHeaderComponent={() => {
            if (isBotResponseOptionsVisible) {
              const convertSuggestedReplyItemToString = (item: SuggestedReplyItem) => {
                const getMessageText = (message: SuggestedReplyMessage) =>
                  typeof message === 'string' ? message : message[language];
                return Array.isArray(item) ? getMessageText(item[0]) : getMessageText(item);
              };
              const replyLabels = suggestedReplies.map(convertSuggestedReplyItemToString);
              const findSuggestedReply = (option: string) =>
                suggestedReplies.find((item) => convertSuggestedReplyItemToString(item) === option);

              return (
                <BotResponseOptions
                  botResponseOptions={replyLabels}
                  sendResponseToBot={async (option) => {
                    const suggestedReply = findSuggestedReply(option);
                    if (!suggestedReply || !Array.isArray(suggestedReply)) {
                      return;
                    }
                    const [message, nextState] = suggestedReply;
                    const messageText = typeof message === 'object' ? message.en : message;

                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setSuggestedReplySelection({
                      replyText: option,
                      channelUrl,
                      state: channelMetaData[CHANNEL_METADATA_KEYS.state],
                    });

                    const index = replyLabels.indexOf(option);
                    await sendInteractiveChatResponse(messageText);
                    if (Array.isArray(suggestedReplies[index])) {
                      await setChannelState({
                        userId: sendbird.currentUser.userId,
                        channelUrl,
                        state: nextState,
                      });
                    }
                  }}
                />
              );
            }

            if (isShowKeypadButtonVisible) {
              return (
                <View
                  style={{
                    paddingHorizontal: 16,
                    marginTop: 24,
                    alignItems: 'flex-end',
                  }}
                >
                  <SuggestedReplyOption onPress={() => setIsKeypadVisible(true)}>
                    비밀번호 입력하기
                  </SuggestedReplyOption>
                </View>
              );
            }

            return null;
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
      <SafeAreaView edges={['bottom']} style={{ backgroundColor: 'white' }}>
        <RowStack style={[_styles.inputBar, { paddingRight: inputBarPaddingEnd }]}>
          <SendFileButton
            disabled={isSendingFileDisabled}
            isLoading={isSendingFileMessage}
            onPress={openImagePickerAsync}
            style={{ marginEnd: 2, marginTop: 4 }}
          />
          <ChatInput
            inputType={lastMessageData?.userInputType === 'number' ? 'money' : 'text'}
            textInputProps={chatInputProps}
          />
          <SendButton isMessageEmpty={input.trim() === ''} onPress={sendUserMessageFromTextInput} />
        </RowStack>
      </SafeAreaView>
      {imageModalUri && (
        <ImageView
          images={[{ uri: imageModalUri }]}
          imageIndex={0}
          visible
          onRequestClose={() => setImageModalUri(null)}
        />
      )}

      <ShareModal {...shareModalContext.modalProps} />
      <KeypadModal
        isVisible={isKeypadVisible}
        onCancel={() => setIsKeypadVisible(false)}
        onSubmit={async (code) => {
          setIsKeypadVisible(false);
          handleChannelStateEvent(
            channelScenario?.states?.[currentChannelState]?.onPinCodeSubmit,
            { code },
            { channelUrl },
          );
        }}
      />
    </KeyboardAvoidingView>
  );
});

export default ChatUI;

const _styles = StyleSheet.create({
  inputBar: {
    backgroundColor: 'white',
    minHeight: 56,
    paddingHorizontal: 4,
    paddingVertical: 8,
    alignItems: 'flex-start',
    overflow: 'hidden',
    position: 'relative',
  },
  avatar: {
    marginHorizontal: 8,
    marginBottom: 3,
  },
  messageRow: {
    paddingLeft: 8,
    paddingRight: 48,
    display: 'flex',
  },
  messageTextWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  removeBubblePadding: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  question: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  link: {
    marginTop: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: { color: colors.tertiaryText, marginHorizontal: 4 },
  dialog: {
    alignSelf: 'center',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 24,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#0000001A',
  },
  dialogTitle: { fontSize: 16, lineHeight: 24, marginBottom: 16 },
  image: { borderRadius: 0 },
  divider: { width: '100%', height: 1, backgroundColor: '#DEDEDE' },
});
