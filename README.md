# AI 聊天助手AIzaSyBQ2Wj7OHUOIy0ZqaWRoXRZyOizXxP4YOI

一个基于 Vue 3 + TypeScript + Tailwind CSS 的现代化 AI 聊天应用，支持多个 AI 模型提供商。

## 功能特性

- 🤖 **多模型支持**: OpenAI、DeepSeek、智谱AI
- 🌙 **暗黑模式**: 完整的主题切换系统
- 📱 **响应式设计**: 适配各种设备
- ⚡ **TypeScript**: 完整的类型安全
- 🎨 **现代UI**: 基于 Tailwind CSS

## 环境变量配置

### 模型控制变量

每个 AI 模型提供商都有两个环境变量：

#### OpenAI
```env
VITE_OPENAI_USE=true          # 是否启用 OpenAI 模型
VITE_OPENAI_TOKEN=sk-xxx      # OpenAI API 密钥
VITE_OPENAI_BASE_URL=https://api.openai.com/v1
```

#### DeepSeek
```env
VITE_DEEPSEEK_USE=true        # 是否启用 DeepSeek 模型
VITE_DEEPSEEK_TOKEN=sk-xxx    # DeepSeek API 密钥
VITE_DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
```

#### 智谱AI
```env
VITE_ZHIPU_USE=true           # 是否启用智谱AI 模型
VITE_ZHIPU_TOKEN=xxx          # 智谱AI API 密钥
VITE_ZHIPU_BASE_URL=https://open.bigmodel.cn/api/paas/v4
```

#### 默认模型
```env
VITE_DEFAULT_MODEL=gpt-3.5-turbo  # 默认使用的模型
```

### 配置说明

- `*_USE` 变量控制是否启用该模型提供商（`true`/`false`）
- `*_TOKEN` 变量存储对应的 API 密钥
- 只有启用且有有效 API 密钥的模型才会在界面中显示

## 本地开发

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd ai_chatbot
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **配置环境变量**
   ```bash
   cp .env.example .env
   # 编辑 .env 文件，填入您的 API 密钥
   ```

4. **启动开发服务器**
   ```bash
   pnpm run dev
   ```

5. **构建生产版本**
   ```bash
   pnpm run build
   ```

## Vercel 部署

### 部署步骤

1.  **Fork 本仓库**

2.  **在 Vercel 中新建项目**

    登录 [Vercel](https://vercel.com)，选择“Add New...” -> “Project”，然后导入你 Fork 的仓库。

3.  **配置环境变量**

    在项目设置的“Environment Variables”中，添加以下变量。请注意，`vercel.json` 文件中的 `@` 符号引用了这些密钥，因此你需要将它们添加为 **Secrets**。

    | 密钥名称 (`Name`)          | 推荐值 (`Value`)                           |
    | -------------------------- | ------------------------------------------ |
    | `openai_use`               | `true`                                     |
    | `openai_token`             | `sk-xxxxxxxxxxxxxxxxxxxxxxxx`              |
    | `openai_base_url`          | `https://api.openai.com/v1`                |
    | `deepseek_use`             | `true`                                     |
    | `deepseek_token`           | `sk-xxxxxxxxxxxxxxxxxxxxxxxx`              |
    | `deepseek_base_url`        | `https://api.deepseek.com/v1`              |
    | `zhipu_use`                | `true`                                     |
    | `zhipu_token`              | `xxxxxxxxxxxxxxxxxxxxxxxx`                 |
    | `zhipu_base_url`           | `https://open.bigmodel.cn/api/paas/v4`     |
    | `default_model`            | `gpt-3.5-turbo`                            |

    **重要提示**: Vercel 会自动为所有环境变量添加 `VITE_` 前缀，因此在 Vercel UI 中输入密钥名称时，请**不要**包含 `VITE_`。

4.  **部署**

    配置完成后，Vercel 将自动开始部署。部署成功后，你就可以访问你的专属 AI 聊天应用了。

## 技术栈

- **前端框架**: Vue 3
- **开发语言**: TypeScript
- **构建工具**: Vite
- **样式框架**: Tailwind CSS
- **AI 集成**: LangChain
- **包管理**: pnpm
- **部署平台**: Vercel

## 项目结构

```
src/
├── components/          # Vue 组件
│   ├── DarkModeToggle.vue
│   └── Dropdown.vue
├── config/             # 配置文件
│   └── models.ts       # AI 模型配置
├── services/           # 服务层
│   └── aiService.ts    # AI 服务
├── App.vue            # 主应用组件
├── main.ts            # 应用入口
└── style.css          # 全局样式
```

## 许可证

MIT License