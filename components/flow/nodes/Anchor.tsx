import { NodeProps } from 'lib/types/workflow';

import cx from './index.less';

interface SvgCircleProps {
  direction: string;
  node?: NodeProps;
}

const SvgCircle: React.FC<SvgCircleProps> = ({ direction, node }) => {
  return (
    // <div className="node_end-point end-point jtk-endpoint task_end-point">
    <div className={'jtk-endpoint ' + cx('node-point-wrapper', direction.toLocaleLowerCase())}>
      <svg
        width="16"
        height="16"
        pointerEvents="all"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        className={cx('node-point')}
        // data-jtk-endpoint="true"
        data-jtk-source="true"
        data-jtk-target="true"
        data-jtk-source-port-type={direction}
        data-jtk-target-port-type={direction}
        // data-jtk-source-port-id={`${node.id}_source_${direction}`}
        // data-jtk-target-port-id={`${node.id}_target_${direction}`}
        // data-jtk-source-port-id={`${direction}`}
        // data-jtk-target-port-id={`${direction}`}
        // data-jtk-anchor-x="0.75"
        // data-jtk-anchor-y="0.75"
        // data-jtk-anchor-orientation-x="1"
        // data-jtk-anchor-orientation-y="1"

        // data-jtk-source-port={`${direction}`}
        // data-jtk-target-port={`${direction}`}
        // data-dir={direction}
      >
        {/* <circle
          cx="4"
          cy="4"
          r="4"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          // fill="#456"
          stroke="none"
          data-jtk-source="true"
        /> */}
      </svg>
    </div>
  );
};

export default SvgCircle;
