# 现在学习 vite 还来得及吗？

## 简介

Vite 是一个现代的前端构建工具，由 Vue.js 的创作者尤雨溪（Evan You）开发。Vite 的目标是提供一个更快、更轻量的开发环境。它利用了 JavaScript 的原生模块系统（ESM - ECMAScript Modules），这使得它能够在浏览器中直接运行源代码，从而实现快速的热模块替换（HMR - Hot Module Replacement）。

Vite 的主要特点包括：

1. **快速的冷启动**：Vite 利用现代浏览器支持的原生 ECMAScript 模块（ESM）来直接加载模块。这意味着在开发过程中，Vite 不需要对代码进行打包和构建，从而大大减少了启动时间。
2. **即时的模块热更新(HMR)**：由于 Vite 使用 ESM，所以可以实现更快速的热模块替换。只有实际更改的模块会被重新加载和更新，而不是整个页面或整个应用，这使得开发过程中的响应时间更短。
3. **按需编译**：传统的打包工具在开发过程中会对整个应用进行打包，这可能会很慢，特别是对于大型项目。而 Vite 只会在浏览器请求时才编译这个模块，未被请求的模块不会被编译，从而大大加快了加载速度。
4. **内建的 TypeScript 支持**：不需要额外的插件或配置。
5. **丰富的插件生态**：可以轻松集成各种工具和框架，如 Vue、React 等。
6. **优化的生产构建**：利用 Rollup 打包，为生产环境提供优化过的代码。
7. **优化的依赖预构建**：对于那些不支持 ESM 的依赖，Vite 会在第一次启动时进行预构建，并缓存结果。这意味着重复的构建时间被大大减少，因为只有在依赖项发生变化时才需要重新构建。

Vite 的设计哲学是利用现代浏览器支持的原生 ESM 特性，减少传统构建工具所需的复杂配置和构建时间，提供更轻松、更快速的开发体验。



