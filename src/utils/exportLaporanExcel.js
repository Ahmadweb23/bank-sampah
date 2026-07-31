import * as XLSX from "xlsx";
import {
  getWargaList,
  getMasterSampah,
  getRiwayatTransaksi,
  getStok,
  getLaporan,
  getDetailSetoran,
} from "../services/api";

const NAMA_BULAN = [
  "JANUARI",
  "FEBRUARI",
  "MARET",
  "APRIL",
  "MEI",
  "JUNI",
  "JULI",
  "AGUSTUS",
  "SEPTEMBER",
  "OKTOBER",
  "NOVEMBER",
  "DESEMBER",
];

function extractArray(res) {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.data?.transaksi)) return res.data.transaksi;
  return [];
}

function isInMonth(dateStr, bulan, tahun) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;
  return d.getMonth() + 1 === Number(bulan) && d.getFullYear() === Number(tahun);
}

function labelBulan(bulan, tahun) {
  const idx = Number(bulan) - 1;
  const nama = NAMA_BULAN[idx] || "BULAN";
  return `BULAN ${nama} ${tahun}`;
}

function formatTanggalExcel(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function parseKategori(keterangan = "") {
  const ket = String(keterangan);
  const match = ket.match(/^\[([^\]]+)\]/);
  if (match) return match[1];
  if (/penjualan/i.test(ket)) return "Penjualan";
  if (/setoran|pembayaran warga/i.test(ket)) return "Pembayaran Warga";
  if (/investasi|dana masuk/i.test(ket)) return "Dana Masuk";
  if (/listrik|bensin|operasional/i.test(ket)) return "Operasional";
  return "Lain-lain";
}

function isMasuk(jenis) {
  return String(jenis || "")
    .toUpperCase()
    .trim() === "MASUK";
}

function appendRows(sheet, rows, startRow = 0) {
  rows.forEach((row, ri) => {
    row.forEach((val, ci) => {
      const addr = XLSX.utils.encode_cell({ r: startRow + ri, c: ci });
      sheet[addr] = {
        t: typeof val === "number" ? "n" : "s",
        v: val ?? "",
      };
    });
  });
  const maxR = startRow + rows.length - 1;
  const maxC = Math.max(...rows.map((r) => r.length - 1), 0);
  sheet["!ref"] = XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: maxR, c: maxC },
  });
  return sheet;
}

function buildMasterWarga(wargaList) {
  const rows = [
    ["MASTER DATA WARGA"],
    [],
    [],
    ["ID Warga", "Nama Warga", "RT", "Nomor HP", "Status", "Keterangan"],
  ];

  wargaList.forEach((w) => {
    rows.push([
      w.id_warga || "",
      w.nama || "",
      w.rt ? `RT ${w.rt}` : "",
      w.no_hp || "",
      "Aktif",
      "",
    ]);
  });

  return appendRows({}, rows);
}

function buildMasterJenisSampah(masterList) {
  const rows = [
    ["MASTER JENIS SAMPAH DAN POIN"],
    [],
    [],
    [
      "Jenis Sampah",
      "Satuan",
      "Harga Acuan/Satuan",
      "Nilai 1 Poin",
      "Poin per Satuan",
      "Nilai Setoran/Satuan",
      "Status",
    ],
  ];

  masterList.forEach((m) => {
    const hargaBeli = Number(m.harga_beli) || 0;
    const nilaiPoin = 100;
    rows.push([
      m.nama_kategori || m.nama || "",
      "kg",
      hargaBeli,
      nilaiPoin,
      hargaBeli > 0 ? Math.round(hargaBeli / nilaiPoin) : 0,
      hargaBeli,
      m.status || "AKTIF",
    ]);
  });

  return appendRows({}, rows);
}

