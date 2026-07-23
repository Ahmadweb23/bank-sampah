<script setup>
import {
  computed,
  ref,
  watch
} from 'vue'

import {
  getApiBaseUrl,
  ujiApi
} from '../services/api.js'

const daftarApi = [
  {
    label: 'Ping API',
    method: 'GET',
    action: 'ping',
    params: {}
  },
  {
    label: 'Daftar master sampah',
    method: 'GET',
    action: 'master_sampah',
    params: {}
  },
  {
    label: 'Tambah master sampah',
    method: 'POST',
    action: 'tambah_master_sampah',
    body: {
      kode: 'SMP-001',
      nama: 'Botol Plastik',
      kategori: 'Plastik',
      satuan: 'kg',
      harga_beli: 2000,
      harga_jual: 2500,
      poin_per_kg: 2000,
      status: 'aktif'
    }
  },
  {
    label: 'Ubah master sampah',
    method: 'POST',
    action: 'ubah_master_sampah',
    body: {
      kode: 'SMP-001',
      nama: 'Botol Plastik',
      kategori: 'Plastik',
      satuan: 'kg',
      harga_beli: 2200,
      harga_jual: 2700,
      poin_per_kg: 2200,
      status: 'aktif'
    }
  },
  {
    label: 'Hapus master sampah',
    method: 'POST',
    action: 'hapus_master_sampah',
    body: {
      kode: 'SMP-001'
    }
  },
  {
    label: 'Kelompok aktif',
    method: 'GET',
    action: 'kelompok_aktif',
    params: {}
  },
  {
    label: 'Tambah kelompok',
    method: 'POST',
    action: 'tambah_kelompok',
    body: {}
  },
  {
    label: 'Aktifkan kelompok',
    method: 'POST',
    action: 'aktifkan_kelompok',
    body: {
      id_kelompok: ''
    }
  },
  {
    label: 'Hapus kelompok',
    method: 'POST',
    action: 'hapus_kelompok',
    body: {
      id_kelompok: ''
    }
  },
  {
    label: 'Masuk warga',
    method: 'GET',
    action: 'login_warga',
    params: {
      username: '',
      no_hp: ''
    }
  },
  {
    label: 'Profil warga',
    method: 'GET',
    action: 'profil_warga',
    params: {
      username: ''
    }
  },
  {
    label: 'Riwayat setoran warga',
    method: 'GET',
    action: 'riwayat_setoran',
    params: {
      username: ''
    }
  },
  {
    label: 'Tambah warga',
    method: 'POST',
    action: 'tambah_warga',
    body: {
      nama: '',
      username: '',
      no_hp: '',
      alamat: ''
    }
  },
  {
    label: 'Simpan setoran',
    method: 'POST',
    action: 'simpan_setoran',
    body: {}
  },
  {
    label: 'Detail setoran',
    method: 'GET',
    action: 'detail_setoran',
    params: {
      id_setoran: ''
    }
  },
  {
    label: 'Riwayat transaksi',
    method: 'GET',
    action: 'riwayat_transaksi',
    params: {}
  },
  {
    label: 'Batalkan setoran',
    method: 'POST',
    action: 'batalkan_setoran',
    body: {
      id_setoran: ''
    }
  },
  {
    label: 'Stok sampah',
    method: 'GET',
    action: 'stok',
    params: {}
  },
  {
    label: 'Simpan penjualan',
    method: 'POST',
    action: 'simpan_penjualan',
    body: {}
  },
  {
    label: 'Dashboard',
    method: 'GET',
    action: 'dashboard',
    params: {}
  },
  {
    label: 'Saldo kas',
    method: 'GET',
    action: 'saldo_kas',
    params: {}
  },
  {
    label: 'Riwayat kas',
    method: 'GET',
    action: 'riwayat_kas',
    params: {}
  },
  {
    label: 'Laporan',
    method: 'GET',
    action: 'laporan',
    params: {
      bulan: new Date().getMonth() + 1,
      tahun: new Date().getFullYear()
    }
  },
  {
    label: 'Catat biaya',
    method: 'POST',
    action: 'catat_biaya',
    body: {
      tanggal: '',
      kategori: '',
      nominal: 0,
      keterangan: ''
    }
  },
  {
    label: 'Catat dana masuk',
    method: 'POST',
    action: 'catat_dana_masuk',
    body: {
      tanggal: '',
      sumber: '',
      nominal: 0,
      keterangan: ''
    }
  },
  {
    label: 'Daftar pengumuman',
    method: 'GET',
    action: 'pengumuman',
    params: {}
  },
  {
    label: 'Tambah pengumuman',
    method: 'POST',
    action: 'tambah_pengumuman',
    body: {
      judul: '',
      isi: '',
      status: 'aktif'
    }
  },
  {
    label: 'Ubah pengumuman',
    method: 'POST',
    action: 'ubah_pengumuman',
    body: {
      id_pengumuman: '',
      judul: '',
      isi: '',
      status: 'aktif'
    }
  },
  {
    label: 'Hapus pengumuman',
    method: 'POST',
    action: 'hapus_pengumuman',
    body: {
      id_pengumuman: ''
    }
  }
]

