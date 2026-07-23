const DEFAULT_API_BASE_URL =
  'https://script.google.com/macros/s/AKfycbyGiJ1D8nodqphTC0_7LH5OwI5fyrmQ3sRELgWLukJ5Wqbbd1owyRWopH6oPdBXS1BH/exec'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? '/api' : DEFAULT_API_BASE_URL)

async function request({
  method = 'GET',
  action,
  params = {},
  body = null
} = {}) {
  if (!action) {
    throw new Error('Action API wajib diisi')
  }

  const metode = String(method).toUpperCase()

  const baseUrl = /^https?:\/\//.test(API_BASE_URL)
    ? new URL(API_BASE_URL)
    : new URL(
      API_BASE_URL,
      typeof window !== 'undefined'
        ? window.location.origin
        : 'http://localhost:3000'
    )

  const url = new URL(baseUrl.toString())

  url.searchParams.set('action', action)
  
  // Tambahkan parameter untuk mencegah caching
  url.searchParams.set('_t', Date.now().toString())

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ''
    ) {
      url.searchParams.set(key, String(value))
    }
  })

  const options = {
    method: metode
  }

  if (metode === 'POST') {
    let payload = body

    if (payload === null || payload === undefined) {
      payload = {}
    }

    if (
      typeof payload === 'object' &&
      !Array.isArray(payload)
    ) {
      payload = {
        ...payload,
        action
      }
    } else {
      payload = {
        action,
        value: payload
      }
    }

    /*
     * Gunakan text/plain agar request ke Apps Script
     * tidak memicu CORS preflight OPTIONS.
     *
     * Backend Apps Script harus membaca body melalui:
     * JSON.parse(e.postData.contents)
     */
    options.headers = {
      'Content-Type': 'text/plain;charset=utf-8'
    }

    options.body = JSON.stringify(payload)
  }

  console.group(
    `[API CALL] ${metode} action=${action}`
  )

  console.log('URL:', url.toString())

  if (metode === 'POST') {
    console.log('Payload:', options.body)
  }

  if (Object.keys(params).length > 0) {
    console.log('Params:', params)
  }

  try {
    const response = await fetch(
      url.toString(),
      options
    )

    if (!response.ok) {
      const errorText = await response
        .text()
        .catch(() => '')

      console.error(
        'Respons gagal:',
        response.status,
        errorText
      )

      throw new Error(
        `Permintaan API gagal dengan status ${response.status}`
      )
    }

    let teksRespons = ''

    try {
      teksRespons = await response.text()
    } catch (error) {
      console.error(
        'Tidak dapat membaca respons teks:',
        error
      )

      throw new Error(
        'Respons server tidak dapat dibaca'
      )
    }

    if (!teksRespons) {
      console.log('Respons server kosong')
      return {}
    }

    let hasil

    try {
      hasil = JSON.parse(teksRespons)
    } catch (error) {
      console.error(
        'Respons bukan JSON:',
        teksRespons
      )

      throw new Error(
        'Respons server bukan JSON yang valid'
      )
    }

    console.log('Hasil Server:', hasil)

    return hasil
  } catch (error) {
    console.error('Kesalahan API:', error)
    console.error(
      'URL yang dipanggil:',
      url.toString()
    )
    console.error(
      'Opsi request:',
      options
    )

    throw new Error(
      error?.message ||
      'Tidak dapat terhubung ke server. Periksa koneksi atau URL API.'
    )
  } finally {
    console.groupEnd()
  }
}

/* =========================================================
 * PENGUJIAN KONEKSI
 * ======================================================= */

export function pingApi() {
  return request({
    action: 'ping'
  })
}

/* =========================================================
 * MASTER SAMPAH
 * ======================================================= */

export function getMasterSampah() {
  return request({
    action: 'master_sampah'
  })
}

export function tambahMasterSampah(payload) {
  return request({
    method: 'POST',
    action: 'tambah_master_sampah',
    body: payload
  })
}

export function ubahMasterSampah(payload) {
  return request({
    method: 'POST',
    action: 'ubah_master_sampah',
    body: payload
  })
}

export function hapusMasterSampah(kode) {
  return request({
    method: 'POST',
    action: 'hapus_master_sampah',
    body: {
      kode
    }
  })
}

/* =========================================================
 * KELOMPOK
 * ======================================================= */

export function getKelompokAktif() {
  return request({
    action: 'kelompok_aktif'
  })
}

export function tambahKelompok(payload) {
  return request({
    method: 'POST',
    action: 'tambah_kelompok',
    body: payload
  })
}

export function aktifkanKelompok(idKelompok) {
  return request({
    method: 'POST',
    action: 'aktifkan_kelompok',
    body: {
      id_kelompok: idKelompok
    }
  })
}

