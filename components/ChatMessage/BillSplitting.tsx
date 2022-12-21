import { LayoutAnimation, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import styles from '../../styles';
import Bubble from '../bubbles/Bubble';
import useBubbleMaxWidth from '../bubbles/useBubbleMaxWidth';
import Image from '../Image';
import Text from '../Text';
import chatMessageStyles from './chatMessageStyles';

const BillSplitting = ({
  sender,
  message,
  totalAmount,
  currency,
  numberOfPeople,
}: {
  sender: { nickname: string; profileUrl: string };
  message: string;
  totalAmount: string;
  currency: string;
  numberOfPeople: number;
}) => {
  const defaultBubbleMaxWidth = useBubbleMaxWidth();
  const { width: screenWidth } = useWindowDimensions();
  const bubbleMaxWidth = screenWidth < 480 ? screenWidth - 32 : defaultBubbleMaxWidth;

  return (
    <Bubble
      style={[
        styles.colStack,
        {
          maxWidth: bubbleMaxWidth,
          alignSelf: 'center',
          width: '100%',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 12,
          backgroundColor: '#F2F3F5',
          marginHorizontal: 16,
          marginVertical: 24,
        },
      ]}
    >
      <View style={{ position: 'relative' }}>
        <Text
          style={{
            position: 'absolute',
            left: 0,
            top: 6,
            textAlign: 'right',
            width: 50,
            fontSize: 21,
            color: '@accent',
            fontWeight: '400',
            transform: [{ translateX: -52 }],
          }}
        >
          {currency}
        </Text>
        <Text style={[{ fontSize: 32, color: '@accent', fontWeight: '500' }]}>{totalAmount}</Text>
      </View>
      <Text style={[styles.textSmall, { paddingHorizontal: 24, textAlign: 'center' }]}>{message}</Text>
      <View style={[chatMessageStyles.divider, { width: 48, marginVertical: 12 }]} />
      <View style={[styles.rowStack, { alignItems: 'center', marginBottom: 20 }]}>
        <Image source={{ uri: sender.profileUrl }} style={{ width: 16, height: 16, borderRadius: 8, marginRight: 8 }} />
        <Text style={[styles.textSmall, { fontWeight: '500', color: '#6B6B6BB2' }]}>
          Sent from {sender.nickname} · {numberOfPeople} Pending
        </Text>
      </View>
      <Pressable
        onPressIn={() => {
          LayoutAnimation.configureNext(LayoutAnimation.create(200, 'easeInEaseOut', 'opacity'));
        }}
        onPressOut={() => {
          LayoutAnimation.configureNext(LayoutAnimation.create(200, 'easeInEaseOut', 'opacity'));
        }}
        style={({ pressed }) => {
          return [
            {
              position: 'relative',
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 10,
              width: '100%',
              alignItems: 'center',
            },
            pressed && { top: 1 },
            !pressed && {
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowRadius: 1.41,
              elevation: 2,
            },
          ];
        }}
      >
        <Text style={[styles.textMedium, componentStyles.buttonLabel]}>Split payment</Text>
      </Pressable>
    </Bubble>
  );
};

export default BillSplitting;

const componentStyles = StyleSheet.create({
  buttonLabel: { color: '@accent', fontWeight: '600' },
});
