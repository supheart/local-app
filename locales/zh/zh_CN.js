import layout from './package/layout';
import workflow from './package/workflow';

// const global = {
//   api: {
//     put: '更新',
//     patch: '更新',
//     post: '创建',
//     delete: '删除',
//   },
//   update: '更新',
//   create: '创建',
//   cancel: '取消',
//   back: '返回',
//   complete: '完成',
//   success: '成功',
//   fail: '失败',
//   updatedAt: '更新于',
// };

// const date = {
//   dateTime: '日期时间',
//   date: '日',
//   week: '周',
//   month: '月',
//   year: '年',
//   format: {
//     week: 'YYYY 第wo',
//   },
// };

// const zhCN = {
//   index: {
//     hello: '你好, {{name}}。',
//     welcome: '欢迎来到',
//   },
//   locale: {
//     current: '当前语言: ',
//     zh: '中文',
//     'zh-CN': '中文',
//     'zh-HK': '中文',
//     'zh-TW': '中文',
//     en: '英文',
//     'en-US': '英文',
//   },
//   menus: {
//     dashboard: '仪表盘',
//     workspaces: '工作空间',
//     create: '创建',
//   },
//   global,
//   date,
//   pages: {
//     workspaces: {
//       views: {
//         layout: {
//           default: '事项视图',
//           structure: '层级视图',
//           kanban: '看板',
//           gantt: '甘特图',
//           storyMapping: '用户故事地图',
//           calendar: '日历视图',
//           split: '分栏视图',
//         },
//       },
//     },
//   },
//   views: {
//     default: {
//       menus: {
//         view: '查看',
//         edit: '编辑',
//         delete: '删除',
//         childCardCreate: '新建子事项',
//         childCardInlineCreate: '快速新建子事项',
//         moveToItemGroup: '移动到事项组',
//         cloneItem: '复制事项',
//         moveItemToWorkspace: '迁移事项',
//       },
//     },
//   },
// };

const zh = {
  layout,
  pages: {
    workflow,
  },
};

export default zh;
