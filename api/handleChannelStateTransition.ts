import axios from 'axios';

import delay from '../utils/delay';
import {
  addReactionsToMessage,
  convertMessagesToPayloadArray__TMP,
  convertScenarioMessageToMessagePayload,
  getScenarioDataFromChannelUrl,
  getScenarioStateContext,
} from '../utils/scenarioUtils';
import { getGroupChannel, getGroupChannelMetaData, inviteUser } from './platformAPI';
import { sendMessageAndTranslate, typeAndSendMessage } from './utils';

export default async function handleChannelStateTransition(userId: string, channelUrl: string, channelState: string) {
  const scenarioData = await getScenarioDataFromChannelUrl(channelUrl);
  if (!scenarioData) {
    return;
  }

  const currentState = scenarioData.states[channelState];
  if (!currentState) {
    return;
  }

  try {
    const channel = await getGroupChannel(channelUrl);
    const channelMetaData = await getGroupChannelMetaData(channelUrl);
    const processedMessages = convertMessagesToPayloadArray__TMP(currentState.messages);

    const sendMessage = async (message) => {
      const payload = convertScenarioMessageToMessagePayload(message, { myUserId: userId, channelMetaData });

      if (!('user_id' in payload) || !payload.user_id || payload.user_id === userId) {
        return sendMessageAndTranslate(channelUrl, payload);
      } else {
        const isChannelMember = channel.members.some((user) => user.user_id === payload.user_id);
        if (!isChannelMember) {
          await inviteUser(channelUrl, payload.user_id);
        }
        return typeAndSendMessage({
          channelUrl,
          userId: payload.user_id,
          messageParams: payload,
        });
      }
    };

    for (const message of processedMessages) {
      const { message_id: messageId } = await sendMessage(message);
      await addReactionsToMessage({ channelUrl, messageId, reactions: message.reactions });
    }

    if (currentState.onEntry) {
      await currentState.onEntry(getScenarioStateContext({ userId, channelUrl }));
    }
    if (currentState.after) {
      const { delay: delayMs, targetState } = currentState.after;
      delayMs && (await delay(delayMs));

      const { setChannelState } = await import('./ChannelStateUtils');
      setChannelState({ channelUrl, state: targetState, userId });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.toJSON());
      console.error(`Response body: ${JSON.stringify(error.response?.data)}`);
    } else {
      console.error(error);
    }
  }
}
