import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  // Relative base so the build works on IPFS / any sub-path (HashRouter is used)
  base: './',
  // Expose CRA-style REACT_APP_* env vars via import.meta.env
  envPrefix: 'REACT_APP_',
  plugins: [
    react(),
    // Import SVGs as React components with: import Icon from './icon.svg?react'
    svgr(),
    nodePolyfills({
      include: ['buffer', 'process', 'crypto', 'stream', 'assert', 'http', 'https', 'os', 'url', 'util', 'events', 'path', 'zlib', 'querystring'],
      globals: {
        Buffer: true,
        global: true,
        process: true
      },
      protocolImports: true
    })
  ],
  build: {
    outDir: 'build',
    sourcemap: false,
    chunkSizeWarningLimit: 4096,
    commonjsOptions: {
      // Some legacy deps (jazzicon, cids, multihashes) are CJS
      transformMixedEsModules: true
    }
  },
  server: {
    port: 3000,
    host: true
  },
  preview: {
    port: 3000
  }
})
