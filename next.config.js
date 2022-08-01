const withPlugins = require('next-compose-plugins');
const withCSS = require('./build-tools/next-css');
const withLess = require('./build-tools/next-less');
const hasha = require('hasha');
const path = require('path');
// const withCSS = require('next-with-css');
// const withLess = require('next-with-less');
// const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const LessPluginFunctions = require('less-plugin-functions');
const withTM = require('next-transpile-modules')(['antd']);

const localBasePath = process.env.Local_BASE_PATH;
// 是否本地启动core服务
const isLocalServer = process.env.PROXIMA_LOCAL_SERVER === 'true';

const getBasePath = () => {
  let basePath = '';
  const envBasePath = localBasePath;
  // if (isProd && envBasePath) {
  if (envBasePath) {
    if (envBasePath.startsWith('/')) {
      basePath = envBasePath;
    } else {
      basePath = '/' + envBasePath;
    }
  }
  return basePath;
};

const nextConfig = {
  reactStrictMode: true,
  assetPrefix: getBasePath(),
  publicRuntimeConfig: {
    serverURL: process.env.PROXIMA_GATEWAY + '/local',
    appId: process.env.NEXT_PUBLIC_PARSE_APP_ID,
    gateway: process.env.PROXIMA_GATEWAY,
    basePath: getBasePath(),
    isLocalServer,
  },
  images: {
    disableStaticImages: true,
  },
  cssModules: {
    getLocalIdent: ({ resourcePath }, localIdentName, localName) => {
      if (/\.global\.(css|less)$/.test(resourcePath) || /node_modules/.test(resourcePath)) {
        return localName;
      }
      return `${localName}__${hasha(resourcePath + localName, { algorithm: 'md5' }).slice(0, 8)}`;
    },
  },
  lessLoaderOptions: {
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: {
        'ant-prefix': 'ant',
      },
      plugins: [new LessPluginFunctions({ alwaysOverride: true })],
    },
  },
  webpack(config) {
    config.resolve.alias.react = path.resolve(__dirname, './node_modules/react');
    config.resolve.alias['react-dom'] = path.resolve(__dirname, './node_modules/react-dom');
    config.resolve.alias['@'] = path.resolve(__dirname, './');
    config.module.rules.push(
      {
        test: /\.svg$/,
        issuer: /\.(js|ts)x|less|css?$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.(eot|woff|woff2|ttf|png|jpg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 100000,
            name: '[name].[ext]',
          },
        },
      },
    );

    // config.plugins.push(new AntdDayjsWebpackPlugin());
    return config;
  },
}
module.exports = withPlugins([withBundleAnalyzer, withTM, withLess, withCSS], nextConfig);
