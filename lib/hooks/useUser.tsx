import { i18n } from 'lib/i18n';
import { User as UserType } from 'lib/types/models';


/** 用户被删除 */
export const isUserDeleted = (user: Partial<UserType>): boolean => user?.deleted === true;
/** 用户被禁用 */
export const isUserDisabled = (user: UserType): boolean => user?.enabled === false;

export const generateUserDisplayName = (user: UserType, onlyNickname = false): string => {
  const getDisplaySuffix = () => {
    if (isUserDeleted(user)) {
      return i18n.t('pages.users.default.delete');
    } else if (isUserDisabled(user)) {
      return i18n.t('pages.users.default.forbidden');
    } else if (!onlyNickname && user?.nickname) {
      return `(${user?.username})`;
    }
    return '';
  };

  const displaySuffix = getDisplaySuffix();
  if (onlyNickname) return `${user?.nickname || user?.username}${displaySuffix}`;
  return user?.nickname ? `${user?.nickname}${displaySuffix}` : user?.username;
};