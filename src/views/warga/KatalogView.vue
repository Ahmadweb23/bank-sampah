<template>
  <div class="min-h-screen bg-[#f9f9ff] text-slate-900 pb-24">
    <!-- Header -->
    <header class="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
      <div class="max-w-md mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div>
            <p class="text-sm text-gray-500">Bank Sampah</p>
            <h1 class="text-lg font-bold text-[#003A36]">Katalog Sembako</h1>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-md mx-auto px-4 py-5">
      <div class="space-y-4">
        <!-- Search Input -->
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
            placeholder="Cari beras, kopi, mie, atau lainnya..."
            class="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm outline-none focus:ring-2 focus:ring-[#003A36]/20"
          />
        </div>

        <!-- Card Poin -->
        <div class="bg-[#00534d] rounded-2xl p-5 overflow-hidden relative shadow-sm text-white">
          <div class="absolute top-0 right-0 opacity-10">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" class="h-[120px] w-[120px]">
              <path d="M4 7h16" />
              <path d="M7 7v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7" />
              <path d="M9 11h6" />
              <path d="M9 15h6" />
            </svg>
          </div>
          <div class="relative z-10 flex items-center justify-between gap-4">
            <div>
              <p class="text-sm text-white/80">Poin Tersedia</p>
              <div class="flex items-center gap-2 mt-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
                  <path d="M12 3 14.5 8 20 8l-4.5 3.5 1.5 6-5-3.5-5 3.5 1.5-6L4 8h5.5L12 3Z" />
                </svg>
                <h2 class="text-3xl font-bold">2.450</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section Produk -->
      <section class="mt-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-[#003A36]">Pilihan Terbaik</h3>
          <button @click="search = ''" class="text-sm font-semibold text-[#0a45e6]">Lihat Semua</button>
        </div>

        <p v-if="loadingKatalog" class="py-8 text-center text-sm text-gray-500">Memuat katalog...</p>
        <p v-else-if="katalogError" role="alert" class="py-8 text-center text-sm text-rose-600">{{ katalogError }}</p>
        <p v-else-if="!filteredItems.length" class="py-8 text-center text-sm text-gray-500">Tidak ada barang yang cocok dengan pencarian.</p>
        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="item in filteredItems"
            :key="item.id_katalog"
            class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col justify-between"
          >
            <!-- Kontainer Foto Produk -->
            <div>
              <div class="h-32 relative overflow-hidden bg-gray-100">
                <img 
                  :src="item.image || getCatalogImageFallback(item.nama)"
                  :alt="item.nama" 
                  @error="(e) => e.target.src = 'https://placehold.co/400x300/e2e8f0/475569?text=' + encodeURIComponent(item.nama)"
                  class="w-full h-full object-cover"
                />
                <div class="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg shadow-sm">
                  <p class="text-xs font-semibold text-[#003A36]">{{ item.satuan }}</p>
                </div>
              </div>

              <div class="p-4 space-y-2">
                <h4 class="font-semibold text-[#003A36] truncate">{{ item.nama }}</h4>
                <div class="flex items-center gap-1 text-[#0a45e6]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                    <path d="M12 3 14.5 8 20 8l-4.5 3.5 1.5 6-5-3.5-5 3.5 1.5-6L4 8h5.5L12 3Z" />
                  </svg>
                  <p class="text-lg font-bold">{{ item.poin }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Bottom Navigation Component -->
    <BottomNavWarga />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { getKatalog } from '../../services/api'
import BottomNavWarga from '../../components/BottomNavWarga.vue'

const search = ref('')
const catalogItems = ref([])
const loadingKatalog = ref(false)
const katalogError = ref('')

const filteredItems = computed(() => {
  const keyword = search.value.trim().toLowerCase()
  return catalogItems.value.filter((item) => {
    return item.nama.toLowerCase().includes(keyword) || item.satuan.toLowerCase().includes(keyword)
  })
})

async function fetchKatalog() {
  loadingKatalog.value = true
  katalogError.value = ''
  try {
    const response = await getKatalog()
    if (response?.success === false) {
      throw new Error(response.message || 'Katalog tidak dapat dimuat.')
    }
    const rows = Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response)
        ? response
        : []
    catalogItems.value = rows
      .map((item) => ({
        id_katalog: item.id_katalog || item.id,
        nama: String(item.nama || ''),
        poin: Number(item.poin) || 0,
        satuan: String(item.satuan || ''),
        image: String(item.image || ''),
      }))
      .filter((item) => item.id_katalog && item.nama)
  } catch (error) {
    console.error('Gagal memuat katalog:', error)
    catalogItems.value = []
    katalogError.value = 'Katalog belum dapat dimuat.'
  } finally {
    loadingKatalog.value = false
  }
}

function getCatalogImageFallback(nama) {
  return `https://placehold.co/400x300/e2e8f0/475569?text=${encodeURIComponent(nama)}`
}

onMounted(fetchKatalog)
</script>