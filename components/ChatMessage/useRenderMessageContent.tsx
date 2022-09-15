import { openBrowserAsync } from 'expo-web-browser';
import { useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Autolink from 'react-native-autolink';
import Markdown from 'react-native-markdown-display';
import SendBird from 'sendbird';

import useThemeValues from '../../hooks/useThemeValues';
import useTranslatedMessage from '../../hooks/useTranslatedMessage';
import { parseMessageData } from '../../utils/dataUtils';
import Text from '../Text';

function openLink(url: string) {
  if (url === '#') {
    return false;
  }
  openBrowserAsync(url);
  return false;
}

export default function useRenderMessageContent({ messageTextColor }: { messageTextColor: string }) {
  const theme = useThemeValues();
  const getTranslatedMessage = useTranslatedMessage();

  const markdownStyles = useMemo(
    () =>
      StyleSheet.create({
        heading1: { fontSize: 16, lineHeight: 20, fontWeight: 'bold', marginBottom: 2 },
        body: { color: messageTextColor, lineHeight: 21, fontSize: 14 },
        link: { color: theme.accent },
        paragraph: { marginTop: 0, marginBottom: 0 },
      }),
    [messageTextColor, theme.accent],
  );

  return useCallback(
    (message: SendBird.AdminMessage | SendBird.UserMessage) => {
      const parsedData = parseMessageData(message.data);

      return parsedData?.isMarkdown ? (
        <Markdown onLinkPress={openLink} style={markdownStyles}>
          {getTranslatedMessage(message)}
        </Markdown>
      ) : (
        <Autolink
          component={Text}
          text={getTranslatedMessage(message)}
          url
          email
          linkStyle={{ color: theme.accent }}
          onPress={openLink}
          style={{ color: messageTextColor }}
        />
      );
    },
    [getTranslatedMessage, markdownStyles, messageTextColor, theme.accent],
  );
}
