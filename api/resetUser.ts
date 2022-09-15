import axios from 'axios';

import { CHANNEL_METADATA_KEYS, USER_METADATA_KEYS, USER_VERSION } from '../constants';
import { scenario } from '../constants/scenario';
import { convertMessagesToPayloadArray__TMP, convertTimestamp, requestSendMessage } from '../utils/scenarioUtils';
import {
  createGroupChannel,
  deleteAllGroupChannels,
  freezeGroupChannel,
  markAsRead,
  updateGroupChannelMetaData,
  updateUserMetadata,
} from './platformAPI';

export default async function resetUser(userId: string) {
  if (!userId) {
    throw new Error('userId is required');
  }

  try {
    await deleteAllGroupChannels(userId);

    for (const channelData of scenario.channels) {
      const { name, isFrozen, members, customType, states, coverUrl = '', initialReadAt } = channelData;
      const channel = await createGroupChannel({
        name,
        is_distinct: true,
        custom_type: customType,
        cover_url: coverUrl,
        user_ids: [userId, ...members],
      });
      const channelUrl = channel.channel_url;

      const processedMessages = convertMessagesToPayloadArray__TMP(states.initial.messages);

      const initialReadAtTimestamp =
        initialReadAt === 0 ? Date.now() : initialReadAt == null ? null : convertTimestamp(initialReadAt);

      const [firstMessages, secondMessages] = processedMessages.reduce(
        ([firstList, secondList], cur) => {
          if (initialReadAtTimestamp == null) {
            firstList.push(cur);
            return [firstList, secondList];
          }
          if (cur.createdAt > initialReadAtTimestamp) {
            secondList.push(cur);
          } else {
            firstList.push(cur);
          }
          return [firstList, secondList];
        },
        [[] as SingleContentScenarioMessage[], [] as SingleContentScenarioMessage[]],
      );

      await Promise.all(
        firstMessages.map((message) =>
          requestSendMessage(message, { myUserId: userId, channelMetaData: {}, channelUrl }),
        ),
      );

      if (initialReadAtTimestamp != null) {
        await markAsRead(userId, channelUrl, initialReadAtTimestamp);
      }

      await Promise.all(
        secondMessages.map((message) =>
          requestSendMessage(message, { myUserId: userId, channelMetaData: {}, channelUrl }),
        ),
      );

      await updateGroupChannelMetaData({ channelUrl, metaData: { [CHANNEL_METADATA_KEYS.state]: 'initial' } });
      if (isFrozen) {
        await freezeGroupChannel(channelUrl);
      }
    }

    await updateUserMetadata({
      userId,
      metadata: {
        [USER_METADATA_KEYS.initializedVersion]: USER_VERSION,
        [USER_METADATA_KEYS.scenario]: scenario.key,
        [USER_METADATA_KEYS.language]: scenario.defaultLanguage,
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.config) {
      const { status, statusText, data, config } = error.response;
      const { url, method, data: configData, params } = config;
      throw {
        status,
        statusText,
        data,
        config: { method, url, data: configData, params },
      };
    }
    throw error;
  }
}
