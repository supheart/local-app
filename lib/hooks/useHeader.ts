import { useContext } from 'react';
import { HeaderContext, HeaderContextType } from '../contexts/header';

const useHeader = (): HeaderContextType => useContext<HeaderContextType>(HeaderContext);

export default useHeader;
