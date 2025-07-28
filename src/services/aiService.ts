import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { getDefaultModel, type ModelConfig } from '../config/models';

export interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp?: Date;
}

export class AIService {
  private model: ChatOpenAI;
  private currentModel: ModelConfig;

  constructor(modelConfig?: ModelConfig) {
    this.currentModel = modelConfig || getDefaultModel();
    this.model = new ChatOpenAI({
      modelName: this.currentModel.id,
      temperature: 0.7
    });
    this.initializeModel();
  }

  private initializeModel() {
    if (!this.currentModel.apiKey) {
      throw new Error(`API Key 未配置，请在 .env 文件中设置 ${this.currentModel.provider.toUpperCase()} 的 API Key`);
    }

    this.model = new ChatOpenAI({
      openAIApiKey: this.currentModel.apiKey,
      modelName: this.currentModel.modelName,
      temperature: 0.7,
      streaming: true,
      configuration: {
        baseURL: this.currentModel.baseURL
      }
    });
  }

  // 切换模型
  switchModel(modelConfig: ModelConfig) {
    this.currentModel = modelConfig;
    this.initializeModel();
  }

  // 获取当前模型信息
  getCurrentModel(): ModelConfig {
    return this.currentModel;
  }

  /**
   * 发送消息并获取流式响应
   * @param messages 聊天历史消息
   * @param onChunk 接收流式数据的回调函数
   * @returns Promise<string> 完整的响应文本
   */
  async sendMessage(
    messages: ChatMessage[],
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    try {
      // 转换消息格式为 LangChain 格式
      const langchainMessages = messages.map(msg => 
        msg.isUser 
          ? new HumanMessage(msg.text)
          : new AIMessage(msg.text)
      );

      let fullResponse = '';

      // 创建流式响应
      const stream = await this.model.stream(langchainMessages);

      // 处理流式数据
      for await (const chunk of stream) {
        const content = chunk.content as string;
        if (content) {
          fullResponse += content;
          // 调用回调函数传递流式数据
          if (onChunk) {
            onChunk(content);
          }
        }
      }

      return fullResponse;
    } catch (error) {
      console.error('AI 服务错误:', error);
      throw new Error(`AI 服务调用失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 发送单条消息（非流式）
   * @param message 用户消息
   * @param context 上下文消息（可选）
   * @returns Promise<string> AI 响应
   */
  async sendSingleMessage(
    message: string,
    context: ChatMessage[] = []
  ): Promise<string> {
    try {
      const messages = [...context, { id: Date.now(), text: message, isUser: true }];
      return await this.sendMessage(messages);
    } catch (error) {
      console.error('发送单条消息失败:', error);
      throw error;
    }
  }

  /**
   * 检查 API 配置是否正确
   * @returns Promise<boolean> 配置是否有效
   */
  async validateConfiguration(): Promise<boolean> {
    try {
      const testMessage = new HumanMessage('Hello');
      await this.model.invoke([testMessage]);
      return true;
    } catch (error) {
      console.error('API 配置验证失败:', error);
      return false;
    }
  }
}

// 创建单例实例
let aiServiceInstance: AIService | null = null;

export function getAIService(): AIService {
  if (!aiServiceInstance) {
    try {
      aiServiceInstance = new AIService();
    } catch (error) {
      console.warn('使用默认模型初始化AI服务失败:', error);
      // 如果默认模型初始化失败，尝试使用兼容配置
      const fallbackConfig = {
        id: 'fallback',
        name: 'Fallback Model',
        provider: 'openai',
        apiKey: import.meta.env.VITE_API_KEY || '',
        baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.openai.com/v1',
        modelName: import.meta.env.VITE_MODEL || 'gpt-3.5-turbo'
      };
      aiServiceInstance = new AIService(fallbackConfig);
    }
  }
  return aiServiceInstance;
}

// 切换AI服务模型
export function switchAIServiceModel(modelConfig: ModelConfig): void {
  const service = getAIService();
  service.switchModel(modelConfig);
}

// 获取当前AI服务模型
export function getCurrentAIServiceModel(): ModelConfig {
  const service = getAIService();
  return service.getCurrentModel();
}