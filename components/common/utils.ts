
import cnchar from 'cnchar';
import { ZH_REG } from 'global';

export const isChinese = (text: string): boolean => ZH_REG.test(text);

// 英文用首字母，中文用末尾字
export const getNameBadge = (name: string): string | null => {
  if (!name?.trim?.()) return null;
  if (isChinese(name)) return name.slice(-1);
  return name.slice(0, 1);
};

// 获取随机的背景颜色
const randomBackgroundColor = ['#5EA1FF', '#4BCC87', '#FFD15E', '#FF945E', '#A994FF'];

export const getBackgroundColor = (s?: string): { background: string } => {
  const char: any = cnchar.spell(s || '').slice(0, 1);
  const code = char.charCodeAt() || 0;
  const random = Math.floor(code % randomBackgroundColor.length);
  return {
    background: randomBackgroundColor[random],
  };
};

