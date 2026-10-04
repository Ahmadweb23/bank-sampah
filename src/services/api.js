/**
 * =========================================================
 * API.JS
 * Sistem Digital Bank Sampah Bojong Karya 2
 * =========================================================
 *
 * Seluruh request frontend diteruskan ke Google Apps Script.
 * Data aplikasi dikelola backend dan disimpan di Google Spreadsheet.
 */

const DEFAULT_API_BASE_URL =
  "https://script.google.com/macros/s/AKfycbw8oekJTou0_OsVFLnROHQ-svY8OYjv5e-0fSfW9fwt7aRsbbm-r4En7uHdb9jLvWdF/exec";
const AUTH_TOKEN_KEY = "api_token";
const PUBLIC_ACTIONS = new Set([
  "ping",
  "status",
  "login_operator",
  "login_warga",
  "reset_password",
  "lupa_password",
  "pengumuman",
  "get_katalog",
]);

function getConfiguredApiBaseUrl() {
  return (
    import.meta.env.VITE_API_BASE_URL?.trim() ||
    DEFAULT_API_BASE_URL
  );
}

function getAuthToken() {
  return typeof window !== "undefined"
    ? window.localStorage.getItem(AUTH_TOKEN_KEY)
    : null;
}

async function request({
  method = "GET",
  action,
  params = {},
  body = null,
} = {}) {
  if (!action) {
    throw new Error("Action API wajib diisi");
  }
  const metode = String(method).toUpperCase();
  const apiBaseUrl = getConfiguredApiBaseUrl();

  const baseUrl = /^https?:\/\//.test(apiBaseUrl)
    ? new URL(apiBaseUrl)
    : new URL(
        apiBaseUrl,
        typeof window !== "undefined"
          ? window.location.origin
          : "http://localhost:3000",
      );

  const url = new URL(baseUrl.toString());

  url.searchParams.set("action", action);

  // Tambahkan parameter untuk mencegah caching
  url.searchParams.set("_t", Date.now().toString());

  const token = getAuthToken();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  if (token && !PUBLIC_ACTIONS.has(action) && metode === "GET") {
    url.searchParams.set("token", token);
  }

  const options = {
    method: metode,
    credentials: "omit",
  };

  if (metode === "POST") {
    let payload = body;

    if (payload === null || payload === undefined) {
      payload = {};
    }

    if (typeof payload === "object" && !Array.isArray(payload)) {
      payload = {
        ...payload,
        action,
      };
    } else {
      payload = {
        action,
        value: payload,
      };
    }

    if (token && !PUBLIC_ACTIONS.has(action)) {
      payload.token = token;
    }

    options.headers = {
      "Content-Type": "text/plain;charset=UTF-8",
    };

    options.body = JSON.stringify(payload);
  }

  try {
    const response = await fetch(url.toString(), options);

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");

      console.error("Respons gagal:", response.status, errorText);

      throw new Error(`Permintaan API gagal dengan status ${response.status}`);
    }

    let teksRespons = "";

    try {
      teksRespons = await response.text();
    } catch (error) {
      console.error("Tidak dapat membaca respons teks:", error);

      throw new Error("Respons server tidak dapat dibaca");
    }

    if (!teksRespons) {
      return {};
    }

    let hasil;

    try {
      hasil = JSON.parse(teksRespons);
    } catch (error) {
      console.error("Respons bukan JSON:", teksRespons);

      throw new Error("Respons server bukan JSON yang valid");
    }

    if (hasil?.success === false) {
      throw new Error(hasil.message || "Permintaan API gagal.");
    }

    if (
      (action === "login_operator" || action === "login_warga") &&
      hasil?.data?.token &&
      typeof window !== "undefined"
    ) {
      window.localStorage.setItem(AUTH_TOKEN_KEY, hasil.data.token);
    } else if (action === "logout" && typeof window !== "undefined") {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
    }

    return hasil;
  } catch (error) {
    console.error("Kesalahan API:", error);

    throw new Error(
      error?.message ||
        "Tidak dapat terhubung ke server. Periksa koneksi atau URL API.",
    );
  }
}