![esm.3070012d.png](https://qn.huat.xyz/mac/202401311928364.awebp)





## vite 插件钩子

### 1. vite 独有的钩子

1. `enforce` ：值可以是`pre` 或 `post` ， `pre` 会较于 `post` 先执行；
2. `apply` ：值可以是 `build` 或 `serve`  亦可以是一个函数，指明它们仅在 `build` 或 `serve` 模式时调用；
3. `config(config, env)` ：可以在 vite 被解析之前修改 vite 的相关配置。钩子接收原始用户配置 config 和一个描述配置环境的变量env；
4. `configResolved(resolvedConfig)` ：在解析 vite 配置后调用。使用这个钩子读取和存储最终解析的配置。当插件需要根据运行的命令做一些不同的事情时，它很有用。
5. `configureServer(server)` ：主要用来配置开发服务器，为 dev-server (connect 应用程序) 添加自定义的中间件；
6. `transformIndexHtml(html)` ：转换 index.html 的专用钩子。钩子接收当前的 HTML 字符串和转换上下文；
7. `handleHotUpdate(ctx)`：执行自定义HMR更新，可以通过ws往客户端发送自定义的事件；

### 2. vite 与 rollup 的通用钩子之构建阶段

1. `options(options)` ：在服务器启动时被调用：获取、操纵Rollup选项，严格意义上来讲，它执行于属于构建阶段之前；
2. `buildStart(options)`：在每次开始构建时调用；
3. `resolveId(source, importer, options)`：在每个传入模块请求时被调用，创建自定义确认函数，可以用来定位第三方依赖；
4. `load(id)`：在每个传入模块请求时被调用，可以自定义加载器，可用来返回自定义的内容；
5. `transform(code, id)`：在每个传入模块请求时被调用，主要是用来转换单个模块；
6. `buildEnd(error?: Error)`：在构建阶段结束后被调用，此处构建结束只是代表所有模块转义完成；

### 3. vite 与 rollup 的通用钩子之输出阶段

1. `outputOptions(options)`：接受输出参数；
2. `renderStart(outputOptions, inputOptions)`：每次 bundle.generate 和 bundle.write 调用时都会被触发；
3. `augmentChunkHash(chunkInfo)`：用来给 chunk 增加 hash；
4. `renderChunk(code, chunk, options)`：转译单个的chunk时触发。rollup 输出每一个chunk文件的时候都会调用；
5. `generateBundle(options, bundle, isWrite)`：在调用 bundle.write 之前立即触发这个 hook；
6. `writeBundle(options, bundle)`：在调用 bundle.write后，所有的chunk都写入文件后，最后会调用一次 writeBundle；
7. `closeBundle()`：在服务器关闭时被调用



## 插件钩子函数 hooks 的执行顺序

![vite插件开发钩子函数 (1).png](https://qn.huat.xyz/mac/202401311925610.awebp)



## 插件的执行顺序

1. 别名处理Alias
2. 用户插件设置`enforce: 'pre'`
3. vite 核心插件
4. 用户插件未设置`enforce`
5. vite 构建插件
6. 用户插件设置`enforce: 'post'`
7. vite 构建后置插件(minify, manifest, reporting)







## 插件开发

Vite 插件的生命周期基于 Rollup 的插件系统，但是 Vite 对其进行了扩展以适应其特有的开发服务器和构建流程。了解 Vite 插件的生命周期，需要区分开发模式和生产构建模式，因为在这两种模式下，插件的行为和可用的钩子可能会有所不同。

### 开发模式下的钩子

在开发模式下，Vite 提供了一系列钩子，这些钩子主要围绕 Vite 的开发服务器和模块热更新（HMR）功能：

1. **configureServer**: 在开发服务器启动之前调用，可以用来配置服务器或添加自定义中间件。

2. **configurePreview**: 类似于 `configureServer`，但用于 Vite 的静态预览服务器。

3. **resolveId**: 用于自定义模块解析逻辑。

4. **load**: 当请求模块内容时调用，可以返回自定义内容。

5. **transform**: 用于在模块被送往浏览器之前应用代码转换。

6. **handleHotUpdate**: 在 HMR 更新时调用，可以自定义热更新的行为。

### 生产构建模式下的钩子

在生产构建模式下，Vite 插件会更多地依赖于 Rollup 的插件钩子。以下是一些关键的生命周期钩子：

1. **options**: 用于修改 Rollup 选项。

2. **buildStart** 和 **buildEnd**: 在构建开始和结束时调用。

3. **resolveId**, **load**, **transform**: 与开发模式类似，用于模块解析和转换。

4. **renderStart** 和 **renderChunk**: 在生成代码块和最终 bundle 之前调用。

5. **generateBundle**: 在文件被写入输出目录之前调用，可以用来修改构建结果。

6. **writeBundle**: 在文件写入磁盘之后调用。

### 公共钩子

有些钩子在开发和生产构建模式下都可用，比如 `resolveId`, `load`, 和 `transform`。这些钩子使得开发者可以写出在不同模式下都能一致工作的插件。

### 常用钩子

| **字段**           | **说明**                                                     | **所属**                  |
| ------------------ | ------------------------------------------------------------ | ------------------------- |
| name               | 插件名称                                                     | `vite` 和 `rollup` 共享   |
| handleHotUpdate    | 执行自定义 HMR（模块热替换）更新处理                         | `vite` 独享               |
| config             | 在解析 Vite 配置前调用。可以自定义配置，会与 `vite` 基础配置进行合并 | `vite` 独享               |
| configResolved     | 在解析 Vite 配置后调用。可以读取 `vite` 的配置，进行一些操作 | `vite` 独享               |
| configureServer    | 是用于配置开发服务器的钩子。最常见的用例是在内部 connect 应用程序中添加自定义中间件。 | `vite` 独享               |
| transformIndexHtml | 转换 `index.html` 的专用钩子                                 | `vite` 独享               |
| options            | 在收集 `rollup` 配置前，`vite` （本地）服务启动时调用，可以和 `rollup` 配置进行合并 | `vite` 和 `rollup` 共享   |
| buildStart         | 在 `rollup` 构建中，`vite` （本地）服务启动时调用，在这个函数中可以访问 `rollup` 的配置 | ```vite` 和 `rollup` 共享 |
| resolveId          | 在解析模块时调用，可以返回一个特殊的 `resolveId `来指定某个 `import` 语句加载特定的模块 | ```vite` 和 `rollup` 共享 |
| load               | 在解析模块时调用，可以返回代码块来指定某个 `import` 语句加载特定的模块 | ```vite` 和 `rollup` 共享 |
| transform          | 在解析模块时调用，将源代码进行转换，输出转换后的结果，类似于 `webpack` 的 `loader` | ```vite` 和 `rollup` 共享 |
| buildEnd           | 在` vite `本地服务关闭前，`rollup` 输出文件到目录前调用      | ```vite` 和 `rollup` 共享 |
| closeBundle        | 在 `vite `本地服务关闭前，`rollup` 输出文件到目录前调用      | ```vite` 和 `rollup` 共享 |



### 注意事项

- 插件的顺序很重要，因为它们的执行顺序会影响到模块解析和处理的结果。
- 并非所有 Rollup 的钩子在 Vite 中都有对应。Vite 的文档提供了详细的信息，说明了哪些钩子是受支持的。
- Vite 还提供了一些专门的 API，比如用于模块热更新（HMR）的 API，这些 API 仅在开发模式下可用。

了解这些钩子及其在不同模式下的行为，对于编写有效且高效的 Vite 插件至关重要。Vite 的官方文档提供了关于这些钩子更详细的描述和示例，非常推荐作为学习和参考资源。



### 已开发的插件


- [vite-plugin-timer](./packages/vite-plugin-timer/README.md): 构建计时插件
- [vite-plugin-hook-logger](./packages/vite-plugin-hook-logger/README.md): Vite 钩子日志插件
- [vite-plugin-text-replace](./packages/vite-plugin-text-replace/README.md): Vite 文案替换插件
- [ite-plugin-no-console](./packages/vite-plugin-no-console/README.md): 删除 console



## 调试

### vscoode-launch.json

#### 配置

在当前文件夹根目录下创建`.vscode/launch.json`，写入：

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
        "build"
      ],
      "runtimeExecutable": "npm",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "type": "node"
    }
    
  ]
}
```

内容解释：

**version**: 指定配置文件的版本。这里是` "0.2.0"`，表明它遵循一定的格式和标准。

**configurations**: 这个数组包含了一个或多个调试配置。每个配置是一个对象，包含了用于启动和调试项目的一系列选项。

在您提供的配置文件中，有一个配置对象：

- **name**: 配置的名称。这里是 `"Launch via NPM"`，它是一个描述性的标签，帮助用户识别不同的调试配置。

- **request**: 指定调试会话的类型。`"launch"` 表示 `Visual Studio Code` 将启动一个新的程序实例作为调试会话的一部分。

- **runtimeArgs**: 包含传递给运行时的参数列表。这里的参数是 `["run-script", "build"]`，它指示 `npm`（Node.js 的包管理器）执行名为` "build"` 的脚本。相当于运行 `npm run build`

- **runtimeExecutable**: 指定用于运行应用程序的运行时可执行文件。这里是 `"npm"`，表示使用` npm` 来启动应用程序，你可以修改成 `pnpm` 。

- **skipFiles**: 包含一个路径数组，调试器将跳过这些文件或路径中的代码。`"<node_internals>/**"` 表示所有内置的 Node.js 模块都将被跳过，这有助于调试时集中注意力在你自己的源代码上。

- **type**: 指定调试器的类型。这里是 `"node"`，表示使用 `Node.js` 调试器。



#### 运行调试

然后在你需要调试的地方打上断点或者 `debugger`

![image-20240130193830834](https://qn.huat.xyz/mac/202401301938874.png)

然后我们就可以看到走进来了：

![image-20240130193912437](https://qn.huat.xyz/mac/202401301939470.png)



#### runtimeArgs技巧

##### 运行 2 个命令

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch via NPM with Clean",
      "request": "launch",
      "runtimeArgs": [
        "run-script", 
        "clean",
        "&&",
        "run-script",
        "build"
      ],
      "runtimeExecutable": "npm",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "type": "node"
    }
  ]
}
```

