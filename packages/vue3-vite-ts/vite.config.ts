import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginTimer from '@vite-study/vite-plugin-timer';
import createReplacePlugin from '@vite-study/vite-plugin-text-replace';
import vitePluginNoConsole from '@vite-study/vite-plugin-no-console';
import vitePluginVisualizer from '@vite-study/vite-plugin-visualizer';
import vitePluginProgress from '@vite-study/vite-plugin-progress';

// import vitePluginHookLogger from '@vite-study/vite-plugin-hook-logger';
// import inspect from 'vite-plugin-inspect';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vitePluginProgress(),
    // inspect({
    //   build: true
    // }),
    // vitePluginHookLogger(),
    vitePluginTimer(),
    createReplacePlugin([
      {
        fileType: '.vue',
        replacements: [
          { from: '更新', to: '更换诗词' },
          // 更多针对 .vue 文件的替换规则...
        ]
      }
    ]),
    vitePluginNoConsole(),
    vue(),
    vitePluginVisualizer(),
  ],
})
