import { isSameDay } from 'date-fns';
import { ComponentProps, useLayoutEffect, useState } from 'react';

import { formatChannelUpdatedAt } from '../utils/common';
import Text from './Text';

export default function AutoUpdatingTimestamp({
  timestamp,
  style,
  ...props
}: {
  timestamp: number;
} & ComponentProps<typeof Text>) {
  const [text, setText] = useState('');

  useLayoutEffect(() => {
    setText(formatChannelUpdatedAt(timestamp));
    if (!isSameDay(timestamp, Date.now())) {
      return;
    }

    const id = setInterval(() => {
      if (isSameDay(timestamp, Date.now())) {
        setText(formatChannelUpdatedAt(timestamp));
        return;
      }
      clearInterval(id);
    }, 10000);

    return () => {
      clearInterval(id);
    };
  }, [timestamp]);

  return (
    <Text style={style} {...props}>
      {text}
    </Text>
  );
}
