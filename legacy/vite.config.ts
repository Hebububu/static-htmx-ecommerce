import { defineConfig, type UserConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { glob } from 'node:fs/promises';
import path from 'node:path';

/**
 * Discover all TypeScript entry points under src/ (excluding type declaration files).
 * Each .ts file becomes its own output bundle (per-component bundles).
 */
async function buildTsEntries(): Promise<Record<string, string>> {
	const entries: Record<string, string> = {};

	for await (const file of glob('src/**/*.ts', { exclude: (f) => f.endsWith('.d.ts') })) {
		// e.g. src/components/layout/header.ts → components/layout/header
		const key = file.replace(/^src\//, '').replace(/\.ts$/, '');
		entries[key] = path.resolve(file);
	}

	return entries;
}

export default defineConfig(async ({ command }): Promise<UserConfig> => {
	const isProd = command === 'build';
	const tsEntries = await buildTsEntries();

	// Base path for deployment (e.g. '/static-htmx-ecommerce/' for GitHub Pages).
	// Defaults to '/' for local development.
	const basePath = process.env.VITE_BASE ?? '/';

	/**
	 * Rewrite HTML for production:
	 * 1. Replace .ts script references with .js
	 * 2. Prefix absolute paths with the deployment base path
	 */
	function rewriteHtml(content: string): string {
		let result = content.replace(/src="([^"]+)\.ts"/g, 'src="$1.js"');
		if (basePath !== '/') {
			result = result.replace(/((?:href|src|hx-get|hx-push-url)=")\/(?!\/)/g, `$1${basePath}`);
		}
		return result;
	}

	return {
		// Vite treats src/ as the project root.
		// All absolute paths in HTML/TS (e.g. /css/global.css) resolve from here.
		root: 'src',

		base: basePath,

		// Serve static assets from the project-level public directory.
		publicDir: '../public',

		define: {
			__BASE_PATH__: JSON.stringify(basePath)
		},

		build: {
			outDir: '../dist',
			emptyOutDir: true,

			// Obfuscation via Terser (production only)
			minify: isProd ? 'terser' : false,
			terserOptions: isProd
				? {
						mangle: {
							// Mangle top-level variable/function names
							toplevel: true
						},
						compress: {
							// Remove console.* in production
							drop_console: true,
							drop_debugger: true,
							// Multiple compression passes for better results
							passes: 2
						},
						format: {
							// Remove comments
							comments: false
						}
					}
				: undefined,

			rollupOptions: {
				// Only compile TypeScript files — HTML/CSS are handled by static copy
				input: tsEntries,
				output: {
					// Preserve directory structure: app.ts → app.js, components/layout/header.ts → components/layout/header.js
					entryFileNames: '[name].js',
					// No code splitting — each entry is a standalone bundle
					chunkFileNames: 'chunks/[name]-[hash].js',
					inlineDynamicImports: false
				}
			},

			// Prevent Vite from inlining small assets
			assetsInlineLimit: 0
		},

		plugins: [
			viteStaticCopy({
				targets: [
					// Copy index.html with path rewriting for production
					{
						src: 'index.html',
						dest: '.',
						transform: rewriteHtml
					},
					// Copy index.html as 404.html for SPA fallback on GitHub Pages
					{
						src: 'index.html',
						dest: '.',
						rename: '404.html',
						transform: rewriteHtml
					},
					// Copy component HTML files in each subdirectory.
					// transform only works on individual files (not directories), so we use globs.
					// Each target has dest matching the component subdirectory to preserve structure.
					{
						src: 'components/layout/*.html',
						dest: 'components/layout',
						transform: rewriteHtml
					},
					// Copy component CSS files
					{
						src: 'components/layout/*.css',
						dest: 'components/layout'
					},
					{
						src: 'components/product/*.html',
						dest: 'components/product',
						transform: rewriteHtml
					},
					// Copy product component CSS files.
					{
						src: 'components/product/*.css',
						dest: 'components/product'
					},
					{
						src: 'components/product-detail/*.html',
						dest: 'components/product-detail',
						transform: rewriteHtml
					},
					{
						src: 'components/product-detail/*.css',
						dest: 'components/product-detail'
					},
					{
						src: 'components/banner/*.html',
						dest: 'components/banner',
						transform: rewriteHtml
					},
					// Copy banner component CSS files.
					{
						src: 'components/banner/*.css',
						dest: 'components/banner'
					},
					// Copy category component HTML files.
					{
						src: 'components/category/*.html',
						dest: 'components/category',
						transform: rewriteHtml
					},
					// Copy category component CSS files.
					{
						src: 'components/category/*.css',
						dest: 'components/category'
					},
					{
						src: 'components/notice-service/*.html',
						dest: 'components/notice-service',
						transform: rewriteHtml
					},
					{
						src: 'components/notice-service/*.css',
						dest: 'components/notice-service'
					},
					{
						src: 'components/breadcrumb/*.css',
						dest: 'components/breadcrumb'
					},
					{
						src: 'components/category-banner/*.html',
						dest: 'components/category-banner',
						transform: rewriteHtml
					},
					{
						src: 'components/category-banner/*.css',
						dest: 'components/category-banner'
					},
					{
						src: 'components/category-sidebar/*.html',
						dest: 'components/category-sidebar',
						transform: rewriteHtml
					},
					{
						src: 'components/category-sidebar/*.css',
						dest: 'components/category-sidebar'
					},
					{
						src: 'components/support-sidebar/*.html',
						dest: 'components/support-sidebar',
						transform: rewriteHtml
					},
					{
						src: 'components/support-sidebar/*.css',
						dest: 'components/support-sidebar'
					},
					{
						src: 'components/account-sidebar/*.html',
						dest: 'components/account-sidebar',
						transform: rewriteHtml
					},
					{
						src: 'components/account-sidebar/*.css',
						dest: 'components/account-sidebar'
					},
					{
						src: 'components/account/*.html',
						dest: 'components/account',
						transform: rewriteHtml
					},
					{
						src: 'components/account/*.css',
						dest: 'components/account'
					},
					{
						src: 'components/order/*.html',
						dest: 'components/order',
						transform: rewriteHtml
					},
					{
						src: 'components/order/*.css',
						dest: 'components/order'
					},
					{
						src: 'components/review/*.html',
						dest: 'components/review',
						transform: rewriteHtml
					},
					{
						src: 'components/review/*.css',
						dest: 'components/review'
					},
					{
						src: 'components/quick-menu/*.html',
						dest: 'components/quick-menu',
						transform: rewriteHtml
					},
					{
						src: 'components/quick-menu/*.css',
						dest: 'components/quick-menu'
					},
					{
						src: 'components/event-banner/*.html',
						dest: 'components/event-banner',
						transform: rewriteHtml
					},
					{
						src: 'components/event-banner/*.css',
						dest: 'components/event-banner'
					},
					{
						src: 'components/modal/*.css',
						dest: 'components/modal'
					},
					{
						src: 'components/event-list/*.html',
						dest: 'components/event-list',
						transform: rewriteHtml
					},
					{
						src: 'components/event-list/*.css',
						dest: 'components/event-list'
					},
					{
						src: 'components/board/*.html',
						dest: 'components/board',
						transform: rewriteHtml
					},
					{
						src: 'components/board/*.css',
						dest: 'components/board'
					},
					{
						src: 'components/board-list/*.html',
						dest: 'components/board-list',
						transform: rewriteHtml
					},
					{
						src: 'components/board-list/*.css',
						dest: 'components/board-list'
					},
					{
						src: 'pages/home.html',
						dest: 'pages',
						transform: rewriteHtml
					},
					{
						src: 'pages/home.css',
						dest: 'pages'
					},
					{
						src: 'pages/product/list-content.html',
						dest: 'pages/product',
						transform: rewriteHtml
					},
					{
						src: 'pages/product/list.css',
						dest: 'pages/product'
					},
					{
						src: 'pages/product/list.html',
						dest: 'pages/product',
						transform: rewriteHtml
					},
					{
						src: 'pages/product/detail-content.html',
						dest: 'pages/product',
						transform: rewriteHtml
					},
					{
						src: 'pages/product/detail.css',
						dest: 'pages/product'
					},
					{
						src: 'pages/product/detail.html',
						dest: 'pages/product',
						transform: rewriteHtml
					},
					{
						src: 'pages/board/notices-content.html',
						dest: 'pages/board',
						transform: rewriteHtml
					},
					{
						src: 'pages/board/notices.css',
						dest: 'pages/board'
					},
					{
						src: 'pages/board/notices.html',
						dest: 'pages/board',
						transform: rewriteHtml
					},
					{
						src: 'pages/board/article-content.html',
						dest: 'pages/board',
						transform: rewriteHtml
					},
					{
						src: 'pages/board/article.html',
						dest: 'pages/board',
						transform: rewriteHtml
					},
					{
						src: 'pages/board/list-content.html',
						dest: 'pages/board',
						transform: rewriteHtml
					},
					{
						src: 'pages/board/list.css',
						dest: 'pages/board'
					},
					{
						src: 'pages/board/list.html',
						dest: 'pages/board',
						transform: rewriteHtml
					},
					{
						src: 'pages/account/index-content.html',
						dest: 'pages/account',
						transform: rewriteHtml
					},
					{
						src: 'pages/account/index.css',
						dest: 'pages/account'
					},
					{
						src: 'pages/account/index.html',
						dest: 'pages/account',
						transform: rewriteHtml
					},
					{
						src: 'pages/my/orders-content.html',
						dest: 'pages/my',
						transform: rewriteHtml
					},
					{
						src: 'pages/my/orders.css',
						dest: 'pages/my'
					},
					{
						src: 'pages/my/orders.html',
						dest: 'pages/my',
						transform: rewriteHtml
					},
					{
						src: 'pages/event/event-content.html',
						dest: 'pages/event',
						transform: rewriteHtml
					},
					{
						src: 'pages/event/event.css',
						dest: 'pages/event'
					},
					{
						src: 'pages/event/event.html',
						dest: 'pages/event',
						transform: rewriteHtml
					},
					{
						src: 'pages/event/list-content.html',
						dest: 'pages/event',
						transform: rewriteHtml
					},
					{
						src: 'pages/event/list.css',
						dest: 'pages/event'
					},
					{
						src: 'pages/event/list.html',
						dest: 'pages/event',
						transform: rewriteHtml
					},
					// Copy global CSS
					{
						src: 'css',
						dest: '.'
					},
					// Copy vendor files (htmx) from project root
					{
						src: '../vendor',
						dest: '.'
					}
				]
			})
		],

		server: {
			port: 3000,
			// Allow serving files from project root (for vendor/)
			fs: {
				allow: ['..']
			}
		}
	};
});