/* =========================================================
 * PENGUJIAN KONEKSI
 * ======================================================= */

export function pingApi() {
  return request({
    action: "ping",
  });
}

/* =========================================================
 * MASTER SAMPAH
 * ======================================================= */

export function getMasterSampah() {
  return request({
    action: "master_sampah",
  });
}

export function tambahMasterSampah(payload) {
  return request({
    method: "POST",
    action: "tambah_master_sampah",
    body: payload,
  });
}

export function ubahMasterSampah(payload) {
  return request({
    method: "POST",
    action: "ubah_master_sampah",
    body: payload,
  });
}

export function hapusMasterSampah(kode) {
  return request({
    method: "POST",
    action: "hapus_master_sampah",
    body: {
      kode,
    },
  });
}

/* =========================================================
 * KELOMPOK
 * ======================================================= */

export function getKelompokAktif() {
  return request({
    action: "kelompok_aktif",
  });
}

export function tambahKelompok(payload) {
  return request({
    method: "POST",
    action: "tambah_kelompok",
    body: payload,
  });
}

export function aktifkanKelompok(idKelompok) {
  return request({
    method: "POST",
    action: "aktifkan_kelompok",
    body: {
      id_kelompok: idKelompok,
    },
  });
}

export function hapusKelompok(idKelompok) {
  return request({
    method: "POST",
    action: "hapus_kelompok",
    body: {
      id_kelompok: idKelompok,
    },
  });
}

/* =========================================================
 * AUTENTIKASI
 * ======================================================= */

export function loginOperator({ username, password }) {
  return request({
    method: "POST",
    action: "login_operator",
    body: {
      username,
      password,
    },
  });
}

export function loginWarga({ username, no_hp }) {
  return request({
    method: "POST",
    action: "login_warga",
    body: {
      username,
      no_hp,
    },
  });
}

export function logoutApi() {
  return request({
    method: "POST",
    action: "logout",
  });
}

export function resetPasswordApi(payload) {
  return request({
    method: "POST",
    action: "reset_password",
    body: payload,
  });
}

/* =========================================================
 * PENGELOLA (OPERATOR)
 * ======================================================= */

// export async function getPengelolaList() {
//   try {
//     const res1 = await request({
//       action: "akun",
//     });
//     if (res1?.success || !(res1?.message && String(res1.message).toLowerCase().includes("tidak ditemukan"))) {
//       return res1;
//     }
//     throw new Error("Fallback to get_akun");
//   } catch (err) {
//     return await request({
//       action: "get_akun",
//     });
//   }
// }

export async function getPengelolaList() {
  try {
    const res1 = await request({
      action: "akun",
    });

    if (
      res1?.success ||
      !(res1?.message &&
        String(res1.message).toLowerCase().includes("tidak ditemukan"))
    ) {
      return res1;
    }

    throw new Error("Fallback to get_akun");
  } catch (err) {
    const res2 = await request({
      action: "get_akun",
    });

    return res2;
  }
}

export function getDetailPengelola(idOperator) {
  return request({
    action: "detail_akun",
    params: {
      id_operator: idOperator,
    },
  });
}

export function tambahPengelola(payload) {
  return request({
    method: "POST",
    action: "tambah_akun",
    body: payload,
  });
}

export function ubahPengelola(payload) {
  return request({
    method: "POST",
    action: "ubah_akun",
    body: payload,
  });
}

export function hapusPengelola(idOperator) {
  return request({
    method: "POST",
    action: "hapus_akun",
    body: {
      id_operator: idOperator,
    },
  });
}

/* =========================================================
 * WARGA
 * ======================================================= */

export function getProfilWarga(username) {
  return request({
    action: "profil_warga",
    params: {
      username,
    },
  });
}

export function getRiwayatSetoran(username) {
  return request({
    action: "riwayat_setoran",
    params: {
      username,
    },
  });
}

export function getWargaList() {
  return request({
    action: "get_warga",
  });
}

export function tambahWarga(payload) {
  return request({
    method: "POST",
    action: "tambah_warga",
    body: payload,
  });
}

