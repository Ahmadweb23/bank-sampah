<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md bg-white border-t border-gray-100 rounded-t-3xl px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
    <div class="flex items-center justify-around">
      <router-link
        v-for="item in navItems"
        :key="item.label"
        :to="item.to"
        class="flex flex-col items-center justify-center transition-all duration-200"
        :class="[
          isActive(item.to)
            ? 'bg-[#004D40] text-white px-5 py-2 rounded-[20px] min-w-[90px]'
            : 'text-gray-700 hover:text-gray-900 px-3 py-1'
        ]"
      >
        <!-- Icon -->
        <component 
          :is="item.icon" 
          class="w-5 h-5 mb-0.5" 
          :class="isActive(item.to) ? 'text-white' : 'text-gray-800'"
        />
        <!-- Label -->
        <span class="text-[11px] font-semibold tracking-wide">
          {{ item.label }}
        </span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { h } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// SVG Icon Beranda (Rumah)
const IconBeranda = () => h('svg', { 
  xmlns: 'http://www.w3.org/2000/svg', 
  fill: 'none', 
  viewBox: '0 0 24 24', 
  'stroke-width': '2', 
  stroke: 'currentColor' 
}, [
  h('path', { 
    'stroke-linecap': 'round', 
    'stroke-linejoin': 'round', 
    d: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25' 
  })
])

// SVG Icon Katalog (Keranjang Belanja)
const IconKatalog = () => h('svg', { 
  xmlns: 'http://www.w3.org/2000/svg', 
  fill: 'none', 
  viewBox: '0 0 24 24', 
  'stroke-width': '2', 
  stroke: 'currentColor' 
}, [
  h('path', { 
    'stroke-linecap': 'round', 
    'stroke-linejoin': 'round', 
    d: 'M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z' 
  })
])

// SVG Icon Informasi (Megafon / Speaker)
const IconInformasi = () => h('svg', { 
  xmlns: 'http://www.w3.org/2000/svg', 
  fill: 'none', 
  viewBox: '0 0 24 24', 
  'stroke-width': '2', 
  stroke: 'currentColor' 
}, [
  h('path', { 
    'stroke-linecap': 'round', 
    'stroke-linejoin': 'round', 
    d: 'M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.6 1.1 1.015 1.58.33.382.72.68 1.143.87.568.255 1.197.387 1.83.387 1.258 0 2.457-.5 3.346-1.389A4.733 4.733 0 0021 16.5v-9c0-.987-.312-1.928-.891-2.711A4.733 4.733 0 0016.763 3.4c-.633 0-1.262.132-1.83.387-.423.19-.813.488-1.143.87-.415.48-.768 1.03-1.015 1.58-.401.891-.732 1.821-.985 2.783m0 6.18a38.647 38.647 0 010-6.18' 
  })
])

const navItems = [
  { label: 'Beranda', to: '/warga', icon: IconBeranda },
  { label: 'Katalog', to: '/katalog', icon: IconKatalog },
  { label: 'Informasi', to: '/informasi', icon: IconInformasi }
]

function isActive(path) {
  if (!path) return false
  return route.path === path
}
</script>