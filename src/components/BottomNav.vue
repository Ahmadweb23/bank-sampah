<template>
  <nav
    class="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md border-t border-gray-100 bg-white px-6 pt-3 pb-5 shadow-lg lg:bottom-0 lg:left-0 lg:right-auto lg:mx-0 lg:flex lg:h-screen lg:w-64 lg:max-w-none lg:flex-col lg:border-r lg:border-t-0 lg:px-5 lg:py-6 lg:shadow-none"
  >
    <div class="mb-10 hidden items-center gap-3 lg:flex">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-50">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#147052"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-8 w-8"
        >
          <path d="M8 4c2.2 1.4 3.5 3.4 4 6.2" />
          <path d="M12 3c1.2 2.2 1.8 4.3 1.8 6.9" />
          <path d="M7 14c2.1-.2 3.8-.5 5.2-1.4" />
          <path d="M9 18c1.4-.4 2.7-.4 4 0" />
          <path d="M7.5 10c2-.5 3.5-1 5.3-2.4" />
        </svg>
      </div>
      <div>
        <p class="text-lg font-bold leading-tight text-green-950">Bank Sampah</p>
        <p class="text-sm font-medium text-green-700">Bojong Karya 2</p>
      </div>
    </div>

    <div class="flex justify-between lg:flex-col lg:gap-2">
      <router-link
        v-for="item in navItems"
        :key="item.label"
        :to="item.to"
        class="flex flex-col items-center gap-1 text-sm transition-colors lg:flex-row lg:justify-start lg:gap-3 lg:rounded-xl lg:px-3 lg:py-3"
        :class="
          isActive(item.to)
            ? 'font-semibold text-green-800 lg:bg-green-50'
            : 'text-gray-400 lg:text-gray-500 lg:hover:bg-gray-50 lg:hover:text-slate-900'
        "
      >
        <span class="flex h-7 w-7 items-center justify-center">
          <svg
            v-if="item.icon === 'home'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-6 w-6"
            :class="isActive(item.to) ? 'text-green-800' : 'text-gray-400'"
          >
            <path d="M3 10.5 12 3l9 7.5" />
            <path d="M5.5 9.5V21h5v-6h3v6h5V9.5" />
          </svg>
          <svg
            v-else-if="item.icon === 'box'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-6 w-6"
            :class="isActive(item.to) ? 'text-green-800' : 'text-gray-400'"
          >
            <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5z" />
            <path d="M4 7.5 12 12l8-4.5" />
            <path d="M12 12v9" />
          </svg>
          <svg
            v-else-if="item.icon === 'clock'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-6 w-6"
            :class="isActive(item.to) ? 'text-green-800' : 'text-gray-400'"
          >
            <circle cx="12" cy="12" r="8.5" />
            <path d="M12 7.5v5l3 2" />
          </svg>
          <svg
            v-else-if="item.icon === 'receipt'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-6 w-6"
            :class="isActive(item.to) ? 'text-green-800' : 'text-gray-400'"
          >
            <path d="M5 4h14v16H5z" />
            <path d="M8 9h8" />
            <path d="M8 13h8" />
            <path d="M8 17h5" />
          </svg>
          <svg
            v-else-if="item.icon === 'chart'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-6 w-6"
            :class="isActive(item.to) ? 'text-green-800' : 'text-gray-400'"
          >
            <path d="M4 19h16" />
            <path d="M7 15v4" />
            <path d="M12 11v8" />
            <path d="M17 7v12" />
            <path d="M3 21h18" />
          </svg>
          <svg
            v-else
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-6 w-6"
            :class="isActive(item.to) ? 'text-green-800' : 'text-gray-400'"
          >
            <path d="M7 3h8l4 4v14H7z" />
            <path d="M15 3v4h4" />
            <path d="M9 12h6" />
            <path d="M9 16h4" />
          </svg>
        </span>
        <span class="whitespace-nowrap">{{ item.label }}</span>
      </router-link>
    </div>

    <p class="mt-auto hidden px-3 pb-2 text-sm italic leading-5 text-green-700 lg:block">
      Lingkungan bersih, masa depan lebih baik
    </p>
  </nav>
</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();

const navItems = [
  { label: "Beranda", to: "/dashboard", icon: "home" },
  { label: "Catat Biaya", to: "/keuangan", icon: "receipt" },
  { label: "Katalog", to: "/katalog-pengelola", icon: "box" },
  { label: "Laporan", to: "/laporan", icon: "chart" },
];

function isActive(path) {
  if (path === "/dashboard") {
    return route.path === "/dashboard";
  }

  return route.path === path;
}
</script>
