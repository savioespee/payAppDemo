import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Image as RNImage, StyleSheet, View } from 'react-native';
import { UserMessage } from 'sendbird';

import { BUBBLE_PADDING, localImageMap } from '../../constants';
import useHandleMessageAction from '../../hooks/useHandleMessageAction';
import useRenderMessageContent from '../ChatMessage/useRenderMessageContent';
import Image from '../Image';
import Bubble from './Bubble';
import MessageActions from './MessageActions';
import useBubbleMaxWidth from './useBubbleMaxWidth';

export default function ActionsBubble({
  cover,
  width: widthProp,
  header,
  message: messageObject,
  actions = [],
  textColor,
  style,
}: {
  cover?: string;
  width: number;
  header: ReactNode;
  message: UserMessage;
  actions?: MessageAction[];
  textColor: string;
  style?: any;
}) {
  const renderMessageContent = useRenderMessageContent({ messageTextColor: textColor });

  const [currentHandlingAction, setCurrentHandlingAction] = useState<MessageAction | null>(null);
  const currentHandlingActionRef = useRef(currentHandlingAction);
  useEffect(() => {
    currentHandlingActionRef.current = currentHandlingAction;
  });

  const handleMessageAction = useHandleMessageAction();

  const handleActionPress = async (action: MessageAction) => {
    if (currentHandlingActionRef.current) {
      return;
    }
    setCurrentHandlingAction(action);
    await handleMessageAction(action, messageObject);
    setCurrentHandlingAction(null);
  };

  const width = Math.min(useBubbleMaxWidth(), widthProp);
  const coverImage = useMemo(() => {
    if (!cover) {
      return null;
    }

    const imageSource = localImageMap[cover];
    const imageInfo = RNImage.resolveAssetSource(imageSource);

    return (
      <Image
        source={imageSource}
        resizeMode="cover"
        style={{
          width,
          height: (width * imageInfo.height) / imageInfo.width,
        }}
      />
    );
  }, [cover, width]);

  return (
    <Bubble style={[componentStyles.container, { width }, !!cover && { padding: 0 }, style]}>
      {coverImage}
      <View style={{ padding: cover ? BUBBLE_PADDING : 0 }}>
        {header}
        <View style={[componentStyles.message, !header && { paddingTop: 0 }]}>
          {renderMessageContent(messageObject)}
        </View>
        <MessageActions
          actions={actions}
          onActionPress={handleActionPress}
          ongoingAction={currentHandlingAction || undefined}
          style={undefined}
        />
      </View>
    </Bubble>
  );
}

const componentStyles = StyleSheet.create({
  container: { padding: BUBBLE_PADDING },
  message: { paddingTop: 10, paddingBottom: BUBBLE_PADDING },
});