function buildTransaksiWarga(setoranList, masterList, bulan, tahun) {
  const jenisNames = masterList.map((m) => m.nama_kategori || m.nama || "");
  const headerRow4 = [
    "ID Transaksi",
    "Tanggal",
    "Nama Warga",
    "RT",
    "Jumlah Sampah per Jenis",
    ...Array(Math.max(jenisNames.length - 1, 0)).fill(""),
    "Total Berat (kg)",
    "Galon (pcs)",
    "Poin Diperoleh",
    "Nilai/Poin",
    "Saldo Warga",
    "Nilai Persediaan",
    "Status",
    "Keterangan",
  ];

  const subHeader = ["", "", "", "", ...jenisNames];
  while (subHeader.length < headerRow4.length) subHeader.push("");

  const rows = [
    ["TRANSAKSI SETORAN WARGA"],
    [labelBulan(bulan, tahun)],
    [],
    headerRow4,
    subHeader,
  ];

  setoranList.forEach((s) => {
    const jenisCols = jenisNames.map(() => "");
    const totalKg = Number(s.total_kg) || 0;
    const totalRupiah = Number(s.total_rupiah) || 0;
    const nilaiPoin = 100;
    const poin = nilaiPoin > 0 ? Math.round(totalRupiah / nilaiPoin) : 0;

    rows.push([
      s.id_setoran || s.id || "",
      formatTanggalExcel(s.tanggal),
      s.nama_warga || s.nama || "",
      s.rt ? `RT ${s.rt}` : "",
      ...jenisCols,
      totalKg,
      "",
      poin,
      nilaiPoin,
      totalRupiah,
      totalRupiah,
      s.status || "SELESAI",
      "",
    ]);
  });

  return appendRows({}, rows);
}

function buildPenjualan(penjualanList, masterList, bulan, tahun) {
  const masterMap = Object.fromEntries(
    masterList.map((m) => [String(m.kode), m]),
  );

  const rows = [
    ["PENJUALAN KE PENGEPUL"],
    [labelBulan(bulan, tahun)],
    [],
    [
      "Id Transaksi",
      "Tanggal",
      "Nama Pengepul",
      "Jenis Sampah",
      "Satuan",
      "Jumlah Terjual(Kg)",
      "Harga Jual/Satuan",
      "Total Penjualan",
      "HPP/Satuan",
      "Total HPP",
      "Margin Kotor",
      "Status",
      "Bukti",
      "Keterangan",
    ],
  ];

  penjualanList.forEach((p) => {
    const kg = Number(p.total_kg) || 0;
    const total = Number(p.total_rupiah) || 0;
    const hargaJual = kg > 0 ? Math.round(total / kg) : 0;
    const hppSatuan = Number(masterMap[1]?.harga_beli) || 0;
    const totalHpp = Math.round(kg * hppSatuan);

    rows.push([
      p.id_penjualan || "",
      formatTanggalExcel(p.tanggal),
      p.nama_pengepul || p.nama || "",
      "Campuran",
      "kg",
      kg,
      hargaJual,
      total,
      hppSatuan,
      totalHpp,
      total - totalHpp,
      p.status || "SELESAI",
      "",
      "",
    ]);
  });

  return appendRows({}, rows);
}

function buildPersediaan(stokList, masterList, bulan, tahun) {
  const rows = [
    ["REKAP PERSEDIAAN SAMPAH"],
    [labelBulan(bulan, tahun)],
    [],
    [
      "Jenis Sampah",
      "Satuan",
      "Jumlah Masuk",
      "Jumlah Terjual",
      "Stok Akhir",
      "HPP/Satuan",
      "Nilai Persediaan Masuk",
      "Total HPP Terjual",
      "Nilai Stok Akhir",
    ],
  ];

  masterList.forEach((m) => {
    const kode = String(m.kode);
    const stokItem = stokList.find((s) => String(s.kode) === kode);
    const stokAkhir = Number(stokItem?.stok) || 0;
    const hpp = Number(m.harga_beli) || 0;

    rows.push([
      m.nama_kategori || m.nama || "",
      "kg",
      "",
      "",
      stokAkhir,
      hpp,
      "",
      "",
      stokAkhir * hpp,
    ]);
  });

  return appendRows({}, rows);
}

function buildPenukaranPoin(bulan, tahun) {
  const rows = [
    ["PENUKARAN POIN WARGA"],
    [labelBulan(bulan, tahun)],
    [],
    [
      "ID Penukaran",
      "Tanggal",
      "Nama Warga",
      "Poin Ditukar",
      "Nilai/Poin",
      "Nilai Penukaran",
      "Bentuk Penukaran",
      "Kas Keluar",
      "Status",
      "Keterangan",
    ],
  ];
  return appendRows({}, rows);
}

