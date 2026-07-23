<template>
  <div class="min-h-screen bg-[#eef4ff] max-w-md mx-auto pb-28 text-slate-900">
    <main class="px-6 pt-6 pb-4">
      <header
        class="mb-6 flex items-center justify-between gap-4 rounded-[28px] bg-white px-5 py-5 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)] border border-slate-200"
      >
        <div class="flex items-center gap-3">
          <div
            class="h-12 w-12 rounded-3xl bg-green-50 flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#147052" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
              <circle cx="12" cy="8" r="3.4" />
              <path d="M5.5 19c1.3-3 3.4-4.4 6.5-4.4s5.2 1.4 6.5 4.4" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">
              Informasi & Riwayat
            </p>
            <h1 class="text-xl font-semibold text-slate-900">
              Warga Bank Sampah
            </h1>
          </div>
        </div>

        <button
          class="h-11 w-11 rounded-2xl bg-slate-100 text-slate-600 shadow-sm flex items-center justify-center"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
            <path d="M10 5a2 2 0 0 1 4 0 4 4 0 0 0 3.9 4h.1v1.6c0 .8.2 1.5.6 2.2l1.2 1.7a1 1 0 0 1-.8 1.5H7.9a1 1 0 0 1-.8-1.5L8.3 9.4c.3-.7.5-1.4.5-2.2V9A4 4 0 0 0 10 5Z" />
            <path d="M10 17a2 2 0 0 0 4 0" />
            <circle cx="17.5" cy="6.5" r="2" fill="#147052" stroke="none" />
          </svg>
        </button>
      </header>

      <section
        class="mb-5 rounded-[32px] bg-white p-5 shadow-sm border border-gray-100"
      >
        <div class="flex items-center justify-between mb-5">
          <div>
            <p class="text-sm font-semibold text-slate-900">Riwayat Poin</p>
            <p class="text-xs text-slate-500">Lihat semua</p>
          </div>
          <span
            class="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-800"
            >Terbaru</span
          >
        </div>

        <div class="space-y-3">
          <div class="rounded-3xl border border-slate-200 p-4 shadow-sm">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div
                  class="h-11 w-11 rounded-3xl bg-green-50 flex items-center justify-center"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="#147052" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
                    <path d="M7 7a4 4 0 0 1 7 1" />
                    <path d="M11 6H7v4" />
                    <path d="M17 17a4 4 0 0 1-7-1" />
                    <path d="M13 18h4v-4" />
                  </svg>
                </div>
                <div>
                  <p class="font-semibold text-slate-900">
                    Setoran Botol Plastik
                  </p>
                  <p class="text-sm text-slate-500">12 Okt 2023 · 14:20</p>
                </div>
              </div>
              <p class="text-lg font-semibold text-green-700">+45 Poin</p>
            </div>
          </div>

          <div class="rounded-3xl border border-slate-200 p-4 shadow-sm">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div
                  class="h-11 w-11 rounded-3xl bg-slate-100 flex items-center justify-center"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
                    <path d="M5 6h14l-1 7H7L5 6Z" />
                    <circle cx="10" cy="18" r="1.2" fill="#64748b" stroke="none" />
                    <circle cx="17" cy="18" r="1.2" fill="#64748b" stroke="none" />
                  </svg>
                </div>
                <div>
                  <p class="font-semibold text-slate-900">Tukar Beras 5kg</p>
                  <p class="text-sm text-slate-500">08 Okt 2023 · 09:15</p>
                </div>
              </div>
              <p class="text-lg font-semibold text-red-600">-150 Poin</p>
            </div>
          </div>

          <div class="rounded-3xl border border-slate-200 p-4 shadow-sm">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div
                  class="h-11 w-11 rounded-3xl bg-green-50 flex items-center justify-center"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="#147052" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
                    <path d="M7 3h6l4 4v14H7z" />
                    <path d="M13 3v4h4" />
                  </svg>
                </div>
                <div>
                  <p class="font-semibold text-slate-900">
                    Setoran Koran & Kertas
                  </p>
                  <p class="text-sm text-slate-500">03 Okt 2023 · 16:45</p>
                </div>
              </div>
              <p class="text-lg font-semibold text-green-700">+28 Poin</p>
            </div>
          </div>
        </div>
      </section>

      <section
        class="mb-5 rounded-[32px] bg-white p-5 shadow-sm border border-gray-100"
      >
        <p class="mb-4 text-sm font-semibold text-slate-900">
          Informasi Bank Sampah
        </p>
        <div class="overflow-hidden rounded-[28px] bg-white">
          <iframe
            title="Lokasi Bank Sampah"
            src="https://www.google.com/maps?q=-6.164774,107.28062&z=16&output=embed"
            class="h-40 w-full border-0"
            allowfullscreen=""
            loading="lazy"
          ></iframe>
        </div>

        <div class="mt-4 space-y-4">
          <div
            class="flex items-center gap-3 rounded-[26px] bg-[#f9fbff] p-4 shadow-sm border border-slate-200"
          >
            <span
              class="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-50 text-pink-600"
              ><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
                <path d="M7 4h4l2 4-2 2a13 13 0 0 0 5 5l2-2 4 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2h4Z" />
              </svg></span
            >
            <div>
              <p class="text-sm text-slate-500">WhatsApp Center</p>
              <p class="font-semibold text-slate-900">+62 812-3456-7890</p>
            </div>
          </div>

          <div
            class="flex items-center gap-3 rounded-[26px] bg-[#f9fbff] p-4 shadow-sm border border-slate-200"
          >
            <span
              class="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700"
              ><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
                <circle cx="12" cy="12" r="8.5" />
                <path d="M12 7.5v5l3 2" />
              </svg></span
            >
            <div>
              <p class="text-sm text-slate-500">Jam Operasional</p>
              <p class="font-semibold text-slate-900">
                Senin - Sabtu (08:00 - 16:00)
              </p>
            </div>
          </div>

          <div
            class="flex items-center gap-3 rounded-[26px] bg-[#f9fbff] p-4 shadow-sm border border-slate-200"
          >
            <span
              class="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"
              ><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
                <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" />
                <circle cx="12" cy="11" r="2.2" />
              </svg></span
            >
            <div>
              <p class="text-sm text-slate-500">Alamat Kantor</p>
              <p class="font-semibold text-slate-900">
                DUSUN BOJONG KARYA 2, RT 010, RW 000, DESA RENGASDENGKLOK
                SELATAN, KECAMATAN RENGASDENGKLOK SELATAN.
              </p>
              <a
                href="https://www.google.com/maps/place/6%C2%B009'53.2%22S+107%C2%B016'50.2%22E/@-6.164774,107.28062,697m"
                target="_blank"
                rel="noreferrer"
                class="text-xs text-slate-500 mt-1 inline-block hover:text-slate-900"
              >
                Lihat di Google Maps • 6°09'53.2"S 107°16'50.2"E
              </a>
            </div>
          </div>
        </div>

        <div class="mt-5 grid gap-3">
          <button
            class="w-full rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm"
            @click="openWhatsApp"
          >
            Hubungi via WhatsApp
          </button>
          <button
            class="w-full rounded-3xl bg-emerald-900 px-4 py-3 text-sm font-semibold text-white shadow-sm"
            @click="openGoogleMaps"
          >
            Buka di Google Maps
          </button>
        </div>
      </section>

      <section
        class="rounded-[32px] bg-gradient-to-b from-emerald-900 to-emerald-800 p-5 text-white shadow-sm"
      >
        <p class="text-lg font-semibold">Yuk, Ajak Tetangga!</p>
        <p class="mt-3 text-sm text-white/80">
          Dapatkan bonus 50 poin untuk setiap warga baru yang bergabung melalui
          kode referral Anda.
        </p>
        <button
          class="mt-5 w-full rounded-3xl bg-white px-4 py-3 text-sm font-semibold text-emerald-950"
          @click="copyReferralCode"
        >
          Bagikan Kode
        </button>
      </section>
    </main>

    <BottomNavWarga />
  </div>
</template>

<script setup>
import { ref } from "vue";
import BottomNavWarga from '../components/BottomNavWarga.vue'

function openWhatsApp() {
  window.open("https://wa.me/6281234567890", "_blank");
}

function openGoogleMaps() {
  window.open(
    "https://www.google.com/maps/place/6%C2%B009'53.2%22S+107%C2%B016'50.2%22E/@-6.164774,107.28062,697m",
    "_blank",
  );
}

function copyReferralCode() {
  const code = "REF12345";
  navigator.clipboard.writeText(code).catch(() => null);
  alert(`Kode referral disalin: ${code}`);
}
</script>
