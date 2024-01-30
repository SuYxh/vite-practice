import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginTimer from '@vite-study/vite-plugin-timer';
// import vitePluginHookLogger from '@vite-study/vite-plugin-hook-logger';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vitePluginTimer(),
    // vitePluginHookLogger()
  ],
})
