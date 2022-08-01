import useSide from 'lib/hooks/useSide';

import { AppLayoutProps } from './AppLayout';
import ContentLayout from './ContentLayout';
import SidebarContent from './SidebarContent';

import style from './SideLayout.less';

interface SideLayoutProps extends AppLayoutProps {
  sideContent: JSX.Element;
  wrapperClassName?: string;
  sideClassName?: string;
  contentClassName?: string;
  contentElementId: string;
  hiddenSide?: boolean;
}

const SideLayout: React.FC<React.PropsWithChildren<SideLayoutProps>> = ({
  title,
  noPadding,
  className,
  sideClassName,
  contentClassName,
  wrapperClassName,
  workspaceId,
  sideContent,
  hiddenSide,
  // workspace.layout.content
  contentElementId,
  children,
}) => {
  const { hidden } = useSide();

  return (
    <ContentLayout title={title} noPadding={noPadding} className={className} workspaceId={workspaceId}>
      <div className={style('layout-wrapper', wrapperClassName)}>
        {hidden || hiddenSide ? null : <SidebarContent className={sideClassName}>{sideContent}</SidebarContent>}
        <div data-element-id={contentElementId} className={style('layout-content', contentClassName)}>
          1111
          {children}
        </div>
      </div>
    </ContentLayout>
  );
};

export default SideLayout;
