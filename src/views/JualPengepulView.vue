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
            placeholder="Masukkan nama pengepul"
            class="w-full bg-transparent outline-none"
          />
        </div>

        <div class="mt-4">
          <p class="text-sm text-slate-600">Jenis Sampah</p>
          <div class="mt-2 grid grid-cols-2 gap-3">
            <button
              v-for="item in stokList"
              :key="item.kode"
              @click="selectItem(item)"
              :class="[
                'rounded-xl p-3 text-sm border text-left',
                selectedKode === item.kode
                  ? 'bg-primary/10 border-primary'
                  : 'bg-white border-slate-200',
              ]"
            >
              <div class="font-medium">{{ item.nama }}</div>
              <div class="text-xs text-slate-500">Stok: {{ item.stok }} kg</div>
            </button>
          </div>
        </div>

        <div
          class="mt-4 rounded-2xl bg-surface-container p-3 flex items-center justify-between"
        >
          <div>
            <p class="text-sm text-on-surface-variant">Stok Tersedia</p>
            <p class="font-semibold">{{ selectedItem?.stok || 0 }} kg</p>
          </div>
          <div>
            <p class="text-sm text-on-surface-variant">Berat Dijual (kg)</p>
            <input
              v-model.number="beratJual"
              type="number"
              min="0"
              :max="selectedItem?.stok"
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
              min="0"
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
            :disabled="loading"
            class="w-full rounded-2xl bg-primary py-3 text-white font-semibold disabled:opacity-50"
          >
            {{ loading ? 'Menyimpan...' : 'Terima & Simpan' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getStok, submitPenjualan } from '../services/api'

const showModal = inject('showModal')
const router = useRouter()

const namaPengepul = ref('')
const stokList = ref([])
const selectedKode = ref('')
const beratJual = ref(0)
const hargaPerKg = ref(0)
const loading = ref(false)

const selectedItem = computed(() => {
  return stokList.value.find(item => item.kode === selectedKode.value)
})

const totalDiterima = computed(() => {
  return (Number(beratJual.value) || 0) * (Number(hargaPerKg.value) || 0)
})

function formatRupiah(v) {
  return 'Rp' + Number(v).toLocaleString('id-ID')
}

function selectItem(item) {
  selectedKode.value = item.kode
  hargaPerKg.value = item.harga_jual || 0
  beratJual.value = 0
}

async function loadStok() {
  try {
    const result = await getStok()
    if (result.success && result.data) {
      stokList.value = result.data
      if (stokList.value.length > 0) {
        selectItem(stokList.value[0])
      }
    }
  } catch (error) {
    showModal({
      type: 'error',
      title: 'Gagal',
      message: error.message || 'Gagal memuat data stok'
    })
  }
}

async function terimaSimpan() {
  if (!namaPengepul.value.trim()) {
    showModal({
      type: 'error',
      title: 'Gagal',
      message: 'Nama pengepul wajib diisi'
    })
    return
  }

  if (!selectedKode.value) {
    showModal({
      type: 'error',
      title: 'Gagal',
      message: 'Pilih jenis sampah terlebih dahulu'
    })
    return
  }

  if (beratJual.value <= 0) {
    showModal({
      type: 'error',
      title: 'Gagal',
      message: 'Berat jual harus lebih dari 0'
    })
    return
  }

  if (selectedItem.value && beratJual.value > selectedItem.value.stok) {
    showModal({
      type: 'error',
      title: 'Gagal',
      message: `Stok tidak mencukupi. Sisa stok: ${selectedItem.value.stok} kg`
    })
    return
  }

  loading.value = true

  try {
    await submitPenjualan({
      nama_pengepul: namaPengepul.value,
      items: [
        {
          kode: selectedKode.value,
          berat: beratJual.value,
          harga_jual: hargaPerKg.value
        }
      ]
    })

    showModal({
      type: 'success',
      title: 'Berhasil',
      message: 'Penjualan berhasil disimpan',
      onConfirm: () => {
        router.back()
      }
    })
  } catch (error) {
    showModal({
      type: 'error',
      title: 'Gagal',
      message: error.message || 'Gagal menyimpan penjualan'
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadStok()
})
</script>
