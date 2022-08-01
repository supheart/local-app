const cssLoaderConfig = require('./css-loader-config');

module.exports = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      const { dev, isServer } = options;
      const { cssModules, cssLoaderOptions, postcssLoaderOptions } = nextConfig;

      options.defaultLoaders.css = cssLoaderConfig(config, {
        extensions: ['css'],
        cssModules,
        cssLoaderOptions,
        postcssLoaderOptions,
        dev,
        isServer,
      });

      config.module.rules.push({
        test: /\.css$/,
        use: options.defaultLoaders.css,
      });

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
};