const apiBaseUrl = getApiBaseUrl()

const indeksApiTerpilih = ref(0)
const teksParameter = ref('{}')
const teksBody = ref('{}')

const sedangMemproses = ref(false)
const statusPengujian = ref('belum-diuji')
const durasiPermintaan = ref(null)
const waktuPengujian = ref('')
const hasilPengujian = ref(null)

const apiTerpilih = computed(() => {
  return daftarApi[indeksApiTerpilih.value]
})

const warnaMetode = computed(() => {
  return apiTerpilih.value.method === 'POST'
    ? 'metode-post'
    : 'metode-get'
})

const responsTerformat = computed(() => {
  if (!hasilPengujian.value) {
    return ''
  }

  return JSON.stringify(
    hasilPengujian.value,
    null,
    2
  )
})

const urlPermintaan = computed(() => {
  try {
    const url = new URL(apiBaseUrl)

    url.searchParams.set(
      'action',
      apiTerpilih.value.action
    )

    const parameter = bacaObjekJson(
      teksParameter.value,
      false
    )

    Object.entries(parameter).forEach(
      ([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== ''
        ) {
          url.searchParams.set(
            key,
            String(value)
          )
        }
      }
    )

    return url.toString()
  } catch (error) {
    return apiBaseUrl
  }
})

watch(
  apiTerpilih,
  () => {
    muatContoh()
  },
  {
    immediate: true
  }
)

function bacaObjekJson(teks, wajibValid = true) {
  const isi = String(teks || '').trim()

  if (!isi) {
    return {}
  }

  try {
    const hasil = JSON.parse(isi)

    if (
      hasil === null ||
      typeof hasil !== 'object' ||
      Array.isArray(hasil)
    ) {
      throw new Error(
        'Nilai JSON harus berupa objek.'
      )
    }

    return hasil
  } catch (error) {
    if (!wajibValid) {
      return {}
    }

    throw new Error(
      `JSON tidak valid: ${error.message}`
    )
  }
}

function muatContoh() {
  teksParameter.value = JSON.stringify(
    apiTerpilih.value.params || {},
    null,
    2
  )

  teksBody.value = JSON.stringify(
    apiTerpilih.value.body || {},
    null,
    2
  )

  bersihkanHasil()
}

function bersihkanHasil() {
  statusPengujian.value = 'belum-diuji'
  durasiPermintaan.value = null
  waktuPengujian.value = ''
  hasilPengujian.value = null
}

async function jalankanPengujian() {
  sedangMemproses.value = true
  statusPengujian.value = 'memproses'
  hasilPengujian.value = null
  durasiPermintaan.value = null

  const mulai = performance.now()

  try {
    const params = bacaObjekJson(
      teksParameter.value
    )

    const body =
      apiTerpilih.value.method === 'POST'
        ? bacaObjekJson(teksBody.value)
        : null

    const hasil = await ujiApi({
      method: apiTerpilih.value.method,
      action: apiTerpilih.value.action,
      params,
      body
    })

    hasilPengujian.value = hasil

    statusPengujian.value =
      hasil?.berhasil === false
        ? 'gagal'
        : 'berhasil'
  } catch (error) {
    statusPengujian.value = 'gagal'

    hasilPengujian.value = {
      berhasil: false,
      kode: error.kode || 'KESALAHAN_FRONTEND',
      pesan: error.message,
      data: error.data || null
    }
  } finally {
    durasiPermintaan.value = Math.round(
      performance.now() - mulai
    )

    waktuPengujian.value =
      new Date().toLocaleString('id-ID')

    sedangMemproses.value = false
  }
}

