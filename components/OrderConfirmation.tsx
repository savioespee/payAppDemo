import { StyleProp, View, ViewStyle } from 'react-native';

import { localImageMap } from '../constants';
import styles from '../styles';
import BlackBubbleHeader from './BlackBubbleHeader';
import Bubble from './bubbles/Bubble';
import Image from './Image';
import Text from './Text';

const Divider = ({ style }: { style: StyleProp<ViewStyle> }) => (
  <View style={[{ width: '100%', height: 1, backgroundColor: '#DEDEDE' }, style]} />
);

export default function OrderConfirmation({
  price,
  product,
  paymentMethod,
  address,
  title,
  localImageName,
  style,
}: {
  price: string;
  product: string;
  paymentMethod: string;
  address?: string;
  title: string;
  localImageName: string;
  style?: StyleProp<ViewStyle>;
}) {
  const paidWithSection = (
    <View style={[styles.colStack, { marginBottom: 4 }]}>
      <Text style={[styles.textXSmall, { color: '#757575' }]}>Paid with</Text>
      <Text style={[styles.textSmall]}>{paymentMethod}</Text>
    </View>
  );

  const addressSection = address && (
    <View style={[styles.colStack]}>
      <Text style={[styles.textXSmall, { color: '#757575' }]}>Deliver to</Text>
      <Text style={[styles.textSmall]}>{address}</Text>
    </View>
  );

  const isProductNameShort = product.length < 20;

  return (
    <Bubble
      style={[
        styles.colStack,
        {
          width: 252,
          borderRadius: 16,
          backgroundColor: '#F2F3F5',
        },
        style,
      ]}
    >
      <BlackBubbleHeader iconSource={require('../assets/ic-receipt.png')} title={title} />

      <View style={{ paddingVertical: 16, paddingHorizontal: 16 }}>
        <View style={[styles.rowStack, { alignItems: 'flex-start', marginBottom: 8 }]}>
          <Image
            source={localImageMap[localImageName]}
            resizeMode="contain"
            style={{
              width: 84,
              aspectRatio: 1,
              marginRight: 8,
              backgroundColor: 'white',
            }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}
          >
            <Text style={[styles.textSmall, { fontWeight: '700', marginBottom: 8 }]}>{product}</Text>
            {isProductNameShort && paidWithSection}
          </View>
        </View>

        {!isProductNameShort && paidWithSection}

        {addressSection}

        <Divider style={{ marginVertical: 12 }} />
        <View style={[styles.rowStack, { justifyContent: 'space-between', alignItems: 'baseline' }]}>
          <Text style={[styles.textSmall, { color: '#757575' }]}>Total</Text>
          <Text style={[styles.textMedium, { fontWeight: '700' }]}>{price}</Text>
        </View>
      </View>
    </Bubble>
  );
}
