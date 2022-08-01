import { useMemo } from 'react';
import { Tooltip } from 'antd';
import { TooltipPlacement } from 'antd/es/tooltip';
import classnames from 'classnames';
import Icon, { UserIcon } from 'icons';

import useI18n from 'lib/hooks/useI18n';
// import { useRecoilUsers } from 'lib/hooks/useUsers';
import { User as UserType } from 'lib/types/models';
import { generateUserDisplayName, isUserDeleted, isUserDisabled } from 'lib/hooks/useUser';

import Avatar from './UserAvatar';

import style from './UserField.less';

const renderUserDisplayName = (user: UserType) => {
  return (
    <span className={classnames('username', { deleted: isUserDeleted(user), disabled: isUserDisabled(user) })}>
      {generateUserDisplayName(user, true)}
    </span>
  );
};

interface UserFieldProps {
  user: any;
  className?: string;
  onlyAvatar?: boolean;
  hiddenAvatar?: boolean;
  avatarClassName?: string;
  placement?: TooltipPlacement;
  fieldName?: string;
  systemUser?: boolean;
  EmptyIcon?: string;
  hiddenTooltip?: boolean;
}

const UserField: React.FC<UserFieldProps> = ({
  user,
  className,
  onlyAvatar,
  hiddenAvatar,
  avatarClassName,
  placement = 'topLeft',
  fieldName,
  systemUser = false,
  EmptyIcon,
  hiddenTooltip,
}) => {
  const { t } = useI18n();
  // 改用 useRecoilUsers 获取用户数据，避免用户数据获取不到
  // const memoizedUserIds = useMemo(() => {
  //   return user?.objectId && [user?.objectId];
  // }, [user]);
  // const { data: cacheUsers } = useRecoilUsers(memoizedUserIds);
  // const targeUser = useMemo(() => {
  //   return cacheUsers?.find(u => u.objectId === user?.objectId) ?? user;
  // }, [cacheUsers, user]);
  const targeUser: UserType = user;

  // 系统默认用户：一般用于系统操作用户展示
  const ADMIN_USER = {
    name: 'admin',
    username: t('global.system'),
    title: `${t('global.system')}(admin)`,
  };

  return user ? (
    systemUser ? (
      <Tooltip placement={placement} title={!hiddenTooltip && ADMIN_USER.title}>
        <span className={style('user-field', className, 'tooltip-overflow', 'tooltip-maxline-1')}>
          <Avatar user={ADMIN_USER} className={avatarClassName} />
          <span className={classnames('username')}>{ADMIN_USER.username}</span>
        </span>
      </Tooltip>
    ) : (
      <Tooltip
        placement={placement}
        title={!hiddenTooltip && (fieldName ? fieldName + '：' : '') + generateUserDisplayName(targeUser)}
      >
        <span className={style('user-field', className, 'tooltip-overflow', 'tooltip-maxline-1')}>
          {hiddenAvatar ? null : <Avatar user={targeUser} className={avatarClassName} />}
          {onlyAvatar ? null : renderUserDisplayName(targeUser)}
        </span>
      </Tooltip>
    )
  ) : (
    <div className={style('empty-user', className)}>
      <Icon className={style('user-icon', EmptyIcon)} component={UserIcon} />
      {onlyAvatar ? null : <span>{t('global.noData', { data: fieldName || '' })}</span>}
    </div>
  );
};

export default UserField;
