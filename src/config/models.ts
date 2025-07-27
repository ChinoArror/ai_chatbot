export interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  apiKey: string;
  baseURL: string;
  modelName: string;
  description?: string;
}

export interface ModelProvider {
  id: string;
  name: string;
  models: ModelConfig[];
}

// 从环境变量获取配置
const getEnvVar = (key: string): string => {
  return import.meta.env[key] || '';
};

// 检查模型提供商是否启用
const isProviderEnabled = (provider: string): boolean => {
  const useKey = `VITE_${provider.toUpperCase()}_USE`;
  const useValue = getEnvVar(useKey);
  return useValue === 'true' || useValue === '1';
};

// 模型配置
export const modelProviders: ModelProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    models: [
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        provider: 'openai',
        apiKey: getEnvVar('VITE_OPENAI_TOKEN'),
        baseURL: getEnvVar('VITE_OPENAI_BASE_URL') || 'https://api.openai.com/v1',
        modelName: 'gpt-3.5-turbo',
        description: '快速、经济的对话模型'
      },
      {
        id: 'gpt-4',
        name: 'GPT-4',
        provider: 'openai',
        apiKey: getEnvVar('VITE_OPENAI_TOKEN'),
        baseURL: getEnvVar('VITE_OPENAI_BASE_URL') || 'https://api.openai.com/v1',
        modelName: 'gpt-4',
        description: '更强大的推理能力'
      }
    ]
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    models: [
      {
        id: 'deepseek-chat',
        name: 'DeepSeek Chat',
        provider: 'deepseek',
        apiKey: getEnvVar('VITE_DEEPSEEK_TOKEN'),
        baseURL: getEnvVar('VITE_DEEPSEEK_BASE_URL') || 'https://api.deepseek.com/v1',
        modelName: 'deepseek-chat',
        description: 'DeepSeek 对话模型'
      },
      {
        id: 'deepseek-coder',
        name: 'DeepSeek Coder',
        provider: 'deepseek',
        apiKey: getEnvVar('VITE_DEEPSEEK_TOKEN'),
        baseURL: getEnvVar('VITE_DEEPSEEK_BASE_URL') || 'https://api.deepseek.com/v1',
        modelName: 'deepseek-coder',
        description: 'DeepSeek 代码生成模型'
      }
    ]
  },
  {
    id: 'zhipu',
    name: '智谱AI',
    models: [
      {
        id: 'glm-4',
        name: 'GLM-4',
        provider: 'zhipu',
        apiKey: getEnvVar('VITE_ZHIPU_TOKEN'),
        baseURL: getEnvVar('VITE_ZHIPU_BASE_URL') || 'https://open.bigmodel.cn/api/paas/v4',
        modelName: 'glm-4',
        description: '智谱AI GLM-4 模型'
      },
      {
        id: 'glm-3-turbo',
        name: 'GLM-3 Turbo',
        provider: 'zhipu',
        apiKey: getEnvVar('VITE_ZHIPU_TOKEN'),
        baseURL: getEnvVar('VITE_ZHIPU_BASE_URL') || 'https://open.bigmodel.cn/api/paas/v4',
        modelName: 'glm-3-turbo',
        description: '智谱AI GLM-3 Turbo 模型'
      }
    ]
  }
];

// 获取所有启用的模型提供商
export const getEnabledProviders = (): ModelProvider[] => {
  return modelProviders.filter(provider => isProviderEnabled(provider.id));
};

// 获取所有可用的模型（仅包含启用的提供商）
export const getAllModels = (): ModelConfig[] => {
  return getEnabledProviders().flatMap(provider => provider.models);
};

// 根据ID获取模型配置
export const getModelById = (id: string): ModelConfig | undefined => {
  return getAllModels().find(model => model.id === id);
};

// 获取默认模型
export const getDefaultModel = (): ModelConfig => {
  const defaultModelId = getEnvVar('VITE_DEFAULT_MODEL') || 'gpt-3.5-turbo';
  return getModelById(defaultModelId) || getAllModels()[0];
};

// 检查模型是否可用（提供商启用且有API密钥）
export const isModelAvailable = (model: ModelConfig): boolean => {
  return isProviderEnabled(model.provider) && !!model.apiKey && model.apiKey.trim() !== '';
};

// 获取可用的模型
export const getAvailableModels = (): ModelConfig[] => {
  return getAllModels().filter(isModelAvailable);
};