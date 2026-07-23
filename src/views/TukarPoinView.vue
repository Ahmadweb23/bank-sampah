<template>
  <div class="min-h-screen bg-background px-4 text-on-surface md:px-0 pb-24">
    <div class="mx-auto max-w-md">
      <header class="flex items-center justify-between py-4">
        <div></div>
        <h1 class="font-headline-md text-headline-md text-primary">
          Bank Sampah
        </h1>
        <button @click="$router.back()" class="text-on-surface-variant">
          <span class="material-symbols-outlined">close</span>
        </button>
      </header>

      <div class="rounded-2xl bg-white p-4 soft-float">
        <h2 class="text-lg font-semibold text-center">
          Tukarkan Poin Berhasil
        </h2>
        <p class="text-sm text-on-surface-variant text-center mt-2">
          Sembako sudah dapat diserahkan kepada warga.
        </p>

        <div
          class="mt-4 rounded-2xl bg-surface-container p-4 flex items-center justify-between"
        >
          <div>
            <p class="text-sm text-on-surface-variant">Total Poin Dipotong</p>
            <p class="mt-2 text-2xl font-bold text-primary">150 Poin</p>
          </div>
          <div
            class="w-16 h-16 bg-white rounded-lg flex items-center justify-center soft-float"
          >
            <span class="material-symbols-outlined text-primary">star</span>
          </div>
        </div>

        <div class="mt-4">
          <p class="text-sm font-medium">Rincian Sembako</p>
          <div class="mt-2 space-y-2">
            <div
              class="rounded-xl bg-white p-3 soft-float flex items-center justify-between"
            >
              <div>
                <p class="font-medium">Beras Premium</p>
                <p class="text-sm text-on-surface-variant">1 Pack (5kg)</p>
              </div>
              <p class="text-sm font-semibold">100 Poin</p>
            </div>
            <div
              class="rounded-xl bg-white p-3 soft-float flex items-center justify-between"
            >
              <div>
                <p class="font-medium">Gula Pasir</p>
                <p class="text-sm text-on-surface-variant">1 Pack (1kg)</p>
              </div>
              <p class="text-sm font-semibold">50 Poin</p>
            </div>
          </div>
        </div>

        <div class="mt-4 grid grid-cols-2 gap-3">
          <div class="rounded-2xl bg-surface-container p-3">
            <p class="text-sm text-on-surface-variant">ID Transaksi</p>
            <p class="font-semibold">#TRX-99210</p>
          </div>
          <div class="rounded-2xl bg-surface-container p-3">
            <p class="text-sm text-on-surface-variant">Waktu</p>
            <p class="font-semibold">Hari ini, 10:45</p>
          </div>
        </div>

        <div
          class="mt-4 rounded-2xl bg-primary p-3 text-white flex items-center gap-3"
        >
          <img src="https://i.pravatar.cc/40" class="w-10 h-10 rounded-full" />
          <div>
            <p class="font-medium">Penerima Sembako</p>
            <p class="font-semibold">Ibu Siti Aminah</p>
          </div>
        </div>

        <div class="mt-4 flex flex-col gap-3">
          <button
            @click="$router.push('/transaksi')"
            class="w-full rounded-2xl bg-primary py-3 text-white font-semibold"
          >
            Transaksi Baru
          </button>
          <div class="flex gap-3">
            <button
              @click="printReceipt"
              class="flex-1 rounded-2xl bg-white py-3 text-primary border border-surface-container"
            >
              Cetak Struk
            </button>
            <button
              @click="shareReceipt"
              class="flex-1 rounded-2xl bg-white py-3 text-primary border border-surface-container"
            >
              Bagikan
            </button>
          </div>
          <button
            class="mt-2 text-center text-sm text-on-surface-variant"
            @click="$router.push('/dashboard')"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// demo transaction data (would come from props or store in real app)
const trx = ref({
  id: "#TRX-99210",
  time: "Hari ini, 10:45",
  points: 150,
  items: [
    { name: "Beras Premium", qty: "1 Pack (5kg)", points: 100 },
    { name: "Gula Pasir", qty: "1 Pack (1kg)", points: 50 },
  ],
  receiver: { name: "Ibu Siti Aminah" },
});

function buildReceiptHtml(data) {
  const itemsHtml = data.items
    .map(
      (i) =>
        `<tr><td style="padding:8px">${i.name}<div style="font-size:12px;color:#6b7280">${i.qty}</div></td><td style="padding:8px;text-align:right">${i.points} Poin</td></tr>`,
    )
    .join("");
  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Struk Tukar Poin</title>
        <style>body{font-family:Inter,Arial,Helvetica,sans-serif;padding:20px;color:#0f172a} .card{border-radius:12px;padding:16px;border:1px solid #e6eef7}</style>
      </head>
      <body>
        <h2>Bank Sampah - Struk Tukar Poin</h2>
        <p>ID: ${data.id}</p>
        <p>Waktu: ${data.time}</p>
        <div class="card" style="margin-top:12px">
          <h3>Total Poin Dipotong: ${data.points} Poin</h3>
          <table style="width:100%;margin-top:8px;border-collapse:collapse">${itemsHtml}</table>
          <div style="margin-top:12px;padding:12px;background:#003a36;color:white;border-radius:8px">Penerima: ${data.receiver.name}</div>
        </div>
      </body>
    </html>
  `;
}

function printReceipt() {
  const html = buildReceiptHtml(trx.value);
  const w = window.open("", "_blank", "noopener");
  if (!w) {
    alert("Pop-up diblokir. Izinkan pop-up untuk mencetak struk.");
    return;
  }
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => {
    w.print();
  }, 300);
}

async function shareReceipt() {
  const text = `Struk Tukar Poin\nID: ${trx.value.id}\nTotal: ${trx.value.points} Poin\nPenerima: ${trx.value.receiver.name}`;
  if (navigator.share) {
    try {
      await navigator.share({ title: "Struk Tukar Poin", text });
    } catch (e) {
      alert("Bagikan dibatalkan atau tidak tersedia.");
    }
    return;
  }

  // Fallback: copy to clipboard
  try {
    await navigator.clipboard.writeText(text);
    alert(
      "Teks struk telah disalin ke clipboard. Anda dapat menempel untuk membagikannya.",
    );
  } catch (e) {
    alert("Tidak dapat mengakses clipboard.");
  }
}
</script>
