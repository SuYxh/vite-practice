# Vite 构建计时插件 (viteBuildTimer)

## 概览

Vite 构建计时插件（`viteBuildTimer`）是一个用于 Vite 的简单插件，用于在构建过程中测量并显示耗时。这个插件提供了一个简洁的方式来跟踪构建过程所需的时间，有助于优化和监控项目的构建性能。

## 功能

- **构建耗时显示**：在构建开始和结束时输出构建耗时。
- **简单集成**：轻松集成到现有的 Vite 项目中。
- **无配置**：无需额外配置，直接使用。

## 安装

由于此插件是自定义开发的，它可能不会作为 npm 包提供。您通常需要将其源代码直接包含在项目中。例如，您可以将其保存为项目中的 `vite-plugin-timer.js`。

```
pnpm i -D @vite-study/vite-plugin-timer
```



## 使用

在您的 Vite 配置文件中，导入并使用 `viteBuildTimer` 插件：

```javascript
import { defineConfig } from 'vite';
import viteBuildTimer from '@vite-study/vite-plugin-timer';

export default defineConfig({
  plugins: [
    viteBuildTimer(),
    // 其他插件...
  ],
});
```

## 示例

使用 `viteBuildTimer` 插件后，当您启动 Vite 构建时，控制台将显示类似以下的输出：

```
Build started...
Build finished in 1234ms
```

## 贡献

如果您有改进 `viteBuildTimer` 插件的想法或代码，欢迎贡献。请确保您的代码更改是有效的，并且经过适当的测试。

## 许可证

该插件根据 [MIT 许可证](LICENSE) 授权。

---

更多详情和源代码，请参见[项目仓库](https://github.com/SuYxh/vite-practice)。