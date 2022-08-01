import { useCallback, useMemo } from 'react';
// import { ProjectSettingIcon } from 'icons';
import { useRouter } from 'next/router';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Space, Button } from 'antd';

import { SideLayout } from 'components/layout';
// import { PLUGIN_MODULE_KEY } from 'lib/global';
import { useToken } from 'lib/hooks';
import { ObjectId, Workspace } from 'lib/types/models';
// import { usePluginManifest } from 'lib/usePluginManifest';

import style from './WorkspaceLayout.less';

interface WorkspaceLayoutProps {
  workspace?: Workspace;
  boardId?: ObjectId;
  redirect?: boolean;
  contentClassName?: string;
}

const WorkspaceLayout: React.FC<React.PropsWithChildren<WorkspaceLayoutProps>> = ({
  workspace,
  boardId,
  children,
  redirect,
  contentClassName,
}) => {
  const router = useRouter();
  const { tenant } = useToken();

  const name = useMemo(() => {
    return workspace?.name;
  }, [workspace]);

  // 跳转空间设置页面
  const handleGoToSetting = useCallback(() => {
    router.push(`/${tenant}/workspaces/${router.query.workspace}/settings/auth`);
  }, [router, tenant]);

  // TODO：插件處理
  // usePluginManifest({ module: PLUGIN_MODULE_KEY.All });

  const sideContent = useMemo(() => {
    return (
      <>
        {/* <BoardList workspace={workspace} boardId={boardId} redirect={redirect} /> */}
        {/* 底部的设置按钮 */}
        <div className={style('workspace-sidebar-setting')} onClick={handleGoToSetting}>
          {/* <ProjectSettingIcon className={cx('workspace-sidebar-setting-icon')} /> */}
          <div>空间设置</div>
        </div>
      </>
    );
  }, [workspace, boardId, redirect, handleGoToSetting]);

  console.log('render workspace layout');

  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
              1st menu item
            </a>
          ),
        },
        {
          key: '2',
          label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
              2nd menu item (disabled)
            </a>
          ),
          icon: <SmileOutlined />,
          disabled: true,
        },
        {
          key: '3',
          label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
              3rd menu item (disabled)
            </a>
          ),
          disabled: true,
        },
        {
          key: '4',
          danger: true,
          label: 'a danger item',
        },
      ]}
    />
  );

  return (
    <SideLayout
      title={name}
      noPadding
      workspaceId={workspace?.objectId}
      contentElementId="workspace.layout.content"
      wrapperClassName={style('workspace-wrapper')}
      contentClassName={style('workspace-content', contentClassName)}
      sideClassName={style('workspace-side')}
      sideContent={sideContent}
    >
      {children}
    </SideLayout>
  );
};

export default WorkspaceLayout;
