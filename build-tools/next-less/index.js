const cssLoaderConfig = require('../next-css/css-loader-config');
const path = require('path');

module.exports = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (!options.defaultLoaders) {
        throw new Error(
          'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade',
        );
      }

      const { dev, isServer } = options;
      const { cssModules, cssLoaderOptions, postcssLoaderOptions, lessLoaderOptions = {} } = nextConfig;

      options.defaultLoaders.less = cssLoaderConfig(config, {
        extensions: ['less'],
        cssModules,
        cssLoaderOptions,
        postcssLoaderOptions,
        dev,
        isServer,
        loaders: [
          {
            loader: 'less-loader',
            options: lessLoaderOptions,
          },
          {
            loader: 'style-resources-loader',
            options: {
              patterns: [
                path.resolve(__dirname, './subgrade-variable.less'),
                path.resolve(__dirname, './antd-theme.less'),
              ],
              injector: 'append',
            },
          },
        ],
      });

      if (cssModules) {
        options.defaultLoaders.less.unshift('@ecomfe/class-names-loader');
      }


      config.module.rules.push({
        test: /\.less$/,
        use: options.defaultLoaders.less,
      });

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
};
