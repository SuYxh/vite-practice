import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
console.log(mode, command);

  loadEnv(mode, process.cwd())
  

  

  return {
    envPrefix: 'ENV_',
    build: {
      minify: false
    }
  }
});
