import { defineConfig } from 'vite'
import { resolve } from 'path'
import yaml from '@modyfi/vite-plugin-yaml'

export default defineConfig({
  plugins: [yaml()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        aboutUs: resolve(__dirname, 'about-us.html'),
        contactUs: resolve(__dirname, 'contact-us.html'),
        comingSoon: resolve(__dirname, 'coming-soon.html'),
      },
    },
  },
})