async function salinRespons() {
  if (!responsTerformat.value) {
    return
  }

  try {
    await navigator.clipboard.writeText(
      responsTerformat.value
    )
  } catch (error) {
    console.error(
      'Gagal menyalin respons:',
      error
    )
  }
}
</script>

<template>
  <main class="halaman-uji-api">
    <header class="kepala-halaman">
      <div>
        <p class="label-kecil">
          Alat pengembangan
        </p>

        <h1>Pengujian API</h1>

        <p class="deskripsi">
          Gunakan halaman ini untuk menguji koneksi
          antara Vue dan Google Apps Script.
        </p>
      </div>

      <div
        class="status-api"
        :class="`status-${statusPengujian}`"
      >
        {{ statusPengujian }}
      </div>
    </header>

    <section class="kartu informasi-api">
      <label>Alamat API</label>

      <code>{{ apiBaseUrl }}</code>
    </section>

    <div class="susunan">
      <section class="kartu panel-formulir">
        <div class="form-group">
          <label for="pilihanApi">
            Pilih API
          </label>

          <select
            id="pilihanApi"
            v-model.number="indeksApiTerpilih"
          >
            <option
              v-for="(api, index) in daftarApi"
              :key="`${api.method}-${api.action}`"
              :value="index"
            >
              {{ api.method }} — {{ api.label }}
            </option>
          </select>
        </div>

        <div class="ringkasan-permintaan">
          <span
            class="metode"
            :class="warnaMetode"
          >
            {{ apiTerpilih.method }}
          </span>

          <code>
            {{ apiTerpilih.action }}
          </code>
        </div>

        <div class="form-group">
          <label for="parameter">
            Parameter URL
          </label>

          <textarea
            id="parameter"
            v-model="teksParameter"
            rows="7"
            spellcheck="false"
          />

          <small>
            Digunakan sebagai query string.
          </small>
        </div>

        <div
          v-if="apiTerpilih.method === 'POST'"
          class="form-group"
        >
          <label for="body">
            Badan permintaan
          </label>

          <textarea
            id="body"
            v-model="teksBody"
            rows="12"
            spellcheck="false"
          />

          <small>
            Isi harus berupa objek JSON.
          </small>
        </div>

        <div class="pratinjau-url">
          <label>URL permintaan</label>

          <code>{{ urlPermintaan }}</code>
        </div>

        <div
          v-if="apiTerpilih.method === 'POST'"
          class="peringatan"
        >
          API POST dapat menambah, mengubah,
          membatalkan, atau menghapus data.
        </div>

        <div class="aksi">
          <button
            type="button"
            class="tombol tombol-utama"
            :disabled="sedangMemproses"
            @click="jalankanPengujian"
          >
            {{
              sedangMemproses
                ? 'Mengirim...'
                : 'Jalankan pengujian'
            }}
          </button>

          <button
            type="button"
            class="tombol tombol-sekunder"
            :disabled="sedangMemproses"
            @click="muatContoh"
          >
            Muat contoh
          </button>
        </div>
      </section>

      <section class="kartu panel-respons">
        <div class="judul-respons">
          <div>
            <h2>Respons API</h2>

            <p v-if="waktuPengujian">
              {{ waktuPengujian }}
            </p>
          </div>

          <button
            v-if="hasilPengujian"
            type="button"
            class="tombol-salin"
            @click="salinRespons"
          >
            Salin JSON
          </button>
        </div>

        <div
          v-if="durasiPermintaan !== null"
          class="metadata"
        >
          <span>
            Durasi:
            <strong>
              {{ durasiPermintaan }} ms
            </strong>
          </span>

          <span>
            Status:
            <strong>
              {{ statusPengujian }}
            </strong>
          </span>
        </div>

        <div
          v-if="sedangMemproses"
          class="keadaan-kosong"
        >
          Menunggu respons server...
        </div>

        <pre
          v-else-if="hasilPengujian"
          :class="{
            'respons-gagal':
              statusPengujian === 'gagal'
          }"
        >{{ responsTerformat }}</pre>

        <div
          v-else
          class="keadaan-kosong"
        >
          Pilih API lalu jalankan pengujian.
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.halaman-uji-api {
  min-height: 100vh;
  padding: 32px;
  background: #f5f7f6;
  color: #17201c;
}

