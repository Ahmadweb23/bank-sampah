<template>
  <div class="min-h-screen bg-background px-4 text-on-surface md:px-0 pb-24">
    <div class="mx-auto max-w-md">
      <!-- Header -->
      <header class="flex items-center justify-between py-4">
        <div class="flex items-center gap-3">
          <button
            @click="$router.back()"
            class="text-primary text-lg md:hidden"
          >
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          <div
            class="w-10 h-10 rounded-full bg-primary-fixed-dim flex items-center justify-center soft-float text-primary font-bold"
          >
            BK
          </div>
          <div>
            <h1 class="font-headline-md text-headline-md text-primary">
              Laporan Arus Kas
            </h1>
          </div>
        </div>
        <button
          @click="loadData"
          class="text-xs text-primary flex items-center gap-1 hover:underline bg-white px-3 py-1.5 rounded-full soft-float"
          :disabled="loading"
        >
          <span
            class="material-symbols-outlined text-sm"
            :class="{ 'animate-spin': loading }"
            >refresh</span
          >
          {{ loading ? "Memuat..." : "Refresh" }}
        </button>
      </header>

      <section class="px-2 space-y-4">
        <!-- Saldo Kas Card -->
        <div class="rounded-2xl bg-white p-4 soft-float">
          <p class="text-sm text-on-surface-variant">Saldo Kas Saat Ini</p>
          <p class="mt-2 text-3xl font-bold text-primary">
            <span v-if="loading" class="text-slate-400 text-lg">Memuat...</span>
            <span v-else>Rp {{ (saldoKas || 0).toLocaleString("id-ID") }}</span>
          </p>
        </div>

        <!-- Ringkasan Arus Kas (Masuk vs Keluar) -->
        <div class="grid grid-cols-2 gap-3">
          <div
            class="rounded-2xl bg-emerald-50/80 border border-emerald-100 p-4 soft-float"
          >
            <div class="flex items-center gap-1.5 text-emerald-700">
              <span class="material-symbols-outlined text-sm">south_east</span>
              <p class="text-xs font-semibold uppercase tracking-wider">
                Kas Masuk
              </p>
            </div>
            <p class="mt-2 text-lg font-bold text-emerald-700">
              <span v-if="loading" class="text-slate-400">...</span>
              <span v-else
                >+ Rp {{ (totalKasMasuk || 0).toLocaleString("id-ID") }}</span
              >
            </p>
          </div>

          <div
            class="rounded-2xl bg-rose-50/80 border border-rose-100 p-4 soft-float"
          >
            <div class="flex items-center gap-1.5 text-rose-700">
              <span class="material-symbols-outlined text-sm">north_west</span>
              <p class="text-xs font-semibold uppercase tracking-wider">
                Kas Keluar
              </p>
            </div>
            <p class="mt-2 text-lg font-bold text-rose-700">
              <span v-if="loading" class="text-slate-400">...</span>
              <span v-else
                >- Rp {{ (totalKasKeluar || 0).toLocaleString("id-ID") }}</span
              >
            </p>
          </div>
        </div>

        <!-- Metric Cards -->
        <div class="grid grid-cols-2 gap-3">
          <div class="rounded-2xl bg-white p-4 soft-float">
            <p class="text-xs text-on-surface-variant uppercase font-medium">
              Sampah Terkumpul
            </p>
            <p class="mt-2 text-xl font-bold text-slate-800">
              <span v-if="loading" class="text-slate-400">...</span>
              <span v-else>{{ totalKg }} kg</span>
            </p>
          </div>
          <div class="rounded-2xl bg-white p-4 soft-float">
            <p class="text-xs text-on-surface-variant uppercase font-medium">
              Total Penjualan
            </p>
            <p class="mt-2 text-xl font-bold text-slate-800">
              <span v-if="loading" class="text-slate-400">...</span>
              <span v-else
                >Rp {{ (totalPenjualan || 0).toLocaleString("id-ID") }}</span
              >
            </p>
          </div>
        </div>

        <!-- Detail Arus Kas -->
        <div class="rounded-2xl bg-white p-4 soft-float space-y-3">
          <div
            class="flex items-center justify-between border-b pb-3 border-slate-100"
          >
            <h3 class="font-bold text-slate-800 flex items-center gap-2">
              <span class="material-symbols-outlined text-primary"
                >receipt_long</span
              >
              Riwayat Arus Kas
            </h3>
            <span
              class="text-xs font-medium text-slate-400"
              v-if="riwayatKas.length"
            >
              {{ riwayatKas.length }} Transaksi
            </span>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="py-8 text-center text-slate-400">
            <span class="material-symbols-outlined animate-spin text-2xl"
              >progress_activity</span
            >
            <p class="mt-2 text-sm">Mengambil data arus kas...</p>
          </div>

          <!-- Empty State -->
          <div
            v-else-if="!riwayatKas || riwayatKas.length === 0"
            class="py-8 text-center text-slate-400"
          >
            <span class="material-symbols-outlined text-3xl"
              >account_balance_wallet</span
            >
            <p class="mt-2 text-sm font-medium">Belum ada transaksi arus kas</p>
            <p class="text-xs text-slate-400">
              Catatan kas akan otomatis muncul di sini
            </p>
          </div>

          <!-- Arus Kas List -->
          <div v-else class="space-y-3">
            <div
              v-for="(item, idx) in riwayatKas"
              :key="item.id_kas || idx"
              class="flex items-center justify-between bg-surface-container rounded-xl p-3 hover:bg-slate-100 transition-colors"
            >
              <div class="flex items-center gap-3">
                <div
                  :class="[
                    'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold',
                    isMasuk(item)
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-rose-100 text-rose-700',
                  ]"
                >
                  <span class="material-symbols-outlined text-lg">
                    {{ isMasuk(item) ? "south_east" : "north_west" }}
                  </span>
                </div>
                <div>
                  <p class="text-sm font-semibold text-slate-800 line-clamp-1">
                    {{
                      item.keterangan ||
                      (isMasuk(item) ? "Dana Masuk" : "Pengeluaran/Biaya")
                    }}
                  </p>
                  <p class="text-xs text-slate-400 mt-0.5">
                    {{ formatTanggal(item.tanggal) }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p
                  :class="[
                    'text-sm font-bold',
                    isMasuk(item) ? 'text-emerald-600' : 'text-rose-600',
                  ]"
                >
                  {{ isMasuk(item) ? "+" : "-" }} Rp
                  {{ Number(item.nominal || 0).toLocaleString("id-ID") }}
                </p>
                <p
                  v-if="item.referensi && item.referensi !== '-'"
                  class="text-[10px] text-slate-400"
                >
                  Ref: {{ item.referensi }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Bottom Navigation -->
      <BottomNav />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getSaldoKas, getDashboardData, getRiwayatKas } from "../services/api";
