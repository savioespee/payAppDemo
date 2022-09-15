import { useEffect, useState } from 'react';

import { sendbird } from '../utils/sendbird';

export default function useUnreadCount(userEventHandlerId: string) {
  const [unreadCount, setUnreadCount] = useState<Number>(0);
  useEffect(() => {
    const params = new sendbird.GroupChannelTotalUnreadMessageCountParams();
    sendbird.getTotalUnreadMessageCount(params).then(setUnreadCount);

    const userEventHandler = new sendbird.UserEventHandler();
    userEventHandler.onTotalUnreadMessageCountUpdated = (count) => {
      setUnreadCount(count);
    };
    sendbird.addUserEventHandler(userEventHandlerId, userEventHandler);

    return () => {
      sendbird.removeUserEventHandler(userEventHandlerId);
    };
  }, [userEventHandlerId]);

  return unreadCount;
}
