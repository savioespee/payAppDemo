import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import ReactNativeModal from 'react-native-modal';

import PinPad from './PinPad';

export default function KeypadModal({
  isVisible,
  onCancel,
  onSubmit,
}: {
  isVisible: boolean;
  onCancel: () => void;
  onSubmit: (code: string) => void;
}) {
  const statusBarHeight = getStatusBarHeight();
  return (
    <ReactNativeModal
      isVisible={isVisible}
      style={{
        justifyContent: 'flex-end',
        margin: 0,
        marginTop: statusBarHeight + 24,
        borderRadius: 8,
        overflow: 'hidden',
      }}
      backdropOpacity={0}
    >
      <PinPad onClose={onCancel} onPasswordConfirm={onSubmit} />
    </ReactNativeModal>
  );
}