.kepala-halaman {
  max-width: 1280px;
  margin: 0 auto 24px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.label-kecil {
  margin: 0 0 6px;
  color: #16803c;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

h1,
h2,
p {
  margin-top: 0;
}

h1 {
  margin-bottom: 8px;
  font-size: 30px;
}

h2 {
  margin-bottom: 4px;
  font-size: 18px;
}

.deskripsi {
  margin-bottom: 0;
  color: #65716b;
}

.status-api {
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  text-transform: capitalize;
}

.status-belum-diuji {
  background: #e5e7eb;
  color: #4b5563;
}

.status-memproses {
  background: #fef3c7;
  color: #92400e;
}

.status-berhasil {
  background: #dcfce7;
  color: #166534;
}

.status-gagal {
  background: #fee2e2;
  color: #991b1b;
}

.kartu {
  background: #ffffff;
  border: 1px solid #e2e8e5;
  border-radius: 16px;
  box-shadow: 0 10px 30px
    rgba(15, 40, 25, 0.05);
}

.informasi-api {
  max-width: 1280px;
  margin: 0 auto 20px;
  padding: 16px 20px;
}

.informasi-api label,
.pratinjau-url label {
  display: block;
  margin-bottom: 8px;
  color: #65716b;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.informasi-api code,
.pratinjau-url code {
  display: block;
  overflow-wrap: anywhere;
  font-size: 13px;
}

.susunan {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns:
    minmax(0, 1fr)
    minmax(0, 1fr);
  gap: 20px;
}

.panel-formulir,
.panel-respons {
  padding: 22px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 700;
}

.form-group small {
  display: block;
  margin-top: 6px;
  color: #77817c;
}

select,
textarea {
  width: 100%;
  border: 1px solid #ccd5d0;
  border-radius: 10px;
  background: #ffffff;
  color: #17201c;
  font: inherit;
}

select {
  min-height: 44px;
  padding: 0 12px;
}

textarea {
  padding: 12px;
  resize: vertical;
  font-family:
    Consolas,
    Monaco,
    monospace;
  font-size: 13px;
  line-height: 1.6;
}

select:focus,
textarea:focus {
  outline: 3px solid
    rgba(22, 128, 60, 0.12);
  border-color: #16803c;
}

.ringkasan-permintaan {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 12px;
  border-radius: 10px;
  background: #f6f8f7;
}

.metode {
  padding: 5px 9px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 800;
}

.metode-get {
  background: #dbeafe;
  color: #1d4ed8;
}

.metode-post {
  background: #fef3c7;
  color: #92400e;
}

.pratinjau-url {
  margin-bottom: 18px;
  padding: 14px;
  border-radius: 10px;
  background: #f6f8f7;
}

.peringatan {
  margin-bottom: 18px;
  padding: 12px 14px;
  border: 1px solid #fed7aa;
  border-radius: 10px;
  background: #fff7ed;
  color: #9a3412;
  font-size: 13px;
}

.aksi {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tombol {
  min-height: 44px;
  padding: 0 18px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
}

.tombol:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.tombol-utama {
  border: 1px solid #16803c;
  background: #16803c;
  color: #ffffff;
}

.tombol-sekunder {
  border: 1px solid #ccd5d0;
  background: #ffffff;
  color: #27332d;
}

.judul-respons {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.judul-respons p {
  margin-bottom: 0;
  color: #77817c;
  font-size: 12px;
}

.tombol-salin {
  border: 0;
  background: transparent;
  color: #16803c;
  font-weight: 700;
  cursor: pointer;
}

.metadata {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 12px;
  color: #65716b;
  font-size: 13px;
}

pre {
  min-height: 420px;
  max-height: 680px;
  margin: 0;
  padding: 18px;
  overflow: auto;
  border-radius: 12px;
  background: #111815;
  color: #d8f3df;
  font-family:
    Consolas,
    Monaco,
    monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

pre.respons-gagal {
  color: #fecaca;
}

.keadaan-kosong {
  min-height: 420px;
  display: grid;
  place-items: center;
  border: 1px dashed #cbd5cf;
  border-radius: 12px;
  color: #77817c;
  text-align: center;
}

@media (max-width: 860px) {
  .halaman-uji-api {
    padding: 20px 14px;
  }

  .kepala-halaman {
    flex-direction: column;
  }

  .susunan {
    grid-template-columns: 1fr;
  }

  pre,
  .keadaan-kosong {
    min-height: 300px;
  }
}
</style>