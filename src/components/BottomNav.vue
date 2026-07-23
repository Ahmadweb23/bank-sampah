<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md border-t border-gray-100 bg-white px-6 pt-3 pb-5 shadow-lg">
    <div class="flex justify-between">
      <router-link
        v-for="item in navItems"
        :key="item.label"
        :to="item.to"
        class="flex flex-col items-center gap-1 text-sm transition-colors"
        :class="isActive(item.to) ? 'font-semibold text-green-800' : 'text-gray-400'"
      >
        <span class="flex h-7 w-7 items-center justify-center">
          <svg v-if="item.icon === 'home'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6" :class="isActive(item.to) ? 'text-green-800' : 'text-gray-400'">
            <path d="M3 10.5 12 3l9 7.5" />
            <path d="M5.5 9.5V21h5v-6h3v6h5V9.5" />
          </svg>
          <svg v-else-if="item.icon === 'box'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6" :class="isActive(item.to) ? 'text-green-800' : 'text-gray-400'">
            <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5z" />
            <path d="M4 7.5 12 12l8-4.5" />
            <path d="M12 12v9" />
          </svg>
          <svg v-else-if="item.icon === 'clock'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6" :class="isActive(item.to) ? 'text-green-800' : 'text-gray-400'">
            <circle cx="12" cy="12" r="8.5" />
            <path d="M12 7.5v5l3 2" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6" :class="isActive(item.to) ? 'text-green-800' : 'text-gray-400'">
            <path d="M7 3h8l4 4v14H7z" />
            <path d="M15 3v4h4" />
            <path d="M9 12h6" />
            <path d="M9 16h4" />
          </svg>
        </span>
        <span>{{ item.label }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { label: 'Beranda', to: '/dashboard', icon: 'home' },
  { label: 'Riwayat', to: '/keuangan', icon: 'clock' },
  { label: 'Laporan', to: '/laporan', icon: 'user' }
]

function isActive(path) {
  if (path === '/dashboard') {
    return route.path === '/dashboard'
  }

  return route.path === path
}
</script>