import BottomNav from "../components/BottomNav.vue";

const saldoKas = ref(0);
const totalKg = ref(0);
const totalPenjualan = ref(0);
const totalPoin = ref(0);
const riwayatKas = ref([]);
const totalKasMasuk = ref(0);
const totalKasKeluar = ref(0);
const loading = ref(false);

function isMasuk(item) {
  const jenis = String(item.jenis || "")
    .toUpperCase()
    .trim();
  return jenis === "MASUK";
}

function formatTanggal(tglStr) {
  if (!tglStr) return "-";
  try {
    const d = new Date(tglStr);
    if (isNaN(d.getTime())) return String(tglStr);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return String(tglStr);
  }
}

async function loadData() {
  loading.value = true;
  try {
    // 1. Fetch Saldo Kas
    const resSaldo = await getSaldoKas();
    if (
      resSaldo &&
      resSaldo.success &&
      resSaldo.data &&
      typeof resSaldo.data.saldo !== "undefined"
    ) {
      saldoKas.value = Number(resSaldo.data.saldo) || 0;
    } else if (resSaldo && typeof resSaldo.saldo !== "undefined") {
      saldoKas.value = Number(resSaldo.saldo) || 0;
    }

    // 2. Fetch Dashboard Data
    const resDash = await getDashboardData();
    if (resDash && resDash.success && resDash.data) {
      totalKg.value = Number(resDash.data.total_setoran_kg || 0);
      totalPenjualan.value = Number(resDash.data.total_penjualan || 0);
      totalPoin.value = Number(resDash.data.total_poin || 0);
      if (!saldoKas.value && typeof resDash.data.saldo_kas !== "undefined") {
        saldoKas.value = Number(resDash.data.saldo_kas) || 0;
      }
    }

    // 3. Fetch Riwayat Kas
    const resKas = await getRiwayatKas();
    let kasList = [];
    if (resKas && resKas.success && Array.isArray(resKas.data)) {
      kasList = resKas.data;
    } else if (Array.isArray(resKas)) {
      kasList = resKas;
    } else if (resKas && Array.isArray(resKas.data?.transaksi)) {
      kasList = resKas.data.transaksi;
    }

    riwayatKas.value = kasList;

    // Calculate totals
    let masuk = 0;
    let keluar = 0;
    kasList.forEach((item) => {
      const nom = Number(item.nominal) || 0;
      if (isMasuk(item)) {
        masuk += nom;
      } else {
        keluar += nom;
      }
    });
    totalKasMasuk.value = masuk;
    totalKasKeluar.value = keluar;
  } catch (err) {
    console.error("Gagal memuat data laporan & arus kas:", err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadData();
});
</script>
