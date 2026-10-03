<template>
  <div class="min-h-screen bg-[#f7f8f7] pb-24 text-slate-900">
    <header class="border-b border-gray-100 bg-white px-5 py-6 sm:px-8 lg:border-0 lg:bg-transparent lg:pb-3 lg:pt-8">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <div>
          <p class="text-sm font-medium text-green-800">Warga dan pengelola</p>
          <h1 class="mt-1 text-2xl font-bold text-slate-950">Pengumuman</h1>
        </div>
        <button
          type="button"
          class="inline-flex h-11 items-center gap-2 rounded-xl bg-green-900 px-4 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="saving"
          @click="startCreate"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span>Buat pengumuman</span>
        </button>
      </div>
    </header>

    <main class="mx-auto grid max-w-6xl gap-6 px-5 py-5 sm:px-8 lg:grid-cols-12 lg:py-7">
      <section v-if="showForm" class="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-5">
        <div class="mb-5 flex items-start justify-between gap-4">
          <div>
            <p class="text-sm text-slate-500">{{ editingId ? 'Perbarui informasi' : 'Informasi baru' }}</p>
            <h2 class="mt-1 text-lg font-semibold text-slate-950">
              {{ editingId ? 'Ubah pengumuman' : 'Buat pengumuman' }}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Tutup formulir"
            class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100"
            @click="closeForm"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <form class="space-y-4" @submit.prevent="saveAnnouncement">
          <div>
            <label for="announcement-title" class="mb-1.5 block text-sm font-medium text-slate-700">Judul</label>
            <input
              id="announcement-title"
              v-model.trim="form.judul"
              required
              maxlength="200"
              autocomplete="off"
              placeholder="Contoh: Perubahan jadwal setoran"
              class="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label for="announcement-content" class="mb-1.5 block text-sm font-medium text-slate-700">Isi pengumuman</label>
            <textarea
              id="announcement-content"
              v-model.trim="form.isi"
              required
              rows="6"
              placeholder="Tulis informasi yang perlu diketahui warga dan pengelola..."
              class="w-full resize-y rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm leading-6 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
            ></textarea>
          </div>

          <p v-if="formError" role="alert" class="text-sm text-rose-700">{{ formError }}</p>
          <div class="flex justify-end gap-2 pt-1">
            <button type="button" class="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50" :disabled="saving" @click="closeForm">
              Batal
            </button>
            <button type="submit" class="rounded-xl bg-green-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60" :disabled="saving">
              {{ saving ? 'Menyimpan...' : editingId ? 'Simpan perubahan' : 'Terbitkan' }}
            </button>
          </div>
        </form>
      </section>

      <section class="lg:col-span-12" :class="showForm ? 'lg:col-span-7' : ''">
        <div class="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold text-slate-950">Daftar pengumuman</h2>
            <p class="mt-1 text-sm text-slate-500">{{ announcements.length }} pengumuman tersimpan</p>
          </div>
          <button
            type="button"
            aria-label="Muat ulang pengumuman"
            title="Muat ulang"
            class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            :disabled="loading"
            @click="loadAnnouncements"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" :class="loading ? 'animate-spin' : ''">
              <path d="M20 7v5h-5M4 17v-5h5" />
              <path d="M5.6 9a7 7 0 0 1 11.8-2L20 12M4 12l2.6 5a7 7 0 0 0 11.8-2" />
            </svg>
          </button>
        </div>

        <p v-if="notice" role="status" class="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
          {{ notice }}
        </p>
        <p v-if="listError" role="alert" class="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {{ listError }}
        </p>

        <div v-if="loading && announcements.length === 0" class="rounded-2xl border border-gray-200 bg-white px-5 py-12 text-center text-sm text-slate-500">
          Memuat pengumuman...
        </div>
        <div v-else-if="announcements.length === 0" class="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
          <p class="font-medium text-slate-800">Belum ada pengumuman</p>
          <p class="mt-1 text-sm text-slate-500">Pengumuman yang diterbitkan akan tampil untuk warga dan pengelola.</p>
        </div>
        <div v-else class="divide-y divide-slate-200 rounded-2xl border border-gray-200 bg-white">
          <article v-for="item in announcements" :key="item.id_pengumuman" class="p-5 sm:p-6">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div class="min-w-0 flex-1">
                <div class="mb-2 flex flex-wrap items-center gap-2">
                  <span class="rounded-full px-2.5 py-1 text-xs font-semibold" :class="isActive(item) ? 'bg-green-100 text-green-900' : 'bg-slate-100 text-slate-600'">
                    {{ isActive(item) ? 'Aktif' : 'Nonaktif' }}
                  </span>
                  <time class="text-xs text-slate-500">{{ formatDate(item.tanggal) }}</time>
                </div>
                <h3 class="break-words text-base font-semibold text-slate-950">{{ item.judul }}</h3>
                <p class="mt-2 whitespace-pre-line break-words text-sm leading-6 text-slate-600">{{ item.isi }}</p>
              </div>
              <div class="flex shrink-0 flex-wrap gap-2 sm:justify-end">
                <button type="button" class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50" @click="startEdit(item)">
                  Ubah
                </button>
                <button type="button" class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50" :disabled="busyId === item.id_pengumuman" @click="toggleStatus(item)">
                  {{ busyId === item.id_pengumuman ? 'Memproses...' : isActive(item) ? 'Nonaktifkan' : 'Aktifkan' }}
                </button>
                <button type="button" class="rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50" :disabled="busyId === item.id_pengumuman" @click="deleteAnnouncement(item)">
                  Hapus
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>

    <BottomNav />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import BottomNav from '../components/BottomNav.vue'
