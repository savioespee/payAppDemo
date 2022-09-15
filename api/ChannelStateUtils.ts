import { CHANNEL_METADATA_KEYS } from '../constants';
import handleChannelStateTransition from './handleChannelStateTransition';
import { getGroupChannelMetaDataOfKey, updateGroupChannelMetaDataOfKey } from './platformAPI';

export async function getChannelState(channelUrl: string) {
  try {
    const result = await getGroupChannelMetaDataOfKey({
      channelUrl,
      key: CHANNEL_METADATA_KEYS.state,
    });
    return result;
  } catch (error) {
    return null;
  }
}

export async function setChannelState({
  channelUrl,
  state,
  userId,
}: {
  channelUrl: string;
  state: number | string;
  userId: string;
}) {
  const previousState = await getGroupChannelMetaDataOfKey({
    channelUrl,
    key: CHANNEL_METADATA_KEYS.state,
  });

  if (previousState === String(state)) {
    return;
  }

  await updateGroupChannelMetaDataOfKey({
    channelUrl,
    key: CHANNEL_METADATA_KEYS.state,
    value: String(state),
  });

  handleChannelStateTransition(userId, channelUrl, String(state));
}
