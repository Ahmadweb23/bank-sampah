# PANDUAN PENGEMBANGAN & VIBE CODING
# SISTEM DIGITAL BANK SAMPAH BOJONG KARYA 2

---

# 1. KONTEKS SISTEM

Sistem Digital Bank Sampah Bojong Karya 2 adalah aplikasi web sederhana untuk operasional bank sampah tingkat dusun/desa. Sistem digunakan untuk mencatat setoran sampah warga, penjualan kepada pengepul, pengelolaan kas, dan pembuatan laporan sederhana.

## Pengguna Sistem

### Pengelola
Satu-satunya pengguna operasional yang memiliki akses penuh terhadap seluruh fitur.

### Warga
Hanya dapat masuk menggunakan username dan nomor HP untuk melihat:
- Total poin
- Riwayat setoran
- Estimasi nilai rupiah
- Informasi dan pengumuman bank sampah

Warga tidak dapat mencatat transaksi atau mengubah data.

---

# 2. TUJUAN PENGEMBANGAN

- Mempermudah pencatatan transaksi bank sampah.
- Mengurangi pencatatan manual.
- Menyediakan laporan kas dan hasil kegiatan.
- Memberikan transparansi poin kepada warga.
- Menjadi MVP yang benar-benar dapat digunakan oleh pengelola desa.

---

# 3. ARSITEKTUR SISTEM

```text
Vue 3 + Vite (Frontend)
        │
        ▼
Google Apps Script API (Backend)
        │
        ▼
Google Sheets (Database)
```

## Teknologi
- Frontend : Vue 3 + Vite
- Hosting : Vercel
- Backend API : Google Apps Script Web App
- Database : Google Sheets
- Bahasa : Indonesia

---

# 4. FITUR UTAMA

## Pengelola
1. Dashboard
2. Kelompok kegiatan
3. Kategori dan harga sampah
4. Penerimaan sampah warga
5. Penjualan kepada pengepul
6. Pencatatan biaya
7. Pencatatan dana masuk
8. Pembatalan transaksi
9. Rekonsiliasi kas
10. Laporan
11. Pengumuman untuk warga

## Warga
1. Masuk dengan username dan nomor HP
2. Melihat poin
3. Melihat riwayat setoran
4. Melihat estimasi rupiah
5. Melihat informasi bank sampah

---

# 5. STRUKTUR FOLDER FINAL

```text
src/
├── modules/
│   ├── master/
│   ├── transaksi/
│   └── keuangan/
│
├── services/
│   └── api.js
├── router/
├── views/
└── assets/
```

---

## 6. PEMBAGIAN MODUL SISTEM

### 6.1 Modul Master
Modul ini bertanggung jawab terhadap data referensi yang digunakan oleh seluruh sistem.

Fitur:
- Data pengelola
- Kelompok kegiatan
- Harga sampah
- Kategori sampah

### 6.2 Modul Transaksi
Modul ini bertanggung jawab terhadap seluruh proses operasional bank sampah.

Fitur:
- Penerimaan sampah warga
- Penjualan kepada pengepul
- Riwayat transaksi
- Pembatalan transaksi
- Pengelolaan stok sampah

### 6.3 Modul Keuangan
Modul ini bertanggung jawab terhadap pencatatan dan pelaporan keuangan.

Fitur:
- Biaya operasional
- Dana masuk
- Rekonsiliasi kas
- Penutupan periode
- Laporan keuangan
- Pengelolaan saldo kas

# 7. STRUKTUR GOOGLE SHEETS

| Sheet | Fungsi |
|---|---|
| warga | Data warga dan poin |
| kelompok_kegiatan | Batch kegiatan |
| kategori_sampah | Daftar kategori |
| harga_sampah | Harga beli dan jual |
| setoran | Header setoran |
| setoran_detail | Detail setoran |
| penjualan | Header penjualan |
| penjualan_detail | Detail penjualan |
| kas | Uang masuk dan keluar |
| rekonsiliasi | Pencocokan kas |
| pengumuman | Informasi untuk warga |
| audit_log | Log sistem |

---

# 8. ATURAN PENGEMBANGAN

1. Jangan mengakses Google Sheets langsung dari frontend.
2. Semua request harus melalui `services/api.js`.
3. Gunakan Composition API.
4. Gunakan JavaScript biasa (bukan TypeScript).
5. Gunakan Tailwind CSS.
6. Fokus pada fitur yang ada di dokumen ini.
7. Hindari over-engineering dan fitur tambahan yang tidak diperlukan.

---

# 9. VIBE CODING

