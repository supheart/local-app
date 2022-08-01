import React, { FC, useMemo } from 'react';
import { Menu, MenuProps } from 'antd';
// import { useRouter } from 'next/router';

// import { useToken } from 'lib/hooks';
// import { getTranslateDisplay } from 'lib/locales';
// import useMenu from 'lib/useMenu';
// import { i18n } from 'lib/i18n';

// 应用菜单组件
const AppMenu: FC<MenuProps> = ({ theme = 'light', mode = 'horizontal' }) => {
  // const router = useRouter();
  // const { tenant } = useToken();
  // const pathname = useMemo(() => {
  //   // 插件路由匹配 key 值，菜单高亮
  //   if (router.pathname === '/[tenant]/plugin/[plugin]') {
  //     return router?.query?.plugin as string;
  //   }
  //   return router.pathname;
  // }, [router]);

  // menu hierarchy
  // const { menu, openKey } = useMenu(pathname);
  // const onSelect = ({ key }) => {
  //   const currentMenu = menu.find(menuItem => menuItem.key === key);
  //   let url = '';
  //   if (currentMenu?.isPlugin) {
  //     // 如果是插件，key值为插件唯一key
  //     url = `/${tenant}/plugin/${key}`;
  //   } else {
  //     url = key.replace('[tenant]', tenant);
  //   }
  //   router.push(url);
  // };

  //
  // 受管openKeys方式，菜单会有展开动画
  //
  // const [openKeys, setOpenKeys] = useState([openKey]);
  // const onOpenChange = keys => setOpenKeys(keys)
  // useEffect(() => {
  //   setOpenKeys([openKey]);
  // }, [openKey]);

  // Menu的defaultOpenKeys属性值二次变更是无法触发菜单打开的
  return <div />;
  // 因此若菜单数据未ready，先不然渲染Menu
  // if (menu.length === 0) return <div />; // TODO: not needed anymore

  // return (
  //   <Menu
  //     theme={theme}
  //     mode={mode}
  //     defaultOpenKeys={[openKey]}
  //     // openKeys={openKeys} onOpenChange={onOpenChange}
  //     onSelect={onSelect}
  //     defaultSelectedKeys={[pathname]}
  //   >
  //     {menu.map(d => {
  //       if (d.children.length === 0) {
  //         return (
  //           <Menu.Item key={d.key} disabled={d.disabled}>
  //             {getTranslateDisplay(d, 'name')}
  //           </Menu.Item>
  //         );
  //       } else {
  //         return (
  //           <Menu.SubMenu key={d.key} disabled={d.disabled} title={d.name}>
  //             {d.children.map(d => {
  //               return (
  //                 <Menu.Item key={d.key} disabled={d.disabled}>
  //                   {getTranslateDisplay(d, 'name')}
  //                 </Menu.Item>
  //               );
  //             })}
  //           </Menu.SubMenu>
  //         );
  //       }
  //     })}
  //   </Menu>
  // );
};

export default AppMenu;
