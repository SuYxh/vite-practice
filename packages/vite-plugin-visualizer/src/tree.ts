import ModuleMapper from "./mapper"; // 导入 ModuleMapper 类，用于处理模块映射

// 定义一个节点接口，表示树中的每个节点
interface INode {
  name: string;       // 节点的名称
  children: INode[];  // 子节点数组
  value?: number;     // 节点的值，例如模块大小
  uid?: string;       // 节点的唯一标识符
}

// 判断一个节点是否为模块树节点的函数
const isModuleTree = (node: INode) => node.children;

// 将模块添加到树中的指定路径的函数
const addPath = (moduleId: string, tree: INode, path: string[], node: any) => {
  if (path.length === 0) {
    throw new Error(`Error adding node to path ${moduleId}`);
  }
  const [name, ...rest] = path; // 分解路径的第一部分和剩余部分

  if (rest.length === 0) {
    // 如果路径没有剩余部分，则直接将节点添加到当前树节点
    tree.children.push({ ...node, name });
    return;
  }

  // 在当前节点的子节点中查找下一个路径部分
  let _tree = tree.children.find(
    (folder) => folder.name === name && isModuleTree(folder)
  );

  // 如果找不到，创建一个新的子节点
  if (!_tree) {
    _tree = { name, children: [] };
    tree.children.push(_tree);
  }
  // 递归调用 addPath，直到路径为空
  addPath(moduleId, _tree, rest, node);
};

// 优化树结构，合并只有单个子节点的树节点的函数
const mergeSingleChildTrees = (tree: INode): INode => {
  if (tree.children.length === 1) {
    const child = tree.children[0];
    const name = `${tree.name}/${child.name}`;
    if (isModuleTree(child)) {
      // 如果子节点是一个模块树，合并当前节点和子节点
      tree.name = name;
      tree.children = child.children;
      return mergeSingleChildTrees(tree); // 递归合并
    } else {
      // 如果子节点不是模块树，创建一个新的合并节点
      return {
        name,
        uid: child.uid,
        value: child.value,
      } as INode;
    }
  } else {
    // 如果有多个子节点，递归处理每个子节点
    tree.children = tree.children.map((node: any) => {
      if (isModuleTree(node)) {
        return mergeSingleChildTrees(node);
      } else {
        return node;
      }
    });
    return tree;
  }
};

// 构建模块依赖树的主函数
export const buildTree = (
  bundleId: string, // 打包标识符
  modules: any[],   // 模块列表
  mapper: ModuleMapper // 模块映射器
) => {
  const tree: INode = {
    name: bundleId, // 树的根节点名称为打包标识符
    children: [],   // 初始化子节点数组
  };
  for (const { id, length } of modules) {
    // 为每个模块生成一个唯一标识符
    const bundleModuleUID = mapper.setNodePart(bundleId, id, { length });
    // 获取模块的相对路径
    const trimmedModuleId = mapper.trimProjectRootId(id);
    // 将模块路径分解为数组
    const pathParts = trimmedModuleId.split("/").filter((p) => p !== "");

    // 将模块添加到树中
    addPath(trimmedModuleId, tree, pathParts, {
      uid: bundleModuleUID,
      value: length,
    });
  }

  // 优化树结构
  tree.children = tree.children.map((node) => {
    if (isModuleTree(node)) {
      return mergeSingleChildTrees(node);
    } else {
      return node;
    }
  });

  return tree; // 返回构建的树
};
