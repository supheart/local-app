import { memo, useEffect, useRef, useState } from 'react';
import {
  AnchorLocations,
  ArrowOverlay,
  BlankEndpoint,
  BrowserUIReact,
  EVENT_CANVAS_CLICK,
  EVENT_CLICK,
  EVENT_DBL_CLICK,
  JsPlumbToolkitSurfaceComponent,
} from '@jsplumbtoolkit/browser-ui-react';
import { OrthogonalConnector } from '@jsplumbtoolkit/connector-orthogonal';
import { AbsoluteLayout, Edge, ObjectData, Vertex } from '@jsplumbtoolkit/core';

import StartNode from './nodes/StartNode';
import TaskNode from './nodes/TaskNode';
import data from './custom.json';

// import cx from './jsplumbPage.less';

const NodeType = {
  START: 'start',
  TASK: 'task',
  ACTION: 'action',
};

const EdgeType = {
  DEFAULT: 'default',
};

const PortType = {
  START: 'start',
  DEFAULT: 'default',
};

const JsplumbPage: React.FC = props => {
  console.info('props:', props);
  const [renderParams, setRenderParams] = useState(null);
  // const [toolkit, setToolkit] = useState<BrowserUIReact>();
  const [view, setView] = useState(null);
  // const surface = useRef(null);
  const toolkit = useRef<BrowserUIReact>(null);

  console.info('render page');

  useEffect(() => {
    if (toolkit.current) return;
    toolkit.current = new BrowserUIReact({
      nodeFactory: (type: string, data: Record<string, any>, callback: (o: ObjectData) => any) => {
        console.info('node factory', type, data, callback);
        return true;
      },
      edgeFactory: (type: string, data: Record<string, any>, callback: (o: ObjectData) => any) => {
        console.info('edge factory', type, data, callback);
        return true;
      },
      portFactory: (type: string, data: Record<string, any>, callback: (o: ObjectData) => any) => {
        console.info('port factory', type, data, callback);
        return true;
      },
      groupFactory: (type: string, data: Record<string, any>, callback: (o: ObjectData) => any) => {
        console.info('group factory', type, data, callback);
        return true;
      },
      beforeStartConnect: (source: Vertex, edgeType: string) => {
        console.info('before start connect', source, edgeType);
        return true;
      },
      beforeConnect: (source: Vertex, target: Vertex, data?: Record<string, any>, userInstigated?: boolean) => {
        console.info('before connect', source, target, data, userInstigated);
        return true;
      },
      beforeMoveConnection: (source: Vertex, target: Vertex, edge: Edge) => {
        console.info('before move connection', source, target, edge);
        return true;
      },
      beforeStartDetach: (source: Vertex, edge: Edge) => {
        console.info('before start detach', source, edge);
        return true;
      },
      beforeDetach: (source: Vertex, target: Vertex, edge: Edge) => {
        console.info('before detach', source, target, edge);
        return true;
      },
    });

    const view = {
      nodes: {
        [NodeType.START]: {
          jsx: (ctx: any): React.ReactElement => <StartNode ctx={ctx} />,
        },
        [NodeType.TASK]: {
          jsx: (ctx: any): React.ReactElement => <TaskNode ctx={ctx} />,
        },
      },
      edges: {
        [EdgeType.DEFAULT]: {
          anchor: AnchorLocations.AutoDefault,
          endpoint: BlankEndpoint.type,
          connector: {
            type: OrthogonalConnector.type,
            options: { cornerRadius: 5 },
          },
          paintStyle: {
            strokeWidth: 2,
            stroke: 'rgb(132, 172, 179)',
            outlineWidth: 3,
            outlineStroke: 'transparent',
          }, //	paint style for this edge type.
          hoverPaintStyle: { strokeWidth: 2, stroke: 'rgb(67,67,67)' },
          events: {
            [EVENT_DBL_CLICK]: (params: any) => {
              console.info(params);
              // dialogs.show({
              //   id: "dlgConfirm",
              //   data: {
              //     msg: "Delete Edge",
              //   },
              //   onOK: () => {
              //     toolkit?.removeEdge(params.edge);
              //   },
              // });
            },
            [EVENT_CLICK]: (params: any) => {
              console.info(params);
              // pathEditor.startEditing(params.edge, {});
            },
          },
          overlays: [
            {
              type: ArrowOverlay.type,
              options: { location: 1, width: 10, length: 10 },
            },
            {
              type: ArrowOverlay.type,
              options: { location: 0.3, width: 10, length: 10 },
            },
          ],
        },
        [EdgeType.DEFAULT]: {
          anchor: AnchorLocations.AutoDefault,
          endpoint: BlankEndpoint.type,
          connector: {
            type: OrthogonalConnector.type,
            options: { cornerRadius: 5 },
          },
          paintStyle: {
            strokeWidth: 2,
            stroke: 'rgb(132, 172, 179)',
            outlineWidth: 3,
            outlineStroke: 'transparent',
          }, //	paint style for this edge type.
          hoverPaintStyle: { strokeWidth: 2, stroke: 'rgb(67,67,67)' },
          events: {
            [EVENT_DBL_CLICK]: (params: any) => {
              console.info(params);
              // dialogs.show({
              //   id: "dlgConfirm",
              //   data: {
              //     msg: "Delete Edge",
              //   },
              //   onOK: () => {
              //     toolkit?.removeEdge(params.edge);
              //   },
              // });
            },
            [EVENT_CLICK]: (params: any) => {
              console.info(params);
              // pathEditor.startEditing(params.edge, {});
            },
          },
          overlays: [
            {
              type: ArrowOverlay.type,
              options: { location: 1, width: 10, length: 10 },
            },
            {
              type: ArrowOverlay.type,
              options: { location: 0.3, width: 10, length: 10 },
            },
          ],
        },
      },
      ports: {
        [PortType.START]: {
          edgeType: PortType.DEFAULT,
        },
      },
    };

    // const view = {
    //   nodes: {
    //     [START]: {
    //       jsx: (ctx: any) => {
    //         return <StartNode ctx={ctx} dlg={null} />;
    //       },
    //     },
    //     [SELECTABLE]: {
    //       events: {
    //         [EVENT_TAP]: (params: { obj: Node }) => {
    //           toolkit.toggleSelection(params.obj);
    //         },
    //       },
    //     },
    //     [QUESTION]: {
    //       parent: SELECTABLE,
    //       jsx: (ctx: any) => {
    //         return <TaskNode ctx={ctx} dlg={null} />;
    //       },
    //     },
    //     [ACTION]: {
    //       parent: SELECTABLE,
    //       jsx: (ctx: any) => {
    //         return <TaskNode ctx={ctx} dlg={null} />;
    //       },
    //     },
    //     [OUTPUT]: {
    //       parent: SELECTABLE,
    //       jsx: (ctx: any) => {
    //         return <TaskNode ctx={ctx} dlg={null} />;
    //       },
    //     },
    //   },
    //   // There are two edge types defined - 'yes' and 'no', sharing a common
    //   // parent.
    //   edges: {
    //     [DEFAULT]: {
    //       anchor: AnchorLocations.AutoDefault,
    //       endpoint: BlankEndpoint.type,
    //       connector: {
    //         type: OrthogonalConnector.type,
    //         options: { cornerRadius: 5 },
    //       },
    //       paintStyle: {
    //         strokeWidth: 2,
    //         stroke: 'rgb(132, 172, 179)',
    //         outlineWidth: 3,
    //         outlineStroke: 'transparent',
    //       }, //	paint style for this edge type.
    //       hoverPaintStyle: { strokeWidth: 2, stroke: 'rgb(67,67,67)' }, // hover paint style for this edge type.
    //       events: {
    //         [EVENT_DBL_CLICK]: (params: any) => {},
    //         [EVENT_CLICK]: (params: any) => {},
    //       },
    //       overlays: [
    //         {
    //           type: ArrowOverlay.type,
    //           options: { location: 1, width: 10, length: 10 },
    //         },
    //         {
    //           type: ArrowOverlay.type,
    //           options: { location: 0.3, width: 10, length: 10 },
    //         },
    //       ],
    //     },
    //     [RESPONSE]: {
    //       parent: DEFAULT,
    //       overlays: [
    //         {
    //           type: LabelOverlay.type,
    //           options: {
    //             label: '${label}',
    //             events: {
    //               click: (params: { edge: Edge }) => {
    //                 // this._editLabel(params.edge);
    //               },
    //             },
    //           },
    //         },
    //       ],
    //     },
    //   },
    //   ports: {
    //     [START]: {
    //       edgeType: DEFAULT,
    //     },
    //     [SOURCE]: {
    //       maxConnections: -1,
    //       edgeType: RESPONSE,
    //     },
    //     [TARGET]: {
    //       maxConnections: -1,
    //       isTarget: true,
    //     },
    //   },
    // };

    const renderParams = {
      layout: {
        type: AbsoluteLayout.type,
      },
      events: {
        [EVENT_CANVAS_CLICK]: (e: Event) => {
          console.info(e);
          toolkit.current.clearSelection();
          // this.pathEditor.stopEditing();
        },
      },
      lassoInvert: true,
      consumeRightClick: false,
      dragOptions: {
        filter: '.jtk-draw-handle, .node-action, .node-action i',
      },
      zoomToFit: true,
      // plugins: [DrawingToolsPlugin.type, LassoPlugin.type],
      grid: {
        size: {
          w: 20,
          h: 20,
        },
      },
      magnetize: {
        afterDrag: true,
      },
    };

    console.info('init', toolkit.current, view, renderParams);
    setView(view);
    setRenderParams(renderParams);
  }, []);

  useEffect(() => {
    if (toolkit.current) {
      console.info('load data', data);
      toolkit.current.load({ data });
    }
  }, [toolkit]);

  return (
    <div style={{ height: '100vh' }}>
      <div style={{ width: '100%', height: '100%', display: 'flex' }}>
        {toolkit.current && (
          <JsPlumbToolkitSurfaceComponent
            renderParams={renderParams}
            toolkit={toolkit.current}
            view={view}
            // ref={surface.current}
          />
        )}
      </div>
    </div>
  );
};

export default memo(JsplumbPage);