function buildKas(transaksiKas, bulan, tahun) {
  const rows = [
    ["KAS BANK SAMPAH"],
    [labelBulan(bulan, tahun)],
    [],
    [
      "ID Transaksi",
      "Tanggal",
      "Jenis Transaksi",
      "Kategori",
      "Keterangan",
      "Kas Masuk",
      "Kas Keluar",
      "Status",
      "Bukti",
    ],
  ];

  transaksiKas.forEach((t, idx) => {
    const masuk = isMasuk(t.jenis);
    rows.push([
      t.referensi || t.id_kas || `KAS-${idx + 1}`,
      formatTanggalExcel(t.tanggal),
      masuk ? "MASUK" : "KELUAR",
      parseKategori(t.keterangan),
      t.keterangan || "",
      masuk ? Number(t.nominal) || 0 : "",
      masuk ? "" : Number(t.nominal) || 0,
      "SELESAI",
      "",
    ]);
  });

  return appendRows({}, rows);
}

function buildSaldoWarga(wargaList, bulan, tahun) {
  const rows = [
    ["REKAP SALDO POIN WARGA"],
    [labelBulan(bulan, tahun)],
    [],
    [
      "ID Warga",
      "Nama Warga",
      "RT",
      "Poin Masuk",
      "Poin Ditukar",
      "Saldo Poin",
      "Nilai Saldo",
      "Status",
    ],
  ];

  wargaList.forEach((w) => {
    const saldoPoin = Number(w.poin) || 0;
    const nilaiSaldo = Number(w.total_nilai_rupiah || w.total_rupiah) || saldoPoin * 100;
    rows.push([
      w.id_warga || "",
      w.nama || "",
      w.rt ? `RT ${w.rt}` : "",
      saldoPoin,
      0,
      saldoPoin,
      nilaiSaldo,
      "Aktif",
    ]);
  });

  return appendRows({}, rows);
}

function buildLabaRugi(transaksiKas, penjualanList, bulan, tahun) {
  let penjualanSampah = 0;
  let pendapatanLain = 0;
  let hppTerjual = 0;

  const beban = {
    angkut: 0,
    karung: 0,
    peralatan: 0,
    alatTulis: 0,
    konsumsi: 0,
    perawatan: 0,
    lain: 0,
  };

  transaksiKas.forEach((t) => {
    const nominal = Number(t.nominal) || 0;
    const ket = String(t.keterangan || "");

    if (isMasuk(t.jenis)) {
      if (/penjualan/i.test(ket)) {
        penjualanSampah += nominal;
      } else {
        pendapatanLain += nominal;
      }
      return;
    }

    const kat = parseKategori(ket).toLowerCase();
    if (kat.includes("angkut")) beban.angkut += nominal;
    else if (kat.includes("karung")) beban.karung += nominal;
    else if (kat.includes("peralatan")) beban.peralatan += nominal;
    else if (kat.includes("alat tulis")) beban.alatTulis += nominal;
    else if (kat.includes("konsumsi")) beban.konsumsi += nominal;
    else if (kat.includes("perawatan")) beban.perawatan += nominal;
    else beban.lain += nominal;
  });

  penjualanList.forEach((p) => {
    hppTerjual += Math.round((Number(p.total_kg) || 0) * 1500);
  });

  const totalPendapatan = penjualanSampah + pendapatanLain;
  const labaKotor = totalPendapatan - hppTerjual;
  const totalBeban = Object.values(beban).reduce((a, b) => a + b, 0);
  const labaBersih = labaKotor - totalBeban;

  const rows = [
    ["LAPORAN LABA RUGI SEDERHANA BANK SAMPAH"],
    [labelBulan(bulan, tahun)],
    [],
    ["KETERANGAN", "JUMLAH"],
    ["PENDAPATAN", ""],
    ["Penjualan Sampah", penjualanSampah],
    ["Pendapatan Lain-lain", pendapatanLain],
    ["Total Pendapatan", totalPendapatan],
    ["", ""],
    ["HARGA POKOK PENJUALAN", ""],
    ["HPP Sampah Terjual", hppTerjual],
    ["Laba Kotor", labaKotor],
    ["", ""],
    ["BEBAN OPERASIONAL", ""],
    ["Beban Angkut", beban.angkut],
    ["Beban Karung", beban.karung],
    ["Beban Peralatan", beban.peralatan],
    ["Beban Alat Tulis", beban.alatTulis],
    ["Beban Konsumsi", beban.konsumsi],
    ["Beban Perawatan", beban.perawatan],
    ["Beban Lain-lain", beban.lain],
    ["Total Beban Operasional", totalBeban],
    ["", ""],
    ["LABA / SURPLUS BERSIH", labaBersih],
  ];

  return appendRows({}, rows);
}

