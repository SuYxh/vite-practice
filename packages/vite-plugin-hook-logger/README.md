# Vite 钩子日志插件 (viteHookLogger)

## 概览

Vite 钩子日志插件（`viteHookLogger`）是一个用于 Vite 的自定义开发插件，旨在记录和显示 Vite 和 Rollup 钩子的调用情况。这个插件能够帮助开发者更好地理解 Vite 插件的工作流程和钩子的执行顺序，对于调试和优化插件开发非常有用。

## 功能

- **钩子调用日志**：在控制台输出每个 Vite 和 Rollup 钩子的调用信息。
- **开发辅助**：帮助开发者了解插件在不同阶段的行为。
- **易于集成**：可以轻松集成到任何 Vite 项目中。

## 安装

```
pnpm i -D @vite-study/vite-plugin-hook-logger
```



## 使用方法

在您的 Vite 配置文件中，导入并使用 `viteHookLogger` 插件：

```javascript
import { defineConfig } from 'vite';
import viteHookLogger from '@vite-study/vite-plugin-hook-logger';

export default defineConfig({
  plugins: [
    viteHookLogger(),
    // 其他插件...
  ],
});
```

## 示例

启用 `viteHookLogger` 插件后，您将在控制台看到类似以下的输出，这取决于您的插件配置和项目结构：

```
config called, command: serve
configResolved called
```

## 贡献

如果您有改进 `viteHookLogger` 插件的想法或代码，欢迎贡献。请确保您的代码更改是有效的，并且经过适当的测试。

## 许可证

该插件根据 [MIT 许可证](LICENSE) 授权。

---

更多详情和源代码，请参见[项目仓库](https://github.com/SuYxh/vite-practice)。