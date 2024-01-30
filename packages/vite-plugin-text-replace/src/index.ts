import { Plugin } from 'vite';
import path from 'path';

type ReplacementRule = {
  from: string;
  to: string;
};

type FileTypeReplacements = {
  fileType: string;
  replacements: ReplacementRule[];
};

function createReplacePlugin(options: FileTypeReplacements[]): Plugin {
  return {
    name: 'vite-plugin-text-replace',
    transform(code, id) {
      // 获取项目根目录下的 src 目录的绝对路径
      const srcDir = path.resolve(process.cwd(), 'src');

      // 检查文件是否位于 src 目录下
      if (!id.startsWith(srcDir)) {
        return;
      }

      if (!Array.isArray(options) || !options?.length) {
        return null
      }

      // 遍历每种文件类型的配置
      for (const option of options) {
        if (id.endsWith(option.fileType)) {
          // 应用当前文件类型的所有替换规则
          option.replacements.forEach(replacement => {
            code = code.replace(new RegExp(replacement.from, 'g'), replacement.to);
          });
          return { code, map: null };
        }
      }
    }
  };
}

export default createReplacePlugin