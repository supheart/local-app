import { useCallback, useState } from 'react';

// import { useInitialRecoilState } from 'lib/useInitialRecoilState';

import HorizontalMenuLayout from './HorizontalMenuLayout';
import { ObjectId } from 'lib/types/models';

export interface AppLayoutProps {
  title?: string;
  className?: string;
  noPadding?: boolean; //不留padding，页面自己控制
  noPaddingBottom?: boolean;
  workspaceId?: ObjectId;
}

// 应用布局，后续做成切换布局的能力
const AppLayout: React.FC<React.PropsWithChildren<AppLayoutProps>> = ({ workspaceId, ...props }) => {
  // useInitialRecoilState();
  // // 新建事项对话框
  // const [visibleCreateModal, setVisibleCreateModal] = useState(false);
  // // 创建子事项需要的数据参数
  // const [childCardDeps, setChildCardDeps] = useState<ChildCardDepsProps>();
  // // 事件传递数据，区分事项创建编辑弹窗的事件来源
  // const [eventExtraData, setEventExtraData] = useState();
  // // 额外字段配置，用于部分插件中需要修改固定字段配置
  // const [extraFieldsData, setExtraFieldsData] = useState();
  // // 创建面板初始化数据
  // const [initItemData, setInitItemData] = useState();
  // // 关联方事项
  // const [inwardItem, setInwardItem] = useState();
  // // 是否关联事项
  // const [addLink, setAddLink] = useState(false);
  // // 通过脚本创建事项
  // const [createItemByScript, setCreateItemByScript] = useState(false);
  // const closeItemCreateScreen = useCallback(() => {
  //   setVisibleCreateModal(false);
  // }, []);
  // const [workspaceId, setWorkspaceId] = useState('');

  // const openItemCreateScreen = useCallback((props = {}) => {
  //   const {
  //     childCardDeps,
  //     initItemData,
  //     extraData,
  //     extraFieldsData,
  //     createItemByScript,
  //     inwardItem,
  //     addLink = false,
  //     workspaceId,
  //   } = props;
  //   if (workspaceId) {
  //     setWorkspaceId(workspaceId);
  //   }
  //   setCreateItemByScript(createItemByScript);
  //   setExtraFieldsData(extraFieldsData);
  //   setEventExtraData(extraData);
  //   setInitItemData(initItemData);
  //   setChildCardDeps(childCardDeps);
  //   setInwardItem(inwardItem);
  //   setAddLink(addLink);
  //   const currentVal = store.get(ExtensionValType.CREATE_OR_UPDATE_ITEM);
  //   store.set(ExtensionValType.CREATE_OR_UPDATE_ITEM, {
  //     ...currentVal,
  //     extraData,
  //   });
  //   setVisibleCreateModal(true);
  // }, []);

  // useListener('openItemCreateScreen', openItemCreateScreen);

  return (
    <>
      <HorizontalMenuLayout {...props} />
      {/* {visibleCreateModal && (
        <CreateOrUpdateItemModal
          createItemByScript={createItemByScript}
          eventExtraData={eventExtraData}
          initItemData={initItemData}
          onCancel={() => closeItemCreateScreen()}
          workspaceId={workspaceObjectId || workspaceId}
          mode="create"
          childCardDeps={childCardDeps}
          extraFieldsData={extraFieldsData}
          addLink={addLink}
          inwardItem={inwardItem}
        />
      )} */}
    </>
  );
};

export default AppLayout;
