import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import preview from './preview.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte({
    preprocess: preview()
  })]
})
