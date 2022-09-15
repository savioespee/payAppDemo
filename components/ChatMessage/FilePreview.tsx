import SendBird from 'sendbird';

import AudioBubble from '../bubbles/AudioBubble';
import Bubble from '../bubbles/Bubble';
import Image from '../Image';
import ScalePressable from '../ScalePressable';

function getImagePreviewSize(message: SendBird.FileMessage) {
  const thumbnail = message.thumbnails[message.thumbnails.length - 1];
  if (thumbnail) {
    const { real_width, real_height } = thumbnail;

    return real_width > real_height
      ? { width: 160, height: (160 * real_height) / real_width }
      : { height: 160, width: (160 * real_width) / real_height };
  }
  return { width: 160, height: 160 };
}

export default function FilePreview({
  message: fileMessage,
  showImagePreview,
}: {
  message: SendBird.FileMessage;
  showImagePreview: (url: string) => void;
}) {
  if (fileMessage.type?.includes('image')) {
    const thumbnail = fileMessage.thumbnails[fileMessage.thumbnails.length - 1];
    const onPress = () => showImagePreview(fileMessage.url);

    if (thumbnail) {
      const { url } = thumbnail;

      return (
        <ScalePressable onPress={onPress}>
          <Bubble style={{ borderWidth: 1, borderColor: '#ECECEC' }}>
            <Image source={{ uri: url }} style={getImagePreviewSize(fileMessage)} resizeMode="cover" />
          </Bubble>
        </ScalePressable>
      );
    }

    return (
      <ScalePressable onPress={onPress}>
        <Bubble>
          <Image source={{ uri: fileMessage.url }} style={{ height: 160, aspectRatio: 1.5 }} />
        </Bubble>
      </ScalePressable>
    );
  }

  if (fileMessage.type?.includes('audio')) {
    return <AudioBubble message={fileMessage} style={undefined} />;
  }
  return null;
}
