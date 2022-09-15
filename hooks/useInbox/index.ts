import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import SendBird from 'sendbird';

import { getInboxItemChannel, sortInboxItems } from './utils';

const INBOX_QUERY_KEY = 'inbox';

function useConnectionStatus() {
  const [connectionStatus, setConnectionStatus] = useState(SendBird.getInstance().getConnectionState());

  useEffect(() => {
    const sb = SendBird.getInstance();
    const connectionHandler = new sb.ConnectionHandler();
    const updateConnectionStatus = () => {
      setConnectionStatus(sb.getConnectionState());
    };

    connectionHandler.onReconnectFailed = updateConnectionStatus;
    connectionHandler.onReconnectStarted = updateConnectionStatus;
    connectionHandler.onReconnectSucceeded = updateConnectionStatus;

    const connectionHandlerId = 'inboxConnectionHandler';
    sb.addConnectionHandler(connectionHandlerId, connectionHandler);

    return () => {
      sb.removeConnectionHandler(connectionHandlerId);
    };
  }, []);

  return useMemo(() => {
    return { isConnected: connectionStatus === 'OPEN', connectionStatus };
  }, [connectionStatus]);
}

function createChannelListQuery() {
  const listQuery = SendBird.getInstance().GroupChannel.createMyGroupChannelListQuery();
  listQuery.includeEmpty = true;
  listQuery.memberStateFilter = 'joined_only';
  listQuery.order = 'latest_last_message';
  listQuery.limit = 100;
  return listQuery;
}

const replaceInboxItemChannel = (item: InboxItem, channel: SendBird.GroupChannel): InboxItem => {
  return { ...item, channel };
};

export default function useInbox({
  shouldIncludeRecentMessages,
  enabled = true,
}: {
  shouldIncludeRecentMessages?: (channel: SendBird.GroupChannel) => boolean;
  enabled?: boolean;
}) {
  const { isConnected } = useConnectionStatus();
  const {
    data = [],
    isLoading,
    refetch,
    error,
  } = useQuery(
    INBOX_QUERY_KEY,
    function getInboxItems() {
      const promise = new Promise<InboxItem[]>((resolve, reject) => {
        const listQuery = createChannelListQuery();
        listQuery.next(async (channels, error) => {
          if (error) {
            reject(error);
            return;
          }

          const recentMessages =
            shouldIncludeRecentMessages &&
            (await Promise.all(
              channels.filter(shouldIncludeRecentMessages).map(
                (channel) =>
                  new Promise<[string, (SendBird.UserMessage | SendBird.FileMessage | SendBird.AdminMessage)[]]>(
                    (resolve) => {
                      const listQuery = channel.createPreviousMessageListQuery();
                      listQuery.limit = 3;
                      listQuery.messageTypeFilter = 'MESG';
                      listQuery.reverse = true;
                      listQuery.load((messages, originalError) => {
                        if (originalError) {
                          const error = new Error(
                            'Fetching recent messages failed.',
                            // @ts-ignore
                            { cause: originalError },
                          );
                          reject(error);
                          return;
                        }
                        resolve([channel.url, messages]);
                      });
                    },
                  ),
              ),
            ).then((recentMessages) => Object.fromEntries(recentMessages)));

          const inboxItems = channels.map((channel) => ({
            inboxItemType: 'channel' as const,
            channel,
            recentMessages: recentMessages?.[channel.url],
          }));

          resolve(sortInboxItems(inboxItems));
        });
      });
      return promise;
    },
    { enabled: isConnected && enabled },
  );

  const queryClient = useQueryClient();
  useEffect(() => {
    const sb = SendBird.getInstance();
    const channelHandler = new sb.ChannelHandler();

    function removeChannel(deletedChannelUrl: string) {
      queryClient.setQueryData<InboxItem[]>(INBOX_QUERY_KEY, (data) => {
        if (!data) {
          return [];
        }
        return data.filter((item) => {
          const channel = getInboxItemChannel(item);
          return channel.url !== deletedChannelUrl;
        });
      });
    }

    channelHandler.onUserJoined = (channel, user) => {
      if (user.userId === sb.currentUser.userId && enabled) {
        refetch();
      }
    };

    channelHandler.onUserLeft = (channel, user) => {
      if (user.userId === sb.currentUser.userId) {
        removeChannel(channel.url);
      }
    };

    channelHandler.onChannelChanged = (changedChannel) => {
      if (!changedChannel.isGroupChannel()) {
        return;
      }
      queryClient.setQueryData<InboxItem[]>(INBOX_QUERY_KEY, (data) => {
        if (!data) {
          return [];
        }
        return sortInboxItems(
          data.map((item) => {
            const channel = getInboxItemChannel(item);
            return channel.url === changedChannel.url ? replaceInboxItemChannel(item, changedChannel) : item;
          }),
        );
      });
    };

    channelHandler.onChannelDeleted = (deletedChannelUrl) => {
      removeChannel(deletedChannelUrl);
    };

    sb.addChannelHandler('inboxChannelHandler', channelHandler);

    return () => {
      sb.removeChannelHandler('inboxChannelHandler');
    };
  }, [enabled, queryClient, refetch]);

  return useMemo(
    () => ({ data, isLoading: !isConnected || isLoading, refetch, error }),
    [data, isConnected, isLoading, refetch, error],
  );
}
