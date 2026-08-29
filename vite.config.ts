import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
import { createViteConfig } from '@max-health-inc/config/vite'

// Base comes from VITE_BASE (see .env.example) rather than being hardcoded, so a
// copy of this template can be served from wherever it is deployed.
export default createViteConfig({
  port: 5180,
  plugins: [viteCommonjs()],
  optimizeDeps: {
    // Cornerstone's loader ships its own workers and breaks when pre-bundled;
    // dicom-parser is CommonJS and has to be.
    exclude: ['@cornerstonejs/dicom-image-loader'],
    include: ['dicom-parser'],
  },
  worker: {
    format: 'es' as const,
  },
})
