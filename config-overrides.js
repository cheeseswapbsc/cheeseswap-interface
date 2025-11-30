const webpack = require('webpack');

module.exports = function override(config) {
  // Add polyfills for node core modules
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
      // Include problematic node_modules packages that need transpilation
      babelRule.exclude = /node_modules\/(?!(@walletconnect|@metamask|@coinbase|@reown|superstruct|eth-block-tracker|@ethereumjs|unstorage|destr)\/).*/;
      
      // Ensure babel options exist
      if (!babelRule.options) {
        babelRule.options = { plugins: [] };
      }
      if (!babelRule.options.plugins) {
        babelRule.options.plugins = [];
      }
      
      // Add necessary babel plugins
      babelRule.options.plugins.push(
        require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
        require.resolve('@babel/plugin-proposal-optional-chaining'),
        // Transform CommonJS to ES modules
        [require.resolve('@babel/plugin-transform-modules-commonjs'), { loose: true }]
      );
    }
  }

  // Add a rule to handle .mjs files properly - must set type to 'javascript/auto'
  // to prevent webpack from treating them as ES modules
  config.module.rules.push({
    test: /\.mjs$/,
    include: /node_modules/,
    type: 'javascript/auto',
  });

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

  // Disable devtool in production to avoid source map issues
  if (config.mode === 'production') {
    config.devtool = false;
  }

  return config;
};

