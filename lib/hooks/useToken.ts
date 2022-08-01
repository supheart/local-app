import { useContext } from 'react';
import { TokenContext, TokenContextType } from 'lib/contexts/token';

export const useToken = (): TokenContextType => useContext(TokenContext);

export default useToken;
