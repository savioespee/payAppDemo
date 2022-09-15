import { createContext } from 'react';

export const AuthContext = createContext<{
  currentUser: SendBird.User | null;
  updateCurrentUserState: () => void;
  initializeCurrentUser: () => void;
  isInitializingUser: boolean;
}>({} as any);
export const CallContext = createContext<any>(undefined);
export const ShareModalContext = createContext<any>(undefined);
