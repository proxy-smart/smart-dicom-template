import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'

/**
 * Standalone Vite config — no shared preset, so a clone of this template owns its own build.
 *
 * `base` comes from VITE_BASE (see .env.example) rather than being hardcoded, so a copy can be
 * served from a sub-path as well as from a domain root.
 */
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react(), tailwindcss(), viteCommonjs()],
  server: { port: 5180 },
  resolve: {
    alias: { '@': path.resolve(process.cwd(), './src') },
  },
  optimizeDeps: {
    // Cornerstone's loader ships its own workers and breaks when pre-bundled;
    // dicom-parser is CommonJS and has to be.
    exclude: ['@cornerstonejs/dicom-image-loader'],
    include: ['dicom-parser'],
  },
  worker: { format: 'es' },
  build: { sourcemap: false, reportCompressedSize: false },
})
