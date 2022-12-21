import { isThisYear } from 'date-fns';
import emoji from 'node-emoji';
import { getLuminance, rgba } from 'polished';
import { memo } from 'react';
import { useCallback, useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import SendBird from 'sendbird';

import { getChannelState } from '../../api/ChannelStateUtils';
import { BUBBLE_PADDING, colors, messageCustomTypes } from '../../constants';
import useThemeValues from '../../hooks/useThemeValues';
import useTranslatedMessage from '../../hooks/useTranslatedMessage';
import styles from '../../styles';
import { parseMessageData } from '../../utils/dataUtils';
import { intlDateLineFormat, intlDateLineLastYearFormat, intlTimeFormat } from '../../utils/intl';
import safeJSONParse from '../../utils/safeJSONParse';
import { getScenarioDataFromChannelUrl, handleChannelStateEvent } from '../../utils/scenarioUtils';
import Avatar from '../Avatar';
import ActionsBubble from '../bubbles/ActionsBubble';
import MapBubble from '../bubbles/MapBubble';
import MessageHeader from '../bubbles/MessageHeader';
import useBubbleMaxWidth from '../bubbles/useBubbleMaxWidth';
import CSAT from '../CSAT';
import Image from '../Image';
import OrderConfirmation from '../OrderConfirmation';
import Text from '../Text';
import BillSplitting from './BillSplitting';
import chatMessageStyles from './chatMessageStyles';
import FilePreview from './FilePreview';
import isMyMessage from './isMyMessage';
import MessageFooter from './MessageFooter';
import MoneyCollectRequestBubble from './MoneyCollectRequestBubble';
import MoneyTransferBubble from './MoneyTransferBubble';
import TypingIndicator from './TypingIndicator';
import useRenderMessageContent from './useRenderMessageContent';

function ChatMessage({
  channel,
  message,
  showImagePreview,
  isFirstMessageOfDay,
  isFollowingSameSender,
  isFollowedBySameSender,
  isTimestampVisible,
}: {
  channel: SendBird.GroupChannel;
  message: SendBird.UserMessage | SendBird.AdminMessage | SendBird.FileMessage;
  showImagePreview: (url: string) => void;
  isFirstMessageOfDay: boolean;
  isFollowingSameSender: boolean;
  isFollowedBySameSender: boolean;
  isTimestampVisible: boolean;
}) {
  const { channelUrl, data } = message;
  const parsedData = useMemo(() => parseMessageData(data), [data]);

  const theme = useThemeValues();
  const bubbleMaxWidth = useBubbleMaxWidth();
  const _isMyMessage = isMyMessage(message);

  const { bubbleBackgroundColor, messageTextColor } = useMemo(() => {
    if (parsedData?.backgroundColor) {
      return {
        bubbleBackgroundColor: parsedData.backgroundColor,
        messageTextColor:
          getLuminance(parsedData.backgroundColor) > 0.5 ? 'rgba(0, 0, 0, 0.88)' : 'rgba(255, 255, 255, 0.88)',
      };
    }
    const bubbleBackgroundColor = _isMyMessage ? theme.outgoingMessageBackground : colors.incomingMessageBackground;
    const messageTextColor = _isMyMessage ? theme.outgoingMessageText : colors.text;

    return { bubbleBackgroundColor, messageTextColor };
  }, [_isMyMessage, parsedData?.backgroundColor, theme.outgoingMessageBackground, theme.outgoingMessageText]);

  const getTranslatedMessage = useTranslatedMessage();

  const getScenarioChannelState = useCallback(async () => {
    const scenarioData = await getScenarioDataFromChannelUrl(channelUrl);
    if (!scenarioData) {
      return undefined;
    }

    const channelStateKey = await getChannelState(channelUrl);
    if (!channelStateKey) {
      return undefined;
    }

    return scenarioData.states[channelStateKey];
  }, [channelUrl]);

  const renderMessageContent = useRenderMessageContent({ messageTextColor });

  const renderBubbles = (item: SendBird.AdminMessage | SendBird.FileMessage | SendBird.UserMessage) => {
    if (message.customType === messageCustomTypes.collectMoneyRequest) {
      return (
        <MoneyCollectRequestBubble
          message={message as SendBird.UserMessage}
          style={{ backgroundColor: bubbleBackgroundColor }}
        />
      );
    }
    if (
      message.customType === messageCustomTypes.moneyTransfer ||
      message.customType === messageCustomTypes.collectMoneySent
    ) {
      return (
        <MoneyTransferBubble
          message={message as SendBird.UserMessage}
          style={{ backgroundColor: bubbleBackgroundColor }}
        />
      );
    }

    if (
      parsedData &&
      ([messageCustomTypes.csat, messageCustomTypes.csat5] as string[]).includes(message.customType || '') &&
      message.isUserMessage()
    ) {
      return (
        <CSAT
          type={message.customType === messageCustomTypes.csat5 ? '5-scale' : 'binary'}
          score={parsedData.csat}
          question={getTranslatedMessage(message)}
          onSelect={async (score) => {
            const state = await getScenarioChannelState();
            handleChannelStateEvent(state?.onCSATSelect, { score: score as -1 | 0 | 1, message }, { channelUrl });
          }}
        />
      );
    }

    const messageHeader = parsedData?.header && (
      <MessageHeader title={parsedData.header.title} type={parsedData.header.type} />
    );

    if (item.customType === messageCustomTypes.typingIndicator) {
      return <TypingIndicator style={{ backgroundColor: bubbleBackgroundColor }} />;
    }

    if (item.customType === messageCustomTypes.map) {
      return <MapBubble title={getTranslatedMessage(item)} />;
    }

    if (item.isFileMessage()) {
      return <FilePreview message={item as SendBird.FileMessage} showImagePreview={showImagePreview} />;
    }

    if (parsedData?.actions) {
      const messageData = parsedData as MessageData;
      return (
        <ActionsBubble
          cover={messageData.cover}
          header={messageHeader}
          width={252}
          message={item as SendBird.UserMessage}
          actions={messageData.actions}
          textColor={messageTextColor}
          style={{ backgroundColor: bubbleBackgroundColor }}
        />
      );
    }

    const isCallStatusMessage =
      item.customType === messageCustomTypes.callStarted || item.customType === messageCustomTypes.callEnded;

    const textMessageBubble = (
      <View
        style={[
          _styles.bubble,
          { backgroundColor: bubbleBackgroundColor, maxWidth: bubbleMaxWidth },
          !!messageHeader && { paddingVertical: BUBBLE_PADDING },
        ]}
      >
        {messageHeader}
        <View
          style={[
            { flexDirection: 'row', alignItems: 'center' },
            isCallStatusMessage && {
              width: 100,
              justifyContent: 'space-between',
            },
            !!messageHeader && { marginTop: 8 },
          ]}
        >
          {isCallStatusMessage && (
            <Image
              source={require('../../assets/ic-call.png')}
              style={{ width: 16, height: 16, tintColor: '@brandAvatarIcon' }}
            />
          )}
          {renderMessageContent(item)}
        </View>
      </View>
    );

    if (item.customType === messageCustomTypes.orderConfirmation && typeof parsedData?.orderInfo === 'object') {
      return (
        <View style={{ width: 252 }}>
          {textMessageBubble}
          <OrderConfirmation {...parsedData.orderInfo} style={{ marginTop: 8 }} />
        </View>
      );
    }

    return textMessageBubble;
  };

  const handleCarouselItemSelect = useCallback(
    async (selectedOption: CarouselItem) => {
      const state = await getScenarioChannelState();

      await handleChannelStateEvent(
        state?.onCarouselSelect,
        { selectedOption, message: message as SendBird.UserMessage },
        { channelUrl },
      );
    },
    [channelUrl, getScenarioChannelState, message],
  );

  const isAvatarHidden = isFollowingSameSender;

  const isNicknameVisible = !isFollowedBySameSender;

  function renderMessage() {
    if (message.customType === messageCustomTypes.splitPayment) {
      const splitPaymentMessage = message as SendBird.AdminMessage;
      const messageData = safeJSONParse(splitPaymentMessage.data);
      return (
        <BillSplitting
          message={getTranslatedMessage(splitPaymentMessage)}
          sender={messageData.splitPayment.sender}
          currency="$"
          totalAmount={messageData.splitPayment.totalAmount}
          numberOfPeople={messageData.splitPayment.pendingPaymentCount}
        />
      );
    }

    return (
      <View
        style={[
          chatMessageStyles.messageRow,
          { flexDirection: _isMyMessage ? 'row-reverse' : 'row' },
          _isMyMessage && { marginLeft: 8 },
          (message.reactions?.length ?? 0) > 0 && { paddingBottom: 22 },
        ]}
      >
        {!_isMyMessage && (
          <Avatar
            user={(message as SendBird.UserMessage).sender || undefined}
            size={28}
            style={[chatMessageStyles.avatar, { opacity: isAvatarHidden ? 0 : 1 }]}
          />
        )}
        <View
          style={[
            chatMessageStyles.messageTextWrapper,
            {
              alignItems: _isMyMessage ? 'flex-end' : 'flex-start',
            },
          ]}
        >
          {!_isMyMessage && (message as SendBird.UserMessage).sender && isNicknameVisible && (
            <Text
              style={[
                {
                  marginBottom: 2,
                  fontWeight: '700',
                  color: rgba('black', 0.5),
                  paddingLeft: 12,
                },
                styles.textXSmall,
              ]}
            >
              {(message as SendBird.UserMessage).sender?.nickname}
            </Text>
          )}
          {renderBubbles(message)}

          {(message.reactions?.length ?? 0) > 0 && (
            <View
              style={[
                _styles.reaction,
                {
                  right: _isMyMessage ? undefined : 4,
                  left: _isMyMessage ? 4 : undefined,
                  backgroundColor: bubbleBackgroundColor,
                },
              ]}
            >
              <Text style={[_styles.reactionText]}>{emoji.get(message.reactions[0].key)}</Text>
              <Text style={[_styles.reactionText, { color: messageTextColor }]}>
                {message.reactions[0].userIds.length > 1 ? ` ${message.reactions[0].userIds.length}` : ''}
              </Text>
            </View>
          )}
        </View>
        {isTimestampVisible && (
          <Text style={[_styles.timestamp, styles.textXSmall]}>{intlTimeFormat.format(message.createdAt)}</Text>
        )}
        {_isMyMessage && channel.getUnreadMemberCount(message) === 0 && (
          <Image
            source={require('../../assets/ic-done-all.png')}
            style={{
              width: 16,
              height: 16,
              position: 'relative',
              top: -2,
              marginHorizontal: isTimestampVisible ? 0 : 4,
            }}
          />
        )}
      </View>
    );
  }
  return (
    <View>
      {isFirstMessageOfDay && (
        <Text style={chatMessageStyles.dateLine}>
          {(isThisYear(message.createdAt) ? intlDateLineFormat : intlDateLineLastYearFormat).format(message.createdAt)}
        </Text>
      )}
      {renderMessage()}
      <MessageFooter message={message} onCarouselItemSelect={handleCarouselItemSelect} />
    </View>
  );
}

const _styles = StyleSheet.create({
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
  timestamp: {
    color: colors.tertiaryText,
    marginHorizontal: 4,
    ...(Platform.OS === 'web' ? { whiteSpace: 'nowrap' } : undefined),
  },
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
  reaction: {
    position: 'absolute',
    bottom: -24,
    minWidth: 30,
    height: 30,
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  reactionText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default memo(ChatMessage);
