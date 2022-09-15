import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback } from 'react';
import { Platform, SafeAreaView, View, ViewStyle } from 'react-native';
import { Easing, Notifier } from 'react-native-notifier';

import ChannelCover from '../components/ChannelCover';
import Spacer from '../components/Spacer';
import Text from '../components/Text';
import { primitive } from '../constants';
import styles from '../styles';
import { sendbird } from '../utils/sendbird';

const NotificationComponent = ({
  title,
  description,
  channel,
}: {
  title: string;
  description: string;
  channel: SendBird.GroupChannel;
}) => {
  return (
    <SafeAreaView>
      <View
        style={[
          {
            borderRadius: 4,
            backgroundColor: primitive.neutral[1],
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 6,
            shadowColor: 'rgba(0, 0, 0, 0.24)',
            paddingHorizontal: 16,
            paddingVertical: 12,
            margin: 12,
          },
          Platform.OS === 'web' && ({ cursor: 'pointer' } as ViewStyle),
        ]}
      >
        <View style={[styles.rowStack, { alignItems: 'center' }]}>
          <ChannelCover channel={channel} size={16} />
          <Spacer size={6} />
          <Text style={[styles.textSmedium, styles.textSemibold, { color: '@accent' }]}>{title}</Text>
        </View>
        <Spacer size={4} />
        <Text style={[styles.textSmedium]} numberOfLines={2}>
          {description}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default function useFakeNewMessageAlert() {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const sendFakeNewMessageAlert = useCallback(
    async ({ title, description, targetChannelCustomType }) => {
      const listQuery = await sendbird.GroupChannel.createMyGroupChannelListQuery();
      listQuery.customTypesFilter = [targetChannelCustomType];
      listQuery.limit = 1;
      const [channel] = await listQuery.next();

      if (!channel) {
        return;
      }

      Notifier.showNotification({
        title,
        description,
        Component: NotificationComponent,
        componentProps: { channel },
        duration: 0,
        showAnimationDuration: 800,
        showEasing: Easing.out(Easing.ease),
        onPress: async () => {
          const { index, routes } = navigation.getState();
          if (routes[index].name === 'Chat' && routes[index].params?.channelUrl !== channel.url) {
            navigation.goBack();
          }
          navigation.navigate('Chat', { channelUrl: channel.url });
        },
        hideOnPress: true,
      });
    },
    [navigation],
  );

  return sendFakeNewMessageAlert;
}
