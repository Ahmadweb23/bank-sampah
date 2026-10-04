# Dokumentasi API Backend
## Sistem Digital Bank Sampah Bojong Karya 2

### Base URL
```
https://script.google.com/macros/s/AKfycbwYssCv-0szWe1gg0wZ-fKwsfNbYZi6HL-bzSV6HCMawr4fj7pxIuI-W-DHiHcUNoZI/exec
```

Vue menggunakan deployment Apps Script ini sebagai URL default. Untuk memakai
deployment lain, atur `VITE_API_BASE_URL` pada `.env` sebelum menjalankan atau
build aplikasi. Vue tidak lagi menggunakan proxy CodeIgniter.

Setelah login, API mengembalikan token sesi. Vue menyimpan token tersebut dan
mengirimkannya pada request yang memerlukan autentikasi: parameter `token`
untuk GET dan field `token` di body POST. Request tulis dikirim sebagai JSON
dengan content type `text/plain;charset=UTF-8`.

### Deployment
1. Impor workbook spreadsheet ke Google Sheets, lalu buat/buka project Apps
   Script yang terikat ke spreadsheet tersebut.
2. Muat semua file `.gs` dan `appsscript.json` dari folder `appsScript`.
3. Deploy sebagai Web app dengan eksekusi sebagai pemilik spreadsheet dan akses
   yang mengizinkan frontend memanggil endpoint.
4. Salin URL deployment yang berakhiran `/exec` ke `VITE_API_BASE_URL` di `.env`
   (lokal) dan Environment Variables deployment Vue (misalnya Vercel), lalu
   deploy ulang frontend.

### Kompatibilitas workbook
API mendukung header `nama_kategori` pada tab `master_sampah` sebagai alias
untuk nama jenis sampah. Tab katalog dapat bernama `Katalog` atau `katalog`,
menggunakan header `id` maupun `id_katalog`, dan tidak wajib memiliki kolom
`status` (baris tanpa status dianggap aktif). Kolom `username` pada tab `warga`
digunakan secara spesifik saat saldo poin diperbarui.

### Format Response
Semua response menggunakan format berikut.

#### Response Berhasil
```json
{
    "success": true,
    "message": "Berhasil",
    "data": {}
}
```

#### Response Gagal
```json
{
    "success": false,
    "message": "Pesan Error"
}
```

---

## MASTER

### 1. Ambil Master Sampah
**GET**
```
?action=master_sampah
```

**Response**
```json
{
    "success": true,
    "data": [
        {
            "kode": "PLS",
            "nama": "Plastik",
            "harga_beli": 2000,
            "harga_jual": 3000,
            "status": "AKTIF"
        }
    ]
}
```

### 2. Tambah Master Sampah
**POST**
```json
{
    "action": "tambah_master_sampah",
    "kode": "PLS",
    "nama": "Plastik",
    "harga_beli": 2000,
    "harga_jual": 3000
}
```

### 3. Ubah Master Sampah
**POST**
```json
{
    "action": "ubah_master_sampah",
    "kode": "PLS",
    "nama": "Plastik PET",
    "harga_beli": 2200,
    "harga_jual": 3200,
    "status": "AKTIF"
}
```

### 4. Hapus Master Sampah
**POST**
```json
{
    "action": "hapus_master_sampah",
    "kode": "PLS"
}
```

---

## KELOMPOK KEGIATAN

### 1. Ambil Kelompok Aktif
**GET**
```
?action=kelompok_aktif
```

### 2. Tambah Kelompok
**POST**
```json
{
    "action": "tambah_kelompok",
    "nama_kelompok": "Kelompok Juli 2026"
}
```

### 3. Aktifkan Kelompok
**POST**
```json
{
    "action": "aktifkan_kelompok",
    "id_kelompok": "KLP-20260719-0001"
}
```

### 4. Hapus Kelompok
**POST**
```json
{
    "action": "hapus_kelompok",
    "id_kelompok": "KLP-20260719-0001"
}
```

---

## WARGA

### 1. Login
**POST**
```
{
    "action": "login_warga",
    "username": "budi",
    "no_hp": "08123456789"
}
```

**Response**
```json
{
    "success": true,
    "data": {
        "nama": "Budi",
        "username": "budi",
        "token": "token-sesi",
        "poin": 25000,
        "total_setoran_kg": 17,
        "total_nilai_rupiah": 25000
    }
}
```

### 2. Profil Warga
**GET**
```
?action=profil_warga&username=budi
```

### 3. Riwayat Setoran
**GET**
```
?action=riwayat_setoran&username=budi
```

### 4. Tambah Warga
**POST**

Nomor HP bersifat opsional. Warga tanpa nomor HP dapat dilayani operator,
namun login mandiri warga tetap memerlukan username dan nomor HP.

```json
{
    "action": "tambah_warga",
    "nama": "Budi",
    "username": "budi",
    "no_hp": ""
}
```

---

## SETORAN

### 1. Simpan Setoran
**POST**

Nilai setoran dihitung berdasarkan berat dan harga beli masing-masing jenis sampah.
Nasabah menerima 50% dari nilai setoran. Pilih `metode_pembayaran` sebagai
`POIN` (default) untuk mengubah bagian nasabah menjadi poin, dengan 1 poin = Rp100;
mode poin tidak mengubah saldo kas. Pilih `TUNAI` untuk membayar bagian nasabah
langsung sebagai uang tunai; hanya mode ini yang mencatat pengeluaran kas.
Contoh: setoran bernilai Rp3.000 memberi 15 poin tanpa mengubah kas atau
pembayaran tunai Rp1.500 yang mengurangi kas sebesar Rp1.500.

