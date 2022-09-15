import { useCallback, useMemo, useState } from 'react';

export default function useCallScreen() {
  const [callScreenData, setCallScreenData] = useState(null);

  const isCallVisible = !!callScreenData;
  const [callEventListenerMap] = useState(new Map());

  const addCallEventListener = useCallback(
    (id, listener) => {
      callEventListenerMap.set(id, listener);
    },
    [callEventListenerMap],
  );

  const removeCallEventListener = useCallback(
    (id) => {
      callEventListenerMap.delete(id);
    },
    [callEventListenerMap],
  );

  const callContext = useMemo(
    () => ({
      toggleCallScreen: setCallScreenData,
      isCallVisible,
      addCallEventListener,
      removeCallEventListener,
    }),
    [addCallEventListener, isCallVisible, removeCallEventListener],
  );

  const stopCall = useCallback(
    (duration) => {
      callEventListenerMap.forEach((listener) => {
        listener.onCallEnded?.(duration);
      });
      setCallScreenData(null);
    },
    [callEventListenerMap],
  );

  return { callScreenData, callContext, stopCall };
}
