import { memo } from 'react';
import dynamic from 'next/dynamic';

const JsplumbPage = dynamic(() => import('./JsplumbPage'), { ssr: false });
// import JsplumbPage from './jsplumbPage';

const app: React.FC = () => {
  return <JsplumbPage />;
};

export default memo(app);
