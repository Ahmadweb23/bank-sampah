<template>
  <div class="min-h-screen bg-background px-4 text-on-surface md:px-0 pb-24">
    <div class="mx-auto max-w-md">
      <header class="flex items-center justify-between py-4">
        <button @click="$router.back()" class="text-primary">
          <span class="material-symbols-outlined">close</span>
        </button>
        <h1 class="font-headline-md text-headline-md text-primary">
          Jual ke Pengepul
        </h1>
        <div class="w-8"></div>
      </header>

      <div class="rounded-2xl bg-white p-4 soft-float">
        <label class="text-sm text-slate-600">Nama Pengepul</label>
        <div
          class="mt-2 rounded-xl bg-surface-container px-3 py-3 flex items-center gap-3"
        >
          <span class="material-symbols-outlined text-primary"
            >local_shipping</span
          >
          <input
            v-model="namaPengepul"
            placeholder="Masukkan nama pengepul atau"
            class="w-full bg-transparent outline-none"
          />
        </div>

        <div class="mt-4">
          <p class="text-sm text-slate-600">Jenis Sampah</p>
          <div class="mt-2 grid grid-cols-2 gap-3">
            <button
              v-for="type in types"
              :key="type"
              @click="selectType(type)"
              :class="[
                'rounded-xl p-3 text-sm border',
                selectedType === type
                  ? 'bg-primary/10 border-primary'
                  : 'bg-white border-slate-200',
              ]"
            >
              {{ type }}
            </button>
          </div>
        </div>

        <div
          class="mt-4 rounded-2xl bg-surface-container p-3 flex items-center justify-between"
        >
          <div>
            <p class="text-sm text-on-surface-variant">Stok Tersedia</p>
            <p class="font-semibold">{{ stok }} kg</p>
          </div>
          <div>
            <p class="text-sm text-on-surface-variant">Berat Dijual (kg)</p>
            <input
              v-model.number="beratJual"
              type="number"
              class="w-28 text-right font-semibold bg-transparent outline-none"
            />
          </div>
        </div>

        <div class="mt-4">
          <p class="text-sm text-slate-600">Harga Jual / kg (Rp)</p>
          <div
            class="mt-2 rounded-xl bg-surface-container px-3 py-3 flex items-center justify-between"
          >
            <span class="text-sm text-on-surface-variant">Rp</span>
            <input
              v-model.number="hargaPerKg"
              type="number"
              class="w-36 text-right font-semibold bg-transparent outline-none"
            />
          </div>
        </div>

        <div class="mt-6 rounded-2xl bg-white p-6 text-center">
          <p class="text-sm text-on-surface-variant">TOTAL DITERIMA</p>
          <p class="mt-2 text-2xl font-bold text-primary">
            {{ formatRupiah(totalDiterima) }}
          </p>
        </div>

        <div class="mt-4 flex flex-col gap-3">
          <button
            @click="$router.back()"
            class="text-center text-sm text-primary"
          >
            Batal
          </button>
          <button
            @click="terimaSimpan"
            class="w-full rounded-2xl bg-primary py-3 text-white font-semibold"
          >
            Terima & Simpan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const namaPengepul = ref("");
const types = ["Plastik", "Kertas", "Logam", "Kaca"];
const selectedType = ref("Plastik");
const stok = ref("125.5");
const beratJual = ref(50);
const hargaPerKg = ref(2000);

const totalDiterima = computed(() => {
  return (Number(beratJual.value) || 0) * (Number(hargaPerKg.value) || 0);
});

function formatRupiah(v) {
  return "Rp" + Number(v).toLocaleString("id-ID");
}

function selectType(t) {
  selectedType.value = t;
}

function terimaSimpan() {
  alert(
    "Transaksi jual tersimpan (demo). Total: " +
      formatRupiah(totalDiterima.value),
  );
  // In real app: call API to save
  // then navigate back or show receipt
  // router.push('/transaksi')
}
</script>
