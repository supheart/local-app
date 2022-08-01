import React, { createContext } from 'react';

export type TokenContextType = {
  sessionToken: string;
  tenant: string;
}

export const TokenContext = createContext<TokenContextType>({ sessionToken: '', tenant: '' });

export const TokenProvider: React.FC<React.PropsWithChildren<TokenContextType>> = ({ sessionToken, tenant, children }) => {
  return <TokenContext.Provider value={{ sessionToken, tenant }}>{children}</TokenContext.Provider>;
}
