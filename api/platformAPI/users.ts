import axios from 'axios';

import { chatAxios } from './shared';

export async function createUser({
  userId,
  nickname,
  profileUrl = '',
  metadata,
}: {
  userId: string;
  nickname: string;
  profileUrl?: string;
  metadata?: any;
}) {
  const { data } = await chatAxios.post('/v3/users', {
    user_id: userId,
    nickname,
    profile_url: profileUrl,
    metadata,
  });
  return data;
}

export async function getUser(userId: string) {
  try {
    const { data } = await chatAxios.get(`/v3/users/${encodeURIComponent(userId)}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && (error.response?.data as any)?.code === 400201) {
      return null;
    }
    throw error;
  }
}

export async function getUserMetadata(userId: string, metadataKey: string) {
  try {
    const { data } = await chatAxios.get(`/v3/users/${userId}/metadata/${metadataKey}`);
    return data[metadataKey] as string;
  } catch (error) {
    if (axios.isAxiosError(error) && (error.response?.data as any)?.code === 400201) {
      return null;
    }
    throw error;
  }
}

export async function updateUserMetadata({ userId, metadata }: { userId: string; metadata: Record<string, string> }) {
  const { data } = await chatAxios.put(`/v3/users/${userId}/metadata`, {
    metadata,
    upsert: true,
  });
  return data;
}

export async function deleteUserAllMetadata(userId: string) {
  await chatAxios.delete(`/v3/users/${userId}/metadata`);
  return;
}
