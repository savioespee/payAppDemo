import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { openBrowserAsync } from 'expo-web-browser';
import { useMemo, useState } from 'react';
import { Image as RNImage, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Carousel from 'react-native-snap-carousel';

import { localImageMap } from '../constants';
import alert from '../utils/alert';
import safeJSONParse from '../utils/safeJSONParse';
import { sendbird } from '../utils/sendbird';
import Image from './Image';
import Text from './Text';

type BannerItem = {
  messageId: number;
  url?: string;
  channelCustomType?: string;
  localImageName?: string;
};

export default function PromotionCarousel({
  data,
}: {
  data: {
    items: {
      recentMessages: (SendBird.UserMessage | SendBird.AdminMessage | SendBird.FileMessage)[];
    }[];
  };
}) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { items = [] } = data;

  const banners: BannerItem[] = useMemo(() => {
    const messages = items.flatMap((item) => item.recentMessages).filter(Boolean);

    return messages
      .map(({ messageId, data }) => ({ messageId, data: safeJSONParse(data) }))
      .filter((item) => !!item.data)
      .map(({ messageId, data }) => ({ ...data, messageId } as BannerItem));
  }, [items]);

  const { width: screenWidth } = useWindowDimensions();
  const [slideIndex, setSlideIndex] = useState(0);

  const onItemPress = async (item: BannerItem) => {
    if (item.url) {
      openBrowserAsync(item.url);
    } else if (item.channelCustomType) {
      const listQuery = sendbird.GroupChannel.createMyGroupChannelListQuery();
      listQuery.includeEmpty = true;
      listQuery.memberStateFilter = 'joined_only';
      listQuery.customTypesFilter = [item.channelCustomType];
      listQuery.limit = 1;

      try {
        const [channel] = await listQuery.next();
        if (!channel) {
          alert(
            'Channel not found',
            `Meant to be navigate to a channel with this custom type: ${item.channelCustomType}`,
          );
          return;
        }
        navigation.push('Chat', { channelUrl: channel.url });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const { width, height } = RNImage.resolveAssetSource(localImageMap[banners[0].localImageName!]);
  const aspectRatio = width / height;

  return (
    <View style={{ position: 'relative' }}>
      <Carousel
        data={banners}
        onSnapToItem={setSlideIndex}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onItemPress(item)} activeOpacity={1}>
            <Image
              source={localImageMap[item.localImageName]}
              style={{
                width: screenWidth,
                height: screenWidth / aspectRatio,
              }}
            />
          </TouchableOpacity>
        )}
        sliderWidth={screenWidth}
        itemWidth={screenWidth}
        autoplay={true}
        loop={true}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
        lockScrollWhileSnapping={true}
      />
      <View
        style={{
          position: 'absolute',
          right: 12,
          bottom: 12,
          paddingVertical: 4,
          paddingHorizontal: 8,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: '500',
            color: 'white',
            lineHeight: 12,
          }}
        >{`${slideIndex + 1} / ${banners.length}`}</Text>
      </View>
    </View>
  );
}
