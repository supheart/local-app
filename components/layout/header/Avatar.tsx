import { useRouter } from 'next/router';
import { Dropdown, Menu } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';
import {
  AppstoreAddOutlined,
  CaretDownOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  LogoutOutlined,
  SettingOutlined,
  // UserOutlined,
} from '@ant-design/icons';
import { useI18n, useToken } from 'lib/hooks';
import UserField from 'components/common/user-field/UserField';
import type { ItemType } from 'antd/lib/menu/hooks/useItems';

const Avatar: React.FC = () => {
  const { t } = useI18n();
  const { tenant } = useToken();
  const router = useRouter();
  // const userModalActionRef = React.useRef<ActionRef>();
  // const resetModalRef = React.useRef<ModalRef>();
  // const { isAdmin } = useCurrentUser();
  const isAdmin = true;
  // const { data: user, mutate: mutateUser } = useUser({ redirectTo: '/login' });
  const user = { username: 'milo', emailVerified: true, deleted: false, enabled: true, isSystem: false };

  const onMenuClick = ({ key }: MenuInfo): void => {
    switch(key) {
      case 'logout':
        // await Parse.User.logOut();
        // mutateUser();
        // window.location.href = patchIconUrl('/login');
        break;
      case 'settings':
        router.push(`/${tenant}/settings/item-types`);
        break;
      case 'apps':
        router.push(`/${tenant}/application/market`);
        break;
      case 'version':
        router.push(`/version`);
        break;
      case 'user':
        // userModalActionRef.current.openModal();
        break;
      case 'download':
        // router.push(`/${tenant}/async-download`);
        break;
      case 'reset':
        // resetModalRef.current.openModal();
        break;
      default:
        break;
    }
  }
  const menus: ItemType[] = [
    { label: t('layout.header.apps'), icon: <AppstoreAddOutlined />, key: 'apps' },
    isAdmin ? { label: t('layout.header.settings'), icon: <SettingOutlined />, key: 'settings' } : null,
    { label: t('layout.header.version'), icon: <ClockCircleOutlined />, key: 'version' },
    { label: t('layout.header.user'), icon: <ClockCircleOutlined />, key: 'user' },
    { label: t('layout.header.reset'), icon: <ClockCircleOutlined />, key: 'reset' },
    { type: 'divider' },
    { label: t('layout.header.logout'), icon: <LogoutOutlined />, key: 'logout' },
  ];
  const menuDropdownContent = <Menu
    // mode="inline"
    // openKeys={openKeys}
    // onOpenChange={onOpenChange}
    // style={{ width: 256 }}
    items={menus}
  />;

  return <>
    <Dropdown overlay={menuDropdownContent}>
      <span className="avatar">
        <UserField user={user} hiddenTooltip />
        <CaretDownOutlined className="down-icon" />
      </span>
    </Dropdown>
  </>;
}

export default Avatar;
