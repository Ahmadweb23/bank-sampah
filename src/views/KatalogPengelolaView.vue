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
              Kelola Stok
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

      <section class="grid grid-cols-2 gap-4 mb-5">
        <div
          class="rounded-[24px] bg-white p-4 shadow-sm border border-gray-100"
        >
          <p class="text-sm text-gray-500">Total Item</p>
          <p class="text-2xl font-bold text-slate-900 mt-2">
            {{ catalogItems.length }}
          </p>
        </div>
        <div
          class="rounded-[24px] bg-white p-4 shadow-sm border border-gray-100"
        >
          <p class="text-sm text-gray-500">Stok Menipis</p>
          <p class="text-2xl font-bold text-amber-600 mt-2">
            {{ lowStockCount }}
          </p>
        </div>
      </section>

      <section class="space-y-3">
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
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h3 class="font-semibold text-slate-900">{{ item.nama }}</h3>
                  <p class="text-sm text-gray-500 mt-1">
                    {{ item.kategori }} • {{ item.satuan }}
                  </p>
                </div>
                <span
                  class="rounded-full px-2.5 py-1 text-xs font-semibold"
                  :class="
                    item.stok < 5
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-green-50 text-green-700'
                  "
                >
                  Stok {{ item.stok }}
                </span>
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

            <div class="grid gap-4 sm:grid-cols-2">
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
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-700"
                  >Stok</label
                >
                <input
                  v-model.number="formData.stok"
                  type="number"
                  min="0"
                  placeholder="12"
                  class="w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                />
              </div>
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
              @click="saveItem"
              class="w-full rounded-2xl bg-[#003A36] px-4 py-3 text-sm font-semibold text-white transition active:scale-[0.98] sm:w-2/3"
            >
              {{ formMode === "create" ? "Tambah Item" : "Simpan Perubahan" }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <BottomNav />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import BottomNav from "../components/BottomNav.vue";

const router = useRouter();
const search = ref("");
const imageInputRef = ref(null);
const showForm = ref(false);
const formMode = ref("create");
const formError = ref("");

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
});

const catalogItems = ref([
  {
    id: 1,
    nama: "Beras Premium",
    kategori: "Sembako",
    satuan: "5kg",
    poin: 150,
    stok: 12,
    image: "/images/sembako/beras.jpg",
  },
  {
    id: 2,
    nama: "Minyak Goreng",
    kategori: "Sembako",
    satuan: "1L",
    poin: 180,
    stok: 4,
    image: "/images/sembako/minyak.jpg",
  },
  {
    id: 3,
    nama: "Gula Pasir",
    kategori: "Sembako",
    satuan: "1kg",
    poin: 160,
    stok: 7,
    image: "/images/sembako/gula.jpg",
  },
  {
    id: 4,
    nama: "Garam",
    kategori: "Sembako",
    satuan: "500g",
    poin: 50,
    stok: 2,
    image: "/images/sembako/garam.jpg",
  },
]);

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

function saveItem() {
  if (!validateForm()) {
    return;
  }

  if (formMode.value === "create") {
    const nextId = catalogItems.value.length
      ? Math.max(...catalogItems.value.map((item) => item.id)) + 1
      : 1;
    catalogItems.value.push({
      ...formData.value,
      id: nextId,
    });
  } else {
    const index = catalogItems.value.findIndex(
      (item) => item.id === formData.value.id,
    );
    if (index !== -1) {
      catalogItems.value[index] = { ...formData.value };
    }
  }

  closeForm();
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

function confirmDelete(item) {
  const confirmed = window.confirm(`Hapus item katalog '${item.nama}'?`);
  if (confirmed) {
    catalogItems.value = catalogItems.value.filter(
      (catalogItem) => catalogItem.id !== item.id,
    );
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

const lowStockCount = computed(
  () => catalogItems.value.filter((item) => item.stok < 5).length,
);

function goBack() {
  router.push("/dashboard");
}
</script>