import {
  getPengumuman,
  hapusPengumuman,
  tambahPengumuman,
  ubahPengumuman,
} from '../services/api'

const announcements = ref([])
const loading = ref(false)
const saving = ref(false)
const busyId = ref('')
const showForm = ref(false)
const editingId = ref('')
const formError = ref('')
const listError = ref('')
const notice = ref('')
const form = reactive({ judul: '', isi: '' })

function assertSuccess(response) {
  if (response?.success === false) {
    throw new Error(response.message || 'Permintaan tidak berhasil.')
  }
}

async function loadAnnouncements() {
  loading.value = true
  listError.value = ''
  try {
    const response = await getPengumuman()
    assertSuccess(response)
    announcements.value = Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response)
        ? response
        : []
  } catch (error) {
    listError.value = error.message || 'Pengumuman tidak dapat dimuat.'
  } finally {
    loading.value = false
  }
}

function startCreate() {
  editingId.value = ''
  form.judul = ''
  form.isi = ''
  formError.value = ''
  notice.value = ''
  showForm.value = true
}

function startEdit(item) {
  editingId.value = item.id_pengumuman
  form.judul = item.judul || ''
  form.isi = item.isi || ''
  formError.value = ''
  notice.value = ''
  showForm.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function closeForm() {
  showForm.value = false
  editingId.value = ''
  formError.value = ''
}

async function saveAnnouncement() {
  saving.value = true
  formError.value = ''
  notice.value = ''
  try {
    const response = editingId.value
      ? await ubahPengumuman({
          id_pengumuman: editingId.value,
          judul: form.judul,
          isi: form.isi,
        })
      : await tambahPengumuman({ judul: form.judul, isi: form.isi })
    assertSuccess(response)
    notice.value = response?.message || (editingId.value ? 'Pengumuman diperbarui.' : 'Pengumuman diterbitkan.')
    closeForm()
    await loadAnnouncements()
  } catch (error) {
    formError.value = error.message || 'Pengumuman tidak dapat disimpan.'
  } finally {
    saving.value = false
  }
}

async function toggleStatus(item) {
  busyId.value = item.id_pengumuman
  notice.value = ''
  try {
    const response = await ubahPengumuman({
      id_pengumuman: item.id_pengumuman,
      status: isActive(item) ? 'NONAKTIF' : 'AKTIF',
    })
    assertSuccess(response)
    notice.value = response?.message || 'Status pengumuman diperbarui.'
    await loadAnnouncements()
  } catch (error) {
    listError.value = error.message || 'Status pengumuman tidak dapat diubah.'
  } finally {
    busyId.value = ''
  }
}

async function deleteAnnouncement(item) {
  if (!window.confirm(`Hapus pengumuman "${item.judul}"?`)) return
  busyId.value = item.id_pengumuman
  notice.value = ''
  try {
    const response = await hapusPengumuman(item.id_pengumuman)
    assertSuccess(response)
    notice.value = response?.message || 'Pengumuman dihapus.'
    await loadAnnouncements()
  } catch (error) {
    listError.value = error.message || 'Pengumuman tidak dapat dihapus.'
  } finally {
    busyId.value = ''
  }
}

function isActive(item) {
  return String(item.status || 'AKTIF').toUpperCase() === 'AKTIF'
}

function formatDate(value) {
  if (!value) return 'Tanggal tidak tersedia'
  const date = new Date(String(value).replace(' ', 'T'))
  if (Number.isNaN(date.getTime())) return 'Tanggal tidak tersedia'
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

onMounted(loadAnnouncements)
</script>