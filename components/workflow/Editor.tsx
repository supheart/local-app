import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { EditOutlined } from '@ant-design/icons';
import { Button, message, PageHeader } from 'antd';

// import { cloneDeep } from 'lodash';
import useI18n from 'lib/hooks/useI18n';
import { useWorkflowState } from 'lib/hooks/useWorkflow';
// import {
//   Item as ItemObject,
//   Status as StatusObject,
//   Workflow as WorkflowObject,
//   WorkflowSchemeConfig as WorkflowSchemeConfigObject,
//   Workspace as WorkspaceObject,
// } from 'lib/models';
// import Parse from 'lib/parse';
import { NodeProps, TransitionProps, WorkflowProps } from 'lib/types/workflow';

// import { ElementType, ModalType, StartNodeItem, UNIQUE_CODE } from './config';
// import Palette from './Palette';
// import PropertiesPanel from './PropertiesPanel';
import { StatusPanel } from './status';

import cx from './index.less';

const IS_DRAFT = true; // 是否保存为草稿

interface EditorProps {
  id?: string;
  parentUrl: string;
  routerBack: () => void;
  routerPush: (url: string) => void;
}

const Editor: React.FC<EditorProps> = ({ id, routerBack }) => {
  const [currentNode, setCurrentNode] = useState<NodeProps | TransitionProps>({} as NodeProps);
  const [flowData, setFlowData] = useState<{ nodes: NodeProps[]; transitions: TransitionProps[] }>({
    nodes: null,
    transitions: null,
  }); // 流程图数据
  const { t } = useI18n();
  const [formData, setFormData] = useState<WorkflowProps>(); // 流程表单数据
  const paletteRef = useRef(null);
  const [canDraft, setCanDraft] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [statusList, statusLoading, getStatusList] = useWorkflowState();
  const [initialNodes, setInitialNodes] = useState<string[]>([]);
  const [draggedStatus, setDraggedStatus] = useState<string[]>([]);
  const [newDragStatus, setNewDragStatus] = useState<string[]>([]); // 当前操作新拖拽进来的状态节点数组，用于删除的判断

  const pageTitle = useMemo(
    () => (
      <span>
        {!id ? t('pages.workflow.default.pageTitle') : ''}
        <span className={cx('edit-title')} onClick={() => setModalVisible(true)}>
          {formData?.name}
          <EditOutlined />
        </span>
      </span>
    ),
    [id, formData?.name, t],
  );

  // useEffect(() => {
  //   const getWorkflow = async workflowId => {
  //     const workflowObject = await new Parse.Query(WorkflowObject).equalTo('objectId', workflowId).first();
  //     if (workflowObject) {
  //       const nodes = workflowObject.get('nodes') || [];
  //       const transitions = workflowObject.get('transitions') || [];
  //       const name = workflowObject.get('name');
  //       const description = workflowObject.get('description');
  //       const usageScheme = workflowObject.get('usageScheme');
  //       setCanDraft(!usageScheme?.length);
  //       setDraggedStatus(nodes.map(node => node.statusId));
  //       setFlowData({ nodes, transitions });
  //       setInitialNodes(nodes.filter(node => node.statusId !== StartNodeItem.statusId).map(node => node.statusId));
  //       setFormData({ objectId: workflowObject.id, name, description });
  //     }
  //   };
  //   if (id) {
  //     getWorkflow(id);
  //   }
  // }, [id]);

  // 判断当前状态是否有在事项中应用
  // const checkUsedStatus = useCallback(
  //   async (statusId: string): Promise<boolean> => {
  //     if (newDragStatus.includes(statusId)) return true;
  //     // 1、首先判断当前工作流是否存在被使用的流程方案中
  //     // 2、根据流程方案判断流程查找被应用工作流
  //     const configs = await new Parse.Query(WorkflowSchemeConfigObject)
  //       .equalTo('workflow', id)
  //       .include(['workflowScheme'])
  //       .find();
  //     if (!configs?.length) {
  //       // 如果不存在当前工作流方案，则返回可以应用
  //       return true;
  //     }
  //     const workflowObjects = configs.map(item => item.get('workflowScheme')).filter(item => !!item);
  //     // 获取工作流方案关联的空间
  //     const relativeWorkspaces = await new Parse.Query(WorkspaceObject)
  //       .containedIn('workflowScheme', workflowObjects)
  //       .find();
  //     const schemes = {};
  //     // 遍历工作流方案配置，根据方案配置内容组成查询事项语句
  //     for (const config of configs) {
  //       const schemeId = config.get('workflowScheme')?.id;
  //       const workspaceKeys = relativeWorkspaces
  //         .filter(item => item.get('workflowScheme')?.id === schemeId)
  //         .map(item => item.id);
  //       const itemType = config.get('itemType')?.id;
  //       // 如果当前工作流方案配置中的工作流方案没有绑定空间，则没有使用的事项
  //       if (!workspaceKeys?.length) continue;
  //       // 这里按方案做分组，避免同一个方案造成多次查询
  //       if (!schemes[schemeId]) {
  //         schemes[schemeId] = {
  //           query: new Parse.Query(ItemObject).equalTo('status', statusId).containedIn('workspace', workspaceKeys),
  //           workspaceKeys,
  //           itemTypes: [itemType],
  //         };
  //       } else {
  //         schemes[schemeId].itemTypes.push(itemType);
  //       }
  //     }
  //     // 这里同一个方案会对应多个空间和多个事项，这里组织起来做一次查询
  //     // 先过滤掉有空能为空的类型和方案
  //     // TODO 如果是所有问题方案，这个需要重新确定需求
  //     const querys = Object.keys(schemes)
  //       .map(key => {
  //         const itemTypeValue = schemes[key].itemTypes.filter(Boolean);
  //         if (!itemTypeValue.length) return null;
  //         return schemes[key].query.containedIn('itemType', itemTypeValue);
  //       })
  //       .filter(Boolean);
  //     if (!querys.length) return true;

  //     // 查询事项，多个查询合并查询
  //     let itemCount = 0;
  //     if (querys.length > 1) {
  //       itemCount = await Parse.Query.or(...querys).count();
  //     } else {
  //       const [query] = querys;
  //       itemCount = await query.count();
  //     }
  //     return itemCount <= 0;
  //   },
  //   [id, newDragStatus],
  // );

  // const save = useCallback(
  //   async isDraft => {
  //     if (!formData || !formData.name) {
  //       message.error(t('pages.workflow.message.name'));
  //       return;
  //     }
  //     const { nodes = [], transitions = [] } = paletteRef?.current?.getData();

  //     // 判断是否有未命名的连接线
  //     for (let i = 0; i < transitions.length; i++) {
  //       if (!transitions[i]?.name) {
  //         message.error(t('pages.workflow.message.namedLineNamed'));
  //         return;
  //       }
  //     }
  //     // 筛选是否是任意流转的状态
  //     const anyNodes = nodes.filter(node => node.parameters?.isAny);

  //     // 判断同一个状态是否有同名的动作
  //     for (let i = 0; i < nodes.length; i++) {
  //       const sourceTransitions = transitions.filter(t => t.sourceId === nodes[i].id);
  //       const textSet = new Set(sourceTransitions.map(t => t.name));
  //       if (sourceTransitions && sourceTransitions.length > textSet.size) {
  //         message.error(t('pages.workflow.message.sameStatus'));
  //         return;
  //       }
  //       const anyNodesName = anyNodes.map(node => node.name);
  //       if (anyNodesName.some(item => textSet.has(item))) {
  //         message.error(t('pages.workflow.message.anyStatus'));
  //         return;
  //       }
  //     }
  //     // 判断开始节点是否有连接线
  //     const starTransition = transitions.find(t => t.sourceId === StartNodeItem.id);
  //     if (!starTransition) {
  //       message.error(t('pages.workflow.message.needNode'));
  //       return;
  //     }

  //     const startNode = nodes.find(node => node.id === starTransition.targetId);

  //     const data = {
  //       name: formData.name,
  //       description: formData.description,
  //       nodes,
  //       transitions,
  //       step: transitions.length,
  //       initial: StatusObject.createWithoutData(startNode?.statusId),
  //       releaseStatus: !isDraft,
  //     };
  //     try {
  //       if (id) {
  //         if (isDraft) {
  //           // 如果是保存为草稿，需要判断当前工作流是否被方案引用，如果已引用就无法
  //           const useCount = await new Parse.Query(WorkflowSchemeConfigObject).equalTo('workflow', id).count();
  //           if (useCount > 0) {
  //             message.warn(t('pages.workflow.message.noDraft'));
  //             return;
  //           }
  //           const projectObject = WorkflowObject.createWithoutData(id);
  //           await projectObject.save(data, {
  //             context: {
  //               // workflow 国际化新增字段
  //               untranslatedName: formData.name,
  //               untranslatedDescription: formData.description,
  //             },
  //           });
  //         } else {
  //           // 添加删除后保存的状态校验
  //           const nodeIds = nodes.map(node => node.statusId);
  //           const deleteNodes = initialNodes.filter(sId => !nodeIds.includes(sId));
  //           if (deleteNodes.length) {
  //             const canDeletes = await Promise.all(deleteNodes.map(sId => checkUsedStatus(sId)));
  //             const canDelete = canDeletes.every(c => c);
  //             if (!canDelete) {
  //               message.warn(t('pages.workflow.message.noDelete'));
  //               return;
  //             }
  //           }
  //           const projectObject = WorkflowObject.createWithoutData(id);
  //           await projectObject.save(data);
  //         }
  //       } else {
  //         const projectObject = new WorkflowObject(data);
  //         await projectObject.save();
  //       }
  //       message.success(t('global.saveSuccess'));
  //       // routerPush(parentUrl);
  //       routerBack();
  //     } catch (error) {
  //       if (error.code === UNIQUE_CODE) {
  //         message.error(t('pages.workflow.message.error'));
  //         return;
  //       }
  //       message.error(error.message || t('pages.workflow.message.fetchFail'));
  //     }
  //   },
  //   [formData, id, routerBack, initialNodes, checkUsedStatus, t],
  // );

  // const updateNode = useCallback(
  //   (node, updateForceNode) => {
  //     if (!node) node = {};

  //     //如果强制更新节点
  //     if (updateForceNode) {
  //       setCurrentNode(node);
  //       return;
  //     }
  //     // 之前也没选择节点
  //     if ((!node.id && !currentNode.id) || node.id === currentNode.id) return;
  //     setCurrentNode(node);
  //   },
  //   [currentNode],
  // );

  // const updateNodeProperties = useCallback((id, type, data) => {
  //   paletteRef?.current?.updateNodeProperties(id, type, data);
  // }, []);
  // const updateNodeApproval = useCallback(
  //   (list, type, item, id) => {
  //     if (list?.length) {
  //       const index = list.findIndex(v => v.value === id);
  //       if (index > -1) {
  //         list.splice(index, 1);
  //         updateNodeProperties(id, type, { approval: item.approved });
  //       }
  //     }
  //   },
  //   [updateNodeProperties],
  // );
  // const deleteTransition = useCallback(
  //   (ids: string[], type, nodes) => {
  //     // 判断通过后 可以删除 遍历节点的连接线 并且保存
  //     for (let m = 0; m < ids.length; m++) {
  //       const id = ids[m];
  //       nodes.forEach(item => {
  //         const transition = item.approval?.transition;
  //         updateNodeApproval(transition?.approved, type, item, id);
  //         updateNodeApproval(transition?.rejected, type, item, id);
  //       });
  //     }
  //   },
  //   [updateNodeApproval],
  // );

  // const deleteNode = useCallback(
  //   (id, type, parameters, statusId) => {
  //     const updateNodeApprovalTransition = () => {
  //       const { nodes = [], transitions = [] } = paletteRef?.current?.getData() || {}; //获取最新的nodes transitions
  //       const deleteTransitionIds: string[] = [];
  //       //删除节点status 先找出连接到这个node的所有连接线 进行连接线删除的判断
  //       if (type === ElementType.status) {
  //         //连接线在transitions可以获得
  //         transitions.forEach(v => {
  //           if (v.target?.id === id) {
  //             deleteTransitionIds.push(v.id);
  //           }
  //         });
  //       } else if (type === ElementType.transition) {
  //         //删除连接线 直接删除
  //         deleteTransitionIds.push(id);
  //       }
  //       // 删除任意节点 此时transition不能及时获取需要手动预生成
  //       if (type === ElementType.status && parameters.isAny) {
  //         nodes.forEach(v => {
  //           deleteTransitionIds.push(`conn_${v.statusId}_${statusId}`); //与后台生成transition的id保持一致  id: `conn_${node.statusId}_${anyNode.statusId}`
  //         });
  //       }
  //       deleteTransition(deleteTransitionIds, type, nodes);
  //     };
  //     paletteRef?.current?.deleteNode(id, type, updateNodeApprovalTransition);
  //   },
  //   [paletteRef, deleteTransition],
  // );

  // const handleSubmit = useCallback(values => {
  //   setFormData(values);
  //   setModalVisible(false);
  // }, []);

  // const users = useMemo(
  //   () => currentNode?.parameters?.users?.map(item => item.key) || [],
  //   [currentNode?.parameters?.users],
  // );
  // const roles = useMemo(
  //   () => currentNode?.parameters?.roles?.map(item => item.key) || [],
  //   [currentNode?.parameters?.roles],
  // );

  return (
    <>
      <div className={cx('workflow-wrapper')}>
        <PageHeader
          className={cx('workflow-header')}
          ghost={false}
          onBack={() => routerBack()}
          title={pageTitle}
          extra={[
            <Button key="saveDraft" disabled={!canDraft} onClick={() => save(IS_DRAFT)}>
              {t('pages.workflow.default.saveDraft')}
            </Button>,
            <Button key="save" type="primary" onClick={() => save(!IS_DRAFT)}>
              {t('pages.workflow.default.savePublish')}
            </Button>,
          ]}
        />
        <div className={cx('workflow-container')}>
          <DndProvider backend={HTML5Backend}>
            <StatusPanel
              list={statusList}
              loading={statusLoading}
              getList={getStatusList}
              draggedStatus={draggedStatus}
            />
            {/* {flowData.nodes && (
              <Palette
                ref={paletteRef}
                initialData={cloneDeep(flowData)}
                updateNode={updateNode}
                updateDraggedStatus={setDraggedStatus}
                updateNewDragStatus={setNewDragStatus}
                checkUsedStatus={checkUsedStatus}
              />
            )} */}
            {/* <PropertiesPanel
              users={users}
              roles={roles}
              node={currentNode}
              deleteNode={deleteNode}
              updateNodeProperties={updateNodeProperties}
              paletteRef={paletteRef}
            /> */}
          </DndProvider>
        </div>
      </div>
    </>
  );
};

export default Editor;
