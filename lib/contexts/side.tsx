import { createContext } from 'react';

export type SideContextType = {
  hidden: boolean;
}

export const SideContext = createContext<SideContextType>({ hidden: false });
