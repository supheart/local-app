import { useMemo } from 'react';
import { Col } from 'antd';

import { WorkFlowStatusColor } from 'lib/global/workflow';
import { StatusType } from 'lib/types/workflow';

import cx from './index.less';

interface StatusButtonProps {
  id: string;
  name: string;
  type: StatusType['type']; // 状态节点的类型，未开始/进行中/已结束，对应不同状态节点的背景颜色
  draggedStatus: string[];
}

const StatusButton: React.FC<StatusButtonProps> = ({ id, name, type, draggedStatus }) => {
  const disabled = useMemo(() => draggedStatus.includes(id), [id, draggedStatus]);

  return (
    <Col span={12}>
      <div node-type={type} node-id={id} title={name}>
        <span className={cx('status-button', { disabled })} title={name}>
          {!disabled && (
            <div className={cx('status-icon')} style={{ backgroundColor: WorkFlowStatusColor[type].color }} />
          )}
          {name}
        </span>
      </div>
    </Col>
  );
};

export default StatusButton;
