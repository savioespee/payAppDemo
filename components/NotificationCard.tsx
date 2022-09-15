import { useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import SendBird from 'sendbird';

import { localImageMap } from '../constants';
import useHandleMessageAction from '../hooks/useHandleMessageAction';
import useThemeValues from '../hooks/useThemeValues';
import useTranslatedMessage from '../hooks/useTranslatedMessage';
import { parseMessageData } from '../utils/dataUtils';
import AutoUpdatingTimestamp from './AutoUpdatingTimestamp';
import headerIconMap from './bubbles/headerIconMap';
import Button from './Button';
import Image from './Image';
import RowStack from './RowStack';
import Spacer from './Spacer';
import Text from './Text';

export default function NotificationCard({
  message,
  onMoreButtonPress,
}: {
  message: SendBird.UserMessage;
  onMoreButtonPress?: (message: SendBird.UserMessage) => void;
}) {
  const getTranslatedMessage = useTranslatedMessage();
  const { width: screenWidth } = useWindowDimensions();
  const handleMessageAction = useHandleMessageAction();
  const theme = useThemeValues();
  const {
    headerLabel,
    title,
    headerIcon,
    body,
    actions,
    cover,
    coverAspectRatio = 1 / 2,
  } = useMemo(() => {
    if (!message.data && message.message) {
      let originalMessage = message.message;
      const headerLabelPart = originalMessage.match(/^\[[\w\s]+\]/)?.[0];
      const headerLabel = headerLabelPart?.replace(/^\[/, '').replace(/\]$/, '').trim();
      if (headerLabelPart) {
        originalMessage = originalMessage.replace(headerLabelPart, '').trim();
      }

      const imagePart = originalMessage.match(/!\[Image\]\((.+)\)$/);
      if (imagePart) {
        originalMessage = originalMessage.replace(imagePart[0], '').trim();
      }
      const [image, imageAspectRatioString] = (imagePart?.[1] ?? '').split('|');
      const cover = image ? { uri: image } : undefined;
      const coverAspectRatio = imageAspectRatioString ? Number(imageAspectRatioString) : undefined;

      let actions: { label: string }[] = [];
      while (originalMessage.match(/\[[\w\s]+\]$/)?.[0]) {
        const actionPart = originalMessage.match(/\[[\w\s]+\]$/)?.[0];
        const action = actionPart?.replace(/^\[/, '').replace(/\]$/, '').trim();

        if (actionPart) {
          originalMessage = originalMessage.replace(actionPart, '').trim();
        }

        actions = action ? [{ label: action }, ...actions] : actions;
      }

      const [titlePart, bodyPart] = originalMessage.split('--');
      const title = titlePart?.trim();
      const body = bodyPart?.trim();

      return {
        headerLabel,
        title,
        headerIcon: null,
        body,
        actions: actions.length > 0 ? actions : undefined,
        cover,
        coverAspectRatio,
      };
    }
    const messageData = parseMessageData(message.data);
    const headerLabel = messageData?.header?.title;
    const title = messageData?.title;
    const headerIcon = messageData?.header?.type ? headerIconMap[messageData.header.type] : null;
    const cover =
      messageData?.cover &&
      (messageData.cover.startsWith('http') ? { uri: messageData.cover } : localImageMap[messageData.cover]);
    const coverAspectRatio = messageData?.coverAspectRatio;
    const body = getTranslatedMessage(message);
    const actions = messageData?.actions;

    return { headerLabel, title, headerIcon, cover, body, actions, coverAspectRatio };
  }, [getTranslatedMessage, message]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <RowStack>
          {headerIcon}
          {headerIcon && <Spacer size={4} />}
          <Text style={styles.headerLabel}>{headerLabel}</Text>
        </RowStack>
        <AutoUpdatingTimestamp style={styles.timestamp} timestamp={message.createdAt} />
      </View>
      <Spacer size={4} />

      {cover && (
        <Image
          source={cover}
          resizeMode="cover"
          style={[
            styles.coverImage,
            {
              width: screenWidth - 32,
              height: (screenWidth - 32) * coverAspectRatio,
            },
          ]}
        />
      )}
      <View style={[styles.bubble, cover ? { borderTopLeftRadius: 0, borderTopRightRadius: 0 } : undefined]}>
        {title && (
          <>
            <Text style={styles.title}>{title}</Text>
            <Spacer size={4} />
          </>
        )}

        <Text style={[styles.body, { fontWeight: title ? '400' : '500' }]}>{body}</Text>
        {actions && (
          <View style={styles.actions}>
            {actions.map((action, index) => (
              <Button
                key={action.label}
                variant="secondary"
                title={action.label}
                style={index > 0 && { marginTop: 8 }}
                textStyle={{ color: theme.accent }}
                onPress={() => handleMessageAction(action, message)}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const bubbleBackgroundColor = '#F2F3F5';

const styles = StyleSheet.create({
  container: { position: 'relative' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  timestamp: {
    color: '#A6A6A6',
    fontSize: 12,
    fontWeight: '500',
  },
  bubble: {
    backgroundColor: bubbleBackgroundColor,
    position: 'relative',
    padding: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    // paddingRight: 16,
  },
  body: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'column',
    marginTop: 16,
  },
  coverImage: {
    backgroundColor: bubbleBackgroundColor,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  iconButtonPressable: {
    position: 'absolute',
    top: 28,
    right: 6,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
});
