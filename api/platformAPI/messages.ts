import type Emoji from './emoji.json';
import { chatAxios } from './shared';

type MessageType = 'MESG' | 'FILE' | 'ADMM';
type Message = {
  message_id: number;
  type: MessageType;
  created_at: number;
};

export async function sendMessage(
  channelUrl: string,
  params: {
    message_type: MessageType;
    user_id?: string | null;
    message?: string;
    custom_type?: string;
    data?: string;
    url?: string;
    thumbnails?: any[];
    file_name?: string;
    file_type?: string;
    created_at?: number;
    translations?: string[];
    is_silent?: boolean;
  },
) {
  const { data } = await chatAxios.post<Message>(`/v3/group_channels/${channelUrl}/messages`, params);
  return data;
}

export async function sendBotMessage({
  channelUrl,
  botUserId,
  message,
  customType,
  data: messageData,
  markAsRead,
  createdAt,
}: {
  channelUrl: string;
  botUserId: string;
  message: string;
  customType?: string;
  data?: string;
  markAsRead?: boolean;
  createdAt?: number;
}) {
  const { data } = await chatAxios.post(`/v3/bots/${botUserId}/send`, {
    channel_url: channelUrl,
    message,
    custom_type: customType,
    data: messageData,
    mark_as_read: markAsRead,
    created_at: createdAt,
  });
  return data;
}

export async function editMessage(
  channelUrl: string,
  messageId: number,
  params: {
    message_type: MessageType;
    message?: string;
    data?: string;
    created_at?: number;
    custom_type?: string;
  },
) {
  const { data } = await chatAxios.put<Message>(`/v3/group_channels/${channelUrl}/messages/${messageId}`, params);
  return data;
}

export async function deleteMessage(channelUrl: string, messageId: number) {
  return chatAxios.delete(`/v3/group_channels/${channelUrl}/messages/${messageId}`);
}

export async function getMessage(channelUrl: string, messageId: number) {
  const { data } = await chatAxios.get(`/v3/group_channels/${channelUrl}/messages/${messageId}`);
  return data;
}

export async function fetchMessages({
  channelUrl,
  customTypes,
  messageType,
  prevLimit,
  nextLimit,
  messageId,
  senderId,
  include,
}: {
  channelUrl: string;
  customTypes?: string;
  messageType?: MessageType;
  prevLimit?: number;
  nextLimit?: number;
  messageId?: number;
  senderId?: string;
  include?: boolean;
}) {
  const { data } = await chatAxios.get(`/v3/group_channels/${channelUrl}/messages`, {
    params: {
      custom_types: customTypes,
      message_ts: messageId ? undefined : Date.now(),
      message_id: messageId,
      include,
      message_type: messageType,
      sender_id: senderId,
      prev_limit: prevLimit,
      next_limit: nextLimit,
    },
  });
  return data.messages;
}

export async function markAsRead(userId: string, channelUrl: string, timestamp?: number) {
  await chatAxios.put(`/v3/group_channels/${channelUrl}/messages/mark_as_read`, { user_id: userId, timestamp });
}

export function addReaction({
  channelUrl,
  messageId,
  userId,
  reaction,
}: {
  channelUrl: string;
  messageId: number | string;
  userId: string;
  reaction: keyof typeof Emoji;
}) {
  return chatAxios.post(`/v3/group_channels/${channelUrl}/messages/${messageId}/reactions`, {
    user_id: userId,
    reaction,
  });
}

export async function translateMessage({
  channelUrl,
  messageId,
  targetLanguages,
}: {
  channelUrl: string;
  messageId: number;
  targetLanguages: string[];
}) {
  const { data: message } = await chatAxios.post(`/v3/group_channels/${channelUrl}/messages/${messageId}/translation`, {
    target_langs: targetLanguages,
  });
  return message;
}
