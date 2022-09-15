import { ComponentProps, useContext } from 'react';

import { languageNames, USER_METADATA_KEYS } from '../constants';
import { AuthContext } from '../contexts';
import IconButton from './IconButton';

export default function LanguageButton(props: ComponentProps<typeof IconButton>) {
  const { currentUser } = useContext(AuthContext);
  const language = currentUser?.metaData[USER_METADATA_KEYS.language] || 'en';
  const label = languageNames[language] || languageNames.en;

  return (
    <IconButton
      source={require('../assets/ic-language.png')}
      size={15}
      label={label}
      tintColor="@navigationTintColor"
      {...props}
    />
  );
}
