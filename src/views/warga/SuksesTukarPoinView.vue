<template>
  <div class="min-h-screen bg-[#F8F9FB] pb-10 font-sans relative max-w-md mx-auto px-5 pt-6">
    <!-- Header Modal / Navigation -->
    <header class="flex justify-between items-center mb-8">
      <h1 class="text-lg font-bold text-[#023E35]">Bank Sampah</h1>
      <button @click="kembaliKeBeranda" class="p-1.5 text-gray-700 hover:bg-gray-200 rounded-full transition">
        <!-- Close Icon (X) -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </header>

    <!-- Title & Subtitle -->
    <div class="text-center mb-6">
      <h2 class="text-2xl font-bold text-[#023E35]">Tukarkan Poin Berhasil</h2>
      <p class="text-sm text-gray-600 mt-1.5 max-w-[260px] mx-auto leading-relaxed">
        Sembako sudah dapat diserahkan kepada warga.
      </p>
    </div>

    <!-- Banner Total Poin Dipotong -->
    <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex justify-between items-center mb-4 relative overflow-hidden">
      <div>
        <p class="text-xs text-gray-500 font-medium">Total Poin Dipotong</p>
        <p class="text-3xl font-extrabold text-[#1A4BFF] mt-1">
          {{ formatAngka(transaksi.totalPoin) }} Poin
        </p>
      </div>
      <!-- Illustration / Icon Card Placeholder -->
      <div class="w-16 h-16 bg-[#EEF2FF] rounded-2xl flex items-center justify-center relative">
        <div class="w-8 h-8 rounded-full bg-[#1A4BFF] flex items-center justify-center text-white text-xs font-bold shadow-sm">
          ★
        </div>
      </div>
    </div>

    <!-- Card Rincian Sembako -->
    <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
      <div class="flex items-center gap-2 mb-4">
        <!-- Shopping Bag Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-[#023E35]">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        <h3 class="text-sm font-bold text-[#023E35]">Rincian Sembako</h3>
      </div>

      <!-- Item List -->
      <div class="space-y-2.5">
        <div 
          v-for="(item, idx) in transaksi.items" 
          :key="idx"
          class="bg-[#F3F5FC] rounded-xl p-3.5 flex justify-between items-center"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-700 shadow-xs">
              <!-- Item Icon Placeholder -->
              <span class="text-lg">{{ item.icon || '📦' }}</span>
            </div>
            <div>
              <p class="text-sm font-bold text-gray-900 leading-tight">{{ item.nama }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ item.varian }}</p>
            </div>
          </div>
          <p class="text-sm font-bold text-[#023E35]">{{ item.poin }} Poin</p>
        </div>
      </div>
    </div>

    <!-- Grid ID Transaksi & Waktu -->
    <div class="grid grid-cols-2 gap-3 mb-4">
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <p class="text-xs text-gray-500 font-medium">ID Transaksi</p>
        <p class="text-sm font-bold text-gray-900 mt-1">{{ transaksi.id }}</p>
      </div>
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <p class="text-xs text-gray-500 font-medium">Waktu</p>
        <p class="text-sm font-bold text-gray-900 mt-1">{{ transaksi.waktu }}</p>
      </div>
    </div>

    <!-- Card Penerima Sembako -->
    <div class="bg-[#014D40] rounded-2xl p-4 text-white flex items-center gap-3.5 shadow-sm mb-6">
      <div class="w-11 h-11 rounded-full bg-gray-300 overflow-hidden border border-white/30 shrink-0">
        <img :src="transaksi.penerima.foto" :alt="transaksi.penerima.nama" class="w-full h-full object-cover" />
      </div>
      <div>
        <p class="text-[11px] text-[#A8E8D5] font-medium">Penerima Sembako</p>
        <p class="text-sm font-bold text-white mt-0.5">{{ transaksi.penerima.nama }}</p>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="space-y-3">
      <!-- Transaksi Baru -->
      <button @click="transaksiBaru" class="w-full bg-[#01382E] hover:bg-[#002B23] text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition text-sm shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Transaksi Baru
      </button>

      <!-- Bottom 2 Buttons -->
      <div class="grid grid-cols-2 gap-3">
        <button @click="cetakStruk" class="bg-[#1A4BFF] hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition text-sm shadow-sm">
          <!-- Printer Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231a1.125 1.125 0 01-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-19.126 0C1.068 7.441.3 8.375.3 9.456v6.294A2.25 2.25 0 002.55 18h1.091" />
          </svg>
          Cetak Struk
        </button>

        <button @click="bagikan" class="bg-[#E2E8F0] hover:bg-gray-300 text-gray-800 font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition text-sm">
          <!-- Share Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
          </svg>
          Bagikan
        </button>
      </div>

      <!-- Kembali ke Beranda Link -->
      <div class="text-center pt-2">
        <button @click="kembaliKeBeranda" class="text-sm font-bold text-[#023E35] hover:underline">
          Kembali ke Beranda
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Data dummy transaksi sesuai tampilan foto
const transaksi = ref({
  id: '#TRX-99210',
  waktu: 'Hari ini, 10:45',
  totalPoin: 150,
  penerima: {
    nama: 'Ibu Siti Aminah',
    foto: 'https://ui-avatars.com/api/?name=Siti+Aminah&background=random'
  },
  items: [
    { nama: 'Beras Premium', varian: '1 Pack (5kg)', poin: 100, icon: '🍚' },
    { nama: 'Gula Pasir', varian: '1 Pack (1kg)', poin: 50, icon: '💧' }
  ]
})

const formatAngka = (num) => new Intl.NumberFormat('id-ID').format(num)

function kembaliKeBeranda() {
  router.push('/warga')
}

function transaksiBaru() {
  router.push('/tukar-poin-sembako')
}

function cetakStruk() {
  window.print()
}

function bagikan() {
  if (navigator.share) {
    navigator.share({
      title: 'Struk Penukaran Poin',
      text: `Penukaran Poin Berhasil untuk ${transaksi.value.penerima.nama} (${transaksi.value.totalPoin} Poin). ID: ${transaksi.value.id}`
    })
  } else {
    alert('Fitur bagikan tidak didukung di browser ini.')
  }
}
</script>