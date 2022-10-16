import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { StateMachineConnector } from '@jsplumb/connector-bezier';
import {
  AnchorLocations,
  ArrayAnchorSpec,
  ArrowOverlay,
  BlankEndpoint,
  BrowserUIReact,
  DotEndpoint,
  EVENT_CANVAS_CLICK,
  EVENT_CLICK,
  EVENT_DBL_CLICK,
  EVENT_RESIZE,
  EVENT_TAP,
  JsPlumbToolkitSurfaceComponent,
  LabelOverlay,
  newInstance,
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
import Anchor from './nodes/Anchor';
import Port from './nodes/Port';
import StatusPanel from './status/Panel';
import StatusContainer from './status/StatusContainer';
import { ElementType, NodeRect, NodeType } from './config';
import { StartNode, TaskNode2 as TaskNode, TaskNode2 } from './nodes';
import { ObjectData } from './type';

import '@jsplumbtoolkit/browser-ui/css/jsplumbtoolkit.css';
import '@jsplumbtoolkit/connector-editors/css/jsplumbtoolkit-connector-editors.css';
import cx from './palette.less';

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
    nodeFactory: function (type, data, callback) {
      data.columns = [];
      callback(data);
    },
    edgeFactory: function (type, data, continueCallback, abortCallback) {
      continueCallback(data);
      return true;
    },
    // the name of the property in each node's data that is the key for the data for the ports for that node.
    // we used to use portExtractor and portUpdater in this demo, prior to the existence of portDataProperty.
    // for more complex setups, those functions may still be needed.
    portDataProperty: 'columns',
    //
    // Prevent connections from a column to itself or to another column on the same table.
    //
    beforeStartConnect: function (source, target) {
      console.info('before start');
      return true;
    },
    beforeConnect: function (source, target) {
      console.info('before connect');
      return true;
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
  });

  window.toolkit1 = toolkit;

  const view = {
    // NOTE two ways of providing a component (which also works for Port definitions).  TableComponent and
    // ViewComponent both extend the Toolkit's BaseNodeComponent. When you provide the `jsx` you should ensure
    // that you pass in `ctx` as a prop to any component that extends BaseNodeComponent/BaseGroupComponent.
    // When you use `component`, the Toolkit handles that for you.
    nodes: {
      Task: {
        jsx: ctx => <TaskNode {...ctx} />,
      },
    },
    // Three edge types  - '1:1', '1:N' and 'N:M',
    // sharing  a common parent, in which the connector type, anchors
    // and appearance is defined.
    edges: {
      default: {
        // anchor: [AnchorLocations.Left, AnchorLocations.Right], // anchors for the endpoints
        endpoint: {
          type: DotEndpoint.type,
          options: {
            radius: 4,
          },
        },
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
    // There is only one type of Port - a column - so we use the key 'default' for the port type
    // Here we define the appearance of this port,
    // and we instruct the Toolkit what sort of Edge to create when the user drags a new connection
    // from an instance of this port. Note that we here we tell the Toolkit to create an Edge of type
    // 'common' because we don't know the cardinality of a relationship when the user is dragging. Once
    // a new relationship has been established we can ask the user for the cardinality and update the
    // model accordingly.
    ports: {
      Top: {
        component: Port,
        // NOTE: you can also use the `jsx` approach for ports.
        //jsx:(ctx) => { return <ColumnComponent ctx={ctx}/> },
        paintStyle: { fill: 'blue' }, // the endpoint's appearance
        hoverPaintStyle: { fill: '#434343' }, // appearance when mouse hovering on endpoint or connection
        // edgeType: 'common', // the type of edge for connections from this port type
        maxConnections: -1, // no limit on connections
        dropOptions: {
          //drop options for the port. here we attach a css class.
          hoverClass: 'drop-hover',
        },
        anchor: [AnchorLocations.Top],
      },
      Right: {
        component: Port,
        // NOTE: you can also use the `jsx` approach for ports.
        //jsx:(ctx) => { return <ColumnComponent ctx={ctx}/> },
        paintStyle: { fill: 'blue', width: '100px' }, // the endpoint's appearance
        hoverPaintStyle: { fill: '#434343' }, // appearance when mouse hovering on endpoint or connection
        // edgeType: 'common', // the type of edge for connections from this port type
        maxConnections: -1, // no limit on connections
        dropOptions: {
          //drop options for the port. here we attach a css class.
          hoverClass: 'drop-hover',
        },
        anchor: [AnchorLocations.Right],
      },
      Left: {
        component: Port,
        // NOTE: you can also use the `jsx` approach for ports.
        //jsx:(ctx) => { return <ColumnComponent ctx={ctx}/> },
        // paintStyle: { fill: 'blue' }, // the endpoint's appearance
        // hoverPaintStyle: { fill: '#434343' }, // appearance when mouse hovering on endpoint or connection
        // edgeType: 'common', // the type of edge for connections from this port type
        maxConnections: -1, // no limit on connections
        dropOptions: {
          //drop options for the port. here we attach a css class.
          hoverClass: 'drop-hover',
        },
        anchor: [AnchorLocations.Left],
      },
      Bottom: {
        component: Port,
        // NOTE: you can also use the `jsx` approach for ports.
        //jsx:(ctx) => { return <ColumnComponent ctx={ctx}/> },
        // paintStyle: { fill: 'blue' }, // the endpoint's appearance
        // hoverPaintStyle: { fill: '#434343' }, // appearance when mouse hovering on endpoint or connection
        // edgeType: 'common', // the type of edge for connections from this port type
        maxConnections: -1, // no limit on connections
        dropOptions: {
          //drop options for the port. here we attach a css class.
          hoverClass: 'drop-hover',
        },
        anchor: [AnchorLocations.Bottom],
      },
    },
  };

  const renderParams = {
    // Layout the nodes using a force directed layout
    layout: {
      type: AbsoluteLayout.type,
    },
    // Register for certain events from the renderer. Here we have subscribed to the 'nodeRendered' event,
    // which is fired each time a new node is rendered.  We attach listeners to the 'new column' button
    // in each table node.  'data' has 'node' and 'el' as properties: node is the underlying node data,
    // and el is the DOM element. We also attach listeners to all of the columns.
    // At this point we can use our underlying library to attach event listeners etc.
    events: {
      canvasClick: e => {
        toolkit.clearSelection();
        pathEditor.current.stopEditing();
      },
    },
    // dragOptions: {
    //   filter: 'i, .view .buttons, .table .buttons, .table-column *, .view-edit, .edit-name, .delete, .add',
    // },
    consumeRightClick: false,
    zoomToFit: true,
    // plugins: [LassoPlugin.type],
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
    // const edges = toolkit.getAllEdges();
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

  const connect = useCallback(() => {
    // toolkit.addNewPort('HqdG1eLkKc', 'Top', { id: 'HqdG1eLkKc_Top' });
    // toolkit.addNewPort('bbk6FgJG9D', 'Right', { id: 'bbk6FgJG9D_Right' });
    // toolkit.connect({ source: 'HqdG1eLkKc', target: 'bbk6FgJG9D' });
    toolkit.addEdge({
      source: 'HqdG1eLkKc.HqdG1eLkKc_source_Top',
      target: 'bbk6FgJG9D.bbk6FgJG9D_target_Right',
      // addedByMouse: true,
    });
  }, []);

  // 回显数据
  useEffect(() => {
    const data = JSON.parse(
      '{"nodes":[{"left":200,"top":120,"w":120,"h":38,"key":"Start","type":"Task","name":"Start","id":"HqdG1eLkKc","text":"aabbcc"},{"left":380,"top":240,"w":120,"h":38,"key":"InProgress","type":"Task","name":"InProgress","id":"bbk6FgJG9D","text":"aabbcc"}],"edges":[{"source":"HqdG1eLkKc.HqdG1eLkKc_source_Right","target":"bbk6FgJG9D.bbk6FgJG9D_target_Right","data":{"label":"888","edgeType":"default","type":"default"}}],"ports":[{"id":"HqdG1eLkKc.HqdG1eLkKc_source_Right","type":"Right"},{"id":"bbk6FgJG9D.bbk6FgJG9D_target_Right","type":"Right"}],"groups":[]}',
    );
    const data1 = JSON.parse(
      '{"nodes":[{"left":105,"top":437,"w":120,"h":38,"key":"Start","type":"Task","name":"Start","id":"HqdG1eLkKc","columns":[]},{"left":344,"top":445,"w":120,"h":38,"key":"InProgress","type":"Task","name":"Resolve","id":"EBGihVhcA5","columns":[]}],"edges":[{"source":"HqdG1eLkKc.HqdG1eLkKc_top","target":"EBGihVhcA5.EBGihVhcA5_right","data":{"type":"common"}},{"source":"HqdG1eLkKc.HqdG1eLkKc_right","target":"EBGihVhcA5.EBGihVhcA5_top","data":{"type":"default"}}],"ports":[{"id":"HqdG1eLkKc.HqdG1eLkKc_bottom","type":"Bottom"},{"id":"HqdG1eLkKc.HqdG1eLkKc_top","type":"Top"},{"id":"HqdG1eLkKc.HqdG1eLkKc_right","type":"Right"},{"id":"HqdG1eLkKc.HqdG1eLkKc_left","type":"Left"},{"id":"EBGihVhcA5.EBGihVhcA5_top","type":"Top"},{"id":"EBGihVhcA5.EBGihVhcA5_right","type":"Right"}],"groups":[]}',
    );
    const data2 = JSON.parse(
      '{"nodes":[{"left":290,"top":198,"w":120,"h":38,"key":"Start","type":"Task","name":"Start","id":"HqdG1eLkKc","columns":[]},{"left":407,"top":375,"w":120,"h":38,"key":"InProgress","type":"Task","name":"Approval","id":"GA9voiqPEq","columns":[]}],"edges":[{"source":"HqdG1eLkKc.HqdG1eLkKc_right","target":"GA9voiqPEq.GA9voiqPEq_right","data":{"type":"default"}}],"ports":[{"id":"HqdG1eLkKc.HqdG1eLkKc_right","type":"Right"},{"id":"HqdG1eLkKc.HqdG1eLkKc_bottom","type":"Bottom"},{"id":"GA9voiqPEq.GA9voiqPEq_right","type":"Right"},{"id":"GA9voiqPEq.GA9voiqPEq_top","type":"Top"}],"groups":[]}',
    );
    if (toolkit) {
      console.info('load data', data2);
      toolkit.load({ data: data2 });
      // console.log(222, data);
      // setTimeout(() => {
      // const ports = toolkit.getPort('source-Top');
      // console.log(334455, data.ports);
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
        <Button onClick={connect}>connect</Button>
      </div>
    </div>
  );
};

export default Palette;
