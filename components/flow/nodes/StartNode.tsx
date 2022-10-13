import { useCallback, useEffect, useRef } from 'react';

import { NodeProps } from 'lib/types/workflow';

import { CommonConfig } from '../config';

import cx from './index.less';

interface TaskNodeProps extends NodeProps {
  setSelected?: (id: string, selected: boolean) => void;
  updateNodePosition: (id: string, position: number[]) => void;
  jsPlumb: any;
  isView?: boolean;
}

const TaskNode: React.FC<TaskNodeProps> = ({
  id,
  x = 0,
  y = 0,
  bgColor,
  jsPlumb,
  selected,
  updateNodePosition,
  setSelected = () => {},
  isView,
}) => {
  const nodeRef = useRef(null);

  useEffect(() => {
    if (jsPlumb) {
      if (!isView) {
        jsPlumb.draggable(id, {
          containment: 'parent',
          grid: [5, 5],
          stop: ({ finalPos }: { finalPos: number[] }) => {
            updateNodePosition(id, finalPos);
          },
        });
      }
      jsPlumb.addEndpoint(id, { anchor: 'Bottom', uuid: id + '-bottom' }, CommonConfig);
    }
  }, [id, jsPlumb, isView, updateNodePosition]);

  useEffect(() => {
    if (nodeRef.current && !isView) {
      const addHoverClass = () => {
        if (jsPlumb) {
          jsPlumb.selectEndpoints({ element: id }).addClass('endpoint-hover');
        }
      };
      const removeHoverClass = () => {
        if (jsPlumb) {
          jsPlumb.selectEndpoints({ element: id }).removeClass('endpoint-hover');
        }
      };
      const nodeDom = nodeRef.current;
      nodeDom.addEventListener('mouseover', addHoverClass);
      nodeDom.addEventListener('mouseout', removeHoverClass);
      return () => {
        if (nodeDom) {
          nodeDom.removeEventListener('mouseover', addHoverClass);
          nodeDom.removeEventListener('mouseout', removeHoverClass);
        }
      };
    }
  }, [isView, nodeRef, id, jsPlumb]);

  const select = useCallback(() => {
    jsPlumb.select().removeClass('select-connection').setHover(false);
    jsPlumb.select({ source: id }).setHover(true);
    jsPlumb.select({ target: id }).setHover(true);
    setSelected(id, true);
  }, [id, jsPlumb, setSelected]);

  return (
    <div
      id={id}
      onClick={select}
      className={cx('flow-node', 'node-element', 'node-start', { selected, 'node-selected': selected })}
      style={{ left: x, top: y }}
      ref={nodeRef}
    >
      <div
        className={cx('node-content')}
        style={{ backgroundColor: bgColor, borderColor: selected ? '#fff' : bgColor }}
      />
    </div>
  );
};

export default TaskNode;
