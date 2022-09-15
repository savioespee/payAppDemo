import { rgba } from 'polished';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import SendBird from 'sendbird';

import useThemeValues from '../../hooks/useThemeValues';
import { sendbird } from '../../utils/sendbird';
import Bubble from '../bubbles/Bubble';
import Image from '../Image';
import Text from '../Text';

export default function MoneyCollectRequestBubble({
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
      <Image source={require('../../assets/collect-money.png')} style={{ width: 32, height: 32 }} />
      <Text style={[styles.text, styles.amount]}>{amount}</Text>
      <Text style={[styles.text, styles.caption]}>입금을 요청드려요</Text>
    </Bubble>
  );
}

const styles = StyleSheet.create({
  bubble: {
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
