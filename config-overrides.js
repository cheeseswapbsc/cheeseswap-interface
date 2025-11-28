const webpack = require('webpack');

module.exports = function override(config) {
  // Add polyfills
  config.resolve.alias = {
    ...config.resolve.alias,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    assert: require.resolve('assert'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify'),
    url: require.resolve('url'),
    buffer: require.resolve('buffer'),
  };

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ]);

  // Update babel-loader to handle .mjs files and modern syntax
  const babelLoaderRule = config.module.rules.find(rule => Array.isArray(rule.oneOf));
  if (babelLoaderRule && babelLoaderRule.oneOf) {
    const babelRule = babelLoaderRule.oneOf.find(
      rule => rule.loader && rule.loader.includes('babel-loader')
    );
    if (babelRule) {
      babelRule.test = /\.(js|mjs|jsx|ts|tsx)$/;
      babelRule.include = undefined;
      babelRule.exclude = /node_modules\/(?!(@walletconnect|@metamask|superstruct)\/).*/;
      if (babelRule.options && babelRule.options.plugins) {
        babelRule.options.plugins.push(
          require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
          require.resolve('@babel/plugin-proposal-optional-chaining')
        );
      }
    }
  }

  // Suppress all source map warnings
  const moduleRules = config.module.rules.find(rule => Array.isArray(rule.oneOf));
  if (moduleRules && moduleRules.oneOf) {
    moduleRules.oneOf.unshift({
      test: /\.(js|mjs|jsx)$/,
      enforce: 'pre',
      loader: require.resolve('source-map-loader'),
      exclude: /node_modules/
    });
  }

  return config;
};
