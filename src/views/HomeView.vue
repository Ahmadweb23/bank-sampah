<template>
  <div class="min-h-screen bg-[#f7f8f7] max-w-md mx-auto pb-24 text-slate-900"> 
    <!-- Header -->
    <header class="bg-white px-6 pt-8 pb-6 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="#147052" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8">
              <path d="M8 4c2.2 1.4 3.5 3.4 4 6.2" />
              <path d="M12 3c1.2 2.2 1.8 4.3 1.8 6.9" />
              <path d="M7 14c2.1-.2 3.8-.5 5.2-1.4" />
              <path d="M9 18c1.4-.4 2.7-.4 4 0" />
              <path d="M7.5 10c2-.5 3.5-1 5.3-2.4" />
            </svg>
          </div>

          <div>
            <h1 class="text-2xl font-bold text-green-900 leading-tight">Bank Sampah</h1>
            <p class="text-lg font-semibold text-green-700">Bojong Karya 2</p>  
          </div>
        </div>

        <button class="w-11 h-11 rounded-full flex items-center justify-center text-gray-700">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
            <path d="M10 5a2 2 0 0 1 4 0 4 4 0 0 0 3.9 4h.1v1.6c0 .8.2 1.5.6 2.2l1.2 1.7a1 1 0 0 1-.8 1.5H7.9a1 1 0 0 1-.8-1.5L8.3 9.4c.3-.7.5-1.4.5-2.2V9A4 4 0 0 0 10 5Z" />
            <path d="M10 17a2 2 0 0 0 4 0" />
            <circle cx="17.5" cy="6.5" r="2" fill="#147052" stroke="none" />    
          </svg>
        </button>
      </div>
    </header>

    <main class="px-6 py-6 pb-28">
      <!-- Greeting -->
      <section class="mb-6">
        <div class="flex items-center gap-2">
          <h2 class="text-2xl font-bold text-slate-900">
            Selamat pagi, Pengelola
          </h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="#147052" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
            <path d="M8 4c2.2 1.4 3.5 3.4 4 6.2" />
            <path d="M12 3c1.2 2.2 1.8 4.3 1.8 6.9" />
            <path d="M7 14c2.1-.2 3.8-.5 5.2-1.4" />
            <path d="M9 18c1.4-.4 2.7-.4 4 0" />
            <path d="M7.5 10c2-.5 3.5-1 5.3-2.4" />
          </svg>
        </div>
        <p class="text-base text-gray-600 mt-2">
          Kelola sampah, jaga lingkungan, raih manfaat.
        </p>
      </section>

      <!-- Saldo Poin Hero -->
      <section class="relative overflow-hidden bg-gradient-to-br from-green-800 to-green-950 rounded-[28px] p-6 mb-5 text-white shadow-sm">
        <div class="relative z-10">
          <p class="text-sm uppercase tracking-wide text-white/80 mb-4">Saldo Poin</p>

          <div class="flex items-end gap-2">
            <p class="text-6xl font-bold leading-none">{{ dashboardData.total_poin || 0 }}</p>
            <span class="text-lg font-semibold mb-2">Poin</span>
          </div>

          <div class="inline-flex items-center gap-2 bg-white/10 rounded-2xl px-4 py-3 mt-6 backdrop-blur">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">       
              <path d="M5 12c0-3 2-5.5 5-7 1.5 2.5 1.5 4.5 1.5 7" />
              <path d="M10 5c-1 3-2.2 4.8-3.8 7" />
              <path d="M16 6c.5 2.5 0 5-2 7" />
              <path d="M7 17c2.5 0 4.5-1 6-3" />
            </svg>
            <p class="font-semibold">Setara Rp {{ formatCurrency((dashboardData.total_poin || 0) * 100) }}</p>
          </div>
        </div>

        <div class="absolute right-0 bottom-0 leading-none">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" class="h-[150px] w-[150px] opacity-10">
            <path d="M5 15c2-5 6-8 10-8 2 0 3 1 3 3 0 3-2 5-6 8" />
            <path d="M6 19c2-2 4-4 7-5" />
            <path d="M10 4c1 2 2 3 3 4" />
            <path d="M8 11c1 1 2 2 3 3" />
          </svg>
        </div>
      </section>

      <!-- Nilai Saldo -->
      <section class="bg-white rounded-[24px] p-6 mb-5 shadow-sm border border-gray-100">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm uppercase tracking-wide text-gray-500 mb-3">Nilai Saldo</p>
            <p class="text-3xl font-bold text-slate-900">Rp {{ formatCurrency(dashboardData.saldo_kas || 0) }}</p>
          </div>

          <div class="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="#147052" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-7 w-7">
              <path d="M4 8h13a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" />
              <path d="M4 8V6a2 2 0 0 1 2-2h2" />
              <path d="M17 8V6" />
              <circle cx="9" cy="16" r="1" fill="#147052" stroke="none" />      
              <circle cx="15" cy="16" r="1" fill="#147052" stroke="none" />     
            </svg>
          </div>
        </div>

        <button class="mt-6 flex items-center gap-2 ml-auto text-sm font-semibold text-green-800">
          Lihat detail
          <span class="text-lg">›</span>
        </button>
      </section>

      <!-- Statistik Kecil -->
      <section class="grid grid-cols-2 gap-4 mb-5">
        <div class="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100">
          <div class="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center mb-5">
            <svg viewBox="0 0 24 24" fill="none" stroke="#147052" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
              <path d="M5 18V10" />
              <path d="M12 18V6" />
              <path d="M19 18v-8" />
            </svg>
          </div>

          <p class="text-sm uppercase tracking-wide text-gray-600 leading-relaxed">
            Transaksi<br />Terakhir
          </p>

          <div class="flex items-end justify-between mt-6">
            <div>
              <p class="text-3xl font-bold">{{ dashboardData.total_setoran_kg || 0 }}</p>
              <p class="text-sm text-gray-500 mt-1">
                Setoran & penjualan tercatat
              </p>
            </div>
            <span class="text-3xl text-gray-500">›</span>
          </div>
        </div>

        <div class="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100">
          <div class="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center mb-5">
            <svg viewBox="0 0 24 24" fill="none" stroke="#147052" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
              <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              <path d="M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              <path d="M4 20a4 4 0 0 1 8 0" />
              <path d="M12 20a4 4 0 0 1 8 0" />
            </svg>
          </div>

          <p class="text-sm uppercase tracking-wide text-gray-600 leading-relaxed">
            Anggota<br />Aktif
          </p>

          <div class="flex items-end justify-between mt-6">
            <div>
              <p class="text-3xl font-bold">{{ dashboardData.total_warga || 0 }}</p>
              <p class="text-sm text-gray-500 mt-1">Warga terdaftar</p>
            </div>
            <span class="text-3xl text-gray-500">›</span>
          </div>
        </div>
      </section>

      <!-- Motivasi -->
      <section class="bg-green-50 rounded-[24px] p-5 mb-6 overflow-hidden relative min-h-[135px]">
        <div class="relative z-10 max-w-[58%]">
          <p class="text-lg font-bold text-green-950 leading-snug">
            Yuk, pilah sampah untuk lingkungan yang lebih baik!
          </p>
          <p class="text-sm text-gray-600 mt-3">
            Sampahmu bernilai, bumi pun tersenyum.
          </p>
        </div>

        <div class="absolute right-4 bottom-2 leading-none">
          <svg viewBox="0 0 24 24" fill="none" stroke="#4a9b5a" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" class="h-24 w-24 opacity-80"> 
            <path d="M7 7a4 4 0 0 1 7 1" />
            <path d="M11 6H7v4" />
            <path d="M17 17a4 4 0 0 1-7-1" />
            <path d="M13 18h4v-4" />
          </svg>
        </div>
      </section>

      <!-- Primary Action (Setor Sampah) -->
      <section class="mb-6">
        <button type="button" @click="openFormModal" class="flex w-full items-center justify-between rounded-[22px] bg-[#08704f] px-5 py-4 text-white shadow-[0_8px_18px_rgba(8,112,79,0.22)] transition active:scale-[0.98]">
          <span class="flex items-center gap-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-7 w-7">
              <path d="M8 4c2.2 1.4 3.5 3.4 4 6.2" />
              <path d="M12 3c1.2 2.2 1.8 4.3 1.8 6.9" />
              <path d="M7 14c2.1-.2 3.8-.5 5.2-1.4" />
              <path d="M9 18c1.4-.4 2.7-.4 4 0" />
              <path d="M7.5 10c2-.5 3.5-1 5.3-2.4" />
            </svg>
            <span class="text-[18px] font-semibold">
              Terima Sampah Warga
            </span>
          </span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-7 w-7">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </section>

      <!-- Quick Actions -->
      <section class="mb-6 grid grid-cols-2 gap-3">
        <!-- Jadwal Penjemputan -->
        <router-link to="/jual" class="flex min-h-[92px] items-center gap-3 rounded-[22px] bg-white px-4 shadow-[0_8px_18px_rgba(20,36,49,0.08)] transition active:scale-[0.98]">
          <div class="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full bg-[#f4f5e9]">
            <svg viewBox="0 0 24 24" fill="none" stroke="#147052" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8">
              <path d="M5 17h14M5 17a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2M7 21v-2m10 2v-2" />
            </svg>
          </div>
          <p class="text-[15px] font-medium leading-tight">
            Jual ke Pengepul
          </p>
        </router-link>

        <!-- Catat Biaya -->
        <router-link to="/riwayat" class="flex min-h-[92px] items-center gap-3 rounded-[22px] bg-white px-4 shadow-[0_8px_18px_rgba(20,36,49,0.08)] transition active:scale-[0.98]">
          <div class="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full bg-[#f4f5e9]">
            <svg viewBox="0 0 24 24" fill="none" stroke="#147052" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <p class="text-[15px] font-medium leading-tight">
            Catat Biaya
          </p>
        </router-link>

        <!-- Tukar Poin Full Width -->
        <router-link to="/tukar-poin-sembako" class="col-span-2 flex min-h-[92px] items-center gap-3 rounded-[22px] bg-white px-4 shadow-[0_8px_18px_rgba(20,36,49,0.08)] transition active:scale-[0.98]">
          <div class="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full bg-[#f4f5e9]">
            <svg viewBox="0 0 24 24" fill="none" stroke="#147052" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <p class="flex-1 text-[16px] font-medium">
            Tukar Poin
          </p>
          <svg viewBox="0 0 24 24" fill="none" stroke="#147052" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-7 w-7">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </router-link>
      </section>

      <!-- Search & Filter -->
      <section class="mb-6">
        <div class="relative">
          <svg viewBox="0 0 24 24" fill="none" stroke="#687481" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="absolute left-5 top-1/2 -translate-y-1/2 h-7 w-7">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input v-model="query" placeholder="Cari nama atau jenis transaksi..." class="h-[66px] w-full rounded-full border border-[#e3e1da] bg-[#f9f8f3] px-14 pr-14 text-[16px] text-[#142431] outline-none placeholder:text-[#7b858e] focus:border-[#147052]" />
        </div>
        <div class="mt-4 flex gap-2 overflow-x-auto pb-1">
          <button v-for="chip in filterChips" :key="chip" type="button" @click="toggleChip(chip)" :class="['shrink-0 rounded-full px-5 py-3 text-[14px] transition', activeChips.includes(chip) ? 'bg-[#08704f] font-semibold text-white' : 'bg-[#f5f3ec] text-[#142431]']">
            {{ chip }}
          </button>
        </div>
      </section>

      <!-- Recent Transactions -->
      <section>
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-[18px] font-medium">
            Transaksi Terakhir
          </h3>
          <button type="button" @click="loadInitialData" class="flex items-center gap-1 text-[14px] text-[#08704f]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" :class="{ 'animate-spin': isLoadingData }" class="h-5 w-5">
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Refresh
          </button>
        </div>
        <div class="space-y-3">
          <div v-for="(t, i) in filteredTransactions" :key="i" class="flex min-h-[104px] items-center gap-3 rounded-[22px] bg-white px-4 shadow-[0_8px_18px_rgba(20,36,49,0.08)]">
            <div :class="['flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-[16px]', t.amount >= 0 ? 'bg-[#eef3df]' : 'bg-[#f7f0df]']">
              <svg viewBox="0 0 24 24" fill="none" stroke="#147052" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8">
                <path d="M7 7a4 4 0 0 1 7 1" />
                <path d="M11 6H7v4" />
                <path d="M17 17a4 4 0 0 1-7-1" />
                <path d="M13 18h4v-4" />
              </svg>
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-[16px] font-medium">
                {{ t.title }}
              </p>
              <p class="mt-1 truncate text-[14px] text-[#687481]">
                {{ t.subtitle }}
              </p>
            </div>
            <div class="text-right">
              <p :class="['whitespace-nowrap text-[16px] font-semibold', t.amount >= 0 ? 'text-[#08704f]' : 'text-red-500']">
                {{ t.amount >= 0 ? "+" : "-" }} Rp
                {{ Math.abs(t.amount).toLocaleString("id-ID") }}
              </p>
              <p class="mt-1 whitespace-nowrap text-[13px] text-[#687481]">
                {{ t.time }}
              </p>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="#687481" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>
          <p v-if="filteredTransactions.length === 0" class="rounded-2xl bg-white p-5 text-center text-sm text-[#687481]">
            Tidak ada transaksi yang sesuai.
          </p>
        </div>
      </section>
      
      <BottomNav />
    </main>
  </div>

  <!-- Popup Form Terima Sampah -->
  <Teleport to="body">
    <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6" @click.self="closeFormModal">
      <div class="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[24px] bg-white p-5 shadow-2xl relative">
        <!-- Modal Header -->
        <div class="mb-5 flex items-center justify-between">
          <h3 class="text-[19px] font-semibold">
            Form Terima Sampah
          </h3>
          <button type="button" class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-[#687481]" @click="closeFormModal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <!-- Nama Warga -->
        <div class="relative">
          <label class="text-[14px] text-[#687481]">
            Nama Warga
          </label>
          <input v-model="namaWarga" @input="onNamaWargaInput" @blur="onNamaWargaBlur" class="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#147052]" placeholder="Ketik nama warga dari spreadsheet..." />
          <!-- Rekomendasi Nama Warga murni dari spreadsheet -->
          <div v-if="showWargaSuggestions && namaWarga.trim() !== '' && filteredWargaSuggestions.length > 0" class="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
            <button v-for="w in filteredWargaSuggestions" :key="w.username || w.nama" type="button" @mousedown.prevent="selectWargaSuggestion(w)" class="flex w-full items-center justify-between border-b border-slate-100 px-4 py-2.5 text-left text-sm hover:bg-emerald-50 focus:bg-emerald-50 transition">
              <div>
                <p class="font-medium text-[#142431]">{{ w.nama }}</p>
                <p class="text-xs text-[#687481]" v-if="w.username">@{{ w.username }}</p>
              </div>
              <span class="text-xs font-semibold text-[#147052]" v-if="w.no_hp">{{ w.no_hp }}</span>
            </button>
          </div>
        </div>
        <!-- RT / Catatan -->
        <label class="mt-4 block text-[14px] text-[#687481]">
          RT / Catatan (Opsional)
        </label>
        <input v-model="rt" class="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#147052]" placeholder="Contoh: 07 / Blok A" />
        <!-- Item Sampah -->
        <div class="mt-5">
          <div class="flex items-center justify-between">
            <p class="text-[15px] font-medium">
              Item Sampah
            </p>
            <button type="button" class="text-sm font-medium text-[#147052]" @click="addItem">
              + Tambah Item
            </button>
          </div>
          <div class="mt-3 space-y-3">
            <div v-for="(item, index) in items" :key="index" class="rounded-xl border border-slate-200 p-3 bg-slate-50/50">
              <!-- Dropdown Kategori Sampah -->
              <label class="mb-1 block text-xs font-medium text-[#687481]">
                Kategori Sampah
              </label>
              <select v-model="item.kode" class="mb-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#147052]">
                <option value="" disabled>-- Pilih Kategori Sampah --</option>
                <option v-for="cat in masterSampahList" :key="cat.kode || cat.nama_kategori || cat.nama" :value="cat.kode || cat.nama_kategori || cat.nama">
                  {{ cat.nama_kategori || cat.nama }}
                </option>
              </select>
              <div class="flex gap-2 items-center">
                <div class="w-1/2">
                  <label class="mb-1 block text-xs font-medium text-[#687481]">
                    Berat (kg)
                  </label>
                  <input v-model.number="item.berat" type="number" step="0.1" min="0" placeholder="0.0" class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#147052]" />
                </div>
                <div class="w-1/2 flex items-end pt-5">
                  <button type="button" class="w-full rounded-lg bg-red-50 py-2 text-sm font-medium text-red-600 hover:bg-red-100" @click="removeItem(index)">
                    Hapus Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Banner Error & Petunjuk Update Deployment -->
        <div v-if="lastErrorMsg" class="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
          <p class="font-bold flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            Gagal: {{ lastErrorMsg }}
          </p>
          <p class="mt-1 leading-relaxed">
            <strong>Penyebab:</strong> Google Apps Script server pada URL deployment yang dipanggil belum di-deploy ke versi terbaru (.gs).
          </p>
          <p class="mt-1 leading-relaxed text-red-900 font-semibold">
            👉 <strong>Solusi:</strong> Buka script.google.com -> Klik <em>Deploy</em> -> <em>New Deployment</em> -> Pilih <em>Web App</em> -> Set <em>Who has access: Anyone</em> -> Simpan & Deploy.
          </p>
        </div>
        <!-- Modal Actions -->
        <div class="mt-6 flex gap-2">
          <button type="button" class="w-1/3 rounded-xl bg-slate-100 py-3 text-sm font-medium text-[#687481]" @click="closeFormModal" :disabled="isSubmitting">
            Batal
          </button>
          <button type="button" @click.prevent="submitTransaction" :disabled="isSubmitting" class="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-[#08704f] py-3 text-sm font-semibold text-white transition active:scale-[0.98] disabled:opacity-50">
            <svg v-if="isSubmitting" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="animate-spin h-5 w-5">
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            <span>{{ isSubmitting ? 'Menyimpan...' : 'Simpan Transaksi' }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { submitSetoran, getMasterSampah, getWargaList, getRiwayatTransaksi, getDashboardData } from '../services/api'
import BottomNav from '../components/BottomNav.vue'

const router = useRouter()
const showModal = inject('showModal') || window.showModal

const showForm = ref(false)
const namaWarga = ref('')
const selectedWargaObj = ref(null)
const showWargaSuggestions = ref(false)
const rt = ref('')
const isSubmitting = ref(false)
const isLoadingData = ref(false)
const lastErrorMsg = ref('')
const dashboardData = ref({})

const masterSampahList = ref([])
const wargaList = ref([])
const totalSaldoPoin = ref(0)

const items = ref([
  {
    kode: '',
    berat: null,
  },
])

// Filter Warga dari data spreadsheet yang di-load via API
const filteredWargaSuggestions = computed(() => {
  const queryText = namaWarga.value.toLowerCase().trim()
  if (!queryText) {
    return []
  }

  return wargaList.value.filter((w) => {
    const nameMatch = String(w.nama || '').toLowerCase().includes(queryText)
    const userMatch = String(w.username || '').toLowerCase().includes(queryText)
    return nameMatch || userMatch
  })
})

function onNamaWargaInput() {
  showWargaSuggestions.value = true
  if (selectedWargaObj.value && selectedWargaObj.value.nama !== namaWarga.value) {
    selectedWargaObj.value = null
  }
}

function onNamaWargaBlur() {
  setTimeout(() => {
    showWargaSuggestions.value = false
  }, 200)
}

function selectWargaSuggestion(w) {
  namaWarga.value = w.nama
  selectedWargaObj.value = w
  showWargaSuggestions.value = false
}

function openFormModal() {
  showForm.value = true
  showWargaSuggestions.value = false
  lastErrorMsg.value = ''
}

function closeFormModal() {
  showForm.value = false
  showWargaSuggestions.value = false
}

function addItem() {
  items.value.push({
    kode: '',
    berat: null,
  })
}

function removeItem(i) {
  if (items.value.length > 1) {
    items.value.splice(i, 1)
  } else {
    items.value = [{ kode: '', berat: null }]
  }
}

const query = ref('')

const filterChips = [
  'Semua',
  'Setoran',
  'Penarikan',
  'Pembelian',
  'Biaya',
]

const activeChips = ref(['Semua'])

function toggleChip(chip) {
  if (chip === 'Semua') {
    activeChips.value = ['Semua']
    return
  }

  if (activeChips.value.includes(chip)) {
    activeChips.value = activeChips.value.filter((c) => c !== chip)

    if (activeChips.value.length === 0) {
      activeChips.value = ['Semua']
    }
  } else {
    activeChips.value = activeChips.value.filter((c) => c !== 'Semua')
    activeChips.value.push(chip)
  }
}

const transactions = ref([])

const filteredTransactions = computed(() => {
  const q = query.value.toLowerCase().trim()

  return transactions.value.filter((t) => {
    const transactionTypes = [t.type, ...(t.aliases || [])]
    if (
      !activeChips.value.includes('Semua') &&
      !activeChips.value.some((chip) =>
        transactionTypes.includes(chip)
      )
    ) {
      return false
    }

    if (!q) {
      return true
    }

    return (
      t.title.toLowerCase().includes(q) ||
      t.subtitle.toLowerCase().includes(q)
    )
  })
})

async function loadDashboard() {
  try {
    const response = await getDashboardData()
    dashboardData.value = response?.data || {}
    totalSaldoPoin.value = Number(dashboardData.value.total_poin || 0)
  } catch (error) {
    console.error('Gagal memuat dashboard', error)
  }
}

async function loadInitialData() {
  isLoadingData.value = true

  try {
    const [resMaster, resWarga, resTransaksi, resDashboard] = await Promise.allSettled([
      getMasterSampah(),
      getWargaList(),
      getRiwayatTransaksi(),
      getDashboardData(),
    ])

    if (resMaster.status === 'fulfilled' && resMaster.value?.success && Array.isArray(resMaster.value.data)) {
      masterSampahList.value = resMaster.value.data.map(item => ({
        ...item,
        nama_kategori: item.nama_kategori || item.nama || item.kategori
      }))
    }

    if (resWarga.status === 'fulfilled' && resWarga.value?.success && Array.isArray(resWarga.value.data)) {
      wargaList.value = resWarga.value.data.map(w => ({
        id_warga: w.id_warga || '',
        nama: String(w.nama || w.nama_warga || w.username || '').trim(),
        username: String(w.username || w.nama || '').trim(),
        no_hp: String(w.no_hp || w.nohp || '').trim()
      })).filter(w => w.nama !== '')
    }

    if (resTransaksi.status === 'fulfilled') {
      if (resTransaksi.value?.success && Array.isArray(resTransaksi.value.data)) {
        transactions.value = resTransaksi.value.data.map((item) => {
          const nama = item.nama || 'Nama Tidak Diketahui'
          
          let waktuFormatted = 'Terbaru'
          if (item.tanggal) {
            const tanggalStr = String(item.tanggal)
            
            let date
            if (tanggalStr.includes('T')) {
              date = new Date(tanggalStr)
            } else if (tanggalStr.includes(' ')) {
              const [tanggal, waktu] = tanggalStr.split(' ')
              if (waktu) {
                const [jam, menit] = waktu.split(':')
                if (jam && menit) {
                  waktuFormatted = `${jam}:${menit}`
                } else {
                  waktuFormatted = waktu
                }
              }
            }
            
            if (date && !isNaN(date.getTime())) {
              waktuFormatted = date.toLocaleTimeString('id-ID', {
                timeZone: 'Asia/Jakarta',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              })
            }
          }
          
          if (item.tipe === 'penjualan') {
            return {
              title: 'Penjualan ke Pengepul',
              subtitle: `${nama} • ${item.total_kg || 0} kg`,
              amount: Number(item.total_rupiah || 0),
              time: waktuFormatted,
              type: 'Penjualan',
              aliases: ['Pembelian']
            }
          } else {
            return {
              title: 'Setoran Sampah',
              subtitle: `${nama} • ${item.total_kg || 0} kg`,
              amount: Number(item.total_rupiah || 0),
              time: waktuFormatted,
              type: 'Setoran'
            }
          }
        })
      }
    }

    if (resDashboard.status === 'fulfilled' && resDashboard.value?.success && resDashboard.value.data) {
      totalSaldoPoin.value = Number(resDashboard.value.data.total_poin || 0)
      dashboardData.value = resDashboard.value.data || {}
    }
  } catch (err) {
    console.error('Gagal memuat data', err)
  } finally {
    isLoadingData.value = false
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID').format(value)
}

function goToCatalogManager() {
  router.push('/katalog-pengelola')
}

async function submitTransaction() {
  lastErrorMsg.value = ''
  const nameTrimmed = namaWarga.value.trim()

  if (!nameTrimmed) {
    showModal({ title: 'Perhatian', message: 'Harap isi nama warga.' })
    return
  }

  const invalidItem = items.value.find((it) => !it.kode || !it.berat || Number(it.berat) <= 0)
  if (invalidItem) {
    showModal({ title: 'Perhatian', message: 'Harap pilih kategori sampah dan isi berat lebih dari 0 kg.' })
    return
  }

  const matchedWarga = selectedWargaObj.value || wargaList.value.find(w => 
    String(w.nama || '').toLowerCase().trim() === nameTrimmed.toLowerCase() ||
    String(w.username || '').toLowerCase().trim() === nameTrimmed.toLowerCase()
  )
  
  const targetUsername = matchedWarga ? matchedWarga.username : nameTrimmed.toLowerCase().replace(/[^a-z0-9]/g, '')

  const payload = {
    username: targetUsername,
    nama: nameTrimmed,
    nama_warga: nameTrimmed,
    rt: rt.value || '-',
    items: items.value.map(it => ({
      kode: it.kode,
      kategori: it.kode,
      berat: Number(it.berat)
    }))
  }

  isSubmitting.value = true
  try {
    const res = await submitSetoran(payload)

    if (res && res.success) {
      await showModal({ title: 'Berhasil', message: 'Transaksi setoran berhasil disimpan ke database spreadsheet!' })

      namaWarga.value = ''
      selectedWargaObj.value = null
      rt.value = ''
      items.value = [{ kode: '', berat: null }]
      showForm.value = false

      await loadInitialData()
    } else {
      const errMsg = res?.message || 'Terjadi kesalahan server.'
      lastErrorMsg.value = errMsg
      await showModal({ title: 'Gagal', message: 'Gagal menyimpan transaksi: ' + errMsg })
    }
  } catch (e) {
    lastErrorMsg.value = e.message
    await showModal({ title: 'Gagal', message: 'Gagal mengirim data setoran: ' + e.message })
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  await loadInitialData()
})
</script>
