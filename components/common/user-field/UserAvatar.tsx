import { useMemo } from 'react';

import { getBackgroundColor, getNameBadge } from '../utils';

import cx from './UserAvatar.less';

interface UserAvatarProps {
  className: string;
  user: {
    avatar?: {
      url?: string;
    };
    username?: string;
    name?: string;
  };
}

const UserAvatar: React.VFC<UserAvatarProps> = ({ user, className }) => {
  const avatarUrl = useMemo(() => user?.avatar?.url, [user]);
  const displayName = useMemo(() => user?.name || user?.username, [user]);
  const userBadge = useMemo(() => getNameBadge(displayName), [displayName]);
  return (
    <>
      {avatarUrl ? (
        <span className={cx('avatar-item', 'avatar', className)} style={{ backgroundImage: `url(${avatarUrl})` }} />
      ) : (
        <span className={cx('avatar-item', 'default-avatar', className)} style={getBackgroundColor(userBadge)}>
          {userBadge}
        </span>
      )}
    </>
  );
};

export default UserAvatar;