async function fetchSetoranDetails(setoranList) {
  const results = await Promise.allSettled(
    setoranList.slice(0, 50).map(async (s) => {
      const id = s.id_setoran || s.id;
      if (!id) return s;
      try {
        const res = await getDetailSetoran(id);
        if (res?.success && res.data?.detail?.length) {
          return { ...s, detail: res.data.detail };
        }
      } catch (_) {
        /* abaikan */
      }
      return s;
    }),
  );
  return results.map((r, i) => (r.status === "fulfilled" ? r.value : setoranList[i]));
}

export async function exportLaporanExcel(bulan, tahun) {
  const [resWarga, resMaster, resRiwayat, resStok, resLaporan] =
    await Promise.all([
      getWargaList(),
      getMasterSampah(),
      getRiwayatTransaksi(),
      getStok(),
      getLaporan(bulan, tahun),
    ]);

  const wargaList = extractArray(resWarga);
  const masterList = extractArray(resMaster);
  const riwayatAll = extractArray(resRiwayat);
  const stokList = extractArray(resStok);

  let transaksiKas = [];
  if (resLaporan?.success && resLaporan.data?.transaksi) {
    transaksiKas = resLaporan.data.transaksi;
  } else if (Array.isArray(resLaporan?.data)) {
    transaksiKas = resLaporan.data;
  }

  const setoranList = riwayatAll
    .filter((t) => t.tipe === "setoran" && isInMonth(t.tanggal, bulan, tahun))
    .sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));

  const penjualanList = riwayatAll
    .filter((t) => t.tipe === "penjualan" && isInMonth(t.tanggal, bulan, tahun))
    .sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));

  await fetchSetoranDetails(setoranList);

  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, buildMasterWarga(wargaList), "Master Warga");
  XLSX.utils.book_append_sheet(
    wb,
    buildMasterJenisSampah(masterList),
    "Master Jenis Sampah",
  );
  XLSX.utils.book_append_sheet(
    wb,
    buildTransaksiWarga(setoranList, masterList, bulan, tahun),
    "Transaksi Warga",
  );
  XLSX.utils.book_append_sheet(
    wb,
    buildPenjualan(penjualanList, masterList, bulan, tahun),
    "Penjualan",
  );
  XLSX.utils.book_append_sheet(
    wb,
    buildPersediaan(stokList, masterList, bulan, tahun),
    "Persediaan",
  );
  XLSX.utils.book_append_sheet(
    wb,
    buildPenukaranPoin(bulan, tahun),
    "Penukaran Poin",
  );
  XLSX.utils.book_append_sheet(
    wb,
    buildKas(transaksiKas, bulan, tahun),
    "Kas",
  );
  XLSX.utils.book_append_sheet(
    wb,
    buildSaldoWarga(wargaList, bulan, tahun),
    "Saldo Warga",
  );
  XLSX.utils.book_append_sheet(
    wb,
    buildLabaRugi(transaksiKas, penjualanList, bulan, tahun),
    "Laba Rugi",
  );

  const namaBulan = NAMA_BULAN[Number(bulan) - 1] || bulan;
  const filename = `Laporan_Bank_Sampah_${namaBulan}_${tahun}.xlsx`;
  XLSX.writeFile(wb, filename);

  return filename;
}
