<template>
  <button
    @click="toggleDarkMode"
    class="fixed top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl z-50"
    :class="{
      'bg-gray-800 hover:bg-gray-700 text-yellow-400': isDark,
      'bg-white hover:bg-gray-50 text-gray-600 border border-gray-200': !isDark
    }"
    :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
  >
    <!-- 太阳图标 (深色模式下显示) -->
    <svg
      v-if="isDark"
      class="w-5 h-5 transition-transform duration-300"
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"
      />
    </svg>

    <!-- 月亮图标 (浅色模式下显示) -->
    <svg
      v-else
      class="w-5 h-5 transition-transform duration-300"
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
        clip-rule="evenodd"
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Emits {
  (e: 'update:isDark', value: boolean): void
}

const emit = defineEmits<Emits>()

const isDark = ref(false)

// 切换暗黑模式
const toggleDarkMode = () => {
  isDark.value = !isDark.value
  updateTheme()
  emit('update:isDark', isDark.value)
}

// 更新主题
const updateTheme = () => {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

// 初始化主题
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    isDark.value = true
  } else {
    isDark.value = false
  }
  
  updateTheme()
  emit('update:isDark', isDark.value)
}

// 监听系统主题变化
const watchSystemTheme = () => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      isDark.value = e.matches
      updateTheme()
      emit('update:isDark', isDark.value)
    }
  })
}

onMounted(() => {
  initTheme()
  watchSystemTheme()
})

// 暴露给父组件
defineExpose({
  isDark,
  toggleDarkMode
})
</script>