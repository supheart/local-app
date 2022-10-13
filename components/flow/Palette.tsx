import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import {
  AnchorLocations,
  ArrayAnchorSpec,
  ArrowOverlay,
  BlankEndpoint,
  BrowserUIReact,
  EVENT_CANVAS_CLICK,
  EVENT_CLICK,
  EVENT_DBL_CLICK,
  EVENT_RESIZE,
  EVENT_TAP,
  JsPlumbToolkitSurfaceComponent,
  LabelOverlay,
} from '@jsplumbtoolkit/browser-ui-react';
import * as ConnectorEditors from '@jsplumbtoolkit/connector-editors';
import * as OrthogonalConnectorEditor from '@jsplumbtoolkit/connector-editors-orthogonal';
import { OrthogonalConnector } from '@jsplumbtoolkit/connector-orthogonal';
import { AbsoluteLayout, Edge, Node } from '@jsplumbtoolkit/core';
import { ForceDirectedLayout } from '@jsplumbtoolkit/layout-force-directed';
import { Button } from 'antd';
import { v4 as uuidv4 } from 'uuid';

import { useWorkflowState } from 'lib/hooks/useWorkflow';
import { NodeProps, StatusType, TransitionProps } from 'lib/types/workflow';

import data from './config/data.json';
import StatusPanel from './status/Panel';
import StatusContainer from './status/StatusContainer';
import { ElementType, NodeRect, NodeType } from './config';
import { StartNode, TaskNode } from './nodes';
import { ObjectData } from './type';

import '@jsplumbtoolkit/browser-ui/css/jsplumbtoolkit.css';
import '@jsplumbtoolkit/connector-editors/css/jsplumbtoolkit-connector-editors.css';
import cx from './palette.less';
import Anchor from './nodes/Anchor';

export interface RefProps {
  deleteNode: (id: string, type: string, callback?: () => void) => void;
  updateNodeProperties: (id: string, type: string, data: Record<string, any>) => void;
  getData: () => { transitions: TransitionProps[]; nodes: NodeProps[] };
}

interface PaletteProps {
  initialData: { nodes: NodeProps[]; transitions: TransitionProps[] };
  updateNode: (element?: NodeProps | TransitionProps, updateForceNode?: boolean) => void;
  updateDraggedStatus: (statusList: string[]) => void;
  updateNewDragStatus: React.Dispatch<React.SetStateAction<string[]>>;
  checkUsedStatus: (statusId: string) => Promise<boolean>;
}

OrthogonalConnectorEditor.initialize();

