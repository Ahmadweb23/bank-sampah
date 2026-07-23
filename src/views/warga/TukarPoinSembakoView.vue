<template>
  <div class="min-h-screen bg-[#F8F9FB] pb-36 font-sans relative max-w-md mx-auto">
    <!-- Header -->
    <header class="px-5 pt-8 pb-4 flex items-center justify-between sticky top-0 bg-[#F8F9FB] z-40">
      <div class="flex items-center gap-3">
        <button @click="kembali" class="p-2 -ml-2 text-gray-800 hover:bg-gray-200 rounded-full transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <h1 class="text-[17px] font-semibold text-gray-800">Tukar Poin Sembako</h1>
      </div>
      <!-- Profil Admin / Petugas -->
      <div class="w-9 h-9 rounded-full bg-[#A8E8D5] flex items-center justify-center text-sm font-bold text-[#024034]">
        BK
      </div>
    </header>

    <!-- Card Pilih Warga -->
    <section class="px-5 mt-2">
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <label class="text-[11px] font-bold text-gray-500 tracking-wider mb-3 block">
          PILIH WARGA
        </label>
        
        <!-- Input Pencarian -->
        <div class="relative mb-4">
          <!-- Ikon Search -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          
          <input 
            type="text" 
            placeholder="Cari nama atau ID warga" 
            class="w-full bg-[#F4F5F9] rounded-xl py-3 pl-10 pr-10 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#014D40]"
          />
          
          <!-- Ikon Dropdown -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>

        <!-- Warga Terpilih -->
        <div class="flex items-center gap-3">
          <div class="w-7 h-7 rounded-full bg-[#A8E8D5] flex items-center justify-center text-[10px] font-bold text-[#024034]">
            BK
          </div>
          <p class="text-[13px] font-medium text-gray-800">
            Budi Kusuma (5.150 Poin)
          </p>
        </div>
      </div>
    </section>

    <!-- Katalog Kategori (Horizontal Scroll) -->
    <section class="mt-6">
      <div class="px-5 mb-3">
        <h2 class="text-lg font-bold text-[#023E35]">Katalog Sembako</h2>
      </div>
      
      <div class="flex gap-2.5 overflow-x-auto px-5 pb-2 hide-scrollbar">
        <button 
          v-for="kat in kategoriList" 
          :key="kat"
          @click="kategoriAktif = kat"
          class="px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
          :class="kategoriAktif === kat ? 'bg-[#014D40] text-white' : 'bg-[#EBF0FF] text-gray-600 hover:bg-gray-200'"
        >
          {{ kat }}
        </button>
      </div>
    </section>

    <!-- List Produk -->
    <section class="px-5 mt-4 space-y-3">
      <div 
        v-for="item in produkList" 
        :key="item.id" 
        class="bg-white rounded-2xl p-3 flex gap-4 shadow-sm border border-gray-100"
      >
        <!-- Gambar Produk -->
        <div class="w-[85px] h-[85px] bg-[#F4F5F9] rounded-xl overflow-hidden shrink-0">
          <img :src="item.image" :alt="item.nama" class="w-full h-full object-cover" />
        </div>
        
        <!-- Info & Stepper -->
        <div class="flex flex-col justify-center flex-1">
          <h3 class="text-[15px] font-bold text-[#023E35] leading-tight">{{ item.nama }}</h3>
          <p class="text-sm font-semibold text-[#1A4BFF] mt-1">{{ formatAngka(item.poin) }} Poin</p>
          
          <!-- Stepper Kontrol (- 0 +) -->
          <div class="flex items-center justify-between w-[90px] bg-[#F4F5F9] rounded-xl px-1 py-1 mt-2">
            <button 
              @click="kurangi(item)" 
              class="w-7 h-7 flex items-center justify-center text-gray-600 font-medium rounded-lg hover:bg-white transition"
              :class="{ 'opacity-50 cursor-not-allowed': item.qty === 0 }"
            >
              −
            </button>
            <span class="text-sm font-semibold text-gray-900 w-4 text-center">{{ item.qty }}</span>
            <button 
              @click="tambah(item)" 
              class="w-7 h-7 flex items-center justify-center text-gray-600 font-medium rounded-lg hover:bg-white transition"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom Bar (Fixed) -->
    <div class="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md bg-white border-t border-gray-100 rounded-t-[24px] px-6 py-5 shadow-[0_-8px_20px_rgba(0,0,0,0.03)]">
      <p class="text-[12px] text-gray-500 font-medium">Total Poin Ditukar</p>
      <p class="text-2xl font-bold text-[#023E35] mt-0.5">{{ formatAngka(totalPoin) }} Poin</p>
      
      <button 
        @click="konfirmasiTukar"
        :disabled="totalPoin === 0"
        class="w-full mt-4 py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors duration-300"
        :class="totalPoin === 0 ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-[#014D40] hover:bg-[#01352c] text-white shadow-md'"
      >
        <!-- Cart Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
        Konfirmasi Tukar
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// State Kategori
const kategoriAktif = ref('Sembako')
const kategoriList = ['Sembako', 'Kebutuhan Rumah', 'Lainnya']

// Data Produk (Ditambah Qty)
const produkList = ref([
  { id: 1, nama: 'Beras (1kg)', poin: 150, qty: 0, image: 'https://placehold.co/300x300/E8F0EE/062923?text=Beras' },
  { id: 2, nama: 'Gula (1kg)', poin: 160, qty: 0, image: 'https://placehold.co/300x300/FDF8F0/062923?text=Gula' },
  { id: 3, nama: 'Minyak Goreng (1L)', poin: 180, qty: 0, image: 'https://placehold.co/300x300/FFFBEB/062923?text=Minyak' },
  { id: 4, nama: 'Garam', poin: 50, qty: 0, image: 'https://placehold.co/300x300/F0EDF5/062923?text=Garam' }
])

// Computed property untuk menghitung total poin otomatis
const totalPoin = computed(() => {
  return produkList.value.reduce((total, item) => {
    return total + (item.poin * item.qty)
  }, 0)
})

// Formatting angka (1000 -> 1.000)
const formatAngka = (num) => new Intl.NumberFormat('id-ID').format(num)

// Logika Stepper
function tambah(item) {
  item.qty++
}

function kurangi(item) {
  if (item.qty > 0) {
    item.qty--
  }
}

// Navigasi
function kembali() {
  router.back()
}

function konfirmasiTukar() {
  if (totalPoin.value > 0) {
    // Navigasi ke halaman sukses tukar poin
    router.push('/sukses-tukar-poin')
  }
}
</script>

<style scoped>
/* Menyembunyikan scrollbar bawaan browser untuk chip kategori */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>