```json
{
    "action": "simpan_setoran",
    "username": "budi",
    "metode_pembayaran": "POIN",
    "items": [
        {
            "kode": "PLS",
            "berat": 2
        }
    ]
}
```

**Response**
```json
{
    "success": true,
    "data": {
        "id_setoran": "STR-20260719-0001",
        "total_kg": 2,
        "total_rupiah": 4000,
        "total_poin": 20,
        "metode_pembayaran": "POIN",
        "nilai_dibayarkan": 0
    }
}
```

Untuk pembayaran langsung, kirim `"metode_pembayaran": "TUNAI"`. Jika nilai
setoran Rp4.000, response berisi `total_poin: 0` dan `nilai_dibayarkan: 2000`.
Pembayaran dicatat sebagai pengeluaran kas Rp2.000 dan dikembalikan ke kas
bila setoran dibatalkan. Pembatalan setoran mode poin tidak mengubah kas.

### Penukaran Poin Menjadi Uang
Operator dapat menukar poin warga menjadi uang tunai melalui action
`tukar_poin`, dengan mengirim `jenis_penukaran: "UANG"` dan `poin_digunakan`.
Nilainya 1 poin = Rp100. Poin dikurangi dan kas keluar dicatat dalam satu
transaksi database.

```json
{
    "action": "tukar_poin",
    "username_warga": "budi",
    "jenis_penukaran": "UANG",
    "poin_digunakan": 150,
    "petugas": "Operator"
}
```

### 2. Detail Setoran
**GET**
```
?action=detail_setoran&id_setoran=STR-20260719-0001
```

### 3. Riwayat Transaksi
**GET**
```
?action=riwayat_transaksi
```

### 4. Batalkan Setoran
**POST**
```json
{
    "action": "batalkan_setoran",
    "id_setoran": "STR-20260719-0001"
}
```

---

## STOK

### Ambil Seluruh Stok
**GET**
```
?action=stok
```

**Response**
```json
{
    "success": true,
    "data": [
        {
            "kode": "PLS",
            "nama": "Plastik",
            "stok": 42.5
        }
    ]
}
```

---

## PENJUALAN

### Simpan Penjualan
**POST**
```json
{
    "action": "simpan_penjualan",
    "nama_pengepul": "Pak Agus",
    "items": [
        {
            "kode": "PLS",
            "berat": 10
        },
        {
            "kode": "KRD",
            "berat": 4
        }
    ]
}
```

---

## KEUANGAN

Saldo kas tidak berkurang saat warga menyetor sampah. Saldo kas berkurang saat
pengeluaran dicatat atau saat poin ditukar; penukaran dicatat sebagai kas keluar
sebesar 100 rupiah untuk setiap poin yang digunakan. Pergerakan kas lama yang
terhubung ke transaksi setoran tidak dihitung dalam saldo.

### 1. Dashboard
**GET**
```
?action=dashboard
```

**Response**
```json
{
    "success": true,
    "data": {
        "total_warga": 12,
        "total_setoran_kg": 156,
        "total_poin": 315000,
        "total_penjualan": 420000,
        "saldo_kas": 105000
    }
}
```

### 2. Saldo Kas
**GET**
```
?action=saldo_kas
```

### 3. Riwayat Kas
**GET**
```
?action=riwayat_kas
```

### 4. Laporan Bulanan
**GET**
```
?action=laporan&bulan=7&tahun=2026
```

### 5. Catat Biaya
**POST**
```json
{
    "action": "catat_biaya",
    "nominal": 50000,
    "keterangan": "Beli Karung"
}
```

### 6. Catat Dana Masuk
**POST**
```json
{
    "action": "catat_dana_masuk",
    "nominal": 100000,
    "keterangan": "Bantuan Desa"
}
```

---

## PENGUMUMAN

### 1. Ambil Pengumuman
**GET**
```
?action=pengumuman
```

### 2. Tambah Pengumuman
**POST**
```json
{
    "action": "tambah_pengumuman",
    "judul": "Jadwal Penimbangan",
    "isi": "Hari Minggu pukul 08.00 WIB"
}
```

### 3. Ubah Pengumuman
**POST**
```json
{
    "action": "ubah_pengumuman",
    "id_pengumuman": "PNG-20260719-0001",
    "judul": "Jadwal Baru",
    "isi": "Hari Sabtu pukul 09.00 WIB",
    "status": "AKTIF"
}
```

### 4. Hapus Pengumuman
**POST**
```json
{
    "action": "hapus_pengumuman",
    "id_pengumuman": "PNG-20260719-0001"
}
```

---

## Catatan untuk Tim Frontend

### Pengelola (Admin)
Menu yang perlu dibuat:
1. Dashboard
2. Master Sampah
3. Kelompok Kegiatan
4. Warga
5. Setoran Sampah
6. Penjualan Sampah
7. Stok Sampah
8. Keuangan
9. Pengumuman

### Warga
- Login menggunakan:
  - Username
  - Nomor HP

- Setelah login, warga hanya dapat melihat:
  1. Profil
  2. Total Poin
  3. Total Setoran
  4. Total Nilai Setoran
  5. Riwayat Setoran
  6. Pengumuman