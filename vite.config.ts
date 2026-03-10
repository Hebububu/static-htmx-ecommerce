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
    const key = file
      .replace(/^src\//, '')
      .replace(/\.ts$/, '');
    entries[key] = path.resolve(file);
  }

  return entries;
}

export default defineConfig(async ({ command }): Promise<UserConfig> => {
  const isProd = command === 'build';
  const tsEntries = await buildTsEntries();

  return {
    // Vite treats src/ as the project root.
    // All absolute paths in HTML/TS (e.g. /css/global.css) resolve from here.
    root: 'src',

    // Serve static assets from the project-level public directory.
    publicDir: '../public',

    build: {
      outDir: '../dist',
      emptyOutDir: true,

      // Obfuscation via Terser (production only)
      minify: isProd ? 'terser' : false,
      terserOptions: isProd
        ? {
            mangle: {
              // Mangle top-level variable/function names
              toplevel: true,
            },
            compress: {
              // Remove console.* in production
              drop_console: true,
              drop_debugger: true,
              // Multiple compression passes for better results
              passes: 2,
            },
            format: {
              // Remove comments
              comments: false,
            },
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
          inlineDynamicImports: false,
        },
      },

      // Prevent Vite from inlining small assets
      assetsInlineLimit: 0,
    },

    plugins: [
      viteStaticCopy({
        targets: [
          // Copy index.html, rewriting /app.ts → /app.js for production
          {
            src: 'index.html',
            dest: '.',
            transform: (content: string) =>
              content.replace(/src="\/app\.ts"/g, 'src="/app.js"'),
          },
          // Copy component HTML files in each subdirectory.
          // transform only works on individual files (not directories), so we use globs.
          // Each target has dest matching the component subdirectory to preserve structure.
          {
            src: 'components/layout/*.html',
            dest: 'components/layout',
            transform: (content: string) =>
              content.replace(/src="([^"]+)\.ts"/g, 'src="$1.js"'),
          },
          // Copy component CSS files
          {
            src: 'components/layout/*.css',
            dest: 'components/layout',
          },
          // Copy product component HTML files.
          {
            src: 'components/product/*.html',
            dest: 'components/product',
            transform: (content: string) =>
              content.replace(/src="([^"]+)\.ts"/g, 'src="$1.js"'),
          },
          // Copy product component CSS files.
          {
            src: 'components/product/*.css',
            dest: 'components/product',
          },
          // Copy banner component HTML files.
          {
            src: 'components/banner/*.html',
            dest: 'components/banner',
            transform: (content: string) =>
              content.replace(/src="([^"]+)\.ts"/g, 'src="$1.js"'),
          },
          // Copy banner component CSS files.
          {
            src: 'components/banner/*.css',
            dest: 'components/banner',
          },
          // Copy category component HTML files.
          {
            src: 'components/category/*.html',
            dest: 'components/category',
          },
          // Copy category component CSS files.
          {
            src: 'components/category/*.css',
            dest: 'components/category',
          },
          // Copy page fragment HTML files (no script tags to transform)
          {
            src: 'pages/home.html',
            dest: 'pages',
          },
          {
            src: 'pages/home.css',
            dest: 'pages',
          },
          // Copy product list content fragment
          {
            src: 'pages/product/list-content.html',
            dest: 'pages/product',
          },
          {
            src: 'pages/product/list.css',
            dest: 'pages/product',
          },
          // Copy product list full page (rewrite .ts → .js)
          {
            src: 'pages/product/list.html',
            dest: 'pages/product',
            transform: (content: string) =>
              content.replace(/src="([^"]+)\.ts"/g, 'src="$1.js"'),
          },
          // Copy global CSS
          {
            src: 'css',
            dest: '.',
          },
          // Copy vendor files (htmx) from project root
          {
            src: '../vendor',
            dest: '.',
          },
        ],
      }),
    ],

    server: {
      port: 3000,
      // Allow serving files from project root (for vendor/)
      fs: {
        allow: ['..'],
      },
    },
  };
});
