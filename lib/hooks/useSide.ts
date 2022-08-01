import { useContext } from 'react';
import { SideContext, SideContextType } from '../contexts/side';

const useSide = (): SideContextType => useContext<SideContextType>(SideContext);

export default useSide;
