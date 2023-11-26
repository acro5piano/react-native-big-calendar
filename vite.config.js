import { defineConfig } from 'vite'

// https://vitejs.dev/config/
/* eslint-disable */
export default defineConfig({
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
  },
})
