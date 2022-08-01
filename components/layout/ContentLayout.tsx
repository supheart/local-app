import React, { useCallback, useContext, useEffect, useState } from 'react';
// import { useServerSDK } from '@projectproxima/plugin-sdk';
// import { useListener } from '@projectproxima/proxima-sdk-js';

// import { ItemPreorderContext } from 'components/data-source/context';
// import AddItemLevelModal from 'components/fields/item-level/AddItemLevelModal';
// import { AddLinkModal } from 'components/fields/link';
// import { CloneItemModal, CreateOrUpdateItemModal, ViewItemDetailModal } from 'components/item';
// import { MoveItemToItemGroupModal } from 'components/item-group';
import { AppLayout, AppLayoutProps } from 'components/layout';
// import SelectWorkspaceModal from 'components/workspace/SelectWorkspaceModal';
import { MAX_MODAL_WIDTH } from 'global';
// import { Item } from 'lib/types/models';

interface BaseModalProps {
  visible: boolean;
  itemId: string;
}

interface ItemLevelModalProps extends BaseModalProps {
  isParentMode: boolean;
  workspaceId: string;
}

interface TransitionStatusScreen extends BaseModalProps {
  screenId: string;
  transition: string;
  onOk: (itemData?: any) => void;
}

const ContentLayout: React.FC<React.PropsWithChildren<AppLayoutProps>> = ({ workspaceId, children, ...props }) => {
  // const serverSDK = useServerSDK();
  // const { setItemPreorderList, setPreviousItemId } = useContext(ItemPreorderContext);
  // 状态流流转事项对话框
  const [transitionStatusModal, setTransitionStatusModal] = useState(false);
  const [updateScreenId, setUpdateScreenId] = useState<TransitionStatusScreen['screenId']>('');
  const [updateTransitionText, setUpdateTransitionText] = useState<TransitionStatusScreen['transition']>('');
  // 复制事项对话框
  const [cloneItemModal, setCloneItemModal] = useState<BaseModalProps>({
    visible: false,
    itemId: '',
  });
  // 事项迁移对话框
  const [moveWorkspaceModal, setMoveWorkspaceModal] = useState({
    visible: false,
    itemId: '',
    workspaceId: '',
  });
  // 编辑事项对话框
  const [visibleEditModal, setVisibleEditModal] = useState(false);
  // 修改事项层级对话框
  const [levelModal, setLevelModal] = useState<ItemLevelModalProps>({
    visible: false,
    itemId: '',
    workspaceId: '',
    isParentMode: true,
  });
  // 查看事项抽屉
  const [visibleViewModal, setVisibleViewModal] = useState(false);
  // 事项选中
  const [selectedItemId, setSelectedItemId] = useState(undefined);
  // 移动到事项组弹窗
  const [visibleMoveToItemGroupModal, setVisibleMoveToItemGroupModal] = useState(false);
  // 添加关联弹窗
  const [visibleAddLinkModal, setVisibleAddLinkModal] = useState(false);
  const [addLinkLoading, setAddLinkLoading] = useState(false);
  // const [rowData, setRowData] = useState<Item>();
  // const [workspaceId, setWorkspaceId] = useState('');

  // const openItemEditScreen = useCallback(itemId => {
  //   setSelectedItemId(itemId);
  //   setVisibleEditModal(true);
  // }, []);
  // const openCloneItemScreen = useCallback(itemId => {
  //   setCloneItemModal({ visible: true, itemId });
  // }, []);
  // const openMoveItemToWorkspace = useCallback(({ workspaceId, itemId }) => {
  //   setMoveWorkspaceModal({ visible: true, itemId, workspaceId });
  // }, []);
  // const openItemViewScreen = useCallback(itemId => {
  //   setSelectedItemId(itemId);
  //   setVisibleViewModal(true);
  // }, []);
  // const closeItemViewScreen = useCallback(() => {
  //   setVisibleViewModal(false);
  // }, []);
  // const openMoveToItemGroupScreen = useCallback(({ itemId, rowData, workspaceId }) => {
  //   if (workspaceId) {
  //     setWorkspaceId(workspaceId);
  //   }
  //   setSelectedItemId(itemId);
  //   setRowData(rowData);
  //   setVisibleMoveToItemGroupModal(true);
  // }, []);
  // const openAddLinkScreen = useCallback(itemId => {
  //   setSelectedItemId(itemId);
  //   setVisibleAddLinkModal(true);
  // }, []);
  // const openUpdateAncestorScreen = useCallback((data: ItemLevelModalProps) => {
  //   setLevelModal({ ...data, visible: true });
  // }, []);
  // const openTransitionStatusScreen = useCallback((data: TransitionStatusScreen) => {
  //   setUpdateTransitionText(data.transition);
  //   setUpdateScreenId(data.screenId);
  //   setSelectedItemId(data.itemId);
  //   setTransitionStatusModal(true);
  // }, []);

  // useEffect(() => {
  //   serverSDK.onAction = (message, callbacks) => {
  //     const { action, param } = message.payload;
  //     switch (action) {
  //       case 'openIssuePanel':
  //         setSelectedItemId(param.issue);
  //         setVisibleViewModal(true);
  //         callbacks.resolve();
  //         break;
  //     }
  //   };
  // }, [serverSDK]);

  // useListener('openItemEditScreen', openItemEditScreen);
  // useListener('openCloneItemScreen', openCloneItemScreen);
  // useListener('openItemViewScreen', openItemViewScreen);
  // useListener('closeItemViewScreen', closeItemViewScreen);
  // useListener('openMoveToItemGroupScreen', openMoveToItemGroupScreen);
  // useListener('openAddLinkScreen', openAddLinkScreen);
  // useListener('openUpdateAncestorScreen', openUpdateAncestorScreen);
  // useListener('openTransitionStatusScreen', openTransitionStatusScreen);
  // useListener('openMoveItemToWorkspace', openMoveItemToWorkspace);

  return (
    <AppLayout {...props} workspaceId={workspaceId}>
      {children}
      {/* {visibleEditModal && (
        <CreateOrUpdateItemModal onCancel={() => setVisibleEditModal(false)} mode="edit" itemId={selectedItemId} />
      )} */}
      {/* {transitionStatusModal && (
        <CreateOrUpdateItemModal
          itemId={selectedItemId}
          screenId={updateScreenId}
          mode="edit"
          transition={updateTransitionText}
          onCancel={() => {
            setUpdateTransitionText('');
            setUpdateScreenId('');
            setTransitionStatusModal(false);
          }}
        />
      )} */}
      {/* {cloneItemModal.visible && (
        <CloneItemModal {...cloneItemModal} onCancel={() => setCloneItemModal({ ...cloneItemModal, visible: false })} />
      )}
      {moveWorkspaceModal.visible && (
        <SelectWorkspaceModal
          workspaceId={workspaceObjectId}
          {...moveWorkspaceModal}
          onCancel={() => {
            setMoveWorkspaceModal({ ...moveWorkspaceModal, visible: false });
          }}
        />
      )}
      {visibleViewModal && (
        <ViewItemDetailModal
          itemId={selectedItemId}
          onClose={() => {
            setVisibleViewModal(false);
            setPreviousItemId('');
            setItemPreorderList([]);
          }}
        />
      )}
      {visibleAddLinkModal && (
        <AddLinkModal
          width={MAX_MODAL_WIDTH}
          loading={addLinkLoading}
          visible={visibleAddLinkModal}
          itemObjectId={selectedItemId}
          setLoading={setAddLinkLoading}
          workspaceId={workspaceObjectId}
          setModalVisible={setVisibleAddLinkModal}
          onCancel={() => {
            setAddLinkLoading(false);
            setVisibleAddLinkModal(false);
          }}
        />
      )}
      <MoveItemToItemGroupModal
        workspaceId={workspaceObjectId || workspaceId}
        visible={visibleMoveToItemGroupModal}
        itemId={selectedItemId}
        rowData={rowData}
        onCancel={() => {
          setVisibleMoveToItemGroupModal(false);
        }}
      />
      {levelModal.visible && (
        <AddItemLevelModal
          {...levelModal}
          onCancel={() => {
            setLevelModal({ ...levelModal, visible: false });
          }}
        />
      )} */}
    </AppLayout>
  );
};

export default ContentLayout;
