import { Plugin } from 'vite';

function removeConsolePlugin(): Plugin {
  return {
    name: 'vite-plugin-no-console', // 插件名称
    transform(code, id) {
      // 使用正则表达式匹配和移除 console.log 语句
      const newCode = code.replace(/console\.log\((.*)\);?/g, '');
      return {
        code: newCode,
        map: null // 如果不处理 source map，可以返回 null
      };
    }
  };
}

export default removeConsolePlugin;
