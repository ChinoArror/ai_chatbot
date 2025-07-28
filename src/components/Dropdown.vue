<template>
  <div class="relative inline-block text-left" ref="dropdownRef">
    <!-- 触发按钮 -->
    <button
      @click="toggleDropdown"
      class="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      :class="{
        'dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700': isDark,
        'bg-white border-gray-300 hover:bg-gray-50': !isDark
      }"
    >
      <!-- 设置图标 -->
      <svg
        class="w-4 h-4 text-gray-600"
        :class="{ 'text-gray-300': isDark, 'text-gray-600': !isDark }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        ></path>
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        ></path>
      </svg>
    </button>

    <!-- 下拉菜单 -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 bottom-full z-10 mb-2 w-72 origin-bottom-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        :class="{
          'bg-gray-800 ring-gray-600': isDark,
          'bg-white ring-gray-300': !isDark
        }"
      >
        <div class="py-1">
          <!-- 标题 -->
          <div class="px-4 py-2 text-sm font-medium border-b"
               :class="{
                 'text-gray-300 border-gray-600': isDark,
                 'text-gray-700 border-gray-200': !isDark
               }">
            选择AI模型
          </div>
          
          <!-- 模型列表 -->
          <div class="max-h-64 overflow-y-auto">
            <template v-for="provider in availableProviders" :key="provider.id">
              <!-- 提供商标题 -->
              <div class="px-4 py-1 text-xs font-medium uppercase tracking-wide"
                   :class="{
                     'text-gray-400': isDark,
                     'text-gray-500': !isDark
                   }">
                {{ provider.name }}
              </div>
              
              <!-- 模型选项 -->
              <button
                v-for="model in provider.models.filter(m => isModelAvailable(m))"
                :key="model.id"
                @click="selectModel(model)"
                class="w-full text-left px-4 py-2 text-sm hover:bg-opacity-75 transition-colors"
                :class="{
                  'text-blue-400 bg-blue-900 bg-opacity-50': isDark && selectedModel?.id === model.id,
                  'text-blue-600 bg-blue-50': !isDark && selectedModel?.id === model.id,
                  'text-gray-300 hover:bg-gray-700': isDark && selectedModel?.id !== model.id,
                  'text-gray-700 hover:bg-gray-100': !isDark && selectedModel?.id !== model.id
                }"
              >
                <div class="font-medium">{{ model.name }}</div>
                <div class="text-xs opacity-75" v-if="model.description">
                  {{ model.description }}
                </div>
              </button>
            </template>
          </div>
          
          <!-- 无可用模型提示 -->
          <div v-if="availableProviders.length === 0" 
               class="px-4 py-3 text-sm"
               :class="{
                 'text-gray-400': isDark,
                 'text-gray-500': !isDark
               }">
            暂无可用模型，请检查环境变量配置
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { modelProviders, isModelAvailable, type ModelConfig } from '../config/models'

interface Props {
  selectedModel?: ModelConfig | null
  isDark?: boolean
}

interface Emits {
  (e: 'update:selectedModel', model: ModelConfig): void
}

withDefaults(defineProps<Props>(), {
  selectedModel: null,
  isDark: false
})

const emit = defineEmits<Emits>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement>()

// 获取有可用模型的提供商
const availableProviders = computed(() => {
  return modelProviders.filter(provider => 
    provider.models.some(model => isModelAvailable(model))
  )
})

// 切换下拉菜单
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

// 选择模型
const selectModel = (model: ModelConfig) => {
  emit('update:selectedModel', model)
  isOpen.value = false
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: Event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>