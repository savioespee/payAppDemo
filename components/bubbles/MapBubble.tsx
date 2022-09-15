import BlackBubbleHeader from '../BlackBubbleHeader';
import Image from '../Image';
import Bubble from './Bubble';

export default function MapBubble({ title }: { title: string }) {
  return (
    <Bubble style={{ width: 252, position: 'relative' }}>
      <BlackBubbleHeader title={title} iconSource={require('../../assets/ic-clock.png')} />
      <Image
        // source={require('../../assets/map-background.jpg')}
        source={require('../../assets/driverMap.png')}
        style={{ width: 252, height: 159 }}
        resizeMode="cover"
      />
      <Image
        source={require('../../assets/map-pin-overlay.png')}
        style={{
          width: 252,
          height: 159,
          position: 'absolute',
          bottom: 0,
          left: 0,
          tintColor: '@accent',
        }}
        resizeMode="cover"
      />
    </Bubble>
  );
}