相当于 `npm run clean && npm run build` 



##### 带参数

在 Node.js 项目中，当通过 `npm` 运行脚本时，可以在脚本名后面添加参数，这些参数会被传递给脚本。

假设您想为 `build` 脚本添加一个名为 `--my-param` 的参数， `runtimeArgs` 配置将如下所示：

```js
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch via NPM with Build Argument",
      "request": "launch",
      "runtimeArgs": [
        "run-script",
        "build",
        "--",
        "--my-param"
      ],
      "runtimeExecutable": "npm",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "type": "node"
    }
  ]
}
```

在这里，`"--"` 是一个特殊的标记，用于告诉 npm 后面的参数应该直接传递给 `build` 脚本，而不是被 npm 自身处理。请确保 `build` 脚本能够接收并正确处理这个参数。

如果想让参数被 `npm` 处理应该怎么办呢？

只需将参数直接加入到 `runtimeArgs` 数组中，而不是在 `--` 后面。npm 有一些内置的命令行选项，比如用于改变日志级别的 `--loglevel`。举个例子，假设您想在运行 `build` 脚本时，将 npm 的日志级别设置为 `verbose`。您的配置将如下所示：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch via NPM with NPM Argument",
      "request": "launch",
      "runtimeArgs": [
        "run-script",
        "build",
        "--loglevel",
        "verbose"
      ],
      "runtimeExecutable": "npm",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "type": "node"
    }
  ]
}
```



### vite-plugin-inspect

#### 简介

`vite-plugin-inspect` 是一个用于 Vite 的插件，它允许开发者检查 Vite 插件处理的中间状态。这个插件对于调试和编写 Vite 插件非常有用。要使用它，您需要在您的 `vite.config.ts` 文件中引入并添加 `Inspect` 插件。运行 `npm run dev` 后，您可以访问特定的 URL (`localhost:5173/__inspect/`) 来检查模块。对于构建模式的检查，可以通过传递 `build: true` 选项来启用，并在构建后使用 `npx serve .vite-inspect` 来查看结果。

#### 用处

`vite-plugin-inspect` 是一个对 Vite 插件开发者特别有用的工具。它允许您查看和检查 Vite 插件在其处理流程中的各个阶段所生成的中间状态。这对于调试插件、理解插件之间的交互以及分析插件对模块的影响非常有帮助。通过使用此插件，开发者可以更容易地识别和解决插件开发过程中的问题，优化插件的性能，以及验证插件的行为是否符合预期。简而言之，`vite-plugin-inspect` 为 Vite 插件的开发和调试提供了一个直观且强大的界面。



⚠️注意 会在你当前文件夹下多一个 `.vite-inspect` 的文件夹

![image-20240130192734079](https://qn.huat.xyz/mac/202401301927158.png)



#### 界面

![image-20240130192804724](https://qn.huat.xyz/mac/202401301928751.png)

vite-plugin-text-replace插件

![image-20240130193247435](https://qn.huat.xyz/mac/202401301932459.png)

可以看到vite插件  `vite-plugin-text-replace` 将 `vue` 文件中的 `更新` 替换成了 `更换诗词`

vue 插件

![image-20240130193432274](https://qn.huat.xyz/mac/202401301934307.png)

vue 插件将 vue 文件进行了转换







