import { useContext } from 'react';

import { USER_METADATA_KEYS } from '../constants';
import { AuthContext } from '../contexts';

export default function useCurrentUserLanguage() {
  const { currentUser } = useContext(AuthContext);
  const language = currentUser?.metaData[USER_METADATA_KEYS.language];
  return language || 'en';
}
