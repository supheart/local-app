const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const findUp = require('find-up');

const fileExtensions = new Set();
let extractCssInitialized = false;

module.exports = (
  config,
  { extensions = [], cssModules = false, dev, isServer, postcssLoaderOptions = {}, loaders = [] },
) => {
  // We have to keep a list of extensions for the splitchunk config
  for (const extension of extensions) {
    fileExtensions.add(extension);
  }

  if (!isServer && !extractCssInitialized) {
    config.plugins.push(
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: dev ? 'static/css/[name].css' : 'static/css/[name].[contenthash:8].css',
        chunkFilename: dev ? 'static/css/[name].chunk.css' : 'static/css/[name].[contenthash:8].chunk.css',
        // 在保证默认开启 CSS Modules 的情况下，CSS 加载的顺序“不是特别重要”
        // https://github.com/vercel/next.js/blob/de42719619ae69fbd88e445100f15701f6e1e100/packages/next/build/webpack/config/blocks/css/index.ts#L336
        ignoreOrder: true,
      }),
    );
    extractCssInitialized = true;
  }

  const postcssConfig = findUp.sync('postcss.config.js', {
    cwd: config.context,
  });
  let postcssLoader;

  if (postcssConfig) {
    // Copy the postcss-loader config options first.
    const postcssOptionsConfig = Object.assign(postcssLoaderOptions.config, { path: postcssConfig });

    postcssLoader = {
      loader: 'postcss-loader',
      options: Object.assign({}, postcssLoaderOptions, {
        config: postcssOptionsConfig,
      }),
    };
  }

  const cssLoader = {
    loader: 'css-loader',
    options: Object.assign({
      modules: cssModules
        ? {
            ...cssModules,
            exportOnlyLocals: isServer,
          }
        : false,
      sourceMap: dev,
      importLoaders: loaders.length + (postcssLoader ? 1 : 0),
    }),
  };

  // When not using css modules we don't transpile on the server
  if (isServer && !cssLoader.options.modules) {
    return ['ignore-loader'];
  }

  // When on the server and using css modules we transpile the css
  if (isServer && cssLoader.options.modules) {
    return [cssLoader, postcssLoader, ...loaders].filter(Boolean);
  }

  return [
    !isServer && dev && 'extracted-loader',
    !isServer && MiniCssExtractPlugin.loader,
    cssLoader,
    postcssLoader,
    ...loaders,
  ].filter(Boolean);
};
