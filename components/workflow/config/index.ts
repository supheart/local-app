export const ElementType = {
  transition: 'Transition',
  status: 'Status',
  any: 'Any', // 任意连线
};

export const NodeType = {
  Start: 'Start',
  Task: 'Task',
};

export const StartNodeItem = {
  name: 'startNodeName',
  id: 'start_node',
  key: 'start',
  width: 30,
  height: 30,
  x: 36,
  y: 36,
  bgColor: '#d0d0d0',
  selected: false,
  parameters: {},
  nodeType: NodeType.Start,
  statusId: 'start_node',
  transitionName: 'createNode',
};
