import { memo } from 'react';

import cx from '../jsplumbPage.less';

type NodeProps = {
  ctx: any;
};

const TaskNode: React.FC<NodeProps> = props => {
  const { data } = props.ctx;
  // const [selected, setSelected] = useState(false);
  // const select = useCallback(() => {}, [data.id]);

  console.info('task node', props);
  return (
    data.id && (
      <div
        style={{ width: data.w + 'px', height: data.h + 'px' }}
        className="flowchart-object flowchart-question"
        data-jtk-target="true"
        data-jtk-port-type="target"
      >
        {/* <div
          id={data.id}
          onClick={select}
          className={cx('flow-node', 'node-task', { selected, 'node-selected': selected })}
          style={{ left: data.x, top: data.y, width: `${data.w}px`, height: `${data.h}px` }}
          // ref={nodeRef}
        > */}
        <div className={cx('node-content')}>
          <span>{data.text}</span>
        </div>
        {/* </div> */}
      </div>
    )
  );
};

// class TaskComponent extends BaseNodeComponent<NodeProps, any> {
//   constructor(props: NodeProps) {
//     super(props);
//   }

//   render() {
//     const obj = this.node.data;
//     return (
//       <div
//         style={{ width: obj.w + 'px', height: obj.h + 'px' }}
//         className="flowchart-object flowchart-output"
//         data-jtk-target="true"
//         data-jtk-port-type="target"
//       >
//         <svg width={obj.w} height={obj.h}>
//           <rect x={0} y={0} width={obj.w} height={obj.h} rx={5} ry={5} />
//         </svg>
//         <span>{obj.text}</span>
//       </div>
//     );
//   }
// }

export default memo(TaskNode);
