import axios from 'axios';
import axiosRetry, { IAxiosRetryConfig } from 'axios-retry';

import { API_TOKEN, APP_ID } from '../../constants/common';

const axiosRetryOptions: IAxiosRetryConfig = {
  retries: 10,
  retryCondition: (error) => {
    return error?.response?.status === 429;
  },
  retryDelay: (retryCount, error) => {
    const retryAfter = Number(error?.response?.headers['x-ratelimit-retryafter']);

    if (Number.isFinite(retryAfter) && retryAfter > 0) {
      return retryAfter * 1000 * Math.pow(2, retryCount);
    } else {
      return 1000;
    }
  },
};

const baseURL = `https://api-${APP_ID}.sendbird.com`;

export const chatAxios = axios.create({
  baseURL,
  headers: { 'Api-Token': API_TOKEN },
});
axiosRetry(chatAxios, axiosRetryOptions);
