import { sveltekit } from '@sveltejs/kit/vite';
import  { defineConfig } from 'vite';

import tsconfigPaths from 'vite-tsconfig-paths'
import { nodePolyfills } from '@bangjelkoski/vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    tsconfigPaths(), 
    nodePolyfills({ protocolImports: true }),
	  sveltekit()
  ],
  build : {
    rollupOptions: {
      treeshake: false,
      experimentalLogSideEffects: true
    }
  }
})

