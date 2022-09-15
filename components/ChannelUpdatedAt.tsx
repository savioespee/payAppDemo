import { isSameDay } from 'date-fns';
import { useLayoutEffect, useState } from 'react';
import { TextProps } from 'react-native';

import { formatChannelUpdatedAt, getChannelUpdatedAt } from '../utils/common';
import Text from './Text';

export default function ChannelUpdatedAt({ channel, ...props }: { channel: SendBird.GroupChannel } & TextProps) {
  const updatedAt = getChannelUpdatedAt(channel);
  const [text, setText] = useState('');

  useLayoutEffect(() => {
    setText(formatChannelUpdatedAt(updatedAt));
    if (!isSameDay(updatedAt, Date.now())) {
      return;
    }

    const id = setInterval(() => {
      if (isSameDay(updatedAt, Date.now())) {
        setText(formatChannelUpdatedAt(updatedAt));
        return;
      }
      clearInterval(id);
    }, 10000);

    return () => {
      clearInterval(id);
    };
  }, [updatedAt]);

  return <Text {...props}>{text}</Text>;
}
