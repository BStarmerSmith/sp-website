import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
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
