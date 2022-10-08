import { memo } from 'react';

import cx from '../jsplumbPage.less';

type NodeProps = {
  ctx: any;
};

const StartNode: React.FC<NodeProps> = props => {
  const { data } = props.ctx;
  // const [selected, setSelected] = useState(false);
  // const select = useCallback(() => {}, [data.id]);

  console.info('start node', props);
  return (
    data.id && (
      <div
        style={{ width: data.w + 'px', height: data.h + 'px' }}
        className="flowchart-object flowchart-question"
        data-jtk-target="true"
        data-jtk-port-type="target"
      >
        <div
          className={cx('node-content')}
          // style={{ backgroundColor: bgColor, borderColor: selected ? '#fff' : bgColor }}
        />
      </div>
    )
  );
};

export default memo(StartNode);
