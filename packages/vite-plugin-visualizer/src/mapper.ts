// 定义节点元数据接口
interface INodeMeta<T> {
  id: string;               // 模块ID
  bundleIdMap: Record<string, string>; // 捆绑ID到UID的映射
  imported: T;              // 导入的模块集合
  importedBy: T;            // 被其他模块导入的集合
  isEntry?: boolean;        // 是否为入口模块
  isExternal?: boolean;     // 是否为外部模块
}

// 定义节点元数据映射类型
type NodeMetaMap = Record<
  string,
  {
    uid: string;             // 节点的唯一标识符
    meta: INodeMeta<Set<string>>; // 节点的元数据
  }
>;

// 生成随机唯一标识符的函数
const getUid = (alphabet: string, size: number) => () => {
  let result = "";
  for (let i = 0; i < size; i++) {
    result += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return result;
};

// 生成唯一ID的前缀
const nanoid = getUid("sunshine", 6);
const UNIQUE_PREFIX = nanoid();
let counter = 0;

// 生成全局唯一ID的函数
const uniqueId = () => `${UNIQUE_PREFIX}-${counter++}`;

// ModuleMapper 类定义
class ModuleMapper {
  private projectRoot: string;           // 项目根目录路径
  private nodePartMap: NodeMetaMap = {}; // 存储节点的部分信息
  private nodeMetaMap: NodeMetaMap = {}; // 存储节点的元数据

  // 构造函数
  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }

  // 裁剪掉模块ID中的项目根路径
  trimProjectRootId(moduleId: string) {
    return moduleId.startsWith(this.projectRoot)
      ? moduleId.slice(this.projectRoot.length)
      : moduleId;
  }

  // 获取模块的唯一标识符
  getModuleUID(moduleId: string) {
    if (!this.nodeMetaMap[moduleId]) {
      this.nodeMetaMap[moduleId] = {
        uid: uniqueId(),
        meta: {
          id: this.trimProjectRootId(moduleId),
          bundleIdMap: {},
          imported: new Set(),
          importedBy: new Set(),
        },
      };
    }
    return this.nodeMetaMap[moduleId].uid;
  }

  // 获取捆绑模块的唯一标识符
  getBundleModuleUID(bundleId: string, moduleId: string) {
    const moduleUID = this.getModuleUID(moduleId);
    if (!this.nodeMetaMap[moduleId].meta.bundleIdMap[bundleId]) {
      this.nodeMetaMap[moduleId].meta.bundleIdMap[bundleId] = uniqueId();
    }
    return this.nodeMetaMap[moduleId].meta.bundleIdMap[bundleId];
  }

  // 设置节点的部分信息
  setNodePart(bundleId: string, moduleId: string, value: any) {
    const uid = this.getBundleModuleUID(bundleId, moduleId);
    if (this.nodePartMap[uid]) {
      throw new Error(
        `Override module: bundle id ${bundleId}, module id ${moduleId}, value ${JSON.stringify(
          value
        )}, existing value: ${JSON.stringify(this.nodePartMap[uid])}`
      );
    }
    this.nodePartMap[uid] = { ...value, metaUid: this.getModuleUID(moduleId) };
    return uid;
  }

  // 设置节点的元数据
  setNodeMeta(moduleId: string, value: any) {
    const uid = this.getModuleUID(moduleId);
    this.nodeMetaMap[moduleId].meta = { ...this.nodeMetaMap[moduleId].meta, ...value };
  }

  // 检查是否存在节点的部分信息
  hasNodePart(bundleId: string, moduleId: string) {
    const moduleUID = this.getModuleUID(moduleId);
    return !!this.nodePartMap[this.nodeMetaMap[moduleId].meta.bundleIdMap[bundleId]];
  }

  // 获取节点的部分信息映射
  getNodePartMap() {
    return this.nodePartMap;
  }

  // 获取节点的元数据映射
  getNodeMetaMap() {
    return this.nodeMetaMap;
  }

  // 添加导入链接
  addImportedLink(targetId: string, sourceId: string) {
    const targetUID = this.getModuleUID(targetId);
    const sourceUID = this.getModuleUID(sourceId);
    this.nodeMetaMap[targetUID].meta.importedBy.add(sourceUID);
  }

  // 添加被导入链接
  addImportedByLink(targetId: string, sourceId: string) {
    const targetUID = this.getModuleUID(targetId);
    const sourceUID = this.getModuleUID(sourceId);
    this.nodeMetaMap[sourceUID].meta.imported.add(targetUID);
  }
}

export default ModuleMapper;
