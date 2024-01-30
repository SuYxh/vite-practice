# Vite 移除 Console 插件

## 概述

`vite-plugin-no-console` 是一个用于 Vite 的插件，旨在从代码中移除所有的 `console.log` 语句。这对于生产构建特别有用，可以帮助保持控制台输出的干净和无日志信息。

## 功能

- 从 JavaScript 文件中移除所有 `console.log` 语句。
- 可以轻松集成到任何 Vite 项目中。
- 在生产环境中保持控制台输出的清洁。

## 安装

```bash
pnpm i -D vite-plugin-no-console
```

## 使用方法

将插件添加到你的 `vite.config.js`：

```javascript
import { defineConfig } from 'vite';
import removeConsolePlugin from 'vite-plugin-no-console';

export default defineConfig({
  plugins: [removeConsolePlugin()]
});
```

## 配置

无需额外配置，默认情况下插件会移除所有 `console.log` 语句。

## 许可证

本项目采用 MIT 许可证。

## 贡献

欢迎贡献。如果您有任何改进或建议，请提交 pull request 或 issue。