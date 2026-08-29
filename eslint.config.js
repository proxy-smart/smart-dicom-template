/**
 * SMART DICOM Template ESLint config — extends the shared React config.
 */
import { defineConfig } from 'eslint/config'
import { createReactConfig } from '@max-health-inc/config/eslint/react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(
  ...createReactConfig({ tsconfigRootDir: __dirname }),
)
