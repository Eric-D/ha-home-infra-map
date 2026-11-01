import { resolve } from 'node:path';
import { transform } from 'esbuild';
import { defineConfig } from 'vitest/config';

const BANNER = '/* home-infra-map-card — built artefact, do not edit. Sources: frontend/src/ */';

// Single minified ES module, everything inlined (no CDN): HA serves it as a
// Lovelace resource from custom_components/home_infra_map/www/.
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/card.ts'),
      formats: ['es'],
      fileName: () => 'home-infra-map-card.js',
    },
    outDir: resolve(__dirname, '../custom_components/home_infra_map/www'),
    emptyOutDir: false,
    target: 'es2021',
    sourcemap: false,
    reportCompressedSize: false,
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
  plugins: [
    {
      // Vite does not minify whitespace of ES-format libraries: do it here.
      name: 'minify-es-lib',
      apply: 'build',
      enforce: 'post',
      async generateBundle(_options, bundle) {
        for (const chunk of Object.values(bundle)) {
          if (chunk.type !== 'chunk') continue;
          const out = await transform(chunk.code, { minify: true, format: 'esm', target: 'es2021', legalComments: 'none' });
          chunk.code = `${BANNER}\n${out.code}`;
        }
      },
    },
  ],
  test: {
    environment: 'happy-dom',
    include: ['test/**/*.test.ts'],
  },
});
