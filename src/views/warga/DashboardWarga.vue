<template>
  <div class="min-h-screen bg-[#F8F9FB] pb-24 font-sans relative">
    
    <!-- Top Header / App Bar -->
    <header class="px-5 pt-8 pb-4 flex justify-between items-center">
      <div class="flex items-center gap-3">
        <!-- Placeholder Avatar -->
        <div class="w-10 h-10 rounded-full bg-gray-300 overflow-hidden border border-gray-200 shadow-sm">
          <img src="https://ui-avatars.com/api/?name=Ibu+Siti&background=random" alt="Profile" class="w-full h-full object-cover" />
        </div>
        <h1 class="text-[17px] font-bold text-[#062923]">Bank Sampah</h1>
      </div>
    </header>

    <!-- Greeting Section -->
    <div class="px-5 mt-1">
      <p class="text-sm text-gray-700 font-medium tracking-wide">Selamat pagi,</p>
      <h2 class="text-2xl font-bold text-[#062923] mt-1">
        Halo, {{ warga.nama || 'Ibu Siti' }}!
      </h2>
    </div>

    <!-- Kartu Saldo Poin -->
    <section class="px-5 mt-6">
      <div class="bg-[#0D5C50] rounded-3xl p-6 shadow-md relative overflow-hidden">
        <p class="text-[#8ABFB7] text-sm font-medium">Saldo Poin Anda</p>
        <div class="flex items-baseline gap-2 mt-1">
          <span class="text-[40px] font-bold text-white tracking-tight">
            {{ formatAngka(warga.poin || 1250) }}
          </span>
          <span class="text-lg font-medium text-[#8ABFB7]">Poin</span>
        </div>
        
        <div class="flex gap-3 mt-6">
          <router-link 
            to="/riwayat-warga" 
            class="flex-1 bg-[#166B5E] border border-[#248173] hover:bg-[#125A4F] text-white font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 transition shadow-sm text-sm"
          >
            <!-- History Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Riwayat
          </router-link>
        </div>
      </div>
    </section>

    <!-- Katalog Sembako Populer (Horizontal Scroll) -->
    <section class="mt-8">
      <div class="px-5 flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-[#062923]">Katalog Sembako Populer</h3>
        <button @click="lihatSemuaKatalog" class="text-sm font-semibold text-gray-700 hover:text-[#062923]">
          Lihat Semua
        </button>
      </div>
      
      <!-- List Scroll Horizontal -->
      <div class="m-5 flex gap-4 overflow-x-auto px-5 pb-4 snap-x hide-scrollbar">
        <div 
          v-for="item in catalogItems" 
          :key="item.id" 
          class="min-w-[160px] w-[160px] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 shrink-0 snap-start flex flex-col justify-between"
        >
          <!-- Bagian Atas: Foto & Informasi Produk -->
          <div>
            <!-- Kontainer Foto Produk + Badge Satuan -->
            <div class="h-28 relative overflow-hidden bg-gray-100">
              <img 
                :src="item.image" 
                :alt="item.nama" 
                @error="(e) => e.target.src = 'https://placehold.co/400x300/e2e8f0/475569?text=' + encodeURIComponent(item.nama)"
                class="w-full h-full object-cover"
              />
              <div class="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-lg shadow-sm">
                <p class="text-[11px] font-semibold text-[#003A36]">{{ item.satuan }}</p>
              </div>
            </div>

            <!-- Detail Nama & Poin -->
            <div class="p-3 space-y-1">
              <h4 class="font-semibold text-[#003A36] text-sm truncate">{{ item.nama }}</h4>
              <div class="flex items-center gap-1 text-[#0a45e6]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5">
                  <path d="M12 3 14.5 8 20 8l-4.5 3.5 1.5 6-5-3.5-5 3.5 1.5-6L4 8h5.5L12 3Z" />
                </svg>
                <p class="text-base font-bold">{{ item.poin }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Informasi & Pengumuman -->
    <section class="px-5 mt-4">
      <h3 class="text-lg font-bold text-[#062923] mb-4">Informasi & Pengumuman</h3>
      
      <div v-if="loadingPengumuman" class="text-center text-gray-500 my-6">
        Memuat pengumuman...
      </div>
      <div v-else-if="pengumuman.length === 0" class="text-center text-gray-400 my-6">
        Tidak ada pengumuman.
      </div>
      
      <div v-else class="space-y-4">
        <div 
          v-for="(item, index) in pengumuman" 
          :key="index" 
          class="bg-white rounded-3xl p-4 shadow-sm flex gap-4 items-start"
        >
          <div class="shrink-0 mt-0.5">
            <svg v-if="getIconType(item.judul) === 'jadwal'" viewBox="0 0 24 24" fill="none" stroke="#147052" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M16 2v4" />
              <path d="M8 2v4" />
              <path d="M3 10h18" />
            </svg>
            <svg v-else-if="getIconType(item.judul) === 'promo'" viewBox="0 0 24 24" fill="none" stroke="#147052" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
              <path d="M12 2 14.5 8 21 8l-4.5 3.5 1.5 6-5-3.5-5 3.5 1.5-6L3 8h6.5L12 2Z" />
            </svg>
            <svg v-else-if="getIconType(item.judul) === 'edukasi'" viewBox="0 0 24 24" fill="none" stroke="#147052" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
              <path d="M12 3 4 7l8 4 8-4-8-4Z" />
              <path d="M4 12l8 4 8-4" />
              <path d="M4 17l8 4 8-4" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="#147052" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
              <circle cx="12" cy="12" r="8" />
              <path d="M12 8v4l2 2" />
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-xs font-bold text-[#003A36] uppercase tracking-wide">
              {{ item.jenis || 'INFO' }}
            </p>
            <h4 class="text-[14px] font-bold text-gray-900 leading-snug">{{ item.judul }}</h4>
            <p class="text-[13px] text-gray-600 mt-1 leading-snug">{{ item.konten || item.deskripsi }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Navigasi Bawah Menggunakan Komponen Reusable -->
    <BottomNavWarga />
  </div>
</template>

<script setup>
import { ref, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { getPengumuman } from '../../services/api'
import BottomNavWarga from '../../components/BottomNavWarga.vue'

const router = useRouter()

// Data warga
const warga = ref({
  nama: 'Ibu Siti',
  username: '',
  poin: 1250,
  total_setoran_kg: 0,
  total_nilai_rupiah: 0
})

// Data Sembako
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

// Data Pengumuman Mock
const mockPengumuman = [
  { jenis: 'JADWAL', judul: 'Jadwal Penjemputan Rutin Minggu Ini', deskripsi: 'Berlaku mulai 12 - 18 Agustus 2024' },
  { jenis: 'PROMO', judul: 'Promo Tukar Poin Merdeka', deskripsi: 'Diskon 17% tukar poin untuk semua sembako' },
  { jenis: 'EDUKASI', judul: 'Cara Memilah Sampah Plastik Baru', deskripsi: 'Tips agar sampah plastik Anda dihargai lebih tinggi' },
]

const pengumuman = ref([])
const loadingPengumuman = ref(false)

// Formatting Ribuan
const formatAngka = (angka) => {
  return new Intl.NumberFormat('id-ID').format(angka)
}

async function fetchPengumuman() {
  loadingPengumuman.value = true
  try {
    const response = await getPengumuman()
    if (response && response.data && response.data.length > 0) {
      pengumuman.value = response.data
    } else if (Array.isArray(response) && response.length > 0) {
      pengumuman.value = response
    } else {
      pengumuman.value = mockPengumuman 
    }
  } catch (error) {
    console.error('Gagal memuat pengumuman:', error)
    pengumuman.value = mockPengumuman
  } finally {
    loadingPengumuman.value = false
  }
}

function getIconType(judul) {
  const kata = (judul || '').toLowerCase()
  if (kata.includes('jadwal') || kata.includes('penjemputan')) return 'jadwal'
  if (kata.includes('promo') || kata.includes('diskon')) return 'promo'
  if (kata.includes('edukasi') || kata.includes('tips')) return 'edukasi'
  return 'info'
}

// Navigasi
function tukarPoin() { router.push('/tukar-poin') }
function lihatRiwayat() { router.push('/riwayat-warga') }
function lihatSemuaKatalog() { router.push('/katalog') }

onMounted(() => {
  const stored = localStorage.getItem('warga')
  if (stored) {
    try {
      warga.value = JSON.parse(stored)
    } catch (e) {
      console.warn('Gagal parse data warga')
    }
  }
  fetchPengumuman()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>