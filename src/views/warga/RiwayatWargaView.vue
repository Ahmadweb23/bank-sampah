<template>
  <div class="min-h-screen bg-[#F8F9FB] pb-10 font-sans relative max-w-md mx-auto">
    <!-- Header -->
    <header class="px-5 pt-8 pb-4 flex items-center justify-between sticky top-0 bg-[#F8F9FB]/90 backdrop-blur-sm z-40">
      <div class="flex items-center gap-3">
        <button @click="kembali" class="p-2 -ml-2 text-gray-800 hover:bg-gray-200 rounded-full transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <h1 class="text-[17px] font-bold text-[#062923]">Riwayat Penukaran</h1>
      </div>
    </header>

    <!-- Ringkasan Singkat -->
    <section class="px-5 mt-2">
      <div class="bg-[#004D40] rounded-2xl p-5 text-white flex justify-between items-center shadow-md relative overflow-hidden">
        <div class="relative z-10">
          <p class="text-xs text-[#8ABFB7] font-medium">Total Penukaran Anda</p>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-2xl font-bold tracking-tight">12 Transaksi</span>
          </div>
        </div>
        <!-- Ikon Transparan di Latar -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 absolute -right-2 -bottom-2 text-white opacity-10">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
        </svg>
      </div>
    </section>

    <!-- Filter Tab (Scroll Horizontal) -->
    <section class="mt-6">
      <div class="flex gap-2.5 overflow-x-auto px-5 pb-2 hide-scrollbar">
        <button 
          v-for="filter in listFilter" 
          :key="filter"
          @click="filterAktif = filter"
          class="px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
          :class="filterAktif === filter ? 'bg-[#E5E7EB] text-gray-900 font-semibold shadow-sm' : 'bg-white text-gray-500 border border-gray-100'"
        >
          {{ filter }}
        </button>
      </div>
    </section>

    <!-- Daftar Riwayat -->
    <section class="px-5 mt-4 space-y-3">
      <div v-if="filteredRiwayat.length === 0" class="text-center text-gray-400 py-10 text-sm">
        Tidak ada riwayat penukaran.
      </div>
      
      <div 
        v-for="item in filteredRiwayat" 
        :key="item.id" 
        class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col cursor-pointer hover:bg-gray-50 transition"
      >
        <!-- Baris Pertama: Waktu & Status -->
        <div class="flex justify-between items-center mb-3">
          <p class="text-xs text-gray-500 font-medium">{{ item.waktu }}</p>
          <span 
            class="text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider"
            :class="getStatusClass(item.status)"
          >
            {{ item.status }}
          </span>
        </div>

        <!-- Baris Kedua: Ikon, Judul & Nominal -->
        <div class="flex justify-between items-start gap-3">
          <div class="flex items-start gap-3 flex-1">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" :class="item.type === 'sembako' ? 'bg-[#EEF2FF] text-[#1A4BFF]' : 'bg-[#F2E5D2] text-[#4A3B22]'">
              <span class="text-xl">{{ item.icon }}</span>
            </div>
            <div>
              <h3 class="text-sm font-bold text-gray-900">{{ item.judul }}</h3>
              <p class="text-[13px] text-gray-500 mt-0.5 line-clamp-1">{{ item.deskripsi }}</p>
            </div>
          </div>
          
          <div class="text-right shrink-0">
            <p class="text-sm font-bold" :class="item.status === 'Dibatalkan' ? 'text-gray-400 line-through' : 'text-[#023E35]'">
              - {{ formatAngka(item.poin) }}
            </p>
            <p class="text-[11px] text-gray-500 mt-1">Poin</p>
          </div>
        </div>

        <!-- Baris Ketiga: ID Transaksi (Opsional) -->
        <div class="mt-3 pt-3 border-t border-gray-50 flex justify-between items-center">
          <p class="text-[11px] text-gray-400">ID: {{ item.id }}</p>
          <button class="text-[11px] font-bold text-[#1A4BFF] hover:underline">Lihat Detail</button>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// State Filter
const filterAktif = ref('Semua')
const listFilter = ['Semua', 'Berhasil', 'Diproses', 'Dibatalkan']

// Data Dummy Riwayat Transaksi
const dataRiwayat = ref([
  {
    id: 'TRX-99210',
    waktu: '12 Ags 2024, 10:45',
    judul: 'Penukaran Sembako',
    deskripsi: 'Beras Premium (5kg), Gula Pasir (1kg)',
    poin: 150,
    status: 'Berhasil',
    type: 'sembako',
    icon: '🛍️'
  },
  {
    id: 'TRX-99182',
    waktu: '05 Ags 2024, 14:20',
    judul: 'Penukaran Sembako',
    deskripsi: 'Minyak Goreng (2L)',
    poin: 180,
    status: 'Berhasil',
    type: 'sembako',
    icon: '🛍️'
  },
  {
    id: 'TRX-99155',
    waktu: '28 Jul 2024, 09:15',
    judul: 'Tukar Saldo Tunai',
    deskripsi: 'Pencairan ke rekening Bank',
    poin: 500,
    status: 'Diproses',
    type: 'tunai',
    icon: '💸'
  },
  {
    id: 'TRX-99012',
    waktu: '10 Jul 2024, 16:30',
    judul: 'Penukaran Sembako',
    deskripsi: 'Garam (500g)',
    poin: 50,
    status: 'Dibatalkan',
    type: 'sembako',
    icon: '🛍️'
  }
])

// Computed property untuk memfilter riwayat berdasarkan tab yang dipilih
const filteredRiwayat = computed(() => {
  if (filterAktif.value === 'Semua') {
    return dataRiwayat.value
  }
  return dataRiwayat.value.filter(item => item.status === filterAktif.value)
})

// Formatting angka (1000 -> 1.000)
const formatAngka = (num) => new Intl.NumberFormat('id-ID').format(num)

// Warna status dinamis
function getStatusClass(status) {
  switch (status) {
    case 'Berhasil':
      return 'bg-[#E8F5E9] text-[#2E7D32]' // Hijau
    case 'Diproses':
      return 'bg-[#FFF3E0] text-[#E65100]' // Oranye
    case 'Dibatalkan':
      return 'bg-[#FFEBEE] text-[#C62828]' // Merah
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

// Navigasi
function kembali() {
  router.back()
}
</script>

<style scoped>
/* Menyembunyikan scrollbar bawaan browser untuk filter */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.line-clamp-1 {
  display: -webkit-box;
  line-clamp: 1;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>