# Dokumentasi API Backend
## Sistem Digital Bank Sampah Bojong Karya 2

### Base URL
```
https://script.google.com/macros/s/AKfycbw13u-bnwmrVeFIpdLHAtbOXnlBIg5_qwX-9KmnZ5lBTWQJA2YeltT7c8xFz7B6B3k_/exec
```

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
**GET**
```
?action=login_warga&username=budi&no_hp=08123456789
```

**Response**
```json
{
    "success": true,
    "data": {
        "nama": "Budi",
        "username": "budi",
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
```json
{
    "action": "tambah_warga",
    "nama": "Budi",
    "username": "budi",
    "no_hp": "08123456789"
}
```

---

## SETORAN

### 1. Simpan Setoran
**POST**
```json
{
    "action": "simpan_setoran",
    "username": "budi",
    "items": [
        {
            "kode": "PLS",
            "berat": 3.5
        },
        {
            "kode": "KRD",
            "berat": 5
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
        "total_kg": 8.5,
        "total_rupiah": 16500,
        "total_poin": 16500
    }
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