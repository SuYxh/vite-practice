vite 调试





### 下载代码

```bash
# 1. 克隆 github 仓库中的源码
git clone https://github.com/vitejs/vite.git

# 2. 进入 vite 目录
cd vite

# 3. 使用 pnpm 初始化
pnpm install
```





### 配置调试文件

这段调试代码表示在 `${workspaceFolder}/packages/playground/alias` 这个项目中执行 `pnpm dev` 这个命令

```json
{
  // 使用 IntelliSense 了解相关属性。 
  // 悬停以查看现有属性的描述。
  // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch via NPM",
      "request": "launch",
      "runtimeArgs": [
        "run-script",
        "dev"
      ],
      "runtimeExecutable": "pnpm",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "type": "node",
      "cwd": "${workspaceFolder}/packages/playground/alias"
    }
  ]
}
```

> cwd 表示你需要调试的项目路径，你可能需要更换成你对应的路径



### playground

有一些开源项目会有 `playground` 我们就可以直接使用这些项目来调试相关源码，注意需要开启 `sourcemap`。

以 `vite 2.7.2` 版本为例：

1、检查  `sourcemap` 是否开启。

![image-20240201103333597](https://qn.huat.xyz/mac/202402011033663.png)

可以看到 `vite`这个包是开启的。



2、使用  `packages/playground/alias` 项目调试 vite 源码，在 `packages/vite/src/node/cli.ts` 文件的 81 行打上断点

![image-20240201103510735](https://qn.huat.xyz/mac/202402011035771.png)

运行：

![image-20240201103614632](https://qn.huat.xyz/mac/202402011036662.png)

就可以进入断点了。



### 通过自己项目调试

使用软链接



参考这篇文章  (vite)如何从0到1参与开源项目成为contributor 中的 阅读源码 部分

https://juejin.cn/post/7219575717423743034





### 参考



面试官：你会看 Vite 源码吗？

https://juejin.cn/post/7094984070999834655



授人予渔，VSCode 如何调试 Vite 代码？

https://cloud.tencent.com/developer/article/2025098



(vite)如何从0到1参与开源项目成为contributor

https://juejin.cn/post/7219575717423743034











