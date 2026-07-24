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
                @change="onKategoriChange(index)"
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

              <div class="grid grid-cols-2 gap-2">
                <div>
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
                <div>
                  <label class="mb-1 block text-xs font-medium text-[#687481]">
                    Harga Jual/kg (Rp)
                  </label>
                  <input
                    v-model.number="item.harga_jual"
                    type="number"
                    min="0"
                    placeholder="0"
                    class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#147052]"
                  />
                </div>
              </div>

              <div class="mt-2 flex items-end justify-between">
                <span class="text-xs text-slate-500">
                  Stok tersedia: {{ getStokForKategori(item.kode) }} kg
                </span>
                <button
                  type="button"
                  class="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
                  @click="removeItem(index)"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 rounded-2xl bg-white p-6 text-center border border-slate-100">
          <p class="text-sm text-on-surface-variant">TOTAL DITERIMA</p>
          <p class="mt-2 text-3xl font-bold text-primary">
            {{ formatCurrency(totalDiterima) }}
          </p>
          <p class="mt-1 text-xs text-slate-500">Total Berat: {{ totalBerat }} kg</p>
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
import { getStok, submitPenjualan, getMasterSampah } from '../services/api'

const showModal = inject('showModal')
const router = useRouter()

const namaPengepul = ref('')
const stokList = ref([])
const masterSampahList = ref([])
const items = ref([
  {
    kode: '',
    berat: null,
    harga_jual: 0
  }
])
const loading = ref(false)

const totalBerat = computed(() => {
  return items.value.reduce((sum, item) => sum + (Number(item.berat) || 0), 0)
})

const totalDiterima = computed(() => {
  return items.value.reduce((sum, item) => {
    return sum + ((Number(item.berat) || 0) * (Number(item.harga_jual) || 0))
  }, 0)
})

function formatCurrency(value) {
  return 'Rp' + Number(value).toLocaleString('id-ID')
}

function getStokForKategori(kode) {
  const stokItem = stokList.value.find(s => s.kode === kode)
  return stokItem ? stokItem.stok : 0
}

function onKategoriChange(index) {
  const item = items.value[index]
  const stokItem = stokList.value.find(s => s.kode === item.kode)
  if (stokItem) {
    item.harga_jual = stokItem.harga_jual || 0
  }
}

function addItem() {
  items.value.push({
    kode: '',
    berat: null,
    harga_jual: 0
  })
}

function removeItem(i) {
  if (items.value.length > 1) {
    items.value.splice(i, 1)
  } else {
    items.value = [{ kode: '', berat: null, harga_jual: 0 }]
  }
}

async function loadData() {
  try {
    const [resStok, resMaster] = await Promise.all([getStok(), getMasterSampah()])

    if (resStok.success && resStok.data) {
      stokList.value = resStok.data
    }

    if (resMaster.success && resMaster.data) {
      masterSampahList.value = resMaster.data.map(item => ({
        ...item,
        nama_kategori: item.nama_kategori || item.nama || item.kategori
      }))
    }
  } catch (error) {
    showModal({
      type: 'error',
      title: 'Gagal',
      message: error.message || 'Gagal memuat data'
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

  const invalidItem = items.value.find((it) => {
    if (!it.kode) return true
    if (!it.berat || Number(it.berat) <= 0) return true
    const stok = getStokForKategori(it.kode)
    if (Number(it.berat) > stok) return true
    return false
  })

  if (invalidItem) {
    showModal({
      type: 'error',
      title: 'Gagal',
      message: 'Harap pilih kategori, isi berat lebih dari 0, dan tidak melebihi stok'
    })
    return
  }

  loading.value = true

  try {
    await submitPenjualan({
      nama_pengepul: namaPengepul.value,
      items: items.value.map(it => ({
        kode: it.kode,
        berat: Number(it.berat),
        harga_jual: Number(it.harga_jual)
      }))
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
  loadData()
})
</script>
