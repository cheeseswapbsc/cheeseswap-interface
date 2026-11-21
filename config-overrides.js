const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

/**
 * Webpack 4 can't read package.json "exports" maps. This resolves modern
 * subpath imports (e.g. "@reown/appkit/core") to their real files.
 */
function pickExportTarget(entry) {
  if (typeof entry === 'string') return entry;
  if (entry && typeof entry === 'object') {
    // Prefer "default" over "import": some packages (valtio) ship webpack4-safe
    // CJS as "default" while their "import" ESM build uses import.meta
    for (const key of ['browser', 'module', 'default', 'import', 'require']) {
      if (entry[key]) {
        const picked = pickExportTarget(entry[key]);
        if (picked) return picked;
      }
    }
  }
  return null;
}

const exportsResolveCache = new Map();

function resolveExportsSubpath(request) {
  if (exportsResolveCache.has(request)) return exportsResolveCache.get(request);
  const resolved = doResolveExportsSubpath(request);
  exportsResolveCache.set(request, resolved);
  return resolved;
}

function doResolveExportsSubpath(request) {
  const match = request.match(/^((?:@[^/]+\/)?[^/]+)(?:\/(.+))?$/);
  if (!match) return null;
  const pkgName = match[1];
  const subpath = match[2] ? './' + match[2] : '.';
  const pkgJsonPath = path.join(__dirname, 'node_modules', pkgName, 'package.json');
  if (!fs.existsSync(pkgJsonPath)) return null;
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
    // Bare imports only need help when the legacy entry is missing or broken
    if (subpath === '.') {
      const legacyEntry = pkg.browser || pkg.module || pkg.main;
      if (legacyEntry && typeof legacyEntry === 'string') {
        const legacyPath = path.join(__dirname, 'node_modules', pkgName, legacyEntry);
        if (fs.existsSync(legacyPath)) return null;
      }
    }
    const entry = pkg.exports && pkg.exports[subpath];
    let target = entry ? pickExportTarget(entry) : null;
    // Wildcard export patterns, e.g. "./*": { "import": "./dist/icons/*.mjs" }
    if (!target && subpath !== '.' && pkg.exports) {
      for (const key of Object.keys(pkg.exports)) {
        if (!key.includes('*')) continue;
        const [keyPrefix, keySuffix] = key.split('*');
        if (subpath.startsWith(keyPrefix) && subpath.endsWith(keySuffix)) {
          const wildcard = subpath.slice(keyPrefix.length, subpath.length - keySuffix.length);
          const patternTarget = pickExportTarget(pkg.exports[key]);
          if (patternTarget) {
            target = patternTarget.replace(/\*/g, wildcard);
            break;
          }
        }
      }
    }
    if (!target) return null;
    const resolved = path.join(__dirname, 'node_modules', pkgName, target);
    return fs.existsSync(resolved) ? resolved : null;
  } catch (err) {
    return null;
  }
}

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
    '@msgpack/msgpack': path.join(__dirname, 'node_modules/@msgpack/msgpack/dist.cjs/index.cjs'),
  };



  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
    // Resolve "exports"-map imports (modern packages) that webpack 4 can't read
    new webpack.NormalModuleReplacementPlugin(
      /^[^./!][^!]*$/,
      resource => {
        const resolved = resolveExportsSubpath(resource.request);
        if (resolved) {
          resource.request = resolved;
        }
      }
    ),
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
      // NOTE: @noble/@scure/@solana must be transpiled by this rule: the CRA
      // "dependencies" babel rule only transforms optional chaining/nullish
      // coalescing in production, so in dev webpack 4 fails to parse them.
      babelRule.exclude = /node_modules\/(?!(@walletconnect|@metamask|@coinbase|@reown|@phosphor-icons|@msgpack|@noble|@scure|@solana|viem|ox|abitype|valtio|proxy-compare|lit|lit-element|lit-html|@lit|@lit-labs|superstruct|eth-block-tracker|@ethereumjs|unstorage|destr|graphql)\/).*/;
      
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
        require.resolve('@babel/plugin-proposal-class-properties'),
        require.resolve('@babel/plugin-proposal-numeric-separator'),
        require.resolve('@babel/plugin-proposal-logical-assignment-operators'),
        require.resolve('@babel/plugin-proposal-export-namespace-from'),
        // Rewrite import.meta usage (valtio, lit) for webpack 4
        require.resolve('babel-plugin-transform-import-meta'),
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

  // CRA's file-loader doesn't exclude .cjs, so CommonJS deps like
  // destr/lib/index.cjs or @msgpack/msgpack/dist.cjs get bundled as static
  // asset URLs ("module.exports = <url>") instead of executable modules,
  // which breaks WalletConnect ("_destr.default is not a function").
  // Exclude .cjs from file-loader so webpack treats them as JS.
  if (babelLoaderRule && babelLoaderRule.oneOf) {
    const fileLoaderRule = babelLoaderRule.oneOf.find(
      rule => rule.loader && rule.loader.includes('file-loader')
    );
    if (fileLoaderRule) {
      if (Array.isArray(fileLoaderRule.exclude)) {
        fileLoaderRule.exclude.push(/\.cjs$/);
      } else if (fileLoaderRule.exclude) {
        fileLoaderRule.exclude = [fileLoaderRule.exclude, /\.cjs$/];
      } else {
        fileLoaderRule.exclude = [/\.cjs$/];
      }
    }
  }
  config.module.rules.push({
    test: /\.cjs$/,
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