## Prinsip Utama
- Simpel lebih baik daripada kompleks.
- Cepat selesai lebih baik daripada terlalu banyak abstraksi.
- UI harus nyaman di HP Android.
- Satu fungsi = satu tanggung jawab.
- Prioritaskan stabilitas dan kemudahan penggunaan.

## Jangan
- Menambahkan role baru.
- Membuat autentikasi rumit.
- Menambahkan realtime yang tidak diperlukan.
- Membuat struktur yang sulit dipahami pengelola desa.

---

# 10. CONTOH REQUEST API

## Setoran
```json
{
  "action": "setoran",
  "namaWarga": "Rahmat",
  "rt": "07",
  "items": [
    {
      "kategori": "Kardus",
      "berat": 5
    }
  ]
}
```

## Penjualan
```json
{
  "action": "penjualan",
  "namaPengepul": "Pengepul Jaya",
  "items": [
    {
      "kategori": "Kardus",
      "berat": 20,
      "hargaJual": 2500
    }
  ]
}
```

---

# 11. CHECKLIST INTEGRASI

- [ ] Endpoint merespons JSON valid
- [ ] Tidak ada error console
- [ ] Validasi form berjalan
- [ ] Double submit dicegah
- [ ] Data tersimpan di sheet yang benar
- [ ] UI mobile tetap rapi
- [ ] Nomor transaksi otomatis
- [ ] Pembatalan membalik kas dan stok
- [ ] Laporan tampil dengan benar

---

# 12. DEFINITION OF DONE

Fitur dianggap selesai jika:

- Build berhasil di Vercel
- Tidak ada error runtime
- Data tersimpan dengan benar
- Data dapat ditampilkan kembali
- Sudah diuji di HP Android
- Sudah direview minimal oleh 1 anggota tim

---

# 13. PROMPT STANDAR UNTUK AI

```text
Saya sedang mengembangkan Sistem Digital Bank Sampah Bojong Karya 2.

Arsitektur:
- Frontend: Vue 3 + Vite
- Hosting: Vercel
- Backend: Google Apps Script API
- Database: Google Sheets
- Bahasa: Indonesia

Modul yang saya kerjakan: [PENGELOLA / WARGA / TRANSAKSI / KEUANGAN]

Aturan:
- Jangan mengakses Google Sheets langsung dari frontend.
- Semua request melalui services/api.js.
- Gunakan Composition API.
- Gunakan JavaScript biasa (bukan TypeScript).
- Gunakan Tailwind CSS.
- Buat kode sederhana dan siap pakai.
- Fokus hanya pada fitur yang tercantum di dokumen panduan proyek.
```

---

# 14. KEPUTUSAN FINAL

Sistem yang dikembangkan adalah aplikasi web sederhana untuk operasional Bank Sampah Bojong Karya 2 dengan satu pengguna utama (Pengelola) dan portal warga yang hanya berfungsi untuk melihat poin, riwayat setoran, dan informasi bank sampah. Seluruh pengembangan harus mengikuti prinsip sederhana, mudah digunakan, dan konsisten dengan dokumen ini.


## 15. REFERENSI UI

Seluruh tampilan antarmuka (UI/UX) mengikuti file HTML dan PNG yang berada pada folder `UI/`.

File tersebut menjadi **source of truth visual** untuk pengembangan frontend.

Aturan:
- Ikuti struktur layout, urutan informasi, dan alur interaksi pada file HTML/PNG.
- Fokus pada implementasi fungsi dan integrasi data.
- Jika terdapat perbedaan antara deskripsi dokumen dan referensi UI, gunakan referensi UI sebagai acuan tampilan.

Folder referensi UI:

```text
UI/
├── admin_login/
├── admin_registration/
├── beranda_transaksi/
├── catat_biaya/
├── dashboard_warga_utama/
├── informasi_riwayat_poin_warga/
├── jual_ke_pengepul/
├── jual_ke_pengepul_updated_flow/
├── katalog_sembako_warga/
├── laporan/
├── onboarding_warga_input_data/
├── riwayat_transaksi_with_date_filters/
├── terima_sampah_input_dinamis_annotated/
├── terima_sampah_periksa_simpan_poin_refined/
├── terima_sampah_pilih_sampah_point_system_refined/
├── terima_sampah_warga/
├── terima_sampah_warga_modern_stepper/
├── tukar_poin_berhasil/
└── tukar_sembako_refined_selection_management/
```

Tujuan penggunaan referensi UI adalah menjaga konsistensi tampilan tanpa perlu menjelaskan detail desain kepada AI atau programmer.