const Palette: React.FC<PaletteProps> = props => {
  const statusPanelRef = useRef(null);
  const [draggedStatus, setDraggedStatus] = useState<string[]>([]);
  const [statusList, statusLoading, getStatusList] = useWorkflowState();
  const [surface, setSurface] = useState(null);
  const pathEditor = useRef(null);

  const toolkit = new BrowserUIReact({
    // portSeparator: '#',
    // portDataProperty: 'columns',
    debugEnabled: true,
    defaultCost: 10,
    nodeFactory: (type: string, data: Record<string, any>, callback: (o: ObjectData) => any) => {
      const node = toolkit.getNode(data.id);
      if (node) {
        console.info('node has exist');
        return false;
      }
      console.info('nodeFactory msg:', type, data, callback);
      data.text = 'aabbcc';
      const columns = [
        {
          id: 'source-Top',
          name: 'Top',
          datatype: 'varchar',
        },
        {
          id: 'source-Bottom',
          name: 'Bottom',
          datatype: 'varchar',
        },
        {
          id: 'source-Right',
          name: 'Right',
          datatype: 'varchar',
        },
        {
          id: 'source-Left',
          name: 'Left',
          datatype: 'varchar',
        },
        {
          id: 'target-Top',
          name: 'Top',
          datatype: 'varchar',
        },
        {
          id: 'target-Bottom',
          name: 'Bottom',
          datatype: 'varchar',
        },
        {
          id: 'target-Right',
          name: 'Right',
          datatype: 'varchar',
        },
        {
          id: 'target-Left',
          name: 'Left',
          datatype: 'varchar',
        },
      ];
      // data.columns = columns;
      columns.forEach(column => {
        toolkit.addNewPort(data.id, data.type, {
          id: column.id,
          name: column.name,
          datatype: column.datatype,
        });
      });
      callback(data);

      const ports = toolkit.getPort('source-Top');
      console.log(334455, ports);
      return true;
    },
    beforeStartConnect: (source, edgeType: string) => {
      console.info('beforeStartConnect msg1:', source, edgeType);
      return { label: '888', edgeType: 'default' };
      return source.data.type === NodeType.Start && source.getEdges().length > 0 ? false : { label: '...' };
    },
    beforeStartDetach: (source: any, edge: Edge): any => {
      console.info('before detach', edge);
      return true;
    },
    beforeDetach: (source: any, target: any, edge: any, isDiscard: any): any => {
      // only allow connections to be detached whose
      // source ID is an even number
      console.info('detach', source, target, edge, isDiscard);
      return true;
    },
    edgeFactory: (
      type: string,
      data: Record<string, any>,
      continueCallback: any,
      // abortCallback: CancelFunction,
      abortCallback: any,
      params: any,
    ): boolean => {
      console.info('edgeFactory msg:', type, data, params);
      // continueCallback({ ...data, ...params });
      continueCallback(data);
      return true;
    },
    portUpdater: (a, b, c) => {
      console.log('ccdd', a, b, c);
    },
    portFactory: (type, data, continueCallback) => {
      console.info('1111 port factory', type, data, continueCallback);
      return true;
    },
  });

  window.toolkit1 = toolkit;

  const view = {
    nodes: {
      [NodeType.Start]: {
        jsx: (ctx: any) => {
          return <StartNode ctx={ctx} dlg={null} />;
        },
      },
      [NodeType.Task]: {
        events: {
          [EVENT_TAP]: (params: { obj: Node }) => {
            toolkit.toggleSelection(params.obj as any);
          },
        },
        jsx: (ctx: any) => {
          return <TaskNode {...ctx} dlg={null} />;
        },
        anchorPositionFinder: (
          el: Element,
          pos: { x: number; y: number },
          vertex: Node,
          def: ViewNodeOptions,
          evt: Event,
        ): ArrayAnchorSpec => {
          console.info('anchor', el, pos, vertex, def, evt);
          // return [number, number, AnchorOrientationHint, AnchorOrientationHint, number?, number?];
          // return [pos.x, pos.y, 0, 0];
        },
      },
    },
    edges: {
      default: {
        // detachable: false,
        // anchor: [AnchorLocations.Left, AnchorLocations.Right, AnchorLocations.Top, AnchorLocations.Bottom],
        // endpoint: BlankEndpoint.type,
        // anchor: AnchorLocations.AutoDefault,
        // endpoint: {
        //   type: 'Dot',
        //   options: {
        //     radius: 10,
        //     cssClass: 'end-point',
        //     hoverClass: 'endpoint-hover',
        //   },
        // },
        // mergeStrategy: 'override',
        reattach: true,
        connector: { type: OrthogonalConnector.type, options: { cornerRadius: 3 } },
        paintStyle: {
          strokeWidth: 1,
          stroke: '#c0c0c0',
          outlineWidth: 3,
          outlineStroke: 'transparent',
        }, //	paint style for this edge type.
        hoverPaintStyle: { strokeWidth: 2, stroke: '#1a8cff' }, // hover paint style for this edge type.
        events: {
          [EVENT_DBL_CLICK]: (params: any) => {
            console.info(params);
          },
          [EVENT_CLICK]: (params: any) => {
            console.info(params, pathEditor);
            console.info(334455, pathEditor.current);
            // params.edge.
            if (pathEditor.current) {
              pathEditor.current.startEditing(params.edge, {});
            }
          },
        },
        overlays: [
          {
            type: ArrowOverlay.type,
            options: { location: 1, width: 10, length: 10 },
          },
          // {
          //   type: ArrowOverlay.type,
          //   options: { location: 0.3, width: 10, length: 10 },
          // },
        ],
      },
    },
    ports: {
      // [NodeType.Start]: {
      //   edgeType: NodeType.Task,
      //   isSource: true,
      // },
      // [NodeType.Task]: {
      //   maxConnections: -1,
      //   edgeType: NodeType.Task,
      //   isSource: true,
      //   isTarget: true,
      //   anchor: [AnchorLocations.Left],
      // },
      Right: {
        maxConnections: -1,
        // edgeType: NodeType.Task,
        // edgeType: 'default',
        isSource: true,
        isTarget: true,
        // uniqueEndpoint: true,
        // isEndpoint: true,
        anchor: [AnchorLocations.Right],
      },
      Top: {
        maxConnections: -1,
        // edgeType: NodeType.Task,
        // edgeType: 'default',
        isSource: true,
        isTarget: true,
        // isEndpoint: true,
        // uniqueEndpoint: true,
        anchor: [AnchorLocations.Top],
      },
      Bottom: {
        maxConnections: -1,
        // edgeType: NodeType.Task,
        // edgeType: 'default',
        isSource: true,
        isTarget: true,
        // uniqueEndpoint: true,
        // isEndpoint: true,
        anchor: [AnchorLocations.Bottom],
      },
      Left: {
        maxConnections: -1,
        // edgeType: NodeType.Task,
        // edgeType: 'default',
        isSource: true,
        isTarget: true,
        // uniqueEndpoint: true,
        // isEndpoint: true,
        anchor: [AnchorLocations.Left],
      },
    },
  };

  const renderParams = {
    // Layout the nodes using an absolute layout
    layout: {
      type: AbsoluteLayout.type,
    },
    events: {
      [EVENT_CANVAS_CLICK]: (e: Event) => {
        console.info(e);
        toolkit.clearSelection();
        pathEditor.current.stopEditing();
      },
      ['port:added']: (a, b) => {
        console.log(111, a, b);
      },
      ['edge:added']: (a, b) => {
        console.log(333111, a, b);
        const path = toolkit.getPath({ source: a.sourceId, target: a.targetId });
        const vertices = path.getVertices();
        console.log(3322, path, vertices);
      },
    },
    lassoInvert: true,
    consumeRightClick: false,
    // dragOptions: {
    //   filter: '.jtk-draw-handle, .node-action, .node-action i',
    // },
    zoomToFit: true,
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

  useEffect(() => {
    if (surface) {
      pathEditor.current = ConnectorEditors.newInstance(surface);
    }
  }, [surface]);

  const dataGenerator = useCallback((element: Element) => {
    console.info('drag element', element);
    const data = {
      w: NodeRect.width,
      h: NodeRect.height,
      key: element.getAttribute('node-type'),
      type: NodeType.Task,
      name: element.getAttribute('title'),
      id: element.getAttribute('node-id'),
    };
    console.info('drag data', data);
    return data;
  }, []);

  const save = useCallback(() => {
    const edges = toolkit.getAllEdges();
    // toolkit.save({
    //   type: 'json',
    //   success: data => {
    //     console.info('save', data);
    //   },
    //   error: error => {
    //     console.error('error', error);
    //   },
    // } as any);
    // const data = toolkit.exportData({ type: 'xml' });
    const data = toolkit.toJSON();
    console.info('save data', data);
    window.adata = data;
  }, []);

  // 回显数据
  useEffect(() => {
    const data = JSON.parse(
      `{
        "nodes": [
          {
            "left": 40,
            "top": 140,
            "w": 120,
            "h": 38,
            "key": "Finished",
            "type": "Task",
            "name": "已关闭",
            "id": "O1nDNY01Km",
            "text": "aabbcc"
          },
          {
            "left": 120,
            "top": 300,
            "w": 120,
            "h": 38,
            "key": "InProgress",
            "type": "Task",
            "name": "需求待评审",
            "id": "GA9voiqPEq",
            "text": "aabbcc"
          },
          {
            "left": 300,
            "top": 220,
            "w": 120,
            "h": 38,
            "key": "InProgress",
            "type": "Task",
            "name": "技术评审完成",
            "id": "hFjhgHEs3Z",
            "text": "aabbcc"
          }
        ],
        "edges": [
          {
            "source": "O1nDNY01Km",
            "target": "GA9voiqPEq",
            "data": {
              "label": "888",
              "edgeType": "default",
              "type": "default"
            },
            "geometry": {
              "segments": [
                {
                  "x": 10,
                  "y": 159
                },
                {
                  "x": 90,
                  "y": 319
                }
              ],
              "source": {
                "curX": 40,
                "curY": 159,
                "x": 0,
                "y": 0.5,
                "ox": -1,
                "oy": 0
              },
              "target": {
                "curX": 120,
                "curY": 319,
                "x": 0,
                "y": 0.5,
                "ox": -1,
                "oy": 0
              }
            }
          },
          {
            "source": "O1nDNY01Km",
            "target": "hFjhgHEs3Z",
            "data": {
              "label": "888",
              "edgeType": "default",
              "type": "default"
            },
            "geometry": {
              "segments": [
                {
                  "x": 190,
                  "y": 159
                },
                {
                  "x": 360,
                  "y": 159
                },
                {
                  "x": 360,
                  "y": 190
                }
              ],
              "source": {
                "curX": 160,
                "curY": 159,
                "x": 1,
                "y": 0.5,
                "ox": 1,
                "oy": 0
              },
              "target": {
                "curX": 360,
                "curY": 220,
                "x": 0.5,
                "y": 0,
                "ox": 0,
                "oy": -1
              }
            }
          },
          {
            "source": "hFjhgHEs3Z",
            "target": "GA9voiqPEq",
            "data": {
              "label": "888",
              "edgeType": "default",
              "type": "default"
            },
            "geometry": {
              "segments": [
                {
                  "x": 360,
                  "y": 288
                },
                {
                  "x": 270,
                  "y": 319
                }
              ],
              "source": {
                "curX": 360,
                "curY": 258,
                "x": 0.5,
                "y": 1,
                "ox": 0,
                "oy": 1
              },
              "target": {
                "curX": 240,
                "curY": 319,
                "x": 1,
                "y": 0.5,
                "ox": 1,
                "oy": 0
              }
            }
          }
        ],
        "ports": [],
        "groups": []
      }`,
    );
    const data1 = JSON.parse(
      '{"nodes":[{"left":140,"top":220,"w":120,"h":38,"key":"InProgress","type":"Task","name":"需求待评审","id":"GA9voiqPEq","text":"aabbcc"},{"left":340,"top":400,"w":120,"h":38,"key":"InProgress","type":"Task","name":"技术评审完成","id":"hFjhgHEs3Z","text":"aabbcc"}],"edges":[{"source":"GA9voiqPEq#GA9voiqPEq_source_Right","target":"hFjhgHEs3Z#hFjhgHEs3Z_target_Bottom","data":{"label":"888","edgeType":"Task","type":"default"}},{"source":"GA9voiqPEq#GA9voiqPEq_source_Top","target":"hFjhgHEs3Z#hFjhgHEs3Z_target_Left","data":{"label":"888","edgeType":"Task","type":"default"}}],"ports":[{"id":"GA9voiqPEq#GA9voiqPEq_source_Right","type":"Right"},{"id":"GA9voiqPEq#GA9voiqPEq_source_Top","type":"Top"},{"id":"hFjhgHEs3Z#hFjhgHEs3Z_target_Bottom","type":"Bottom"},{"id":"hFjhgHEs3Z#hFjhgHEs3Z_target_Left","type":"Left"}],"groups":[]}',
    );
    if (toolkit && data) {
      toolkit.load({ data: data });
      console.log(222, data);
      // setTimeout(() => {
      // const ports = toolkit.getPort('source-Top');
      console.log(334455, data.ports);
      // data.ports.forEach(port => {
      //   toolkit.addNewPort(port.id, port.type);
      // });
      // toolkit.load({
      //   data: data,
      //   onload: () => {
      //     // const count = toolkit.getEdgeCount();
      //     // console.log(234, count, surface);
      //     // surface.reload();
      //   },
      // });
      // }, 3000);
    }
  }, []);

  return (
    <div className={cx('palette-container')}>
      {/* <div className={cx('status-panel')} ref={statusPanelRef}> */}
      {surface && (
        <StatusPanel
          surface={surface}
          list={statusList}
          loading={statusLoading}
          getList={getStatusList}
          draggedStatus={draggedStatus}
          dataGenerator={dataGenerator}
        />
        // <StatusContainer
        //   surface={surface}
        //   selector={'div'}
        //   container={statusPanelRef.current}
        //   statusList={statusList}
        //   dataGenerator={dataGenerator}
        // />
      )}
      {/* </div> */}
      <div className={cx('workflow-wrapper')}>
        <JsPlumbToolkitSurfaceComponent
          toolkit={toolkit}
          view={view}
          renderParams={renderParams}
          ref={(data: { surface: any }) => {
            if (data != null) {
              setSurface(data.surface);
              // const data1 = JSON.parse(
              //   '{"nodes":[{"left":160,"top":140,"w":120,"h":38,"key":"Finished","type":"Task","name":"已关闭","id":"O1nDNY01Km","text":"aabbcc"},{"left":260,"top":320,"w":120,"h":38,"key":"InProgress","type":"Task","name":"需求待评审","id":"GA9voiqPEq","text":"aabbcc"}],"edges":[{"source":"O1nDNY01Km.Right","target":"GA9voiqPEq.Right","data":{"label":"888","edgeType":"default","type":"default"}},{"source":"O1nDNY01Km.Left","target":"GA9voiqPEq.Left","data":{"label":"888","edgeType":"default","type":"default"}}],"ports":[{"id":"O1nDNY01Km.Right","type":"Right"},{"id":"O1nDNY01Km.Left","type":"Left"},{"id":"GA9voiqPEq.Right","type":"Right"},{"id":"GA9voiqPEq.Left","type":"Left"}],"groups":[]}',
              // );
              // console.info('data:', data1);
              // toolkit.load({
              //   data: data1,
              //   onload: () => {
              //     // const edges = toolkit.getAllEdges();
              //     // console.log('edges', edges);
              //     // data1.ports.forEach(port => {
              //     //   toolkit.addNewPort(port.id, port.type);
              //     // });
              //     // const port1 = toolkit.getPort(data1.ports[0].id);
              //     // console.log('ports', port1);
              //     // data.surface.reload();
              //   },
              // });
            }
          }}
        />
      </div>
      <div className={cx('operation-wrapper')}>
        <Button onClick={save}>save</Button>
      </div>
    </div>
  );
};

export default Palette;
