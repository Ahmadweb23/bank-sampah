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

        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="item in filteredItems"
            :key="item.id"
            class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col justify-between"
          >
            <!-- Kontainer Foto Produk -->
            <div>
              <div class="h-32 relative overflow-hidden bg-gray-100">
                <img 
                  :src="item.image" 
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
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import BottomNavWarga from '../../components/BottomNavWarga.vue'

const router = useRouter()
const search = ref('')

const catalogItems = ref([
  { 
    id: 1, 
    nama: 'Beras Premium', 
    poin: 150, 
    satuan: '5kg', 
    image: '/images/sembako/beras.jpg' 
  },
  { 
    id: 2, 
    nama: 'Gula Pasir', 
    poin: 160, 
    satuan: '1kg', 
    image: '/images/sembako/gula.jpg' 
  },
  { 
    id: 3, 
    nama: 'Minyak Goreng', 
    poin: 180, 
    satuan: '1L', 
    image: '/images/sembako/minyak.jpg' 
  },
  { 
    id: 4, 
    nama: 'Garam', 
    poin: 50, 
    satuan: '500g', 
    image: '/images/sembako/garam.jpg' 
  },
  { 
    id: 5, 
    nama: 'Kopi Kapal Api', 
    poin: 45, 
    satuan: '165g', 
    image: '/images/sembako/kopi.jpg' 
  },
  { 
    id: 6, 
    nama: 'Sunlight', 
    poin: 75, 
    satuan: '650ml', 
    image: '/images/sembako/sunlight.jpg' 
  },
  { 
    id: 7, 
    nama: 'Mie Instan', 
    poin: 25, 
    satuan: '1 pck', 
    image: '/images/sembako/mie.jpg' 
  },
])

const filteredItems = computed(() => {
  const keyword = search.value.toLowerCase()
  return catalogItems.value.filter((item) => {
    return item.nama.toLowerCase().includes(keyword) || item.satuan.toLowerCase().includes(keyword)
  })
})

function keRiwayat() {
  router.push('/riwayat-warga')
}

function openDetail(item) {
  console.log('Detail produk:', item)
}
</script>