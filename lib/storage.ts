import { isServer } from './env';

export const getLocalStorageItem = (key: string, defaults: any = ''): any => {
  if (isServer()) {
    console.warn('in node');
    return defaults;
  }
  let item;
  try {
    item = localStorage.getItem(key);
    return (item && JSON.parse(item)) || defaults;
  } catch (e) {
    return item ?? defaults;
  }
};

export const setLocalStorageItem = (key: string, value: unknown): boolean => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    }
    return false;
  } catch (e) {
    console.error(e);
    return false;
  }
};

const getStorageKeys = () => {
  if (isServer()) {
    return [];
  }
  return Object.keys(localStorage);
};

export const removeParseItems = (): void => {
  try {
    const keys = getStorageKeys();
    const parseKeys = keys.filter(fieldKey => fieldKey.startsWith('Parse/') && fieldKey.endsWith('/currentUser'));
    parseKeys.forEach(paresKey => {
      localStorage.removeItem(paresKey);
    });
  } catch (error) {
    console.error('removeParseItems', error);
  }
};

export default {
  getItem: getLocalStorageItem,
  setItem: setLocalStorageItem,
  removeParseItems,
};
