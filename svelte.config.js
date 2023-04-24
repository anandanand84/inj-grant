import preprocess from 'svelte-preprocess';
import { optimizeImports, optimizeCss } from "carbon-preprocess-svelte";
import { elements } from "carbon-preprocess-svelte";
// import adapter from '@sveltejs/adapter-node';
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	kit: {
		adapter: adapter(),
		alias : {
			"components": "./src/lib/components",
			"stores": "./src/stores"
		}
	},
	preprocess: [
		preprocess({
			postcss: true,
		}),
		// elements({
		// 	theme: "all",
		// 	cssVars: true
		// }),
		// optimizeImports(),
	],
};


export default config;
