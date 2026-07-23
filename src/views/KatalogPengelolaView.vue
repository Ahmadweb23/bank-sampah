<template>
  <div class="min-h-screen bg-[#f7f8f7] max-w-md mx-auto pb-24 text-slate-900">
    <header class="bg-white px-6 pt-8 pb-5 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Pengelola</p>
          <h1 class="text-2xl font-bold text-[#003A36]">Katalog Sembako</h1>
        </div>
        <button @click="goBack" class="w-11 h-11 rounded-full flex items-center justify-center bg-green-50 text-green-800">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      </div>
    </header>

    <main class="px-6 py-6">
      <section class="mb-5">
        <div class="flex items-center justify-between mb-3">
          <div>
            <p class="text-sm uppercase tracking-wide text-gray-500">Kelola Stok</p>
            <h2 class="text-lg font-semibold text-slate-900">Daftar Item Katalog</h2>
          </div>
          <button class="rounded-2xl bg-[#003A36] px-4 py-2 text-sm font-semibold text-white">
            + Tambah
          </button>
        </div>

        <div class="relative">
          <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
              <circle cx="11" cy="11" r="6" />
              <path d="m20 20-4.2-4.2" />
            </svg>
          </div>
          <input
            v-model="search"
            type="text"
            placeholder="Cari barang..."
            class="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-100 bg-white shadow-sm outline-none focus:ring-2 focus:ring-green-100"
          />
        </div>
      </section>

      <section class="grid grid-cols-2 gap-4 mb-5">
        <div class="rounded-[24px] bg-white p-4 shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500">Total Item</p>
          <p class="text-2xl font-bold text-slate-900 mt-2">{{ catalogItems.length }}</p>
        </div>
        <div class="rounded-[24px] bg-white p-4 shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500">Stok Menipis</p>
          <p class="text-2xl font-bold text-amber-600 mt-2">{{ lowStockCount }}</p>
        </div>
      </section>

      <section class="space-y-3">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="rounded-[24px] border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div class="flex items-start gap-3">
            <div class="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
              <svg v-if="item.icon === 'beras'" viewBox="0 0 24 24" fill="none" stroke="#147052" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8">
                <path d="M4 8h13a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" />
                <path d="M4 8V6a2 2 0 0 1 2-2h2" />
                <path d="M17 8V6" />
                <circle cx="9" cy="16" r="1" fill="#147052" stroke="none" />
                <circle cx="15" cy="16" r="1" fill="#147052" stroke="none" />
              </svg>
              <svg v-else-if="item.icon === 'minyak'" viewBox="0 0 24 24" fill="none" stroke="#147052" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8">
                <rect x="5" y="4" width="10" height="16" rx="2" />
                <path d="M15 8h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
                <path d="M8 8h2" />
                <path d="M8 12h2" />
              </svg>
              <svg v-else-if="item.icon === 'gula'" viewBox="0 0 24 24" fill="none" stroke="#147052" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8">
                <path d="M5 8c0-2 2-4 5-4 3 0 5 2 5 4 0 3-2 4-5 6-3-2-5-3-5-6Z" />
                <path d="M6 12c2 1 3 2 4 3" />
                <path d="M14 12c-1 1-2 2-3 3" />
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="#147052" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8">
                <path d="M4 8h16" />
                <path d="M7 8v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V8" />
                <path d="M9 12h6" />
              </svg>
            </div>

            <div class="flex-1">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h3 class="font-semibold text-slate-900">{{ item.nama }}</h3>
                  <p class="text-sm text-gray-500 mt-1">{{ item.kategori }} • {{ item.satuan }}</p>
                </div>
                <span
                  class="rounded-full px-2.5 py-1 text-xs font-semibold"
                  :class="item.stok < 5 ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'"
                >
                  Stok {{ item.stok }}
                </span>
              </div>

              <div class="mt-3 flex items-center justify-between">
                <div class="flex items-center gap-2 text-green-800">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                    <path d="M12 3 14.5 8 20 8l-4.5 3.5 1.5 6-5-3.5-5 3.5 1.5-6L4 8h5.5L12 3Z" />
                  </svg>
                  <span class="font-semibold">{{ item.poin }} Poin</span>
                </div>
                <button class="text-sm font-semibold text-green-800">Lihat</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <BottomNav />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import BottomNav from '../components/BottomNav.vue'

const router = useRouter()
const search = ref('')

const catalogItems = ref([
  { id: 1, nama: 'Beras Premium', kategori: 'Sembako', satuan: '5kg', poin: 150, stok: 12, icon: 'beras' },
  { id: 2, nama: 'Minyak Goreng', kategori: 'Sembako', satuan: '1L', poin: 180, stok: 4, icon: 'minyak' },
  { id: 3, nama: 'Gula Pasir', kategori: 'Sembako', satuan: '1kg', poin: 160, stok: 7, icon: 'gula' },
  { id: 4, nama: 'Garam', kategori: 'Sembako', satuan: '500g', poin: 50, stok: 2, icon: 'garam' },
])

const filteredItems = computed(() => {
  const keyword = search.value.toLowerCase()
  return catalogItems.value.filter((item) => {
    return (
      item.nama.toLowerCase().includes(keyword) ||
      item.kategori.toLowerCase().includes(keyword) ||
      item.satuan.toLowerCase().includes(keyword)
    )
  })
})

const lowStockCount = computed(() => catalogItems.value.filter((item) => item.stok < 5).length)

function goBack() {
  router.push('/dashboard')
}
</script>
