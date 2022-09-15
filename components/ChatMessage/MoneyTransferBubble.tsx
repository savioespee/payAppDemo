import { rgba } from 'polished';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import SendBird from 'sendbird';

import useThemeValues from '../../hooks/useThemeValues';
import { sendbird } from '../../utils/sendbird';
import Bubble from '../bubbles/Bubble';
import Image from '../Image';
import Text from '../Text';

export default function MoneyTransferBubble({
  message,
  style,
}: {
  message: SendBird.UserMessage;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useThemeValues();
  const amount = /[\d,]+원/.exec(message.message || '')?.[0];
  return (
    <Bubble style={[styles.bubble, style]}>
      <View>
        <Text style={[styles.text, styles.amount]}>{amount}</Text>
        <Text style={[styles.text, styles.caption]}>송금 완료</Text>
      </View>
      <View
        style={[
          styles.arrowContainer,
          {
            backgroundColor:
              message.sender?.userId === sendbird.currentUser.userId
                ? rgba(theme.brandAvatarIcon, 0.15)
                : rgba('black', 0.05),
          },
        ]}
      >
        <Image
          source={require('../../assets/bubble-arrow.png')}
          style={{ width: 16, height: 16, tintColor: theme.brandAvatarIcon }}
        />
      </View>
    </Bubble>
  );
}

const styles = StyleSheet.create({
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    width: 200,
  },
  text: {
    color: '@outgoingMessageText',
  },
  amount: {
    fontSize: 20,
    fontWeight: '600',
  },
  caption: {
    opacity: 0.7,
  },
  arrowContainer: {
    marginRight: -4,
    width: 32,
    height: 32,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
