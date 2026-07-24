<template>
  <div class="min-h-screen bg-background px-4 text-on-surface md:px-0 pb-36">
    <div class="mx-auto max-w-md">
      <!-- Top bar -->
      <header class="flex items-center justify-between py-4 px-2">
        <button @click="$router.back()" class="text-primary text-lg">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 class="font-headline-md text-headline-md text-primary">
          Catat Keuangan
        </h1>
        <div
          class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-sm font-bold text-primary"
        >
          BK
        </div>
      </header>

      <!-- Tabs -->
      <div class="px-4 mb-4">
        <div class="flex gap-2 bg-surface-container p-1 rounded-xl">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'flex-1 py-2 rounded-lg text-sm font-medium transition-all',
              activeTab === tab.id
                ? 'bg-white text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Saldo Card -->
      <section class="p-4">
        <div class="rounded-2xl bg-white p-4 soft-float">
          <div class="flex items-center justify-between">
            <p class="text-sm text-slate-500">Saldo Saat Ini</p>
            <button
              @click="fetchSaldo"
              class="text-xs text-primary flex items-center gap-1 hover:underline"
              :disabled="loadingSaldo"
            >
              <span
                class="material-symbols-outlined text-sm"
                :class="{ 'animate-spin': loadingSaldo }"
                >refresh</span
              >
              {{ loadingSaldo ? "Memuat..." : "Refresh" }}
            </button>
          </div>
          <p class="mt-3 text-2xl font-bold text-primary">
            <span v-if="loadingSaldo" class="text-slate-400 text-lg"
              >Memuat saldo...</span
            >
            <span v-else>{{ formatRupiah(saldoAwal) }}</span>
          </p>
        </div>
      </section>

      <!-- Form -->
      <form class="px-4 space-y-4" @submit.prevent="submitKeuangan">
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700"
            >Nominal</label
          >
          <div class="rounded-2xl bg-white p-3 soft-float flex items-center">
            <span class="text-sm text-on-surface-variant mr-3">Rp</span>
            <input
              v-model.number="nominal"
              type="number"
              min="0"
              placeholder="0"
              class="w-full bg-transparent outline-none text-lg font-semibold"
            />
          </div>
        </div>

        <div>
          <p class="text-sm font-medium text-slate-700 mb-2">Kategori</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="c in currentCategories"
              :key="c"
              type="button"
              @click="selectCategory(c)"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                selectedCategory === c
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-container text-on-surface hover:bg-slate-200',
              ]"
            >
              {{ c }}
            </button>
          </div>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700"
            >Keterangan</label
          >
          <textarea
            v-model="keterangan"
            rows="4"
            class="w-full rounded-2xl bg-white p-3 soft-float outline-none focus:ring-2 focus:ring-primary/20"
            :placeholder="activeTab === 'pengeluaran' ? 'Tuliskan detail biaya...' : 'Tuliskan detail dana masuk...'"
          ></textarea>
        </div>
      </form>

      <!-- Sticky action -->
      <div
        class="sticky bottom-0 mt-4 w-full bg-surface/90 backdrop-blur-md p-4 border-t border-slate-100 z-40"
      >
        <div class="max-w-md mx-auto flex items-center justify-between gap-4">
          <div>
            <p class="text-sm text-on-surface-variant">{{ saldoLabel }}:</p>
            <p class="text-base font-semibold text-primary">
              {{ formatRupiah(saldoAfter) }}
            </p>
          </div>
          <button
            @click.prevent="submitKeuangan"
            :disabled="submitting"
            class="ml-2 flex-1 rounded-2xl bg-primary py-3 text-white font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <span
              v-if="submitting"
              class="material-symbols-outlined animate-spin text-sm"
              >progress_activity</span
            >
            <span>{{ submitting ? "Menyimpan..." : submitButtonLabel }}</span>
          </button>
        </div>
      </div>

      <!-- Bottom Navigation -->
      <BottomNav />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject, watch } from "vue";
import { submitBiaya, submitDanaMasuk, getSaldoKas } from "../services/api";
import BottomNav from "../components/BottomNav.vue";

