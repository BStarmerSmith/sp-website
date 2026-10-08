import { defineConfig } from 'vite'
import { resolve } from 'path'
import yaml from '@modyfi/vite-plugin-yaml'

export default defineConfig({
  plugins: [yaml()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        terms: resolve(__dirname, 'terms.html'),
      },
    },
  },
})
