import { defineConfig } from "vite";
// import {visualizer} from 'rollup-plugin-visualizer';
// @ts-ignore
import cleanDist from "./src/plugins/vite-plugin-clean-dist";
import compression from "vite-plugin-compression";
import cdn from "vite-plugin-cdn-import";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // cleanDist({
    //   outDir: 'dist' // 指定要清理的输出目录
    // }),
    compression(), // 默认使用 Gzip 压缩
    // visualizer({ open: false, filename: 'dist/stats.html' })
    cdn({
      modules: [
        {
          name: "axios",
          var: "axios",
          path: `https://cdn.bootcdn.net/ajax/libs/axios/1.7.4/axios.js`,
        },
      ],
    }),
  ],
  build: {
    minify: false,
    // chunkSizeWarningLimit: 500, // 设置警告的文件大小限制为 1024KB
    rollupOptions: {
      output: {
        manualChunks(id) {
          // console.log('id', id);

          if (id.includes("axios")) {
            return "axios";
          } else if (id.includes("node_modules")) {
            return "vendor";
          }
        },
        // 控制最大块大小为 1024 KB
      },
    },
  },
});
