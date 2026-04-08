import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import fs from 'node:fs';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

/**
 * Post-process plugin: strips type="module" and crossorigin from inlined scripts
 * so the HTML works when opened directly via file:// (e.g. Figma Make import).
 * Uses closeBundle to run AFTER vite-plugin-singlefile has written the file.
 */
function stripModuleType(): Plugin {
  return {
    name: 'strip-module-type',
    enforce: 'post',
    apply: 'build',
    closeBundle() {
      const outFile = path.resolve(__dirname, 'dist-figma/figma-preview.html');
      if (!fs.existsSync(outFile)) return;
      const html = fs.readFileSync(outFile, 'utf-8');
      const patched = html
        .replace(/<script type="module" crossorigin>/g, '<script>')
        .replace(/<script type="module">/g, '<script>');
      fs.writeFileSync(outFile, patched);
      console.log('[strip-module-type] Removed type="module" from inlined scripts');
    },
  };
}

/**
 * Figma Make build — outputs a single self-contained HTML file
 * with all JS + CSS inlined, no external dependencies.
 *
 * Usage: pnpm build:figma
 * Output: dist-figma/figma-preview.html  (drag-and-drop into Figma Make)
 */
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteSingleFile({ removeViteModuleLoader: true }),
    stripModuleType(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  build: {
    outDir: 'dist-figma',
    emptyOutDir: true,
    target: 'es2015',
    assetsInlineLimit: 100_000_000,
    rollupOptions: {
      input: path.resolve(__dirname, 'figma-preview.html'),
      output: {
        format: 'iife',
        inlineDynamicImports: true,
      },
    },
  },
});
