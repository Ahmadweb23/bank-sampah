<template>
  <div class="min-h-screen bg-[#fbfaf6] px-4 pb-28 text-[#142431] md:px-0">
    <div class="mx-auto max-w-md">

      <!-- Header -->
      <header class="flex items-center justify-between px-1 py-4">
        <div class="flex items-center gap-3">
          <div
            class="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_6px_16px_rgba(20,36,49,0.10)]"
          >
            <span class="material-symbols-outlined text-[29px] text-[#147052]">
              eco
            </span>
          </div>

          <div>
            <h1 class="text-[21px] font-bold leading-tight text-[#126047]">
              Bank Sampah
            </h1>

            <p class="mt-1 text-[18px] leading-tight text-[#687481]">
              Bojong Karya 2
            </p>
          </div>
        </div>

        <button
          type="button"
          class="relative flex h-10 w-10 items-center justify-center text-[#142431]"
        >
          <span class="material-symbols-outlined text-[29px]">
            notifications_none
          </span>

          <span
            class="absolute right-0.5 top-0.5 h-3 w-3 rounded-full border-2 border-[#fbfaf6] bg-[#147052]"
          ></span>
        </button>
      </header>

      <!-- Balance Card -->
      <section class="mt-4">
        <div
          class="relative min-h-[205px] overflow-hidden rounded-[24px] bg-gradient-to-br from-[#fffefa] via-[#fbfaf0] to-[#eef4dc] p-5 shadow-[0_10px_24px_rgba(20,36,49,0.10)]"
        >
          <div class="relative z-10">
            <div class="flex items-center gap-2 text-[#6d7780]">
              <span class="material-symbols-outlined text-[23px]">
                spa
              </span>

              <p class="text-[18px]">
                Saldo Poin
              </p>
            </div>

            <p class="mt-5 text-[42px] font-bold leading-none text-[#126047]">
              {{ totalSaldoPoin.toLocaleString("id-ID") }}
              <span class="text-[30px]">Poin</span>
            </p>

            <p class="mt-5 text-[17px] text-[#687481]">
              Setara dengan Rp {{ (totalSaldoPoin * 100).toLocaleString("id-ID") }}
            </p>
          </div>

          <!-- Ilustrasi tanaman -->
          <div
            class="pointer-events-none absolute -bottom-5 right-[-12px] h-[190px] w-[210px] opacity-75"
          >
            <svg
              viewBox="0 0 280 250"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="h-full w-full"
            >
              <path
                d="M89 252C104 205 112 157 113 99C113 72 108 47 99 25"
                stroke="#80B98A"
                stroke-width="8"
                stroke-linecap="round"
              />

              <path
                d="M111 154C78 137 59 113 56 80C87 82 111 105 111 154Z"
                fill="#A8D4A4"
              />

              <path
                d="M112 119C130 78 154 55 187 50C186 87 159 111 112 119Z"
                fill="#9CCA99"
              />

              <path
                d="M111 183C143 148 177 140 218 153C196 183 159 195 111 183Z"
                fill="#8FC58F"
              />

              <path
                d="M103 207C72 199 47 183 30 157C60 151 91 168 103 207Z"
                fill="#C8E2B4"
              />

              <path
                d="M113 79C105 50 111 25 132 3C149 30 141 59 113 79Z"
                fill="#A4D0A0"
              />

              <path
                d="M205 38C216 20 233 17 254 22C249 44 231 53 205 38Z"
                fill="#D4E5B8"
              />

              <path
                d="M218 68C231 54 249 54 267 64C257 82 238 85 218 68Z"
                fill="#D8E8BE"
              />

              <path
                d="M236 112C243 94 257 86 276 87C273 107 259 117 236 112Z"
                fill="#D9E9C2"
              />
            </svg>
          </div>

          <span
            class="material-symbols-outlined absolute right-5 top-8 text-[54px] text-[#dce8c9]"
          >
            recycling
          </span>
        </div>
      </section>

      <!-- Primary Action -->
      <section class="mt-6">
        <button
          type="button"
          @click="openFormModal"
          class="flex w-full items-center justify-between rounded-[22px] bg-[#08704f] px-5 py-4 text-white shadow-[0_8px_18px_rgba(8,112,79,0.22)] transition active:scale-[0.98]"
        >
          <span class="flex items-center gap-3">
            <span class="material-symbols-outlined text-[27px]">
              spa
            </span>

            <span class="text-[18px] font-semibold">
              Terima Sampah Warga
            </span>
          </span>

          <span class="material-symbols-outlined text-[27px]">
            chevron_right
          </span>
        </button>
      </section>

      <!-- Quick Actions -->
      <section class="mt-6 grid grid-cols-2 gap-3">

        <!-- Jadwal Penjemputan -->
        <router-link
          to="/jual"
          class="flex min-h-[92px] items-center gap-3 rounded-[22px] bg-white px-4 shadow-[0_8px_18px_rgba(20,36,49,0.08)] transition active:scale-[0.98]"
        >
          <div
            class="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full bg-[#f4f5e9]"
          >
            <span class="material-symbols-outlined text-[32px] text-[#147052]">
              local_shipping
            </span>
          </div>

          <p class="text-[15px] font-medium leading-tight">
            Jadwal Penjemputan
          </p>
        </router-link>

        <!-- Catat Biaya -->
        <router-link
          to="/riwayat"
          class="flex min-h-[92px] items-center gap-3 rounded-[22px] bg-white px-4 shadow-[0_8px_18px_rgba(20,36,49,0.08)] transition active:scale-[0.98]"
        >
          <div
            class="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full bg-[#f4f5e9]"
          >
            <span class="material-symbols-outlined text-[32px] text-[#147052]">
              receipt_long
            </span>
          </div>

          <p class="text-[15px] font-medium leading-tight">
            Catat Biaya
          </p>
        </router-link>

        <!-- Tukar Poin Full Width -->
        <router-link
          to="/tukar-poin-sembako"
          class="col-span-2 flex min-h-[92px] items-center gap-3 rounded-[22px] bg-white px-4 shadow-[0_8px_18px_rgba(20,36,49,0.08)] transition active:scale-[0.98]"
        >
          <div
            class="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full bg-[#f4f5e9]"
          >
            <span class="material-symbols-outlined text-[32px] text-[#147052]">
              calendar_month
            </span>
          </div>

          <p class="flex-1 text-[16px] font-medium">
            Tukar Poin
          </p>

          <span class="material-symbols-outlined text-[26px] text-[#147052]">
            chevron_right
          </span>
        </router-link>
      </section>

      <!-- Search -->
      <section class="mt-7">
        <div class="relative">
          <span
            class="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[29px] text-[#687481]"
          >
            search
          </span>

          <input
            v-model="query"
            placeholder="Cari nama atau jenis transaksi..."
            class="h-[66px] w-full rounded-full border border-[#e3e1da] bg-[#f9f8f3] px-14 pr-14 text-[16px] text-[#142431] outline-none placeholder:text-[#7b858e] focus:border-[#147052]"
          />

          <span
            class="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-[27px] text-[#687481]"
          >
            tune
          </span>
        </div>

        <!-- Filter Chips -->
        <div class="mt-4 flex gap-2 overflow-x-auto pb-1">
          <button
            v-for="chip in filterChips"
            :key="chip"
            type="button"
            @click="toggleChip(chip)"
            :class="[
              'shrink-0 rounded-full px-5 py-3 text-[14px] transition',
              activeChips.includes(chip)
                ? 'bg-[#08704f] font-semibold text-white'
                : 'bg-[#f5f3ec] text-[#142431]',
            ]"
          >
            {{ chip }}
          </button>
        </div>
      </section>

      <!-- Recent Transactions -->
      <section class="mt-7">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-[18px] font-medium">
            Transaksi Terakhir
          </h3>

          <button
            type="button"
            @click="loadInitialData"
            class="flex items-center gap-1 text-[14px] text-[#08704f]"
          >
            <span class="material-symbols-outlined text-[18px]" :class="{ 'animate-spin': isLoadingData }">refresh</span>
            Refresh
          </button>
        </div>

        <div class="space-y-3">
          <div
            v-for="(t, i) in filteredTransactions"
            :key="i"
            class="flex min-h-[104px] items-center gap-3 rounded-[22px] bg-white px-4 shadow-[0_8px_18px_rgba(20,36,49,0.08)]"
          >
            <div
              :class="[
                'flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-[16px]',
                t.amount >= 0 ? 'bg-[#eef3df]' : 'bg-[#f7f0df]',
              ]"
            >
              <span class="material-symbols-outlined text-[32px] text-[#147052]">
                recycling
              </span>
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
              <p
                :class="[
                  'whitespace-nowrap text-[16px] font-semibold',
                  t.amount >= 0 ? 'text-[#08704f]' : 'text-red-500',
                ]"
              >
                {{ t.amount >= 0 ? "+" : "-" }} Rp
                {{ Math.abs(t.amount).toLocaleString("id-ID") }}
              </p>

              <p class="mt-1 whitespace-nowrap text-[13px] text-[#687481]">
                {{ t.time }}
              </p>
            </div>

            <span class="material-symbols-outlined text-[24px] text-[#687481]">
              chevron_right
            </span>
          </div>

          <p
            v-if="filteredTransactions.length === 0"
            class="rounded-2xl bg-white p-5 text-center text-sm text-[#687481]"
          >
            Tidak ada transaksi yang sesuai.
          </p>
        </div>
      </section>

      <!-- Panel Log Debugger -->
      <section class="mt-8 rounded-2xl bg-slate-900 p-4 text-xs font-mono text-slate-200">
        <div class="flex items-center justify-between border-b border-slate-700 pb-2 mb-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-amber-400 text-[18px]">terminal</span>
            <span class="font-semibold text-white">Log Debugger API & Spreadsheet</span>
          </div>
          <button
            type="button"
            @click="showLogs = !showLogs"
            class="text-xs text-emerald-400 underline"
          >
            {{ showLogs ? 'Sembunyikan Log' : `Lihat Log (${debugLogs.length})` }}
          </button>
        </div>

        <div v-if="showLogs" class="space-y-2 max-h-60 overflow-y-auto">
          <div v-if="debugLogs.length === 0" class="text-slate-400 italic">
            Belum ada log aktif. Silakan coba simpan transaksi atau tekan Refresh.
          </div>
          <div
            v-for="(log, idx) in debugLogs"
            :key="idx"
            :class="[
              'p-2 rounded border text-[11px] leading-relaxed',
              log.type === 'error' ? 'bg-red-950/60 border-red-800 text-red-300' :
              log.type === 'success' ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' :
              'bg-slate-800/80 border-slate-700 text-slate-300'
            ]"
          >
            <div class="flex items-center justify-between font-semibold mb-1">
              <span>[{{ log.time }}] {{ log.title }}</span>
              <span class="uppercase text-[10px] px-1.5 py-0.5 rounded" :class="log.type === 'error' ? 'bg-red-800 text-white' : 'bg-emerald-800 text-white'">{{ log.type }}</span>
            </div>
            <div>{{ log.message }}</div>
            <pre v-if="log.detail" class="mt-1 p-1 bg-black/40 rounded text-[10px] whitespace-pre-wrap overflow-x-auto">{{ JSON.stringify(log.detail, null, 2) }}</pre>
          </div>
        </div>
      </section>

      <!-- Bottom Navigation -->
      <BottomNav />
    </div>
  </div>

  <!-- Popup Form Terima Sampah -->
  <Teleport to="body">
    <div
      v-if="showForm"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
      @click.self="closeFormModal"
    >
      <div
        class="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[24px] bg-white p-5 shadow-2xl relative"
      >
        <!-- Modal Header -->
        <div class="mb-5 flex items-center justify-between">
          <h3 class="text-[19px] font-semibold">
            Form Terima Sampah
          </h3>

          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-[#687481]"
            @click="closeFormModal"
          >
            <span class="material-symbols-outlined text-[22px]">
              close
            </span>
          </button>
        </div>

        <!-- Nama Warga -->
        <div class="relative">
          <label class="text-[14px] text-[#687481]">
            Nama Warga
          </label>

          <input
            v-model="namaWarga"
            @input="onNamaWargaInput"
            @blur="onNamaWargaBlur"
            class="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#147052]"
            placeholder="Ketik nama warga dari spreadsheet..."
          />

          <!-- Rekomendasi Nama Warga murni dari spreadsheet -->
          <div
            v-if="showWargaSuggestions && namaWarga.trim() !== '' && filteredWargaSuggestions.length > 0"
            class="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl"
          >
            <button
              v-for="w in filteredWargaSuggestions"
              :key="w.username || w.nama"
              type="button"
              @mousedown.prevent="selectWargaSuggestion(w)"
              class="flex w-full items-center justify-between border-b border-slate-100 px-4 py-2.5 text-left text-sm hover:bg-emerald-50 focus:bg-emerald-50 transition"
            >
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

        <input
          v-model="rt"
          class="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#147052]"
          placeholder="Contoh: 07 / Blok A"
        />

        <!-- Item Sampah -->
        <div class="mt-5">
          <div class="flex items-center justify-between">
            <p class="text-[15px] font-medium">
              Item Sampah
            </p>

            <button
              type="button"
              class="text-sm font-medium text-[#147052]"
              @click="addItem"
            >
              + Tambah Item
            </button>
          </div>

          <div class="mt-3 space-y-3">
            <div
              v-for="(item, index) in items"
              :key="index"
              class="rounded-xl border border-slate-200 p-3 bg-slate-50/50"
            >
              <!-- Dropdown Kategori Sampah -->
              <label class="mb-1 block text-xs font-medium text-[#687481]">
                Kategori Sampah
              </label>

              <select
                v-model="item.kode"
                class="mb-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#147052]"
              >
                <option value="" disabled>-- Pilih Kategori Sampah --</option>
                <option
                  v-for="cat in masterSampahList"
                  :key="cat.kode || cat.nama_kategori || cat.nama"
                  :value="cat.kode || cat.nama_kategori || cat.nama"
                >
                  {{ cat.nama_kategori || cat.nama }}
                </option>
              </select>

              <div class="flex gap-2 items-center">
                <div class="w-1/2">
                  <label class="mb-1 block text-xs font-medium text-[#687481]">
                    Berat (kg)
                  </label>
                  <input
                    v-model.number="item.berat"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="0.0"
                    class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#147052]"
                  />
                </div>

                <div class="w-1/2 flex items-end pt-5">
                  <button
                    type="button"
                    class="w-full rounded-lg bg-red-50 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                    @click="removeItem(index)"
                  >
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
            <span class="material-symbols-outlined text-sm">warning</span>
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
          <button
            type="button"
            class="w-1/3 rounded-xl bg-slate-100 py-3 text-sm font-medium text-[#687481]"
            @click="closeFormModal"
            :disabled="isSubmitting"
          >
            Batal
          </button>

          <button
            type="button"
            @click.prevent="submitTransaction"
            :disabled="isSubmitting"
            class="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-[#08704f] py-3 text-sm font-semibold text-white transition active:scale-[0.98] disabled:opacity-50"
          >
            <span v-if="isSubmitting" class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
            <span>{{ isSubmitting ? 'Menyimpan...' : 'Simpan Transaksi' }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, inject } from "vue";
import { submitSetoran, getMasterSampah, getWargaList, getRiwayatTransaksi, getDashboardData } from "../services/api";
import BottomNav from "../components/BottomNav.vue";

const showModal = inject('showModal') || window.showModal;

const showForm = ref(false);
const namaWarga = ref("");
const selectedWargaObj = ref(null);
const showWargaSuggestions = ref(false);
const rt = ref("");
const isSubmitting = ref(false);
const isLoadingData = ref(false);
const lastErrorMsg = ref("");

const showLogs = ref(true);
const debugLogs = ref([]);

function addLog(type, title, message, detail = null) {
  const timeStr = new Date().toLocaleTimeString('id-ID');
  debugLogs.value.unshift({
    time: timeStr,
    type,
    title,
    message,
    detail
  });
  console.log(`[DEBUG_LOG][${type.toUpperCase()}] ${title}: ${message}`, detail || '');
}

const masterSampahList = ref([]);
const wargaList = ref([]);
const totalSaldoPoin = ref(0);

const items = ref([
  {
    kode: "",
    berat: null,
  },
]);

// Filter Warga dari data spreadsheet yang di-load via API
const filteredWargaSuggestions = computed(() => {
  const queryText = namaWarga.value.toLowerCase().trim();
  if (!queryText) {
    return [];
  }

  return wargaList.value.filter((w) => {
    const nameMatch = String(w.nama || "").toLowerCase().includes(queryText);
    const userMatch = String(w.username || "").toLowerCase().includes(queryText);
    return nameMatch || userMatch;
  });
});

function onNamaWargaInput() {
  showWargaSuggestions.value = true;
  if (selectedWargaObj.value && selectedWargaObj.value.nama !== namaWarga.value) {
    selectedWargaObj.value = null;
  }
}

function onNamaWargaBlur() {
  setTimeout(() => {
    showWargaSuggestions.value = false;
  }, 200);
}

function selectWargaSuggestion(w) {
  namaWarga.value = w.nama;
  selectedWargaObj.value = w;
  showWargaSuggestions.value = false;
  addLog('info', 'Warga Dipilih', `Nama: ${w.nama}, Username: ${w.username}`, w);
}

function openFormModal() {
  showForm.value = true;
  showWargaSuggestions.value = false;
  lastErrorMsg.value = "";
}

function closeFormModal() {
  showForm.value = false;
  showWargaSuggestions.value = false;
}

function addItem() {
  items.value.push({
    kode: "",
    berat: null,
  });
}

function removeItem(i) {
  if (items.value.length > 1) {
    items.value.splice(i, 1);
  } else {
    items.value = [{ kode: "", berat: null }];
  }
}

const query = ref("");

const filterChips = [
  "Semua",
  "Setoran",
  "Penarikan",
  "Pembelian",
  "Biaya",
];

const activeChips = ref(["Semua"]);

function toggleChip(chip) {
  if (chip === "Semua") {
    activeChips.value = ["Semua"];
    return;
  }

  if (activeChips.value.includes(chip)) {
    activeChips.value = activeChips.value.filter((c) => c !== chip);

    if (activeChips.value.length === 0) {
      activeChips.value = ["Semua"];
    }
  } else {
    activeChips.value = activeChips.value.filter((c) => c !== "Semua");
    activeChips.value.push(chip);
  }
}

const transactions = ref([]);

const filteredTransactions = computed(() => {
  const q = query.value.toLowerCase().trim();

  return transactions.value.filter((t) => {
    const transactionTypes = [t.type, ...(t.aliases || [])];

    if (
      !activeChips.value.includes("Semua") &&
      !activeChips.value.some((chip) =>
        transactionTypes.includes(chip)
      )
    ) {
      return false;
    }

    if (!q) {
      return true;
    }

    return (
      t.title.toLowerCase().includes(q) ||
      t.subtitle.toLowerCase().includes(q)
    );
  });
});

onMounted(async () => {
  await loadInitialData();
});

async function loadInitialData() {
  isLoadingData.value = true;
  addLog('info', 'Memuat Data Initial', 'Memanggil API get_warga, master_sampah, riwayat_transaksi...');

  try {
    const [resMaster, resWarga, resTransaksi, resDashboard] = await Promise.allSettled([
      getMasterSampah(),
      getWargaList(),
      getRiwayatTransaksi(),
      getDashboardData(),
    ]);

    if (resMaster.status === 'fulfilled' && resMaster.value?.success && Array.isArray(resMaster.value.data)) {
      masterSampahList.value = resMaster.value.data.map(item => ({
        ...item,
        nama_kategori: item.nama_kategori || item.nama || item.kategori
      }));
      addLog('success', 'Master Sampah Loaded', `Jumlah item: ${masterSampahList.value.length}`, masterSampahList.value);
    } else {
      addLog('error', 'Master Sampah Fail', resMaster.reason?.message || 'Gagal memuat master sampah');
    }

    if (resWarga.status === 'fulfilled' && resWarga.value?.success && Array.isArray(resWarga.value.data)) {
      wargaList.value = resWarga.value.data.map(w => ({
        id_warga: w.id_warga || '',
        nama: String(w.nama || w.nama_warga || w.username || '').trim(),
        username: String(w.username || w.nama || '').trim(),
        no_hp: String(w.no_hp || w.nohp || '').trim()
      })).filter(w => w.nama !== '');
      addLog('success', 'Warga Loaded', `Jumlah warga di spreadsheet: ${wargaList.value.length}`, wargaList.value);
    } else {
      addLog('error', 'Warga Load Fail / Belum Deploy get_warga', resWarga.reason?.message || JSON.stringify(resWarga.value));
    }

    if (resTransaksi.status === 'fulfilled') {
      addLog('info', 'Res Transaksi Status', 'resTransaksi.status fulfilled', resTransaksi);
      if (resTransaksi.value?.success && Array.isArray(resTransaksi.value.data)) {
        console.log('[DEBUG] Data transaksi mentah dari server:', resTransaksi.value.data);
        
        transactions.value = resTransaksi.value.data.map((item) => {
          console.log('[DEBUG] Memproses item transaksi:', item);
          
          // Ambil nama dari berbagai kemungkinan field
          const namaWarga = item.nama || item.nama_warga || item.username || "Nama Tidak Diketahui";
          
          // Format waktu untuk menampilkan hanya jam:menit
          let waktuFormatted = "Terbaru";
          if (item.tanggal) {
            const tanggalStr = String(item.tanggal);
            
            // Coba parsing dari berbagai format tanggal
            let date;
            if (tanggalStr.includes('T')) {
              // Format ISO string: 2026-07-22T17:00:00.000Z
              date = new Date(tanggalStr);
            } else if (tanggalStr.includes(' ')) {
              // Format: 2026-07-22 17:00:00
              const [tanggal, waktu] = tanggalStr.split(' ');
              if (waktu) {
                const [jam, menit] = waktu.split(':');
                if (jam && menit) {
                  waktuFormatted = `${jam}:${menit}`;
                } else {
                  waktuFormatted = waktu;
                }
              }
            }
            
            if (date && !isNaN(date.getTime())) {
              // Format waktu dalam zona waktu Asia/Jakarta
              waktuFormatted = date.toLocaleTimeString('id-ID', {
                timeZone: 'Asia/Jakarta',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              });
            }
          }
          
          const result = {
            title: "Setoran Sampah",
            subtitle: `${namaWarga} • ${item.total_kg || 0} kg`,
            amount: Number(item.total_rupiah || 0),
            time: waktuFormatted,
            type: "Setoran"
          };
          
          console.log('[DEBUG] Hasil mapping item:', result);
          return result;
        });
        addLog('success', 'Riwayat Transaksi Loaded', `Jumlah transaksi: ${transactions.value.length}`);
        console.log('[DEBUG] Final transactions.value:', transactions.value);
      } else {
        addLog('error', 'Riwayat Transaksi Gagal', 'resTransaksi.value is not success or data is not array', resTransaksi.value);
      }
    } else {
      addLog('error', 'Res Transaksi Gagal', 'resTransaksi.status rejected', resTransaksi.reason);
    }

    if (resDashboard.status === 'fulfilled' && resDashboard.value?.success && resDashboard.value.data) {
      totalSaldoPoin.value = Number(resDashboard.value.data.total_poin || 0);
    }
  } catch (err) {
    addLog('error', 'Critical Load Failure', err.message);
  } finally {
    isLoadingData.value = false;
  }
}

async function submitTransaction() {
  lastErrorMsg.value = "";
  const nameTrimmed = namaWarga.value.trim();

  if (!nameTrimmed) {
    showModal({ title: 'Perhatian', message: 'Harap isi nama warga.' });
    return;
  }

  const invalidItem = items.value.find((it) => !it.kode || !it.berat || Number(it.berat) <= 0);
  if (invalidItem) {
    showModal({ title: 'Perhatian', message: 'Harap pilih kategori sampah dan isi berat lebih dari 0 kg.' });
    return;
  }

  const matchedWarga = selectedWargaObj.value || wargaList.value.find(w => 
    String(w.nama || "").toLowerCase().trim() === nameTrimmed.toLowerCase() ||
    String(w.username || "").toLowerCase().trim() === nameTrimmed.toLowerCase()
  );
  
  const targetUsername = matchedWarga ? matchedWarga.username : nameTrimmed.toLowerCase().replace(/[^a-z0-9]/g, '');

  const payload = {
    username: targetUsername,
    nama: nameTrimmed,
    nama_warga: nameTrimmed,
    rt: rt.value || "-",
    items: items.value.map(it => ({
      kode: it.kode,
      kategori: it.kode,
      berat: Number(it.berat)
    }))
  };

  addLog('info', 'Mengirim Transaksi', `Target Username: "${targetUsername}", Nama: "${nameTrimmed}"`, payload);

  isSubmitting.value = true;
  try {
    const res = await submitSetoran(payload);

    addLog(res && res.success ? 'success' : 'error', 'Response Server Simpan Setoran', res?.message || 'Tanpa pesan', res);

    if (res && res.success) {
      await showModal({ title: 'Berhasil', message: 'Transaksi setoran berhasil disimpan ke database spreadsheet!' });

      // Reset form state
      namaWarga.value = "";
      selectedWargaObj.value = null;
      rt.value = "";
      items.value = [{ kode: "", berat: null }];
      showForm.value = false;

      // Reload fresh data from database
      await loadInitialData();
    } else {
      const errMsg = res?.message || "Terjadi kesalahan server.";
      lastErrorMsg.value = errMsg;
      await showModal({ title: 'Gagal', message: 'Gagal menyimpan transaksi: ' + errMsg });
    }
  } catch (e) {
    addLog('error', 'Exception Simpan Setoran', e.message);
    lastErrorMsg.value = e.message;
    await showModal({ title: 'Gagal', message: 'Gagal mengirim data setoran: ' + e.message });
  } finally {
    isSubmitting.value = false;
  }
}
</script>