<template>
  <div class="min-h-screen bg-[#f7f8f7] max-w-md mx-auto pb-24 text-slate-900">
    <!-- Header -->
    <header class="bg-white px-6 pt-8 pb-6 border-b border-gray-100">
      <div class="flex items-center gap-3">
        <router-link
          to="/dashboard"
          class="w-11 h-11 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 transition"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-6 w-6"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </router-link>
        <div>
          <h1 class="text-2xl font-bold text-green-900 leading-tight">
            Profil
          </h1>
          <p class="text-sm text-gray-500">Kelola akun admin dan warga</p>
        </div>
      </div>
    </header>

    <main class="px-6 py-6 pb-28">
      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="flex flex-col items-center justify-center py-12"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#08704f"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="animate-spin h-8 w-8 mb-3"
        >
          <polyline points="23 4 23 10 17 10" />
          <polyline points="1 20 1 14 7 14" />
          <path
            d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
          />
        </svg>
        <p class="text-sm text-gray-500">Memuat data...</p>
      </div>

      <template v-if="!isLoading">
        <!-- Profil Pengelola Saat Ini -->
        <section
          class="bg-white rounded-[24px] p-6 mb-5 shadow-sm border border-gray-100"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#147052"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-8 w-8"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-bold text-slate-900">
                {{ currentOperator.nama || "Pengelola" }}
              </h2>
              <p class="text-sm text-gray-500">
                @{{ currentOperator.username || "-" }}
              </p>
            </div>
          </div>
        </section>

        <!-- Tab Jenis Akun -->
        <section class="mb-5 grid grid-cols-2 rounded-2xl bg-slate-200 p-1">
          <button
            type="button"
            class="rounded-xl px-4 py-3 text-sm font-semibold transition"
            :class="
              activeTab === 'admin'
                ? 'bg-white text-green-800 shadow-sm'
                : 'text-slate-500'
            "
            @click="switchTab('admin')"
          >
            Admin
          </button>
          <button
            type="button"
            class="rounded-xl px-4 py-3 text-sm font-semibold transition"
            :class="
              activeTab === 'warga'
                ? 'bg-white text-green-800 shadow-sm'
                : 'text-slate-500'
            "
            @click="switchTab('warga')"
          >
            Warga
          </button>
        </section>

        <!-- Tombol Tambah Akun -->
        <section class="mb-5">
          <button
            type="button"
            @click="openAddModal"
            class="flex w-full items-center justify-between rounded-[22px] bg-[#08704f] px-5 py-4 text-white shadow-[0_8px_18px_rgba(8,112,79,0.22)] transition active:scale-[0.98]"
          >
            <span class="flex items-center gap-3">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-7 w-7"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
              <span class="text-[18px] font-semibold">
                {{ activeTab === "admin" ? "Tambah Admin" : "Tambah Warga" }}
              </span>
            </span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-7 w-7"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </section>

        <!-- Daftar Akun -->
        <section>
          <h3 class="text-[18px] font-medium mb-4">
            {{ activeTab === "admin" ? "Daftar Admin" : "Daftar Warga" }}
          </h3>

          <div
            v-if="activeList.length === 0"
            class="rounded-2xl bg-white p-8 text-center shadow-sm border border-gray-100"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#687481"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-12 w-12 mx-auto mb-3 text-gray-400"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <p class="text-sm text-gray-500">
              {{
                activeTab === "admin"
                  ? "Belum ada akun admin"
                  : "Belum ada akun warga"
              }}
            </p>
          </div>

          <div class="space-y-3">
            <div
              v-for="(p, i) in activeList"
              :key="getItemId(p) || i"
              class="flex items-center gap-3 rounded-[22px] bg-white px-4 py-4 shadow-sm border border-gray-100"
            >
              <div
                class="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-green-50"
              >
                <span class="text-lg font-bold text-green-700">{{
                  getInitials(p.nama || p.username)
                }}</span>
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-[16px] font-medium">
                  {{ p.nama || "Tanpa Nama" }}
                </p>
                <p class="truncate text-[14px] text-gray-500">
                  @{{ p.username || "-" }}
                </p>
                <div class="mt-1 flex items-center gap-2">
                  <span
                    class="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] capitalize text-slate-600"
                  >
                    {{ activeTab }}
                  </span>
                  <span
                    v-if="activeTab === 'admin'"
                    class="rounded-full px-2 py-0.5 text-[11px] capitalize"
                    :class="
                      String(p.status).toLowerCase() === 'aktif'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    "
                  >
                    {{ p.status || "nonaktif" }}
                  </span>
                  <span
                    v-else
                    class="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] text-amber-700"
                  >
                    {{ Number(p.poin || 0) }} poin
                  </span>
                </div>
                <p
                  v-if="activeTab === 'warga'"
                  class="mt-1 truncate text-[11px] text-gray-400"
                >
                  {{ Number(p.total_kg || 0) }} kg ·
                  {{ formatRupiah(p.total_rupiah || 0) }}
                </p>
              </div>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="openEditModal(p)"
                  class="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="h-4 w-4"
                  >
                    <path
                      d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                    />
                    <path
                      d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  @click="confirmDelete(p)"
                  class="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="h-4 w-4"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path
                      d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>
      </template>

      <!-- Tombol Logout -->
      <section class="mt-8">
        <button
          type="button"
          @click="handleLogout"
          class="flex w-full items-center justify-center gap-3 rounded-[22px] border border-red-200 bg-red-50 px-5 py-4 text-red-600 transition active:scale-[0.98]"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-6 w-6"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span class="text-[16px] font-semibold">Keluar</span>
        </button>
      </section>
    </main>
  </div>

  <!-- Modal Tambah / Edit Akun -->
  <Teleport to="body">
    <div
      v-if="showForm"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
      @click.self="closeForm"
    >
      <div
        class="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[24px] bg-white p-5 shadow-2xl relative"
      >
        <!-- Modal Header -->
        <div class="mb-5 flex items-center justify-between">
          <h3 class="text-[19px] font-semibold">
            {{ formTitle }}
          </h3>
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-[#687481]"
            @click="closeForm"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-6 w-6"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <!-- Form -->
        <div class="space-y-4">
          <!-- Nama -->
          <div>
            <label class="mb-1 block text-[14px] text-[#687481]"> Nama </label>
            <input
              v-model="formData.nama"
              type="text"
              class="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#147052]"
              placeholder="Nama lengkap"
            />
          </div>

          <!-- Username -->
          <div>
            <label class="block text-[14px] text-[#687481] mb-1"
              >Username</label
            >
            <input
              v-model="formData.username"
              type="text"
              class="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#147052]"
              placeholder="Username untuk login"
            />
          </div>

          <!-- No HP -->
          <div>
            <label class="block text-[14px] text-[#687481] mb-1">No HP</label>
            <input
              v-model="formData.no_hp"
              type="tel"
              class="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#147052]"
              placeholder="Nomor handphone"
            />
          </div>

          <!-- Status -->
          <div v-if="activeTab === 'admin'">
            <label class="mb-1 block text-[14px] text-[#687481]">Status</label>
            <select
              v-model="formData.status"
              class="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#147052]"
            >
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </div>

          <!-- Password -->
          <div v-if="activeTab === 'admin'">
            <label class="block text-[14px] text-[#687481] mb-1">{{
              isEditing
                ? "Password Baru (biarkan kosong jika tidak diganti)"
                : "Password"
            }}</label>
            <input
              v-model="formData.password"
              type="password"
              class="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#147052]"
              :placeholder="
                isEditing
                  ? 'Kosongkan jika tidak diganti'
                  : 'Minimal 6 karakter'
              "
            />
          </div>

          <div
            v-if="activeTab === 'warga'"
            class="rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs leading-relaxed text-blue-700"
          >
            Warga login menggunakan username dan nomor HP tanpa password. Poin,
            total kilogram, dan total rupiah dibuat otomatis dengan nilai awal
            0.
          </div>
        </div>

        <!-- Error Banner -->
        <div
          v-if="formError"
          class="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700"
        >
          <p class="font-bold flex items-center gap-1">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-4 w-4"
            >
              <path
                d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
              />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            {{ formError }}
          </p>
        </div>

        <!-- Modal Actions -->
        <div class="mt-6 flex gap-2">
          <button
            type="button"
            class="w-1/3 rounded-xl bg-slate-100 py-3 text-sm font-medium text-[#687481]"
            @click="closeForm"
            :disabled="isSubmitting"
          >
            Batal
          </button>
          <button
            type="button"
            @click="submitForm"
            :disabled="isSubmitting"
            class="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-[#08704f] py-3 text-sm font-semibold text-white transition active:scale-[0.98] disabled:opacity-50"
          >
            <svg
              v-if="isSubmitting"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="animate-spin h-5 w-5"
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path
                d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
              />
            </svg>
            <span>{{
              isSubmitting
                ? "Menyimpan..."
                : isEditing
                  ? "Simpan Perubahan"
                  : "Tambah Akun"
            }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Modal Konfirmasi Hapus -->
  <Teleport to="body">
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
      @click.self="showDeleteConfirm = false"
    >
      <div class="w-full max-w-sm rounded-[24px] bg-white p-6 shadow-2xl">
        <div class="text-center">
          <div
            class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#dc2626"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-7 w-7"
            >
              <polyline points="3 6 5 6 21 6" />
              <path
                d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
              />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-slate-900">Hapus Akun</h3>
          <p class="mt-2 text-sm text-gray-500">
            Apakah Anda yakin ingin menghapus akun
            <strong>{{ deleteTarget?.nama || deleteTarget?.username }}</strong
            >? Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>
        <div class="mt-6 flex gap-3">
          <button
            type="button"
            class="flex-1 rounded-xl bg-slate-100 py-3 text-sm font-medium text-[#687481]"
            @click="showDeleteConfirm = false"
            :disabled="isDeleting"
          >
            Batal
          </button>
          <button
            type="button"
            @click="handleDelete"
            :disabled="isDeleting"
            class="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition active:scale-[0.98] disabled:opacity-50"
          >
            <svg
              v-if="isDeleting"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="animate-spin h-5 w-5"
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path
                d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
              />
            </svg>
            <span>{{ isDeleting ? "Menghapus..." : "Ya, Hapus" }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, inject } from "vue";
import { useRouter } from "vue-router";
import {
  getPengelolaList,
  tambahPengelola,
  ubahPengelola,
  hapusPengelola,
  getWargaList,
  tambahWarga,
  ubahWarga,
  hapusWarga,
} from "../services/api";

const router = useRouter();
const showModal = inject("showModal") || window.showModal;

const isLoading = ref(true);
const isSubmitting = ref(false);
const isDeleting = ref(false);
const showForm = ref(false);
const showDeleteConfirm = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const deleteTarget = ref(null);
const formError = ref("");
const activeTab = ref("admin");
const pengelolaList = ref([]);
const wargaList = ref([]);

// Ambil data operator yang login dari localStorage
const currentOperator = computed(() => {
  try {
    const data = localStorage.getItem("operator");
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
});

const formData = ref({
  nama: "",
  username: "",
  no_hp: "",
  password: "",
  status: "aktif",
});

const activeList = computed(() =>
  activeTab.value === "admin" ? pengelolaList.value : wargaList.value,
);

const formTitle = computed(() => {
  const jenis = activeTab.value === "admin" ? "Admin" : "Warga";
  return isEditing.value ? `Edit ${jenis}` : `Tambah ${jenis}`;
});

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function resetForm() {
  formData.value = {
    nama: "",
    username: "",
    no_hp: "",
    password: "",
    status: "aktif",
  };
  formError.value = "";
  isEditing.value = false;
  editingId.value = null;
}

function openAddModal() {
  resetForm();
  showForm.value = true;
}

function switchTab(tab) {
  if (tab !== "admin" && tab !== "warga") return;
  closeForm();
  showDeleteConfirm.value = false;
  deleteTarget.value = null;
  activeTab.value = tab;
}

function getItemId(item) {
  return activeTab.value === "admin" ? item?.id_operator : item?.id_warga;
}

function openEditModal(p) {
  formData.value = {
    nama: p.nama || "",
    username: p.username || "",
    no_hp: p.no_hp || "",
    password: "",
    status: p.status || "aktif",
  };
  isEditing.value = true;
  editingId.value =
    activeTab.value === "admin" ? p.id_operator || "" : p.id_warga || "";
  formError.value = "";
  showForm.value = true;
}

function closeForm() {
  showForm.value = false;
  resetForm();
}

function confirmDelete(p) {
  deleteTarget.value = p;
  showDeleteConfirm.value = true;
}

async function loadPengelolaList() {
  try {
    const res = await getPengelolaList();

    const daftarAkun = res?.akun || res?.data?.akun;

    if (res?.success && Array.isArray(daftarAkun)) {
      pengelolaList.value = daftarAkun;
    } else if (Array.isArray(daftarAkun)) {
      pengelolaList.value = daftarAkun;
    } else {
      pengelolaList.value = [];
    }
  } catch (err) {
    console.error("Gagal memuat daftar pengelola", err);
    pengelolaList.value = [];
  }
}

async function loadWargaList() {
  try {
    const res = await getWargaList();

    if (res?.success && Array.isArray(res.data)) {
      wargaList.value = res.data;
    } else {
      wargaList.value = [];
    }
  } catch (err) {
    console.error("Gagal memuat daftar warga", err);
    wargaList.value = [];
  }
}

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

async function submitForm() {
  formError.value = "";

  if (!formData.value.nama.trim()) {
    formError.value = "Nama harus diisi.";
    return;
  }
  if (!formData.value.username.trim()) {
    formError.value = "Username harus diisi.";
    return;
  }
  if (!formData.value.no_hp.trim()) {
    formError.value = "Nomor HP harus diisi.";
    return;
  }
  if (
    activeTab.value === "admin" &&
    !isEditing.value &&
    !formData.value.password.trim()
  ) {
    formError.value = "Password harus diisi.";
    return;
  }
  if (
    activeTab.value === "admin" &&
    formData.value.password.trim() &&
    formData.value.password.trim().length < 6
  ) {
    formError.value = "Password minimal 6 karakter.";
    return;
  }

  isSubmitting.value = true;
  try {
    let res;

    const dataDasar = {
      nama: formData.value.nama.trim(),
      username: formData.value.username.trim(),
      no_hp: formData.value.no_hp.trim(),
    };

    if (activeTab.value === "admin" && isEditing.value) {
      res = await ubahPengelola({
        ...dataDasar,
        id_operator: editingId.value,
        role: "admin",
        status: formData.value.status,
        ...(formData.value.password.trim()
          ? { password: formData.value.password.trim() }
          : {}),
      });
    } else if (activeTab.value === "admin") {
      res = await tambahPengelola({
        ...dataDasar,
        password: formData.value.password.trim(),
        role: "admin",
        status: formData.value.status,
      });
    } else if (isEditing.value) {
      res = await ubahWarga({
        ...dataDasar,
        id_warga: editingId.value,
      });
    } else {
      res = await tambahWarga(dataDasar);
    }

    if (res?.success || res?.data?.success) {
      const jenis = activeTab.value === "admin" ? "admin" : "warga";

      await showModal({
        title: "Berhasil",
        message: isEditing.value
          ? `Akun ${jenis} berhasil diperbarui.`
          : `Akun ${jenis} baru berhasil ditambahkan.`,
      });
      closeForm();

      if (activeTab.value === "admin") {
        await loadPengelolaList();
      } else {
        await loadWargaList();
      }
    } else {
      formError.value = res?.message || res?.data?.message || "Gagal menyimpan data akun.";
    }
  } catch (err) {
    formError.value = err.message || "Terjadi kesalahan server.";
  } finally {
    isSubmitting.value = false;
  }
}

async function handleDelete() {
  if (!deleteTarget.value) return;

  isDeleting.value = true;
  try {
    const jenis = activeTab.value === "admin" ? "admin" : "warga";
    const id = getItemId(deleteTarget.value);

    if (!id) {
      throw new Error(`ID ${jenis} tidak ditemukan.`);
    }

    const res =
      activeTab.value === "admin"
        ? await hapusPengelola(id)
        : await hapusWarga(id);

    if (res?.success || res?.data?.success) {
      await showModal({
        title: "Berhasil",
        message: `Akun ${jenis} berhasil dihapus.`,
      });
      showDeleteConfirm.value = false;
      deleteTarget.value = null;

      if (activeTab.value === "admin") {
        await loadPengelolaList();
      } else {
        await loadWargaList();
      }
    } else {
      await showModal({
        title: "Gagal",
        message: res?.message || res?.data?.message || "Gagal menghapus akun.",
      });
    }
  } catch (err) {
    await showModal({
      title: "Gagal",
      message: err.message || "Terjadi kesalahan server.",
    });
  } finally {
    isDeleting.value = false;
  }
}

function handleLogout() {
  localStorage.removeItem("operator");
  router.push("/login");
}

onMounted(async () => {
  try {
    await Promise.all([loadPengelolaList(), loadWargaList()]);
  } finally {
    isLoading.value = false;
  }
});
</script>
