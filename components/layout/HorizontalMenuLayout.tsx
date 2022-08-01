import React, { useCallback } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Layout, Tooltip } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';

// import { getNewlyCreatedItem } from 'components/item/hooks';
import { useHeader, useI18n, useSide } from 'lib/hooks';
// import { useCurrentUser } from 'lib/useUser';

import Avatar from './header/Avatar';
import { AppLayoutProps } from './AppLayout';
import AppMenu from './AppMenu';

import style from './HorizontalMenuLayout.less';

const { Header, Content } = Layout;

/**
 * 横向菜单布局
 */
const HorizontalMenuLayout: React.FC<React.PropsWithChildren<AppLayoutProps>> = ({
  title = 'Local App',
  noPadding = false,
  noPaddingBottom = false,
  className,
  children,
}) => {
  const { t } = useI18n();
  const { hidden } = useHeader();
  const { hidden: sideHidden } = useSide();
  const layoutClassNames = style('horizontal-layout', { 'no-header': hidden, 'no-side': sideHidden }, className);
  const contentClassNames = style('site-layout', { 'no-padding': noPadding, 'no-padding-bottom': noPaddingBottom });
  // const { data: currentUser } = useCurrentUser();

  const router = useRouter();
  const {
    query: { workspace },
  } = router;

  // const proxima = createProximaSdk();

  const openItemCreateScreen = useCallback(async () => {
    // const itemValue = await getNewlyCreatedItem(currentUser, workspace as string);
    // proxima.execute('openItemCreateScreen', {
    //   initItemData: itemValue,
    // });
  // }, [proxima, currentUser, workspace]);
  }, []);

  console.log('render header');

  return (
    <Layout className={layoutClassNames}>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {hidden ? (
        <></>
      ) : (
        <Header className={style('header')}>
          <div className={style('logo')}>
            {/* <img src="/gitee-logo.svg" style={{ height: '40px', width: '40px' }} /> */}
            <span className="brand" />
            <span className={style('name')}>{title}</span>
          </div>
          {/* <div className={style('app-menu-container')}>
            <AppMenu />
          </div>
          <div>
            <Button type="primary" onClick={openItemCreateScreen}>
              {t('menus.create')}
            </Button>
          </div> */}
          <div style={{ flex: '1 1 0%' }} />
          <Tooltip title="帮助文档">
            <QuestionCircleOutlined style={{ display: 'none' }} />
          </Tooltip>
          <Avatar />
        </Header>
      )}
      <Content className={contentClassNames}>{children}</Content>
    </Layout>
  );
};

export default HorizontalMenuLayout;
