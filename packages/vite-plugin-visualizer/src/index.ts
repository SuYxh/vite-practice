import type { Plugin } from "vite";
import path from "node:path";
import fs from "node:fs";
import { buildTree } from "./tree";
import ModuleMapper from "./mapper";
import { createHtml } from "./createHtml";

interface IOptions {
  output?: string;
  title?: string;
  root?: string;
}

const DEFAULT_FILE_NAME = "visualizer.html";
const DEFAULT_TITLE = "vite-plugin-visualizer";

interface ILengthOptions {
  id: string;
  length: string;
  code: string;
}

const getLength = ({ id, length, code }: ILengthOptions) => {
  const isEmpty = code === null || code === "";
  return {
    id,
    length: isEmpty ? length : Buffer.byteLength(code, "utf-8"),
  };
};

// Vite 插件主体
const VitePluginVisualizer = (options: IOptions = {}): Plugin => {
  let startTime = 0; // 用于记录构建开始的时间戳

  return {
    name: "vite-plugin-visualizer", // 插件名称

    // 构建开始时的钩子函数
    buildStart() {
      startTime = Date.now(); // 记录当前时间作为构建开始时间
    },

    // 在生成打包文件时触发的钩子
    generateBundle(_, outputBundle: Record<string, any>) {
      console.log(outputBundle); // 打印输出包的内容，便于调试

      // 设置输出文件和一些基本参数
      const outputFile = options.output ?? DEFAULT_FILE_NAME; // 使用提供的输出文件名或默认文件名
      const title = options.title ?? DEFAULT_TITLE; // 使用提供的标题或默认标题
      const root = options.root ?? process.cwd(); // 使用提供的根目录或当前工作目录
      const roots = []; // 用于存储处理后的模块树数据
      const mapper = new ModuleMapper(root); // 创建一个 ModuleMapper 实例

      // 初始化用于存储统计信息的变量
      let assetCount = 0;
      let chunkCount = 0;
      let packageCount = 0;
      let totalSize = 0;
      let jsSize = 0;
      let cssSize = 0;
      let imgSize = 0;
      let htmlSize = 0;
      let fontSize = 0;
      const tableData = []; // 用于存储表格数据

      // 遍历输出包中的每个资源
      for (const [bundleId, bundle] of Object.entries(outputBundle)) {
        const fileType = path.extname(bundle.fileName).slice(1); // 获取文件类型
        const size = bundle?.code?.length ?? bundle?.source?.length ?? 0; // 计算文件大小

        // 根据文件类型累加对应类型的大小
        if (fileType === "js") jsSize += size;
        if (fileType === "css") cssSize += size;
        if (["jpg", "jpeg", "png", "gif", "svg"].includes(fileType)) imgSize += size;
        if (fileType === "html") htmlSize += size;
        if (["woff", "woff2", "ttf", "otf"].includes(fileType)) fontSize += size;

        // 处理模块依赖并构建模块树
        const dependencyCount = Object.keys(bundle.modules ?? []).length;
        totalSize += size;
        assetCount++;
        tableData.push({
          fileName: bundle.fileName,
          fileType,
          size: Number(size / 1000).toFixed(2), // 转换为 KB
          dependencyCount,
        });

        // 如果资源类型是 chunk，处理模块树
        if (bundle.type == "chunk") {
          packageCount += dependencyCount;

          // 获取模块树信息
          const modules = Object.entries(bundle.modules).map(
            ([id, { renderedLength, code }]: any) =>
              getLength({ id, length: renderedLength, code })
          );
          const tree = buildTree(bundleId, modules, mapper); // 构建模块树

          // 将模块树添加到 roots 数组
          if (tree.children.length === 0) {
            const bundleSizes = getLength({
              id: bundleId,
              length: bundle.code.length,
              code: bundle.code,
            });
            const facadeModuleId = bundle.facadeModuleId ?? `${bundleId}-unknown`;
            const bundleUID = mapper.setNodePart(bundleId, facadeModuleId, bundleSizes);
            const leaf = { name: bundleId, uid: bundleUID };
            roots.push(leaf);
          } else {
            roots.push(tree);
          }
        }

        chunkCount = Object.keys(outputBundle).length; // 更新 chunk 计数
      }

      // 准备要写入 HTML 文件的数据
      const outputBundlestats = {
        title,
        bundleObj: {
          root,
          time: (Date.now() - startTime) / 1000 + "s", // 计算构建耗时
          startTime: new Date().toLocaleString(),
          totalSize: Number(totalSize / 1000).toFixed(2), // 转换为 KB
          assetCount,
          chunkCount,
          packageCount,
          jsSize: Number(jsSize / 1000).toFixed(2),
          cssSize: Number(cssSize / 1000).toFixed(2),
          imageSize: Number(imgSize / 1000).toFixed(2),
          htmlSize: Number(htmlSize / 1000).toFixed(2),
          fontSize: Number(fontSize / 1000).toFixed(2),
        },
        tableData,
        treeData: roots,
      };

      // 使用 createHtml 函数生成最终的 HTML
      const html = createHtml(outputBundlestats);
      fs.writeFileSync(path.join("./", outputFile), html); // 将 HTML 写入文件
    },
  };
};

export default VitePluginVisualizer; // 导出插件