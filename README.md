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

### 方法一：通过 Vercel CLI

1. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **部署项目**
   ```bash
   vercel
   ```

### 方法二：通过 Vercel Dashboard

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "New Project"
3. 导入您的 Git 仓库
4. Vercel 会自动检测到这是一个 Vite 项目

### 环境变量配置

在 Vercel Dashboard 中配置以下环境变量：

| 变量名 | 描述 | 示例值 |
|--------|------|--------|
| `VITE_OPENAI_USE` | 是否启用 OpenAI | `true` |
| `VITE_OPENAI_TOKEN` | OpenAI API 密钥 | `sk-xxx` |
| `VITE_OPENAI_BASE_URL` | OpenAI API 基础URL | `https://api.openai.com/v1` |
| `VITE_DEEPSEEK_USE` | 是否启用 DeepSeek | `true` |
| `VITE_DEEPSEEK_TOKEN` | DeepSeek API 密钥 | `sk-xxx` |
| `VITE_DEEPSEEK_BASE_URL` | DeepSeek API 基础URL | `https://api.deepseek.com/v1` |
| `VITE_ZHIPU_USE` | 是否启用智谱AI | `true` |
| `VITE_ZHIPU_TOKEN` | 智谱AI API 密钥 | `xxx` |
| `VITE_ZHIPU_BASE_URL` | 智谱AI API 基础URL | `https://open.bigmodel.cn/api/paas/v4` |
| `VITE_DEFAULT_MODEL` | 默认模型 | `gpt-3.5-turbo` |

### 部署配置

项目包含 `vercel.json` 配置文件，确保：
- 使用 `pnpm` 作为包管理器
- 正确的构建和输出目录配置
- SPA 路由重写规则

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