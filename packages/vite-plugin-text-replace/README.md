# Vite 文案替换插件

## 概览

Vite 文案替换插件是一个高度可配置的 Vite 插件，用于在 Vue 文件中根据不同的文件类型执行不同的文本替换。这个插件支持为不同的文件类型定义一组特定的替换规则，使其在复杂的项目结构中特别有用。

## 功能

- **支持多文件类型**：可以针对不同的文件类型（如 `.vue`、`.js`）配置不同的替换规则。
- **灵活的替换配置**：每种文件类型都可以有多个替换规则。
- **简单易用**：简洁的 API，易于配置和使用。

## 安装

要使用 Vite 多条件替换插件，请首先将其作为开发依赖安装到您的 Vite 项目中：

```bash
pnpm i -D @vite-study/vite-plugin-text-replace
```

## 使用方法

在您的 Vite 配置文件中，按如下方式导入并配置插件：

```typescript
import { defineConfig } from 'vite';
import createReplacePlugin from '@vite-study/vite-plugin-text-replace';

export default defineConfig({
  plugins: [
    createReplacePlugin([
      {
        fileType: '.vue',
        replacements: [
          { from: '原文1', to: '替换文本1' },
          // 更多针对 .vue 文件的替换规则...
        ]
      },
      {
        fileType: '.js',
        replacements: [
          { from: '原文2', to: '替换文本2' },
          // 更多针对 .js 文件的替换规则...
        ]
      },
      // 可以添加更多文件类型的配置...
    ]),
    // ...其他插件
  ],
});
```

## 配置选项

插件接受一个对象数组作为配置，每个对象包括：

- `fileType`: 字符串，指定插件应用的文件类型。
- `replacements`: 替换规则的数组。每个规则对象包含 `from` 和 `to` 属性，分别代表原始文本和替换后的文本。

## 示例

以下是一个配置示例：

```typescript
createReplacePlugin([
  {
    fileType: '.vue',
    replacements: [
      { from: '欢迎', to: 'Bienvenue' },
      { from: '世界', to: 'Monde' },
    ]
  },
  {
    fileType: '.js',
    replacements: [
      { from: 'console.log', to: 'console.debug' },
    ]
  },
  // 更多配置...
]);
```

此配置将在 `.vue` 文件中替换 "欢迎" 为 "Bienvenue"，"世界" 为 "Monde"，并在 `.js` 文件中替换所有的 `console.log` 为 `console.debug`。

## 贡献

欢迎为 Vite 多条件替换插件贡献代码。请确保您的贡献符合项目的编码标准，并包含适当的测试。

## 许可证

此项目根据 [MIT 许可证](LICENSE) 授权。

---

有关更多信息和详细文档，请参阅[官方仓库](https://github.com/SuYxh/vite-practice)。