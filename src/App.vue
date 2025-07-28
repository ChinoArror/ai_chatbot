<template>
  <div class="min-h-screen transition-colors duration-300" :class="{
    'bg-light-primary text-light-primary': !isDark,
    'bg-dark-primary text-dark-primary': isDark
  }">
    <!-- 暗黑模式切换按钮 -->
    <DarkModeToggle @update:isDark="handleDarkModeChange" ref="darkModeToggle" />
    
    <main class="mx-auto px-5 h-screen overflow-y-auto pb-40" :class="mainWidthClass" ref="chatContainer">
      <!-- 聊天列表 -->
      <div class="space-y-4 pt-6">
        <!-- 聊天消息 -->
        <div v-for="message in messages" :key="message.id" class="flex" :class="message.isUser ? 'justify-end' : 'justify-start'">
          <div 
            class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg transition-colors" 
            :class="{
              'bg-primary text-white': message.isUser,
              'bg-white text-black border border-gray-300': !message.isUser && !isDark,
              'bg-dark-card text-dark-text border border-dark-border': !message.isUser && isDark
            }"
          >
            <div class="whitespace-pre-wrap">{{ message.text }}</div>
            <div v-if="message.timestamp" class="text-xs opacity-70 mt-1">
              {{ formatTime(message.timestamp) }}
            </div>
          </div>
        </div>
        
        <!-- 加载指示器 -->
        <div v-if="isLoading" class="flex justify-start">
          <div class="px-4 py-2 rounded-lg transition-colors" :class="{
            'bg-white text-black border border-gray-300': !isDark,
            'bg-dark-card text-dark-text border border-dark-border': isDark
          }">
            <div class="flex items-center space-x-2">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span>AI 正在思考...</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 模型选择器 - 独立固定位置 -->
    <div class="fixed bottom-20 left-1/2 transform -translate-x-1/2 px-5 z-30" :class="inputWidthClass">
      <div class="mb-2 flex items-center justify-between p-3 rounded-lg transition-colors shadow-lg" :class="{
        'border border-gray-300 bg-white': !isDark,
        'border border-dark-border bg-dark-card': isDark
      }">
        <div class="flex items-center space-x-2">
          <span class="text-sm font-medium" :class="{
            'text-gray-700': !isDark,
            'text-gray-300': isDark
          }">当前模型:</span>
          <span class="text-sm" :class="{
            'text-gray-600': !isDark,
            'text-gray-400': isDark
          }">{{ currentModel?.name || '未选择' }}</span>
        </div>
        <Dropdown 
          :selectedModel="currentModel" 
          :isDark="isDark"
          @update:selectedModel="handleModelChange" 
        />
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="fixed bottom-5 left-1/2 transform -translate-x-1/2 px-5 z-20" :class="inputWidthClass">
      <div class="flex items-end rounded-lg p-2 transition-colors shadow-lg" :class="{
        'border border-gray-300 bg-white': !isDark,
        'border border-dark-border bg-dark-card': isDark
      }">
        <textarea
          v-model="inputMessage"
          @keydown.enter.prevent="sendMessage"
          placeholder="你有什么要我帮助的吗？"
          class="flex-1 border-none outline-none resize-none min-h-[40px] max-h-32 px-2 py-1 transition-colors"
          :class="{
            'bg-white text-black placeholder-gray-500': !isDark,
            'bg-dark-card text-dark-text placeholder-gray-400': isDark
          }"
          rows="1"
          :disabled="isLoading"
        ></textarea>
        <button
          @click="sendMessage"
          class="ml-2 bg-primary hover:bg-primary-hover text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!inputMessage.trim() || isLoading"
        >
          <svg v-if="!isLoading" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor"/>
          </svg>
          <div v-else class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        </button>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="errorMessage" class="fixed top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-40">
      <div class="flex items-center justify-between">
        <span>{{ errorMessage }}</span>
        <button @click="errorMessage = ''" class="ml-2 text-white hover:text-gray-200">
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import { getAIService, switchAIServiceModel, getCurrentAIServiceModel, type ChatMessage } from './services/aiService'
import { getDefaultModel, getAvailableModels, type ModelConfig } from './config/models'
import Dropdown from './components/Dropdown.vue'
import DarkModeToggle from './components/DarkModeToggle.vue'

