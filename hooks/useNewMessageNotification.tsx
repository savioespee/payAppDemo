import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback } from 'react';
import { Platform, SafeAreaView, StatusBar, View, ViewStyle } from 'react-native';
import { Easing, Notifier } from 'react-native-notifier';

import ChannelCover from '../components/ChannelCover';
import RowStack from '../components/RowStack';
import Spacer from '../components/Spacer';
import Text from '../components/Text';
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
    <SafeAreaView style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      <View
        style={[
          {
            borderRadius: 4,
            backgroundColor: '#F7F7F7',
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 6,
            shadowColor: 'rgba(0, 0, 0, 0.24)',
            shadowOpacity: 1,
            paddingHorizontal: 16,
            paddingVertical: 12,
            marginHorizontal: 12,
          },
          Platform.OS === 'web' && ({ cursor: 'pointer' } as ViewStyle),
        ]}
      >
        <RowStack>
          <ChannelCover channel={channel} size={16} />
          <Spacer size={6} />
          <Text style={[styles.textSmedium, styles.textSemibold, { color: '@accent' }]}>{title}</Text>
        </RowStack>
        <Spacer size={4} />
        <Text style={styles.textSmedium} numberOfLines={2}>
          {description}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default function useNewMessageNotification() {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const showNewMessageNotification = useCallback(
    async ({
      title,
      description,
      targetChannelCustomType,
    }: {
      title: string;
      description: string;
      targetChannelCustomType: string;
    }) => {
      const listQuery = await sendbird.GroupChannel.createMyGroupChannelListQuery();
      listQuery.customTypesFilter = [targetChannelCustomType];
      listQuery.limit = 1;
      const [channel] = await listQuery.next();

      if (!channel) {
        return;
      }

      const navigateToChannel = async () => {
        const { index, routes } = navigation.getState();
        if (routes[index].name === 'Chat' && routes[index].params?.channelUrl !== channel.url) {
          navigation.goBack();
        }
        navigation.navigate('Chat', { channelUrl: channel.url });
      };

      Notifier.showNotification({
        title,
        description,
        Component: NotificationComponent,
        componentProps: { channel },
        duration: 0,
        showAnimationDuration: 800,
        showEasing: Easing.out(Easing.ease),
        onPress: navigateToChannel,
        hideOnPress: true,
      });
    },
    [navigation],
  );

  return showNewMessageNotification;
}