export function hapusKelompok(idKelompok) {
  return request({
    method: 'POST',
    action: 'hapus_kelompok',
    body: {
      id_kelompok: idKelompok
    }
  })
}

/* =========================================================
 * AUTENTIKASI
 * ======================================================= */

export function loginOperator({
  username,
  password
}) {
  return request({
    method: 'POST',
    action: 'login_operator',
    body: {
      username,
      password
    }
  })
}

export function loginWarga({
  username,
  no_hp
}) {
  return request({
    action: 'login_warga',
    params: {
      username,
      no_hp
    }
  })
}

export function resetPasswordApi(payload) {
  return request({
    method: 'POST',
    action: 'reset_password',
    body: payload
  })
}

/* =========================================================
 * WARGA
 * ======================================================= */

export function getProfilWarga(username) {
  return request({
    action: 'profil_warga',
    params: {
      username
    }
  })
}

export function getRiwayatSetoran(username) {
  return request({
    action: 'riwayat_setoran',
    params: {
      username
    }
  })
}

export function getWargaList() {
  return request({
    action: 'get_warga'
  })
}

export function tambahWarga(payload) {
  return request({
    method: 'POST',
    action: 'tambah_warga',
    body: payload
  })
}

/* =========================================================
 * SETORAN SAMPAH
 * ======================================================= */

export function submitSetoran(payload) {
  return request({
    method: 'POST',
    action: 'simpan_setoran',
    body: payload
  })
}

export function getDetailSetoran(idSetoran) {
  return request({
    action: 'detail_setoran',
    params: {
      id_setoran: idSetoran
    }
  })
}

export function getRiwayatTransaksi() {
  return request({
    action: 'riwayat_transaksi'
  })
}

export function batalkanSetoran(idSetoran) {
  return request({
    method: 'POST',
    action: 'batalkan_setoran',
    body: {
      id_setoran: idSetoran
    }
  })
}

/* =========================================================
 * STOK DAN PENJUALAN
 * ======================================================= */

export function getStok() {
  return request({
    action: 'stok'
  })
}

export function submitPenjualan(payload) {
  return request({
    method: 'POST',
    action: 'simpan_penjualan',
    body: payload
  })
}

/* =========================================================
 * DASHBOARD
 * ======================================================= */

export function getDashboardData() {
  return request({
    action: 'dashboard'
  })
}

/* =========================================================
 * KAS DAN KEUANGAN
 * ======================================================= */

export function getSaldoKas() {
  return request({
    action: 'saldo_kas'
  })
}

export function getRiwayatKas() {
  return request({
    action: 'riwayat_kas'
  })
}

export function getLaporan(bulan, tahun) {
  return request({
    action: 'laporan',
    params: {
      bulan,
      tahun
    }
  })
}

export function submitBiaya(payload) {
  return request({
    method: 'POST',
    action: 'catat_biaya',
    body: payload
  })
}

export function submitDanaMasuk(payload) {
  return request({
    method: 'POST',
    action: 'catat_dana_masuk',
    body: payload
  })
}

/* =========================================================
 * PENGUMUMAN
 * ======================================================= */

export function getPengumuman() {
  return request({
    action: 'pengumuman'
  })
}

export function tambahPengumuman(payload) {
  return request({
    method: 'POST',
    action: 'tambah_pengumuman',
    body: payload
  })
}

export function ubahPengumuman(payload) {
  return request({
    method: 'POST',
    action: 'ubah_pengumuman',
    body: payload
  })
}

export function hapusPengumuman(
  idPengumuman
) {
  return request({
    method: 'POST',
    action: 'hapus_pengumuman',
    body: {
      id_pengumuman: idPengumuman
    }
  })
}

/* =========================================================
 * POIN
 * ======================================================= */

export function submitTukarPoin(payload) {
  return request({
    method: 'POST',
    action: 'tukar_poin',
    body: payload
  })
}

/* =========================================================
 * UTILITAS
 * ======================================================= */

export function ujiApi({
  method = 'GET',
  action,
  params = {},
  body = null
}) {
  return request({
    method,
    action,
    params,
    body
  })
}

/* =========================================================
 * KATALOG SEMBAKO
 * ======================================================= */

export function getKatalog() {
  return request({
    action: 'get_katalog'
  })
}

export function tambahKatalog(payload) {
  return request({
    method: 'POST',
    action: 'tambah_katalog',
    body: payload
  })
}

export function ubahKatalog(payload) {
  return request({
    method: 'POST',
    action: 'ubah_katalog',
    body: payload
  })
}

export function hapusKatalog(idKatalog) {
  return request({
    method: 'POST',
    action: 'hapus_katalog',
    body: {
      id_katalog: idKatalog
    }
  })
}

export function getApiBaseUrl() {
  return API_BASE_URL
}