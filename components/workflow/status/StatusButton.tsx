import { useMemo } from 'react';
import { useDrag } from 'react-dnd';
import { Col } from 'antd';

import { ElementType } from '../config';

import cx from '../index.less';

interface StatusButtonProps {
  id: string;
  name: string;
  type: string;
  color?: string;
  bgColor?: string;
  draggedStatus: string[];
}

const StatusButton: React.FC<StatusButtonProps> = ({ id, name, type, draggedStatus, color }) => {
  const disabled = useMemo(() => draggedStatus.includes(id), [id, draggedStatus]);
  const [, dragger] = useDrag({
    canDrag: !disabled,
    type: ElementType.status,
    item: { id, name, key: type },
  });

  return (
    <Col span={12}>
      <div>
        <span className={cx('status-button', { disabled })} title={name} ref={dragger}>
          {!disabled && <div className={cx('status-icon')} style={{ backgroundColor: color }} />}
          {name}
        </span>
      </div>
    </Col>
  );
};

export default StatusButton;
