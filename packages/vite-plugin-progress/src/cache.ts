// 导入文件系统和路径处理模块
import fs from 'fs';
import path from 'path';

// 定义缓存文件的路径，位于当前工作目录下的 node_modules/.progress 文件夹中
const dirPath = path.join(process.cwd(), 'node_modules', '.progress');
const filePath = path.join(dirPath, 'index.json');

// 定义一个接口用于描述缓存数据的结构
export interface ICacheData {
    /**
     * Transform all count
     * 记录所有的转换次数
     */
    cacheTransformCount: number;

    /**
     * chunk all count
     * 记录所有的代码块数量
     */
    cacheChunkCount: number
}

// 检查缓存文件是否存在
export const isExists = fs.existsSync(filePath) || false;

/**
 * 获取缓存数据
 * 如果缓存存在，从缓存文件中读取数据并解析为 ICacheData 对象
 * 如果缓存不存在，返回包含0的 ICacheData 对象
 * @returns ICacheData
 */
export const getCacheData = (): ICacheData => {
    if (!isExists) return {
        cacheTransformCount: 0,
        cacheChunkCount: 0
    };

    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

/**
 * 设置缓存数据
 * 将传入的 ICacheData 对象转换为 JSON 字符串，并写入缓存文件
 * 如果缓存目录不存在，则先创建目录
 * @returns 
 */
export const setCacheData = (data: ICacheData) => {
    !isExists && fs.mkdirSync(dirPath);
    fs.writeFileSync(filePath, JSON.stringify(data));
};
