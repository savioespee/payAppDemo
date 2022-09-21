import { useCallback, useMemo, useState } from 'react';

import { messageCustomTypes, translationTargetLanguages } from '../constants';
import formatDuration from '../utils/formatDuration';
import { sendbird } from '../utils/sendbird';

async function get1On1ChannelWith(user) {
  const channelParams = new sendbird.GroupChannelParams();
  channelParams.addUserId(user.userId);
  const { channel: groupChannel } = await sendbird.GroupChannel.createDistinctChannelIfNotExist(channelParams);
  return groupChannel;
}

export default function useCallScreen() {
  const [callScreenData, setCallScreenData] = useState(null);

  const isCallVisible = !!callScreenData;
  const [callEventListenerMap] = useState(new Map());

  const addCallEventListener = useCallback(
    (id, listener) => {
      callEventListenerMap.set(id, listener);
    },
    [callEventListenerMap],
  );

  const removeCallEventListener = useCallback(
    (id) => {
      callEventListenerMap.delete(id);
    },
    [callEventListenerMap],
  );

  const startCall = useCallback(async ({ user }) => {
    const groupChannel = await get1On1ChannelWith(user);

    const messageParams = new sendbird.UserMessageParams();
    messageParams.message = 'Call started';
    messageParams.customType = messageCustomTypes.callStarted;
    messageParams.translationTargetLanguages = translationTargetLanguages;
    groupChannel.sendUserMessage(messageParams, (message, error) => {
      if (error) {
        console.error(error);
      }
      if (message) {
        console.log(`Message "${message.message}" sent to channel ${groupChannel.url}`);
      }
      setCallScreenData({ user });
    });
  }, []);

  const callContext = useMemo(
    () => ({
      startCall,
      isCallVisible,
      addCallEventListener,
      removeCallEventListener,
    }),
    [addCallEventListener, isCallVisible, removeCallEventListener, startCall],
  );

  const stopCall = useCallback(
    async (duration) => {
      if (!callScreenData) {
        setCallScreenData(null);
        return;
      }

      const { user } = callScreenData;

      const groupChannel = await get1On1ChannelWith(user);

      const messageParams = new sendbird.UserMessageParams();
      messageParams.message = formatDuration(duration);
      messageParams.customType = messageCustomTypes.callEnded;
      messageParams.translationTargetLanguages = translationTargetLanguages;

      try {
        const message = await new Promise((resolve, reject) => {
          groupChannel.sendUserMessage(messageParams, (message, error) => {
            if (error) {
              return reject(error);
            }
            resolve(message);
          });
        });
        console.log(`Message "${message.message}" sent to channel ${groupChannel.url}`);
        setCallScreenData(null);

        callEventListenerMap.forEach((listener) => {
          listener.onCallEnded?.(duration);
        });
      } catch (error) {
        console.error(error);
      }
    },
    [callEventListenerMap, callScreenData],
  );

  return { callScreenData, callContext, stopCall };
}
