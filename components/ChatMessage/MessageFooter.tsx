import { StyleSheet, TouchableOpacity, View } from 'react-native';
import SendBird from 'sendbird';

import { BUBBLE_PADDING, messageCustomTypes } from '../../constants';
import useThemeValues from '../../hooks/useThemeValues';
import styles from '../../styles';
import safeJSONParse from '../../utils/safeJSONParse';
import Carousel from '../Carousel';
import FAQArticles from '../FAQArticles';
import Text from '../Text';
import isMyMessage from './isMyMessage';

function getFAQArticles(messageData: MessageData | null) {
  try {
    if (messageData && Array.isArray(messageData?.faqArticles)) {
      return messageData.faqArticles;
    }
    return [];
  } catch {
    return [];
  }
}

export default function MessageFooter({
  message,
  onCarouselItemSelect,
}: {
  message: SendBird.UserMessage | SendBird.AdminMessage | SendBird.FileMessage;
  onCarouselItemSelect?: (selectedItem: CarouselItem) => void;
}) {
  const parsedData = safeJSONParse(message.data) as MessageData | null;

  function renderFAQArticles() {
    const faqArticles = getFAQArticles(parsedData);
    if (faqArticles.length === 0) {
      return null;
    }

    return (
      <View style={[componentStyles.messageAvatarPadding, styles.rowStack, { marginTop: 8, marginBottom: 4 }]}>
        <FAQArticles items={faqArticles} />
      </View>
    );
  }

  function renderCarousel() {
    if (message.customType !== messageCustomTypes.vote) {
      return null;
    }

    return <Carousel data={parsedData?.carousel?.options} onItemSelect={onCarouselItemSelect} />;
  }

  const _isMyMessage = isMyMessage(message);
  const theme = useThemeValues();

  function renderFileMessageActions() {
    if (!message.isFileMessage()) {
      return null;
    }
    if (!(parsedData?.actions?.length ?? 0)) {
      return null;
    }
    return (
      <View
        style={[
          componentStyles.messageAvatarPadding,
          {
            alignItems: _isMyMessage ? 'flex-end' : 'flex-start',
            marginTop: 4,
          },
        ]}
      >
        {parsedData?.actions?.map((item) => {
          return (
            <TouchableOpacity style={[componentStyles.action, { borderColor: theme.accent }]}>
              <Text style={{ color: theme.accent, fontSize: 14 }}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  return (
    <View>
      {renderCarousel()}
      {renderFAQArticles()}
      {renderFileMessageActions()}
    </View>
  );
}

const componentStyles = StyleSheet.create({
  messageAvatarPadding: {
    paddingLeft: 52,
    paddingRight: 16,
  },
  action: {
    paddingVertical: BUBBLE_PADDING / 2,
    paddingHorizontal: BUBBLE_PADDING,
    borderWidth: 1,
    borderRadius: 16,
  },
});
