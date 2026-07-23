<template>
  <div class="min-h-screen bg-background px-4 text-on-surface md:px-0 pb-24">
    <div class="mx-auto max-w-md">
      <header class="flex items-center justify-between py-4">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full bg-primary-fixed-dim flex items-center justify-center soft-float"
          >
            BK
          </div>
          <div>
            <h1 class="font-headline-md text-headline-md text-primary">
              Riwayat Transaksi
            </h1>
          </div>
        </div>
        <button class="text-on-surface-variant">
          <span class="material-symbols-outlined">settings</span>
        </button>
      </header>

      <div class="px-2">
        <input
          v-model="query"
          placeholder="Cari nama atau jenis transaksi..."
          class="w-full rounded-full px-4 py-3 bg-surface-container border border-slate-200 outline-none"
        />
        <div class="mt-3 flex gap-2 flex-wrap">
          <button
            v-for="chip in chips"
            :key="chip"
            @click="toggleChip(chip)"
            :class="[
              'px-3 py-2 rounded-full text-sm',
              active.includes(chip)
                ? 'bg-primary text-white'
                : 'bg-surface-container text-on-surface',
            ]"
          >
            {{ chip }}
          </button>
        </div>
      </div>

      <section class="px-2 mt-4 space-y-3">
        <h3 class="text-sm font-medium text-on-surface-variant">Hari Ini</h3>
        <div
          v-for="(t, i) in filtered"
          :key="i"
          class="bg-white p-3 rounded-2xl soft-float flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center"
            >
              <span class="material-symbols-outlined text-primary"
                >recycling</span
              >
            </div>
            <div>
              <p class="font-medium">{{ t.title }}</p>
              <p class="text-sm text-on-surface-variant">{{ t.subtitle }}</p>
            </div>
          </div>
          <div class="text-right">
            <p
              :class="[
                'font-semibold',
                t.amount > 0 ? 'text-emerald-600' : 'text-red-500',
              ]"
            >
              {{ t.amount > 0 ? "+" : "-" }} Rp
              {{ Math.abs(t.amount).toLocaleString("id-ID") }}
            </p>
            <p class="text-sm text-on-surface-variant">{{ t.time }}</p>
          </div>
        </div>
      </section>

      <nav
        class="fixed bottom-0 left-0 w-full bg-surface z-40 py-3 border-t border-slate-100"
      >
        <div class="max-w-md mx-auto flex items-center justify-between px-6">
          <router-link
            to="/dashboard"
            class="flex flex-col items-center gap-1 text-sm text-on-surface-variant"
          >
            <span class="material-symbols-outlined">home</span>
            <span>Beranda</span>
          </router-link>
          <router-link
            to="/riwayat"
            class="flex flex-col items-center gap-1 text-sm text-primary"
          >
            <span class="material-symbols-outlined">history</span>
            <span>Riwayat</span>
          </router-link>
          <router-link
            to="/laporan"
            class="flex flex-col items-center gap-1 text-sm text-on-surface-variant"
          >
            <span class="material-symbols-outlined">bar_chart</span>
            <span>Laporan</span>
          </router-link>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const query = ref("");
const chips = ["Semua", "Setoran", "Penjualan", "Biaya"];
const active = ref(["Semua"]);

function toggleChip(chip) {
  if (chip === "Semua") {
    active.value = ["Semua"];
    return;
  }
  if (active.value.includes(chip)) {
    active.value = active.value.filter((c) => c !== chip);
    if (active.value.length === 0) active.value = ["Semua"];
  } else {
    active.value = active.value.filter((c) => "Semua" !== c);
    active.value.push(chip);
  }
}

const list = ref([
  {
    title: "Setoran Sampah",
    subtitle: "Budi Santoso • 12.5 kg",
    amount: 45000,
    time: "10:30 WIB",
    type: "Setoran",
  },
  {
    title: "Tarik Saldo",
    subtitle: "Ani Yudhoyono",
    amount: -20000,
    time: "09:15 WIB",
    type: "Biaya",
  },
]);

const filtered = computed(() => {
  const q = query.value.toLowerCase().trim();
  return list.value.filter((t) => {
    if (!active.value.includes("Semua") && !active.value.includes(t.type))
      return false;
    if (!q) return true;
    return (
      t.title.toLowerCase().includes(q) || t.subtitle.toLowerCase().includes(q)
    );
  });
});
</script>
