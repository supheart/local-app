import { createContext } from 'react';

export type HeaderContextType = {
  hidden: boolean;
}

export const HeaderContext = createContext<HeaderContextType>({ hidden: false });
