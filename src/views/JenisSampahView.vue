<template>
  <div class="min-h-screen bg-[#f7f8f7] pb-24 text-slate-900">
    <main class="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <header class="mb-6 flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Pengelola</p>
          <h1 class="text-2xl font-bold text-[#003A36]">Jenis Sampah</h1>
          <p class="mt-1 text-sm text-gray-600">Atur harga beli dan jual setiap jenis sampah.</p>
        </div>
        <button
          type="button"
          class="rounded-2xl bg-[#003A36] px-4 py-3 text-sm font-semibold text-white"
          @click="startCreate"
        >
          + Tambah
        </button>
      </header>

      <section v-if="showForm" class="mb-6 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 class="mb-4 text-lg font-semibold">{{ editingCode ? 'Ubah Jenis Sampah' : 'Tambah Jenis Sampah' }}</h2>
        <form class="grid gap-4 sm:grid-cols-2" @submit.prevent="saveWasteType">
          <label class="text-sm font-medium text-slate-700">
            Kode
            <input v-model.trim="form.kode" :disabled="Boolean(editingCode)" required class="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 disabled:bg-gray-100" placeholder="PLS" />
          </label>
          <label class="text-sm font-medium text-slate-700">
            Nama jenis sampah
            <input v-model.trim="form.nama" required class="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5" placeholder="Plastik" />
          </label>
          <label class="text-sm font-medium text-slate-700">
            Harga beli / kg (Rp)
            <input v-model.number="form.harga_beli" type="number" min="0" step="1" required class="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5" />
          </label>
          <label class="text-sm font-medium text-slate-700">
            Harga jual / kg (Rp)
            <input v-model.number="form.harga_jual" type="number" min="0" step="1" required class="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5" />
          </label>
          <label class="text-sm font-medium text-slate-700">
            Status
            <select v-model="form.status" class="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5">
              <option value="AKTIF">Aktif</option>
              <option value="NONAKTIF">Nonaktif</option>
            </select>
          </label>
          <p v-if="formError" role="alert" class="text-sm text-rose-700 sm:col-span-2">{{ formError }}</p>
          <div class="flex gap-3 sm:col-span-2">
            <button type="button" class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold" @click="closeForm">Batal</button>
            <button type="submit" :disabled="saving" class="rounded-xl bg-[#003A36] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
              {{ saving ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </section>

      <p v-if="notice" role="status" class="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-800">{{ notice }}</p>
      <p v-if="listError" role="alert" class="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{{ listError }}</p>

      <section class="space-y-3">
        <p v-if="loading" class="py-8 text-center text-sm text-gray-500">Memuat jenis sampah...</p>
        <p v-else-if="!wasteTypes.length && !listError" class="rounded-2xl bg-white p-6 text-center text-sm text-gray-500">Belum ada jenis sampah.</p>
        <article v-for="item in wasteTypes" :key="item.kode" class="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="font-semibold text-slate-900">{{ item.nama }}</h2>
              <span class="rounded-full px-2 py-0.5 text-xs font-semibold" :class="isActive(item) ? 'bg-green-50 text-green-800' : 'bg-gray-100 text-gray-600'">
                {{ isActive(item) ? 'Aktif' : 'Nonaktif' }}
              </span>
            </div>
            <p class="mt-1 text-sm text-gray-500">{{ item.kode }} · Beli {{ formatRupiah(item.harga_beli) }}/kg · Jual {{ formatRupiah(item.harga_jual) }}/kg</p>
          </div>
          <div class="flex gap-2">
            <button type="button" class="rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-green-800" :disabled="busyCode === item.kode" @click="startEdit(item)">Ubah</button>
            <button type="button" class="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 disabled:opacity-50" :disabled="busyCode === item.kode" @click="deleteWasteType(item)">Hapus</button>
          </div>
        </article>
      </section>
    </main>
    <BottomNav />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import BottomNav from '../components/BottomNav.vue'
import {
  getMasterSampah,
  hapusMasterSampah,
  tambahMasterSampah,
  ubahMasterSampah,
} from '../services/api'

const wasteTypes = ref([])
const loading = ref(false)
const saving = ref(false)
const busyCode = ref('')
const showForm = ref(false)
const editingCode = ref('')
const formError = ref('')
const listError = ref('')
const notice = ref('')
const form = reactive({ kode: '', nama: '', harga_beli: 0, harga_jual: 0, status: 'AKTIF' })

function assertSuccess(response) {
  if (response?.success === false) throw new Error(response.message || 'Permintaan tidak berhasil.')
}

async function loadWasteTypes() {
  loading.value = true
  listError.value = ''
  try {
    const response = await getMasterSampah()
    assertSuccess(response)
    wasteTypes.value = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : []
  } catch (error) {
    listError.value = error.message || 'Jenis sampah tidak dapat dimuat.'
  } finally {
    loading.value = false
  }
}

function clearForm() {
  form.kode = ''
  form.nama = ''
  form.harga_beli = 0
  form.harga_jual = 0
  form.status = 'AKTIF'
  formError.value = ''
}

function startCreate() {
  editingCode.value = ''
  clearForm()
  notice.value = ''
  showForm.value = true
}

function startEdit(item) {
  editingCode.value = item.kode
  form.kode = item.kode || ''
  form.nama = item.nama || ''
  form.harga_beli = Number(item.harga_beli) || 0
  form.harga_jual = Number(item.harga_jual) || 0
  form.status = String(item.status || 'AKTIF').toUpperCase()
  formError.value = ''
  notice.value = ''
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingCode.value = ''
  clearForm()
}

async function saveWasteType() {
  if (!form.kode || !form.nama || form.harga_beli < 0 || form.harga_jual < 0) {
    formError.value = 'Lengkapi data dan pastikan harga tidak negatif.'
    return
  }
  saving.value = true
  formError.value = ''
  try {
    const response = editingCode.value
      ? await ubahMasterSampah({ kode: editingCode.value, nama: form.nama, harga_beli: form.harga_beli, harga_jual: form.harga_jual, status: form.status })
      : await tambahMasterSampah({ ...form, kode: form.kode.toUpperCase() })
    assertSuccess(response)
    notice.value = response?.message || (editingCode.value ? 'Jenis sampah diperbarui.' : 'Jenis sampah ditambahkan.')
    closeForm()
    await loadWasteTypes()
  } catch (error) {
    formError.value = error.message || 'Jenis sampah tidak dapat disimpan.'
  } finally {
    saving.value = false
  }
}

async function deleteWasteType(item) {
  if (!window.confirm(`Hapus jenis sampah "${item.nama}"?`)) return
  busyCode.value = item.kode
  notice.value = ''
  listError.value = ''
  try {
    const response = await hapusMasterSampah(item.kode)
    assertSuccess(response)
    notice.value = response?.message || 'Jenis sampah dihapus.'
    await loadWasteTypes()
  } catch (error) {
    listError.value = error.message || 'Jenis sampah tidak dapat dihapus.'
  } finally {
    busyCode.value = ''
  }
}

function isActive(item) {
  return String(item.status || 'AKTIF').toUpperCase() === 'AKTIF'
}

function formatRupiah(value) {
  return `Rp${Number(value || 0).toLocaleString('id-ID')}`
}

onMounted(loadWasteTypes)
</script>
