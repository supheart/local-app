import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import React from 'react';
import { BaseNodeComponent, render } from '@jsplumbtoolkit/browser-ui-react';
import classNames from 'classnames';
import { cloneDeep } from 'lodash';

import { WorkFlowStatusColor } from 'lib/global/workflow';
import useI18n from 'lib/hooks/useI18n';
import { NodeProps, StatusType } from 'lib/types/workflow';

import { CommonConfig, NodeRect } from '../config';

import Anchor from './Anchor';
import Port from './Port';

import cx from './index.less';

type endPointType = {
  cssClass: string;
};

// interface TaskNodeProps extends NodeProps {
//   setSelected?: (id: string, selected: boolean, isAny?: boolean) => void;
//   updateNodePosition: (id: string, position: number[]) => void;
//   keyType?: StatusType['type'];
//   isAny: boolean;
//   jsPlumb: any;
//   isView?: boolean;
//   data: any;
//   surface: any;
//   element: any;
//   toolkit: any;
//   vertex: any;
// }

const anchors = ['Top', 'Left', 'Right', 'Bottom'];

interface TaskNode {
  props: {
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
  };
  anyColor: any;
  bgColor: any;
  color: any;
  selected: boolean;
}

class TaskNode extends BaseNodeComponent<any, any> {
  // console.log(123, props);
  constructor(props) {
    super(props);
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

    this.anyColor = isAnySelected ? '#1a8cff' : '#c0c0c0';
    const keyType = key as StatusType['type'];
    this.bgColor = WorkFlowStatusColor[keyType].bgColor;
    this.color = WorkFlowStatusColor[keyType].color;
    // const { t } = useI18n();
    // this.t = t;
  }

  select(is: boolean): void {
    this.selected = is;
  }

  render(): React.ReactElement {
    return (
      <>
        <div
          id={this.props.data.id}
          onClick={() => this.select(false)}
          className={cx('flow-node', 'node-element', 'node-task', {
            selected: this.selected,
            'node-selected': this.selected,
          })}
          // ref={nodeRef}
        >
          <div
            className={cx('node-content')}
            style={{
              backgroundColor: this.bgColor,
              borderColor: this.selected ? '#fff' : this.bgColor,
              color: this.color,
            }}
          >
            {this.props.data.name}1
            {/* {anchors.map(item => {
              return <Anchor key={item} node={this.props.data} direction={item} />;
            })} */}
            {anchors.map(item => {
              return (
                <Port
                  key={item}
                  node={this.props.data}
                  type={item}
                  toolkit={this.toolkit}
                  surface={this.surface}
                  vertex={this.vertex}
                />
              );
            })}
          </div>
        </div>
        {this.props.data.isAny && (
          <div
            className={cx('any-status', { 'any-selected': this.props.data.isAnySelected })}
            style={{
              left: this.props.data.x + NodeRect.width / 2,
              top: this.props.data.y + NodeRect.height,
            }}
          >
            <svg width="9" height="50" className={cx('content')}>
              <path
                pointerEvents="all"
                d="M4.5,0 L8.5,8 L4.5,5 L0.5,8 L4.5,0"
                stroke={this.anyColor}
                fill={this.anyColor}
              />
              <line x1="4.5" y1="0.5" x2="4.5" y2="50" stroke={this.anyColor} strokeWidth="1" />
            </svg>
            <span className={cx('text')} onClick={() => this.select(true)}>
              {/* {this.t('formField.anyStatus')} */}
            </span>
          </div>
        )}
      </>
    );
  }
}

export default TaskNode;
