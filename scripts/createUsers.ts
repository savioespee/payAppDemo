import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

import { updateUserMetadata } from '../api/platformAPI';
import { chatAxios } from '../api/platformAPI/shared';
import { botUsers } from '../constants/botUsers';

async function createUser(info: BotUserInfo) {
  const { userId, nickname, avatarPath, userType, brandAvatarType } = info;
  const formData = new FormData();
  if (avatarPath) {
    formData.append('profile_file', fs.createReadStream(path.join(__dirname, '..', avatarPath)));
  } else {
    formData.append('profile_url', '');
  }
  formData.append('user_id', userId);
  formData.append('nickname', nickname);

  try {
    await chatAxios.post('/v3/users', formData);
    if (userType) {
      await updateUserMetadata({ userId, metadata: { userType } });
    }
    if (brandAvatarType) {
      await updateUserMetadata({ userId, metadata: { brandAvatarType } });
    }
    console.log(`Created user ${userId}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if ((error.response?.data as any)?.code === 400202) {
        throw `User ${userId} already exists`;
      } else {
        throw error;
      }
    } else {
      throw error;
    }
  }
}

async function updateUser(userId: string, formData: FormData) {
  try {
    await chatAxios.put(`/v3/users/${userId}`, formData);
    console.log(`Updated user ${userId}`);
  } catch (error) {
    throw error;
  }
}

async function createUsers() {
  for (const botUser of Object.keys(botUsers)) {
    const userInfo = botUsers[botUser] as BotUserInfo;
    const { userId, nickname, avatarPath, userType, updateUserInfo, brandAvatarType } = userInfo;
    const formData = new FormData();
    if (avatarPath) {
      formData.append('profile_file', fs.createReadStream(path.join(__dirname, '..', avatarPath)));
    } else {
      formData.append('profile_url', '');
    }
    formData.append('user_id', userId);
    formData.append('nickname', nickname);

    await createUser(userInfo).catch((error) => {
      if (typeof error === 'string' && error.endsWith('already exists')) {
        if (updateUserInfo) {
          const formData = new FormData();
          if (avatarPath) {
            formData.append('profile_file', fs.createReadStream(path.join(__dirname, '..', avatarPath)));
          } else {
            formData.append('profile_url', '');
          }
          formData.append('nickname', nickname);
          return updateUser(userId, formData).then(() =>
            updateUserMetadata({ userId, metadata: { userType, brandAvatarType: brandAvatarType || '' } }),
          );
        } else {
          console.log(error);
        }
      } else {
        throw error;
      }
    });
  }
}

createUsers();
