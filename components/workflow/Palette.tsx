import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { v4 as uuidv4 } from 'uuid';

import { NodeProps, StatusType, TransitionProps } from 'lib/types/workflow';

import { ElementType, NodeRect, NodeType } from './config';
import { StartNode, TaskNode } from './nodes';

// import { useI18n } from 'lib/hooks';
import cx from './index.less';
import cxi from './palette.less';

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

const Palette: React.ForwardRefRenderFunction<RefProps, PaletteProps> = ({
  updateDraggedStatus,
  updateNewDragStatus,
}) => {
  // const { t } = useI18n();
  const jsPlumbInstanceObject = useRef(null);
  const workflowWrapper = useRef(null);
  const [jsPlumbInstance, setJsPlumb] = useState(null);
  const [nodes, setNodes] = useState<NodeProps[]>([]);
  const [connecting, setConnecting] = useState(false);
  const [offset, setOffset] = useState<{ top: number; left: number }>();

  useEffect(() => {
    import('jsplumb').then(({ jsPlumb }: any) => {
      jsPlumb.ready(() => {
        const instance = jsPlumb.getInstance();
        jsPlumbInstanceObject.current = instance;
        setJsPlumb(instance);
      });
    });
  }, []);

  useEffect(() => {
    if (jsPlumbInstance && workflowWrapper.current) {
      setOffset({
        top: workflowWrapper.current.offsetTop || 0,
        left: workflowWrapper.current.offsetLeft || 0,
      });
      jsPlumbInstance.setContainer('jsplumbContainer');
      jsPlumbInstance.importDefaults({
        ConnectionsDetachable: false,
      });
    }
  }, [jsPlumbInstance]);

  const [, dropRef] = useDrop({
    accept: ElementType.status,
    drop: (source: any, monitor) => {
      const { x, y } = monitor.getClientOffset();
      const { id, name, key } = source;
      const left = x - offset.left - NodeRect.width / 2;
      const top = y - offset.top - NodeRect.height / 2;
      const { scrollTop, scrollLeft } = workflowWrapper.current;
      nodes.push({
        width: NodeRect.width,
        height: NodeRect.height,
        name,
        x: Math.max(0, left) + scrollLeft,
        y: Math.max(0, top) + scrollTop,
        id: id + '-' + uuidv4(),
        statusId: id,
        key,
        selected: false,
        parameters: {},
      });
      setNodes(nodes);
      updateDraggedStatus(nodes.map(node => node.statusId));
      updateNewDragStatus(ns => [...ns, id]);
    },
    collect: monitor => {
      return {
        isHover: !!monitor.isOver(),
      };
    },
  });

  const setNodeSelected = useCallback(() => {}, []);
  const updateNodePosition = useCallback(() => {}, []);

  return (
    <div className={cx('workflow-palette-container')} ref={workflowWrapper}>
      <div className={cxi('workflow-wrapper')} ref={dropRef}>
        <div id="jsplumbContainer" className={cxi('flow-container', { connecting })}>
          {nodes.map(node => {
            if (node.nodeType === NodeType.Start) {
              return (
                <StartNode
                  {...node}
                  key={node.id as StatusType['type']}
                  jsPlumb={jsPlumbInstance}
                  setSelected={setNodeSelected}
                  updateNodePosition={updateNodePosition}
                />
              );
            }
            return (
              <TaskNode
                {...node}
                key={node.id as StatusType['type']}
                keyType={node.key}
                isAny={node.parameters?.isAny}
                jsPlumb={jsPlumbInstance}
                setSelected={setNodeSelected}
                updateNodePosition={updateNodePosition}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default forwardRef(Palette);
