<template>
  <div class="min-h-screen bg-[#f7f8f7] pb-24 text-slate-900">
    <main class="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <header class="mb-6">
        <p class="text-sm text-gray-500">Layanan oleh operator</p>
        <h1 class="text-2xl font-bold text-[#003A36]">Bantu Warga Tukar Poin</h1>
        <p class="mt-1 text-sm text-gray-600">Warga tidak perlu menggunakan HP atau login sendiri.</p>
      </header>

      <section v-if="successTransaction" role="status" class="mb-6 rounded-3xl border border-green-200 bg-green-50 p-5">
        <h2 class="text-lg font-bold text-green-900">Penukaran berhasil</h2>
        <p class="mt-2 text-sm text-green-900">
          {{ successTransaction.nama }}
          <template v-if="successTransaction.jenis === 'UANG'">
            menerima uang tunai Rp{{ formatNumber(successTransaction.nominal) }}
            dari penukaran {{ formatNumber(successTransaction.poin) }} poin.
          </template>
          <template v-else>
            menukar {{ formatNumber(successTransaction.poin) }} poin untuk barang katalog.
          </template>
          Saldo tersisa {{ formatNumber(successTransaction.saldo) }} poin.
        </p>
        <p class="mt-1 text-xs text-green-800">ID transaksi: {{ successTransaction.id }}</p>
        <button type="button" class="mt-4 rounded-xl bg-[#003A36] px-4 py-2.5 text-sm font-semibold text-white" @click="startNewExchange">
          Penukaran Baru
        </button>
      </section>

      <template v-else>
        <p v-if="pageError" role="alert" class="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{{ pageError }}</p>

        <section class="mb-5 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <label for="resident-search" class="block text-sm font-semibold text-gray-700">Pilih atau cari warga</label>
          <input
            id="resident-search"
            v-model="search"
            type="search"
            autocomplete="off"
            placeholder="Cari nama atau username"
            class="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
          />
          <p v-if="loadingWarga" class="mt-3 text-sm text-gray-500">Memuat data warga...</p>
          <div v-else-if="search.trim()" class="mt-2 max-h-56 overflow-y-auto rounded-xl border border-gray-100">
            <button
              v-for="warga in filteredWarga"
              :key="warga.username"
              type="button"
              class="flex w-full items-center justify-between gap-4 border-b border-gray-100 px-4 py-3 text-left last:border-0 hover:bg-green-50"
              @click="selectWarga(warga)"
            >
              <span>
                <span class="block font-semibold">{{ warga.nama }}</span>
                <span class="block text-xs text-gray-500">@{{ warga.username }}</span>
              </span>
              <span class="whitespace-nowrap text-sm font-semibold text-green-800">{{ formatNumber(warga.poin) }} poin</span>
            </button>
            <p v-if="!filteredWarga.length" class="p-4 text-sm text-gray-500">Warga tidak ditemukan.</p>
          </div>
          <div v-if="selectedWarga" class="mt-4 flex items-center justify-between rounded-2xl bg-green-50 p-4">
            <div>
              <p class="font-semibold text-green-950">{{ selectedWarga.nama }}</p>
              <p class="text-sm text-green-800">@{{ selectedWarga.username }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-green-800">Saldo poin</p>
              <p class="text-lg font-bold text-green-950">{{ formatNumber(selectedWarga.poin) }}</p>
            </div>
          </div>
        </section>

        <section class="mb-5 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 class="text-lg font-semibold text-[#003A36]">Pilih penukaran</h2>
          <div class="mt-3 grid grid-cols-2 gap-3">
            <button
              type="button"
              class="rounded-xl border px-4 py-3 text-sm font-semibold"
              :class="redemptionMode === 'BARANG' ? 'border-green-800 bg-green-50 text-green-900' : 'border-gray-200 text-gray-600'"
              @click="setRedemptionMode('BARANG')"
            >
              Tukar barang
            </button>
            <button
              type="button"
              class="rounded-xl border px-4 py-3 text-sm font-semibold"
              :class="redemptionMode === 'UANG' ? 'border-green-800 bg-green-50 text-green-900' : 'border-gray-200 text-gray-600'"
              @click="setRedemptionMode('UANG')"
            >
              Tukar uang
            </button>
          </div>
        </section>

        <section v-if="redemptionMode === 'BARANG'" class="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-[#003A36]">Pilih barang katalog</h2>
              <p class="text-sm text-gray-500">Saldo poin diperiksa kembali saat penukaran.</p>
            </div>
            <button type="button" class="text-sm font-semibold text-green-800" :disabled="loadingKatalog" @click="loadKatalog">Muat ulang</button>
          </div>

          <p v-if="loadingKatalog" class="py-6 text-center text-sm text-gray-500">Memuat katalog...</p>
          <p v-else-if="!produkList.length" class="py-6 text-center text-sm text-gray-500">Belum ada barang katalog yang aktif.</p>
          <div v-else class="space-y-3">
            <article v-for="produk in produkList" :key="produk.id_katalog" class="flex items-center gap-4 rounded-2xl border border-gray-100 p-3">
              <img
                v-if="produk.image"
                :src="produk.image"
                :alt="produk.nama"
                class="h-16 w-16 rounded-xl bg-gray-100 object-cover"
              />
              <div class="min-w-0 flex-1">
                <h3 class="truncate font-semibold">{{ produk.nama }}</h3>
                <p class="text-sm text-gray-500">{{ formatNumber(produk.poin) }} poin <span v-if="produk.satuan">· {{ produk.satuan }}</span></p>
                <p class="text-xs text-gray-500">Stok: {{ produk.stok }}</p>
              </div>
              <div class="flex items-center gap-2">
                <button type="button" class="h-9 w-9 rounded-lg bg-gray-100 text-lg disabled:opacity-40" :disabled="produk.qty === 0" :aria-label="`Kurangi ${produk.nama}`" @click="produk.qty--">−</button>
                <span class="w-6 text-center font-semibold">{{ produk.qty }}</span>
                <button type="button" class="h-9 w-9 rounded-lg bg-green-50 text-lg text-green-900 disabled:opacity-40" :disabled="produk.qty >= produk.stok" :aria-label="`Tambah ${produk.nama}`" @click="produk.qty++">+</button>
              </div>
            </article>
          </div>

          <div class="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
            <span class="font-medium text-gray-600">Total ditukar</span>
            <span class="text-xl font-bold text-[#003A36]">{{ formatNumber(totalPoin) }} poin</span>
          </div>
          <p v-if="selectedWarga && totalPoin > selectedWarga.poin" role="alert" class="mt-2 text-sm text-rose-700">Poin warga tidak mencukupi.</p>
          <p v-if="formError" role="alert" class="mt-3 text-sm text-rose-700">{{ formError }}</p>
          <button
            type="button"
            class="mt-4 w-full rounded-xl bg-[#003A36] px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="saving || !selectedWarga || totalPoin <= 0 || !produkList.length || totalPoin > (selectedWarga?.poin || 0)"
            @click="exchangePoints"
          >
            {{ saving ? 'Memproses penukaran...' : 'Konfirmasi Penukaran' }}
          </button>
        </section>

        <section v-else class="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 class="text-lg font-semibold text-[#003A36]">Tukar poin menjadi uang tunai</h2>
          <p class="mt-1 text-sm text-gray-500">Nilai penukaran: 1 poin = Rp100. Uang akan dicatat sebagai kas keluar.</p>
          <label for="cash-points" class="mt-5 block text-sm font-medium text-gray-700">Jumlah poin yang ditukar</label>
          <input
            id="cash-points"
            v-model.number="cashPoints"
            type="number"
            min="1"
            :max="selectedWarga?.poin || 0"
            step="1"
            inputmode="numeric"
            class="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
            placeholder="Masukkan jumlah poin"
          />
          <div class="mt-4 flex items-center justify-between rounded-2xl bg-green-50 p-4">
            <span class="text-sm text-green-900">Uang diterima warga</span>
            <strong class="text-lg text-green-950">Rp{{ formatNumber(cashAmount) }}</strong>
          </div>
          <p v-if="selectedWarga && cashPoints > selectedWarga.poin" role="alert" class="mt-2 text-sm text-rose-700">Jumlah penukaran melebihi saldo poin warga.</p>
          <p v-if="formError" role="alert" class="mt-3 text-sm text-rose-700">{{ formError }}</p>
          <button
            type="button"
            class="mt-4 w-full rounded-xl bg-[#003A36] px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="saving || !selectedWarga || !Number.isInteger(cashPoints) || cashPoints <= 0 || cashPoints > (selectedWarga?.poin || 0)"
            @click="exchangePoints"
          >
            {{ saving ? 'Memproses penukaran...' : `Tukar ${formatNumber(cashPoints)} poin menjadi uang` }}
          </button>
        </section>
      </template>
    </main>
    <BottomNav />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import BottomNav from '../components/BottomNav.vue'
import { getKatalog, getWargaList, submitTukarPoin } from '../services/api'

const wargaList = ref([])
const produkList = ref([])
const selectedWarga = ref(null)
const search = ref('')
const loadingWarga = ref(false)
const loadingKatalog = ref(false)
const saving = ref(false)
const pageError = ref('')
const formError = ref('')
const successTransaction = ref(null)
const redemptionMode = ref('BARANG')
const cashPoints = ref(0)

const filteredWarga = computed(() => {
  const query = search.value.trim().toLocaleLowerCase('id-ID')
  if (!query) return []
  return wargaList.value
    .filter((warga) =>
      `${warga.nama} ${warga.username}`.toLocaleLowerCase('id-ID').includes(query),
    )
    .slice(0, 10)
})

const totalPoin = computed(() =>
  produkList.value.reduce((total, produk) => total + produk.poin * produk.qty, 0),
)
const cashAmount = computed(() => (Number(cashPoints.value) || 0) * 100)

function formatNumber(value) {
  return new Intl.NumberFormat('id-ID').format(Number(value) || 0)
}

function assertSuccess(response) {
  if (response?.success === false) throw new Error(response.message || 'Permintaan tidak berhasil.')
}

async function loadWarga() {
  loadingWarga.value = true
  try {
    const response = await getWargaList()
    assertSuccess(response)
    const rows = Array.isArray(response?.data) ? response.data : []
    wargaList.value = rows.map((warga) => ({
      ...warga,
      nama: String(warga.nama || warga.nama_warga || warga.username || '').trim(),
      username: String(warga.username || '').trim(),
      poin: Number(warga.poin || 0),
    })).filter((warga) => warga.nama && warga.username)
  } catch (error) {
    pageError.value = error.message || 'Data warga tidak dapat dimuat.'
  } finally {
    loadingWarga.value = false
  }
}

async function loadKatalog() {
  loadingKatalog.value = true
  try {
    const response = await getKatalog()
    assertSuccess(response)
    const rows = Array.isArray(response?.data) ? response.data : []
    produkList.value = rows.map((produk) => ({
      ...produk,
      poin: Number(produk.poin) || 0,
      stok: Number(produk.stok) || 0,
      qty: 0,
    })).filter((produk) => produk.id_katalog && produk.poin > 0 && produk.stok > 0)
  } catch (error) {
    pageError.value = error.message || 'Katalog tidak dapat dimuat.'
  } finally {
    loadingKatalog.value = false
  }
}

function selectWarga(warga) {
  selectedWarga.value = warga
  search.value = ''
  formError.value = ''
  successTransaction.value = null
  cashPoints.value = 0
  produkList.value.forEach((produk) => { produk.qty = 0 })
}

function setRedemptionMode(mode) {
  redemptionMode.value = mode
  formError.value = ''
  cashPoints.value = 0
  produkList.value.forEach((produk) => { produk.qty = 0 })
}

async function exchangePoints() {
  const pointsToRedeem = redemptionMode.value === 'UANG'
    ? Number(cashPoints.value)
    : totalPoin.value
  if (!selectedWarga.value || pointsToRedeem <= 0) {
    formError.value = redemptionMode.value === 'UANG'
      ? 'Pilih warga dan masukkan jumlah poin untuk ditukar.'
      : 'Pilih warga dan minimal satu barang untuk ditukar.'
    return
  }
  if (!Number.isInteger(pointsToRedeem)) {
    formError.value = 'Jumlah poin harus berupa bilangan bulat.'
    return
  }
  if (pointsToRedeem > selectedWarga.value.poin) {
    formError.value = 'Poin warga tidak mencukupi.'
    return
  }
  const productItems = redemptionMode.value === 'BARANG' ? produkList.value
    .filter((produk) => produk.qty > 0)
    .map((produk) => ({
      id: produk.id_katalog,
      qty: produk.qty,
      nama: produk.nama,
      poin_per_item: produk.poin,
      subtotal_poin: produk.poin * produk.qty,
    })) : []
  if (redemptionMode.value === 'BARANG' && !productItems.length) {
    formError.value = 'Pilih minimal satu barang untuk ditukar.'
    return
  }
  const cashValue = pointsToRedeem * 100
  const redemptionLabel = redemptionMode.value === 'UANG'
    ? `${formatNumber(pointsToRedeem)} poin menjadi Rp${formatNumber(cashValue)} tunai`
    : `${formatNumber(pointsToRedeem)} poin untuk barang katalog`
  const accepted = window.confirm(
    `Konfirmasi penukaran ${redemptionLabel} milik ${selectedWarga.value.nama}?`,
  )
  if (!accepted) return

  saving.value = true
  formError.value = ''
  try {
    const operator = JSON.parse(localStorage.getItem('operator') || '{}')
    const response = await submitTukarPoin({
      username_warga: selectedWarga.value.username,
      nama_warga: selectedWarga.value.nama,
      no_hp: selectedWarga.value.no_hp || '',
      jenis_penukaran: redemptionMode.value,
      poin_digunakan: pointsToRedeem,
      status: redemptionMode.value === 'UANG' ? 'SELESAI' : 'DIPROSES',
      petugas: operator.nama || operator.username || 'Operator',
      katalog_json: productItems,
      catatan: `${redemptionMode.value === 'UANG' ? `Tukar uang Rp${formatNumber(cashValue)}` : 'Tukar barang katalog'} dibantu operator ${operator.nama || operator.username || 'Operator'}`,
    })
    assertSuccess(response)
    successTransaction.value = {
      id: response?.data?.id_tukar || '',
      nama: selectedWarga.value.nama,
      jenis: redemptionMode.value,
      poin: pointsToRedeem,
      nominal: Number(response?.data?.nominal_uang) || cashValue,
      saldo: Number.isFinite(Number(response?.data?.saldo_poin))
        ? Number(response.data.saldo_poin)
        : selectedWarga.value.poin - pointsToRedeem,
    }
    selectedWarga.value.poin = successTransaction.value.saldo
    produkList.value.forEach((produk) => { produk.qty = 0 })
    cashPoints.value = 0
  } catch (error) {
    formError.value = error.message || 'Penukaran poin tidak dapat diproses.'
  } finally {
    saving.value = false
  }
}

function startNewExchange() {
  selectedWarga.value = null
  search.value = ''
  formError.value = ''
  successTransaction.value = null
  void loadWarga()
  void loadKatalog()
}

onMounted(() => {
  void loadWarga()
  void loadKatalog()
})
</script>
