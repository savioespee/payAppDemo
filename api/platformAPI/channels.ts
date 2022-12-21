import axios from 'axios';

import { chatAxios } from './shared';

export type Channel = {
  channel_url: string;
  custom_type: string;
  created_at: number;
  members: { user_id: string }[];
  last_message?: {
    message_id: number;
    created_at: number;
    custom_type: string;
  };
  data: string;
};

export async function fetchGroupChannels(
  userId: string,
  params?: { members_exactly_in?: string; custom_types?: string },
): Promise<Channel[]> {
  const { data } = await chatAxios.get(`/v3/users/${userId}/my_group_channels`, {
    params: { ...params, limit: 100, show_empty: true },
  });
  return data.channels;
}

export async function getGroupChannel(channelUrl: string): Promise<Channel> {
  const { data } = await chatAxios.get(`/v3/group_channels/${channelUrl}`, {
    params: { show_member: true },
  });
  return data;
}

export async function updateGroupChannel(
  channelUrl: string,
  params: { custom_type?: string; data?: string },
): Promise<Channel> {
  const { data } = await chatAxios.put(`/v3/group_channels/${channelUrl}`, params);
  return data;
}

export async function createGroupChannel(params: {
  channel_url?: string;
  cover_url: string;
  custom_type?: string;
  inviter_id?: string;
  is_distinct: boolean;
  name?: string;
  user_ids: string[];
  data?: string;
}): Promise<Channel> {
  const { data } = await chatAxios.post('/v3/group_channels', params);
  return data;
}

export async function freezeGroupChannel(channelUrl: string): Promise<Channel> {
  const { data } = await chatAxios.put(`/v3/group_channels/${channelUrl}/freeze`, { freeze: true });
  return data;
}

export async function getGroupChannelMetaDataOfKey({ channelUrl, key }: { channelUrl: string; key: string }) {
  try {
    const { data } = await chatAxios.get(`/v3/group_channels/${channelUrl}/metadata/${encodeURIComponent(key)}`);
    return data[key] as string;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if ((error.response?.data as any)?.code === 400201) {
        return null;
      }
    }
    throw error;
  }
}

export async function updateGroupChannelMetaDataOfKey({
  channelUrl,
  key,
  value,
}: {
  channelUrl: string;
  key: string;
  value: string;
}) {
  await chatAxios.put(`/v3/group_channels/${channelUrl}/metadata/${encodeURIComponent(key)}`, { value, upsert: true });
}

export async function getGroupChannelMetaData(channelUrl: string) {
  const { data } = await chatAxios.get(`/v3/group_channels/${channelUrl}/metadata`);
  return data;
}

export async function updateGroupChannelMetaData({
  channelUrl,
  metaData,
}: {
  channelUrl: string;
  metaData: Record<string, string>;
}) {
  const { data } = await chatAxios.put(`/v3/group_channels/${channelUrl}/metadata`, {
    metadata: metaData,
    upsert: true,
  });
  return data;
}

export async function inviteUser(channelUrl: string, userId: string): Promise<Channel> {
  const { data: channel } = await chatAxios.post(`/v3/group_channels/${channelUrl}/invite`, { user_ids: [userId] });
  return channel;
}

export async function leaveChannel(channelUrl: string, userId: string) {
  await chatAxios.put(`/v3/group_channels/${channelUrl}/leave`, {
    user_ids: [userId],
  });
}

export async function deleteChannel(url: string) {
  await chatAxios.delete(`/v3/group_channels/${url}`);
}

export async function deleteAllGroupChannels(userId: string) {
  const channels = await fetchGroupChannels(userId);
  await Promise.all(
    channels.map((channel: { channel_url: string }) => {
      return deleteChannel(channel.channel_url);
    }),
  );
}

export async function startTypingIndicator(channelUrl: string, userIds: string[]) {
  await chatAxios.post(`/v3/group_channels/${channelUrl}/typing`, { user_ids: userIds });
}

export async function stopTypingIndicator(channelUrl: string, userIds: string[]) {
  await chatAxios.delete(`/v3/group_channels/${channelUrl}/typing`, { data: { user_ids: userIds } });
}

export async function create1On1Channel(
  userId: string,
  otherUserId: string,
  options: { name?: string; customType?: string; validateFirst?: boolean } = {},
) {
  const { customType = '', name, validateFirst = false } = options;

  let channel: any | null = null;

  if (validateFirst) {
    channel = await fetchGroupChannels(userId, {
      members_exactly_in: `${userId},${otherUserId}`,
    });
  }

  if (channel == null) {
    channel = await createGroupChannel({
      user_ids: [userId, otherUserId],
      channel_url: `${otherUserId}_${userId}`.replace(/[^a-zA-Z0-9-_]/g, ''),
      custom_type: customType,
      cover_url: '',
      is_distinct: true,
      inviter_id: otherUserId,
      name,
    });
  }

  return channel;
}
