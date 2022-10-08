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

export const CommonConfig = {
  // 是否可以拖动（作为连线起点）
  isSource: true,
  // 是否可以放置（连线终点）
  isTarget: true,
  // 设置连接点最多可以连接几条线
  // -1不限制，默认限制一条线
  maxConnections: -1,
  // 设置锚点位置，按照[target, source]的顺序进行设置
  // 可以有 Bottom Top Right Left四种方位
  // 还可以是BottomLeft BottomRight BottomCenter TopLeft TopRight TopCenter LeftMiddle RightMiddle的组合
  // 默认值 ['Bottom', 'Bottom']
  // anchor: ['Bottom', 'Bottom'],
  // 端点类型，形状（区分大小写），Rectangle-正方形 Dot-圆形 Blank-空
  endpoint: [
    'Dot',
    {
      radius: 4,
      cssClass: 'end-point',
    },
  ],
  // 设置端点的样式
  endpointStyle: {
    // fill: '#fff', // 填充颜色
    // outlineStroke: '#1a8cff', // 边框颜色
    // outlineWidth: 0.5, // 边框宽度
  },
  paintStyle: {
    strokeWidth: 1,
    storke: '#1a8cff',
  },
  // 设置连接线的样式 Bezier-贝瑟尔曲线 Flowchart-流程图 StateMachine-弧线 Straight-直线
  connector: ['Flowchart', { cornerRadius: 5 }],
  // 设置连接线的样式
  connectorStyle: {
    joinstyle: 'round',
    stroke: '#c0c0c0', // 实线颜色
    strokeWidth: 1, // 实线宽度
    outlineStroke: 'blank', // 边框颜色
    outlineWidth: 2, // 边框宽度
  },
  // 设置连接线悬浮样式
  connectorHoverStyle: {
    strokeWidth: 1,
    stroke: '#646464',
  },
  // 设置连接线的箭头
  // 可以设置箭头的长宽以及箭头的位置，location 0.5表示箭头位于中间，location 1表示箭头设置在连接线末端。 一根连接线是可以添加多个箭头的。
  connectorOverlays: [
    [
      'Arrow',
      {
        width: 8,
        length: 8,
        location: 1,
      },
    ],
  ],
};

export const NodeRect = { width: 120, height: 38 };