const inputMessage = ref('')
const messages = ref<ChatMessage[]>([
  { 
    id: 1, 
    text: '你好！我是AI助手，有什么可以帮助你的吗？', 
    isUser: false, 
    timestamp: new Date() 
  }
])
const isLoading = ref(false)
const errorMessage = ref('')
const chatContainer = ref<HTMLElement>()
const darkModeToggle = ref<InstanceType<typeof DarkModeToggle>>()
const isDark = ref(false)
const currentModel = ref<ModelConfig | null>(null)
const aiService = getAIService()

const mainWidthClass = computed(() => {
  return 'w-full max-w-[780px]'
})

const inputWidthClass = computed(() => {
  return 'w-full max-w-[740px]' // 减去 padding 的宽度
})

// 格式化时间显示
const formatTime = (date: Date) => {
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return
  
  const userMessage: ChatMessage = {
    id: Date.now(),
    text: inputMessage.value.trim(),
    isUser: true,
    timestamp: new Date()
  }
  
  messages.value.push(userMessage)
  inputMessage.value = ''
  isLoading.value = true
  errorMessage.value = ''
  
  scrollToBottom()
  
  try {
    // 创建AI消息占位符
    const aiMessageId = Date.now() + 1
    const aiMessage: ChatMessage = {
      id: aiMessageId,
      text: '',
      isUser: false,
      timestamp: new Date()
    }
    
    messages.value.push(aiMessage)
    scrollToBottom()
    
    // 使用流式响应
    const fullResponse = await aiService.sendMessage(
      messages.value.slice(0, -1), // 排除刚添加的空AI消息
      (chunk: string) => {
        // 流式更新AI消息内容
        const messageIndex = messages.value.findIndex(m => m.id === aiMessageId)
        if (messageIndex !== -1) {
          messages.value[messageIndex].text += chunk
          scrollToBottom()
        }
      }
    )
    
    // 确保最终消息完整
    const messageIndex = messages.value.findIndex(m => m.id === aiMessageId)
    if (messageIndex !== -1) {
      messages.value[messageIndex].text = fullResponse
    }
    
  } catch (error) {
    console.error('发送消息失败:', error)
    errorMessage.value = error instanceof Error ? error.message : '发送消息失败，请重试'
    
    // 移除失败的AI消息
    messages.value = messages.value.filter(m => m.text !== '')
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

// 处理暗黑模式切换
const handleDarkModeChange = (dark: boolean) => {
  isDark.value = dark
}

// 处理模型切换
const handleModelChange = (model: ModelConfig) => {
  try {
    switchAIServiceModel(model)
    currentModel.value = model
    console.log('已切换到模型:', model.name)
  } catch (error) {
    console.error('切换模型失败:', error)
    errorMessage.value = `切换模型失败: ${error instanceof Error ? error.message : '未知错误'}`
  }
}

// 初始化模型
const initializeModel = () => {
  try {
    const availableModels = getAvailableModels()
    if (availableModels.length > 0) {
      currentModel.value = getCurrentAIServiceModel()
    } else {
      // 如果没有可用模型，尝试使用默认模型
      const defaultModel = getDefaultModel()
      currentModel.value = defaultModel
    }
  } catch (error) {
    console.warn('初始化模型失败:', error)
    currentModel.value = null
  }
}

// 组件挂载时验证API配置
onMounted(async () => {
  // 初始化模型
  initializeModel()
  
  try {
    const isValid = await aiService.validateConfiguration()
    if (!isValid) {
      errorMessage.value = 'API 配置无效，请检查 .env 文件中的配置'
    }
  } catch (error) {
    console.warn('API 配置验证失败:', error)
    // 不显示错误，允许用户尝试发送消息
  }
})
</script>

<style scoped>
/* 自定义滚动条样式 */
main::-webkit-scrollbar {
  width: 6px;
}

main::-webkit-scrollbar-track {
  background: #f1f1f1;
}

main::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

main::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* 自动调整 textarea 高度 */
textarea {
  field-sizing: content;
}
</style>