export function ubahWarga(payload) {
  return request({
    method: "POST",
    action: "ubah_warga",
    body: payload,
  });
}

export function hapusWarga(idWarga) {
  return request({
    method: "POST",
    action: "hapus_warga",
    body: {
      id_warga: idWarga,
    },
  });
}

/* =========================================================
 * SETORAN SAMPAH
 * ======================================================= */

export function submitSetoran(payload) {
  return request({
    method: "POST",
    action: "simpan_setoran",
    body: payload,
  });
}

export function getDetailSetoran(idSetoran) {
  return request({
    action: "detail_setoran",
    params: {
      id_setoran: idSetoran,
    },
  });
}

export function getRiwayatTransaksi() {
  return request({
    action: "riwayat_transaksi",
  });
}

export function batalkanSetoran(idSetoran) {
  return request({
    method: "POST",
    action: "batalkan_setoran",
    body: {
      id_setoran: idSetoran,
    },
  });
}

/* =========================================================
 * STOK DAN PENJUALAN
 * ======================================================= */

export function getStok() {
  return request({
    action: "stok",
  });
}

export function submitPenjualan(payload) {
  return request({
    method: "POST",
    action: "simpan_penjualan",
    body: payload,
  });
}

/* =========================================================
 * DASHBOARD
 * ======================================================= */

export function getDashboardData() {
  return request({
    action: "dashboard",
  });
}

/* =========================================================
 * KAS DAN KEUANGAN
 * ======================================================= */

export function getSaldoKas() {
  return request({
    action: "saldo_kas",
  });
}

export function getRiwayatKas() {
  return request({
    action: "riwayat_kas",
  });
}

export function getLaporan(bulan, tahun) {
  return request({
    action: "laporan",
    params: {
      bulan,
      tahun,
    },
  });
}

export function submitBiaya(payload) {
  return request({
    method: "POST",
    action: "catat_biaya",
    body: payload,
  });
}

export function submitDanaMasuk(payload) {
  return request({
    method: "POST",
    action: "catat_dana_masuk",
    body: payload,
  });
}

/* =========================================================
 * PENGUMUMAN
 * ======================================================= */

export function getPengumuman() {
  return request({
    action: "pengumuman",
  });
}

export function tambahPengumuman(payload) {
  return request({
    method: "POST",
    action: "tambah_pengumuman",
    body: payload,
  });
}

export function ubahPengumuman(payload) {
  return request({
    method: "POST",
    action: "ubah_pengumuman",
    body: payload,
  });
}

export function hapusPengumuman(idPengumuman) {
  return request({
    method: "POST",
    action: "hapus_pengumuman",
    body: {
      id_pengumuman: idPengumuman,
    },
  });
}

/* =========================================================
 * POIN
 * ======================================================= */

export function submitTukarPoin(payload) {
  return request({
    method: "POST",
    action: "tukar_poin",
    body: payload,
  });
}

export function getRiwayatTukarPoin(username = null) {
  return request({
    action: "riwayat_tukar_poin",
    params: username ? { username } : {},
  });
}

/* =========================================================
 * UTILITAS
 * ======================================================= */

export function ujiApi({ method = "GET", action, params = {}, body = null }) {
  return request({
    method,
    action,
    params,
    body,
  });
}

/* =========================================================
 * KATALOG SEMBAKO
 * ======================================================= */

export function getKatalog() {
  return request({
    action: "get_katalog",
  });
}

export function getKatalogAdmin() {
  return request({
    action: "get_katalog_admin",
  });
}

export function tambahKatalog(payload) {
  return request({
    method: "POST",
    action: "tambah_katalog",
    body: payload,
  });
}

export function ubahKatalog(payload) {
  return request({
    method: "POST",
    action: "ubah_katalog",
    body: payload,
  });
}

export function hapusKatalog(idKatalog) {
  return request({
    method: "POST",
    action: "hapus_katalog",
    body: {
      id_katalog: idKatalog,
    },
  });
}

export function getApiBaseUrl() {
  return getConfiguredApiBaseUrl();
}