const showModal = inject("showModal") || window.showModal;

const activeTab = ref("pengeluaran");
const tabs = [
  { id: "pengeluaran", label: "Pengeluaran" },
  { id: "pemasukan", label: "Pemasukan" }
];

const nominal = ref(0);
const keterangan = ref("");
const selectedCategory = ref("Angkut");
const categoriesPengeluaran = [
  "Angkut",
  "Karung",
  "Konsumsi",
  "Alat Tulis",
  "Perawatan",
  "Kegiatan Sosial",
  "Lainnya",
];
const categoriesPemasukan = [
  "Kas Masuk (Investasi)",
  "Lainnya"
];

const currentCategories = computed(() => {
  return activeTab.value === "pengeluaran" ? categoriesPengeluaran : categoriesPemasukan;
});

const saldoLabel = computed(() => {
  return activeTab.value === "pengeluaran" ? "Saldo setelah biaya" : "Saldo setelah dana masuk";
});

const submitButtonLabel = computed(() => {
  return activeTab.value === "pengeluaran" ? "Simpan Biaya" : "Simpan Dana Masuk";
});

const saldoAwal = ref(0);
const loadingSaldo = ref(false);
const submitting = ref(false);

// Reset selected category when tab changes
watch(activeTab, (newTab) => {
  selectedCategory.value = newTab === "pengeluaran" ? "Angkut" : "Kas Masuk (Investasi)";
  nominal.value = 0;
  keterangan.value = "";
});

async function fetchSaldo() {
  loadingSaldo.value = true;
  try {
    const res = await getSaldoKas();
    if (
      res &&
      res.success &&
      res.data &&
      typeof res.data.saldo !== "undefined"
    ) {
      saldoAwal.value = Number(res.data.saldo) || 0;
    } else if (res && typeof res.saldo !== "undefined") {
      saldoAwal.value = Number(res.saldo) || 0;
    }
  } catch (err) {
    console.error("Gagal mengambil saldo kas:", err);
  } finally {
    loadingSaldo.value = false;
  }
}

onMounted(() => {
  fetchSaldo();
});

const saldoAfter = computed(() => {
  const n = Number(nominal.value) || 0;
  if (activeTab.value === "pengeluaran") {
    return Math.max(0, saldoAwal.value - n);
  } else {
    return saldoAwal.value + n;
  }
});

function formatRupiah(value) {
  return "Rp " + Number(value || 0).toLocaleString("id-ID");
}

function selectCategory(cat) {
  selectedCategory.value = cat;
}

async function submitKeuangan() {
  if (!selectedCategory.value) {
    alert("Pilih kategori terlebih dahulu.");
    return;
  }

  if (!nominal.value || nominal.value <= 0) {
    alert("Masukkan nominal yang valid.");
    return;
  }

  submitting.value = true;
  try {
    const ketFull = selectedCategory.value
      ? `[${selectedCategory.value}] ${keterangan.value || ""}`.trim()
      : keterangan.value;

    let res;
    if (activeTab.value === "pengeluaran") {
      res = await submitBiaya({
        nominal: Number(nominal.value),
        keterangan: ketFull,
      });
    } else {
      res = await submitDanaMasuk({
        nominal: Number(nominal.value),
        keterangan: ketFull,
      });
    }

    if (res && res.success === false) {
      const message = activeTab.value === "pengeluaran" ? "Gagal mencatat biaya" : "Gagal mencatat dana masuk";
      alert(message + ": " + (res.message || "Terjadi kesalahan"));
    } else {
      const successMessage = activeTab.value === "pengeluaran" ? "Catatan biaya" : "Catatan dana masuk";
      alert(successMessage + " berhasil disimpan.");
      nominal.value = 0;
      keterangan.value = "";
      await fetchSaldo();
    }
  } catch (err) {
    console.error("Error submitKeuangan:", err);
    const errorMessage = activeTab.value === "pengeluaran" ? "biaya" : "dana masuk";
    alert("Gagal mengirim data " + errorMessage + ": " + (err.message || "Error koneksi"));
  } finally {
    submitting.value = false;
  }
}
</script>
