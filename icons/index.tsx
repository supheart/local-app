import { CSSProperties, SVGProps } from 'react';
import Icon, { createFromIconfontCN } from '@ant-design/icons';
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon'

import { patchIconUrl } from 'lib/path';

import style from './index.less';

interface IconPropsProperty extends CustomIconComponentProps {
  className: string;
  style: CSSProperties;
  type: string;
  props: any;
  key: string;
  [key: string]: any;
}

export type IconProps = Partial<IconPropsProperty> | SVGProps<SVGSVGElement>;

const IconFont = createFromIconfontCN({
  scriptUrl: [patchIconUrl('/icons/iconfont.js')],
});

export const CustomIconFont: React.FC<IconProps> = props => {
  const { type, ...restProps } = props;
  return <IconFont {...restProps} type={`icon-${type}`} />;
};

export { IconFont };

export const UserIcon: React.FC<IconProps> = props => <CustomIconFont {...props} type="User2" />;
export const RightArrow: React.FC<IconProps> = props => <CustomIconFont {...props} type="right" />;
export const ToggleLeft: React.FC<IconProps> = props => (
  <CustomIconFont {...props} className={style('rotate-180', props.className)} type="ToggleRight" />
);

export default Icon;
