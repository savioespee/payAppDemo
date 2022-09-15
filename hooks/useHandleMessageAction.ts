import * as WebBrowser from 'expo-web-browser';
import { useCallback } from 'react';
import SendBird from 'sendbird';

import { getChannelState } from '../api/ChannelStateUtils';
import { getScenarioDataFromChannelUrl, handleChannelStateEvent } from '../utils/scenarioUtils';

export default function useHandleMessageAction() {
  const handleActionPress = useCallback(async (action: MessageAction, message: SendBird.UserMessage) => {
    if (action.url) {
      WebBrowser.openBrowserAsync(action.url);
    }
    const { channelUrl } = message;
    const channelScenario = await getScenarioDataFromChannelUrl(channelUrl);
    const channelState = await getChannelState(channelUrl);
    if (channelScenario && channelState) {
      const onActionPress = channelScenario.states[channelState]?.onActionPress;
      if (onActionPress) {
        handleChannelStateEvent(onActionPress, { action, message }, { channelUrl });
        return;
      }
    }
  }, []);

  return handleActionPress;
}
