import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { cloneDeep } from 'lodash';

import { WorkFlowStatusColor } from 'lib/global/workflow';
import useI18n from 'lib/hooks/useI18n';
import { NodeProps, StatusType } from 'lib/types/workflow';

import { CommonConfig, NodeRect } from '../config';

import Anchor from './Anchor';

import cx from './index.less';

type endPointType = {
  cssClass: string;
};

interface TaskNodeProps extends NodeProps {
  setSelected?: (id: string, selected: boolean, isAny?: boolean) => void;
  updateNodePosition: (id: string, position: number[]) => void;
  keyType?: StatusType['type'];
  isAny: boolean;
  jsPlumb: any;
  isView?: boolean;
  data: any;
  surface: any;
  element: any;
  toolkit: any;
  vertex: any;
}

const anchors = ['Top', 'Left', 'Right', 'Bottom'];

const TaskNode: React.FC<TaskNodeProps> = props => {
  // console.log(123, props);
  const {
    id,
    name,
    x = 0,
    y = 0,
    isAny = false,
    key,
    jsPlumb,
    selected,
    isAnySelected,
    updateNodePosition,
    setSelected = () => {},
    isView,
  } = props.data;
  const { t } = useI18n();
  const nodeRef = useRef(null);
  const initPoint = useRef(false);
  const [position] = useState({ x, y });
  const [anyPosition, setAnyPosition] = useState({ x, y });

  // useEffect(() => {
  //   if (jsPlumb && !isView) {
  //     jsPlumb.draggable(id, {
  //       containment: 'parent',
  //       grid: [10, 10],
  //       drag: ({ pos }: { pos: number[] }) => {
  //         setAnyPosition({ x: pos[0], y: pos[1] });
  //       },
  //       stop: ({ finalPos }: { finalPos: number[] }) => {
  //         updateNodePosition(id, finalPos);
  //       },
  //     });
  //   }
  // }, [jsPlumb, id, isView, setAnyPosition, updateNodePosition]);

  // useEffect(() => {
  //   if (nodeRef.current && !isView) {
  //     const addHoverClass = () => {
  //       if (jsPlumb) {
  //         jsPlumb.selectEndpoints({ element: id }).addClass('endpoint-hover');
  //       }
  //     };
  //     const removeHoverClass = () => {
  //       if (jsPlumb) {
  //         jsPlumb.selectEndpoints({ element: id }).removeClass('endpoint-hover');
  //       }
  //     };
  //     const nodeDom = nodeRef.current;
  //     nodeDom.addEventListener('mouseover', addHoverClass);
  //     nodeDom.addEventListener('mouseout', removeHoverClass);
  //     return () => {
  //       if (nodeDom) {
  //         nodeDom.removeEventListener('mouseover', addHoverClass);
  //         nodeDom.removeEventListener('mouseout', removeHoverClass);
  //       }
  //     };
  //   }
  // }, [nodeRef, id, isView, jsPlumb]);

  // const endPointConfig = useMemo(() => {
  //   const config = cloneDeep(CommonConfig);
  //   const classString = (config.endpoint[1] as endPointType).cssClass;
  //   (config.endpoint[1] as endPointType).cssClass = classNames(classString, keyType.toLocaleLowerCase());
  //   return config;
  // }, [keyType]);

  // useEffect(() => {
  //   if (jsPlumb) {
  //     const points = jsPlumb.selectEndpoints({ element: id });
  //     if (points.length === 0) {
  //       jsPlumb.addEndpoint(id, { anchor: 'Right', uuid: id + '-right' }, endPointConfig);
  //       jsPlumb.addEndpoint(id, { anchor: 'Left', uuid: id + '-left' }, endPointConfig);
  //       jsPlumb.addEndpoint(id, { anchor: 'Top', uuid: id + '-top' }, endPointConfig);
  //       jsPlumb.addEndpoint(id, { anchor: 'Bottom', uuid: id + '-bottom' }, endPointConfig);
  //     }
  //   }
  // }, [id, jsPlumb, initPoint, endPointConfig]);

  const select = useCallback(
    (isAny = false) => {
      // jsPlumb.select().removeClass('select-connection').setHover(false);
      // jsPlumb.select({ source: id }).setHover(true);
      // jsPlumb.select({ target: id }).setHover(true);
      // setSelected(id, true, isAny);
    },
    [id, jsPlumb, setSelected],
  );

  const anyColor = useMemo(() => (isAnySelected ? '#1a8cff' : '#c0c0c0'), [isAnySelected]);
  const keyType = key as StatusType['type'];
  const bgColor = WorkFlowStatusColor[keyType].bgColor;
  const color = WorkFlowStatusColor[keyType].color;

  return (
    <>
      <div
        id={id}
        onClick={() => select(false)}
        className={cx('flow-node', 'node-element', 'node-task', { selected, 'node-selected': selected })}
        ref={nodeRef}
      >
        <div
          className={cx('node-content')}
          style={{
            backgroundColor: bgColor,
            borderColor: selected ? '#fff' : bgColor,
            color: color,
          }}
        >
          {name}
          {/* {anchors.map(item => {
            return <Anchor key={item} node={props.data} direction={item} />;
          })} */}
        </div>
      </div>
      {isAny && (
        <div
          className={cx('any-status', { 'any-selected': isAnySelected })}
          style={{
            left: anyPosition.x + NodeRect.width / 2,
            top: anyPosition.y + NodeRect.height,
          }}
        >
          <svg width="9" height="50" className={cx('content')}>
            <path pointerEvents="all" d="M4.5,0 L8.5,8 L4.5,5 L0.5,8 L4.5,0" stroke={anyColor} fill={anyColor} />
            <line x1="4.5" y1="0.5" x2="4.5" y2="50" stroke={anyColor} strokeWidth="1" />
          </svg>
          <span className={cx('text')} onClick={() => select(true)}>
            {t('formField.anyStatus')}
          </span>
        </div>
      )}
    </>
  );
};

export default TaskNode;
