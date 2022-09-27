export type NodeTypeProps = 'Start' | 'Task';

export type StatusType = {
  objectId: string;
  name: string;
  type: 'Start' | 'InProgress' | 'Finished';
};

export interface NodeItemProps {
  id: string;
  key: string;
  anchor: string;
  name?: string;
  type?: string;
}

export interface BaseNodeProps {
  id: string;
  name: string;
  type?: string;
  nodeType?: NodeTypeProps;
  source?: NodeItemProps;
  target?: NodeItemProps;
  parameters?: Record<string, any>;
  properties?: Array<any>; //预留自定义属性list
}

export interface NodeProps extends BaseNodeProps {
  width: number;
  height: number;
  key: string;
  bgColor?: string;
  x: number;
  y: number;
  selected: boolean;
  isAnySelected?: boolean;
  anyData?: Record<string, any>;
  statusId?: string;
}

export interface TransitionProps extends BaseNodeProps {
  isAny?: boolean;
  sourceId?: string;
  targetId?: string;
  elementId?: string;
}

export interface WorkflowProps {
  objectId: string;
  name?: string;
  description?: string;
}
