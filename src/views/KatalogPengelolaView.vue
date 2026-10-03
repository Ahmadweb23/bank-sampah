<template>
  <div class="min-h-screen bg-[#f7f8f7] max-w-md mx-auto pb-24 text-slate-900">
    <header class="bg-white px-6 pt-8 pb-5 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Pengelola</p>
          <h1 class="text-2xl font-bold text-[#003A36]">Katalog Sembako</h1>
        </div>
        <button
          @click="goBack"
          class="w-11 h-11 rounded-full flex items-center justify-center bg-green-50 text-green-800"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-5 w-5"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      </div>
    </header>

    <main class="px-6 py-6">
      <section class="mb-5">
        <div class="flex items-center justify-between mb-3">
          <div>
            <p class="text-sm uppercase tracking-wide text-gray-500">
              Kelola Katalog
            </p>
            <h2 class="text-lg font-semibold text-slate-900">
              Daftar Item Katalog
            </h2>
          </div>
          <button
            type="button"
            @click="openForm('create')"
            class="rounded-2xl bg-[#003A36] px-4 py-2 text-sm font-semibold text-white"
          >
            + Tambah
          </button>
        </div>

        <div class="relative">
          <div
            class="absolute inset-y-0 left-4 flex items-center pointer-events-none"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6b7280"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-5 w-5"
            >
              <circle cx="11" cy="11" r="6" />
              <path d="m20 20-4.2-4.2" />
            </svg>
          </div>
          <input
            v-model="search"
            type="text"
            placeholder="Cari barang..."
            class="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-100 bg-white shadow-sm outline-none focus:ring-2 focus:ring-green-100"
          />
        </div>
      </section>

      <section class="mb-5">
        <div
          class="rounded-[24px] bg-white p-4 shadow-sm border border-gray-100"
        >
          <p class="text-sm text-gray-500">Total Item</p>
          <p class="text-2xl font-bold text-slate-900 mt-2">
            {{ catalogItems.length }}
          </p>
        </div>
      </section>

      <p v-if="listError" role="alert" class="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{{ listError }}</p>
      <p v-if="notice" role="status" class="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-800">{{ notice }}</p>

      <section class="space-y-3">
        <p v-if="loading" class="py-8 text-center text-sm text-gray-500">Memuat katalog...</p>
        <p v-else-if="!filteredItems.length && !listError" class="rounded-2xl bg-white p-6 text-center text-sm text-gray-500">Belum ada item katalog.</p>
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="rounded-[24px] border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div class="flex items-start gap-3">
            <div
              class="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center overflow-hidden shrink-0"
            >
              <img
                :src="item.image"
                :alt="item.nama"
                class="h-full w-full object-cover"
              />
            </div>

            <div class="flex-1">
              <div>
                <h3 class="font-semibold text-slate-900">{{ item.nama }}</h3>
                <p class="text-sm text-gray-500 mt-1">
                  {{ item.kategori }} • {{ item.satuan }}
                </p>
              </div>

              <div class="mt-3 flex items-center justify-between">
                <div class="flex items-center gap-2 text-green-800">
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
                      d="M12 3 14.5 8 20 8l-4.5 3.5 1.5 6-5-3.5-5 3.5 1.5-6L4 8h5.5L12 3Z"
                    />
                  </svg>
                  <span class="font-semibold">{{ item.poin }} Poin</span>
                </div>
                <span class="text-xs text-gray-500">Stok: {{ item.stok }} · {{ item.status }}</span>
                <div class="flex gap-2">
                  <button
                    type="button"
                    @click="openForm('edit', item)"
                    class="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-[#147052]"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    @click="confirmDelete(item)"
                    class="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <Teleport to="body">
      <div
        v-if="showForm"
        class="fixed inset-0 z-50 flex items-center justify-center px-4"
      >
        <div class="absolute inset-0 bg-black/40" @click="closeForm"></div>
        <div
          class="relative w-full max-w-xl overflow-hidden rounded-[28px] bg-white p-6 shadow-2xl"
        >
          <div class="mb-4 flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Form Katalog</p>
              <h3 class="text-xl font-semibold text-slate-900">
                {{
                  formMode === "create"
                    ? "Tambah Item Katalog"
                    : "Ubah Item Katalog"
                }}
              </h3>
            </div>
            <button
              type="button"
              @click="closeForm"
              class="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
            >
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700"
                >Nama Produk</label
              >
              <input
                v-model="formData.nama"
                type="text"
                placeholder="Beras Premium"
                class="w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-700"
                  >Kategori</label
                >
                <input
                  v-model="formData.kategori"
                  type="text"
                  placeholder="Sembako"
                  class="w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                />
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-700"
                  >Satuan</label
                >
                <input
                  v-model="formData.satuan"
                  type="text"
                  placeholder="5kg"
                  class="w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                />
              </div>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700"
                >Poin</label
              >
              <input
                v-model.number="formData.poin"
                type="number"
                min="0"
                placeholder="150"
                class="w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <label class="block text-sm font-medium text-slate-700">
                Stok
                <input v-model.number="formData.stok" type="number" min="0" step="1" class="mt-2 w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3" />
              </label>
              <label class="block text-sm font-medium text-slate-700">
                Status
                <select v-model="formData.status" class="mt-2 w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3">
                  <option value="AKTIF">Aktif</option>
                  <option value="NONAKTIF">Nonaktif</option>
                </select>
              </label>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700"
                >Gambar</label
              >
              <div class="grid gap-3 sm:grid-cols-2">
                <div class="space-y-3">
                  <button
                    type="button"
                    @click="chooseImage"
                    class="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Pilih file gambar
                  </button>

                  <select
                    v-model="formData.image"
                    class="w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                  >
                    <option disabled value="">Pilih gambar publik</option>
                    <option
                      v-for="src in availableImages"
                      :key="src"
                      :value="src"
                    >
                      {{ src.replace("/images/sembako/", "") }}
                    </option>
                  </select>
                </div>

                <div v-if="formData.image" class="space-y-2">
                  <label class="mb-2 block text-sm font-medium text-slate-700"
                    >Preview</label
                  >
                  <div
                    class="h-28 w-full overflow-hidden rounded-2xl border border-gray-200 bg-slate-50"
                  >
                    <img
                      :src="formData.image"
                      alt="Preview gambar"
                      class="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <input
                ref="imageInputRef"
                type="file"
                accept="image/*"
                @change="onImagePicked"
                class="hidden"
              />

              <p class="mt-2 text-xs text-slate-500">
                Pilih gambar dari file lokal atau gunakan daftar publik.
              </p>
            </div>

            <p v-if="formError" class="text-sm font-semibold text-rose-700">
              {{ formError }}
            </p>
          </div>

          <div class="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              @click="closeForm"
              class="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 sm:w-1/3"
            >
              Batal
            </button>
            <button
              type="button"
              :disabled="saving"
              @click="saveItem"
              class="w-full rounded-2xl bg-[#003A36] px-4 py-3 text-sm font-semibold text-white transition active:scale-[0.98] sm:w-2/3"
            >
              {{ saving ? "Menyimpan..." : formMode === "create" ? "Tambah Item" : "Simpan Perubahan" }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <BottomNav />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import BottomNav from "../components/BottomNav.vue";
import { getKatalogAdmin, hapusKatalog, tambahKatalog, ubahKatalog } from "../services/api";

const router = useRouter();
const search = ref("");
const imageInputRef = ref(null);
const showForm = ref(false);
const formMode = ref("create");
const formError = ref("");
const listError = ref("");
const notice = ref("");
const loading = ref(false);
const saving = ref(false);

const availableImages = [
  "/images/sembako/beras.jpg",
  "/images/sembako/minyak.jpg",
  "/images/sembako/gula.jpg",
  "/images/sembako/garam.jpg",
];

const formData = ref({
  id: null,
  nama: "",
  kategori: "",
  satuan: "",
  poin: 0,
  stok: 0,
  image: "",
  status: "AKTIF",
});

const catalogItems = ref([]);

function assertSuccess(response) {
  if (response?.success === false) throw new Error(response.message || "Permintaan tidak berhasil.");
}

async function loadCatalog() {
  loading.value = true;
  listError.value = "";
  try {
    const response = await getKatalogAdmin();
    assertSuccess(response);
    const rows = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
    catalogItems.value = rows.map((item) => ({
      ...item,
      id: item.id_katalog,
      poin: Number(item.poin) || 0,
      stok: Number(item.stok) || 0,
      status: String(item.status || "AKTIF").toUpperCase(),
    }));
  } catch (error) {
    listError.value = error.message || "Katalog tidak dapat dimuat.";
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  formError.value = "";
  formData.value = {
    id: null,
    nama: "",
    kategori: "",
    satuan: "",
    poin: 0,
    stok: 0,
    image: "",
    status: "AKTIF",
  };
}

function openForm(mode, item = null) {
  formMode.value = mode;
  resetForm();

  if (mode === "edit" && item) {
    formData.value = { ...item };
  }

  showForm.value = true;
}

function closeForm() {
  showForm.value = false;
  resetForm();
}

function validateForm() {
  if (!formData.value.nama.trim()) {
    formError.value = "Nama produk harus diisi.";
    return false;
  }
  if (!formData.value.kategori.trim()) {
    formError.value = "Kategori harus diisi.";
    return false;
  }
  if (!formData.value.satuan.trim()) {
    formError.value = "Satuan harus diisi.";
    return false;
  }
  if (formData.value.poin < 0) {
    formError.value = "Poin tidak boleh negatif.";
    return false;
  }
  if (formData.value.stok < 0) {
    formError.value = "Stok tidak boleh negatif.";
    return false;
  }
  if (!formData.value.image.trim()) {
    formError.value = "Path gambar harus diisi.";
    return false;
  }
  formError.value = "";
  return true;
}

async function saveItem() {
  if (!validateForm()) {
    return;
  }

  saving.value = true;
  formError.value = "";
  notice.value = "";
  const payload = {
    nama: formData.value.nama,
    kategori: formData.value.kategori,
    satuan: formData.value.satuan,
    poin: Number(formData.value.poin),
    stok: Number(formData.value.stok),
    image: formData.value.image,
    status: formData.value.status,
  };
  try {
    const response = formMode.value === "create"
      ? await tambahKatalog(payload)
      : await ubahKatalog({ ...payload, id_katalog: formData.value.id_katalog });
    assertSuccess(response);
    notice.value = response?.message || (formMode.value === "create" ? "Item katalog ditambahkan." : "Item katalog diperbarui.");
    closeForm();
    await loadCatalog();
  } catch (error) {
    formError.value = error.message || "Item katalog tidak dapat disimpan.";
  } finally {
    saving.value = false;
  }
}

function chooseImage() {
  if (imageInputRef.value) {
    imageInputRef.value.value = null;
    imageInputRef.value.click();
  }
}

function onImagePicked(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    formData.value.image = reader.result;
  };
  reader.readAsDataURL(file);
}

async function confirmDelete(item) {
  const confirmed = window.confirm(`Hapus item katalog '${item.nama}'?`);
  if (!confirmed) return;
  notice.value = "";
  listError.value = "";
  try {
    const response = await hapusKatalog(item.id_katalog);
    assertSuccess(response);
    notice.value = response?.message || "Item katalog dihapus.";
    await loadCatalog();
  } catch (error) {
    listError.value = error.message || "Item katalog tidak dapat dihapus.";
  }
}

const filteredItems = computed(() => {
  const keyword = search.value.toLowerCase();
  return catalogItems.value.filter((item) => {
    return (
      item.nama.toLowerCase().includes(keyword) ||
      item.kategori.toLowerCase().includes(keyword) ||
      item.satuan.toLowerCase().includes(keyword)
    );
  });
});

function goBack() {
  router.push("/dashboard");
}

onMounted(loadCatalog);
</script>
