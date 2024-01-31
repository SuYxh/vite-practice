// 导入所需的模块和类型定义
import type { PluginOption } from 'vite';
import colors from 'picocolors';
import progress from 'progress';
import rd from 'rd';
import { isExists, getCacheData, setCacheData } from './cache';

// 定义类型辅助工具 Omit 和 Merge
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

// 定义插件选项类型，扩展自 ProgressBar 的选项，并添加额外的属性
type PluginOptions = Merge<
    ProgressBar.ProgressBarOptions,
    {
        total?: number; // 进度条的总刻度数，默认为 100
        format?: string; // 进度条的显示格式
    }
>;

// 插件的主体函数，接受插件选项并返回 PluginOption 类型
export default function viteProgressBar(options?: PluginOptions): PluginOption {

    // 从缓存中获取之前的转换和代码块计数
    const { cacheTransformCount, cacheChunkCount } = getCacheData()

    // 初始化变量
    let bar: progress;
    const stream = options?.stream || process.stderr;
    let outDir: string;
    let transformCount = 0
    let chunkCount = 0
    let transformed = 0
    let fileCount = 0
    let lastPercent = 0
    let percent = 0

    // 返回一个包含多个钩子的对象
    return {
        name: 'vite-plugin-progress', // 插件名称

        enforce: 'pre', // 优先级设置为预处理

        apply: 'build', // 仅在构建时应用

        // 配置钩子：在构建开始前设置
        config(config, { command }) {
            if (command === 'build') {
                // 设置日志级别为 silent，减少输出
                config.logLevel = 'silent';
                // 设置输出目录，默认为 'dist'
                outDir = config.build?.outDir || 'dist';

                // 配置进度条的默认选项
                options = {
                    width: 40, // 默认宽度
                    complete: '\u2588', // 完成部分的字符
                    incomplete: '\u2591', // 未完成部分的字符
                    ...options // 合并用户提供的选项
                };
                options.total = options?.total || 100; // 设置总刻度，默认为 100

                // 根据是否存在缓存来决定是否显示转换和代码块的进度
                const transforming = isExists ? `${colors.magenta('Transforms:')} :transformCur/:transformTotal | ` : ''
                const chunks = isExists ? `${colors.magenta('Chunks:')} :chunkCur/:chunkTotal | ` : ''
                const barText = `${colors.cyan(`[:bar]`)}`

                // 设置进度条的显示格式
                const barFormat =
                    options.format ||
                    `${colors.green('Bouilding')} ${barText} :percent | ${transforming}${chunks}Time: :elapseds`

                // 删除 options 中的 format 属性，以避免重复设置
                delete options.format;
                // 创建进度条实例
                bar = new progress(barFormat, options as ProgressBar.ProgressBarOptions);

                // 如果没有缓存，则遍历源代码目录，计算匹配文件的数量
                if (!isExists) {
                    const readDir = rd.readSync('src');
                    const reg = /\.(vue|ts|js|jsx|tsx|css|scss||sass|styl|less)$/gi;
                    readDir.forEach((item) => reg.test(item) && fileCount++);
                }
            }
        },

        // 转换钩子：每次文件转换时调用
        transform(code, id) {
            transformCount++ // 增加转换计数
            
            // 如果没有缓存，根据转换的文件更新进度条的百分比
            if(!isExists) {
                const reg = /node_modules/gi;

                // 排除 node_modules 中的文件
                if (!reg.test(id) && percent < 0.25) {
                    transformed++
                    percent = +(transformed / (fileCount * 2)).toFixed(2)
                    percent < 0.8 && (lastPercent = percent)
                }
          
                // 在进度达到一定程度后，缓慢增加百分比
                if (percent >= 0.25 && lastPercent <= 0.65) {
                    lastPercent = +(lastPercent + 0.001).toFixed(4)
                } 
            }

            // 如果存在缓存，则使用缓存数据更新进度条
            if (isExists) runCachedData()
            
            // 更新进度条
            bar.update(lastPercent, {
                transformTotal: cacheTransformCount,
                transformCur: transformCount,
                chunkTotal: cacheChunkCount,
                chunkCur: 0,
            })

            // 返回转换后的代码和 source map（此处为 null）
            return {
                code,
                map: null
            };
        },

        // 渲染代码块钩子：每次代码块渲染时调用
        renderChunk() {
            chunkCount++ // 增加代码块计数

            // 根据进度和是否存在缓存更新进度条
            if (lastPercent <= 0.95) 
                isExists ? runCachedData() : (lastPercent = +(lastPercent + 0.005).toFixed(4))

            // 更新进度条
            bar.update(lastPercent, {
                transformTotal: cacheTransformCount,
                transformCur: transformCount,
                chunkTotal: cacheChunkCount,
                chunkCur: chunkCount,
            })

            // 返回 null，不修改代码块
            return null
        },

        // 关闭打包钩子：在构建结束时调用
        closeBundle() {
            // 关闭并清除进度条
            bar.update(1)
            bar.terminate()

            // 保存当前的转换和代码块计数到缓存
            setCacheData({
                cacheTransformCount: transformCount,
                cacheChunkCount: chunkCount,
            })

            // 输出构建成功的消息
            stream.write(
                `${colors.cyan(colors.bold(`Build successful. Please see ${outDir} directory`))}`
            );
            stream.write('\n');
            stream.write('\n');
        }
    };

    // 用于处理缓存数据的辅助函数
    function runCachedData() {
        if (transformCount === 1) {
            stream.write('\n');
            
            bar.tick({
                transformTotal: cacheTransformCount,
                transformCur: transformCount,
                chunkTotal: cacheChunkCount,
                chunkCur: 0,
            })
        }

        // 根据缓存的数据更新进度百分比
        transformed++
        percent = lastPercent = +(transformed / (cacheTransformCount + cacheChunkCount)).toFixed(2)
    }
}
