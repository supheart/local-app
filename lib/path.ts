import getConfig from 'next/config';
import { startsWith } from 'lodash/fp';

const removeExtraSlash = (paths: string): string => {
  if (!paths) return '';
  const isEndsWithSlash = paths.endsWith('/');
  const isStartsWithSlash = paths.startsWith('/');
  const result = paths.split('/').filter(Boolean).join('/');
  return `${isStartsWithSlash ? '/' : ''}${result}${isEndsWithSlash ? '/' : ''}`;
};

const mergePath = (path1: string, path2: string): string => {
  // 合并,去空
  const paths = [path1, path2].filter(Boolean).join('/');
  let result = '';
  try {
    const urlObj = new URL(paths);
    urlObj.pathname = removeExtraSlash(urlObj.pathname);
    result = urlObj.toString();
  } catch (error) {
    result = removeExtraSlash(paths);
  }
  return result;
};

// 获取基本路径
export const getBasePath = (): string => {
  const { publicRuntimeConfig } = getConfig() || {};
  const { basePath = '' } = publicRuntimeConfig || {};
  return basePath;
};

// 获取资源路径
export const getSourcePath = (path: string): string => {
  const basePath = getBasePath();
  return mergePath(basePath, path);
};

// 获取图片路径
export const patchIconUrl = (iconUrl: string): string => {
  const iconBasePath = '/icons';
  const startsWithIconPath = startsWith(iconBasePath);
  if (startsWithIconPath(iconUrl)) {
    return getSourcePath(iconUrl);
  }
  return iconUrl;
};