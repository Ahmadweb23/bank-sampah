<template>
  <div
    class="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(172,239,230,0.35),_transparent_40%),linear-gradient(135deg,_#f8fbff_0%,_#f5f7ff_100%)] flex items-center justify-center px-4 py-8"
  >
    <div
      class="w-full max-w-md rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_20px_50px_rgba(0,58,54,0.12)] backdrop-blur"
    >
      <!-- Logo -->
      <div class="flex flex-col items-center text-center">
        <div
          class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#003A36] text-3xl text-white"
        >
          <span class="material-symbols-outlined">
            account_balance_wallet
          </span>
        </div>

        <h1 class="text-2xl font-semibold text-[#003A36]">Login Warga</h1>

        <p class="mt-2 text-sm text-slate-600">
          Masukkan Username dan Nomor HP untuk masuk ke dashboard Anda.
        </p>
      </div>

      <!-- Form -->
      <div class="mt-8">
        <!-- Username -->
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">
            Username
          </label>
          <div class="relative">
            <UserIcon
              class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#003A36]"
            />
            <input
              v-model="username"
              type="text"
              placeholder="Masukkan Username"
              @keyup.enter="handleLogin"
              class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-11 outline-none transition focus:border-[#003A36]"
            />
          </div>
        </div>

        <!-- Nomor HP -->
        <div class="mt-4">
          <label class="mb-2 block text-sm font-medium text-slate-700">
            Nomor HP
          </label>
          <div class="relative">
            <PhoneIcon
              class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#003A36]"
            />
            <input
              v-model="nomorHp"
              type="text"
              placeholder="08123456789"
              @keyup.enter="handleLogin"
              class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-11 outline-none transition focus:border-[#003A36]"
            />
          </div>
        </div>

        <!-- Tombol -->
        <button
          @click="handleLogin"
          :disabled="loading"
          class="mt-6 flex w-full items-center justify-center rounded-xl bg-[#003A36] px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {{ loading ? "Memuat..." : "Masuk" }}
        </button>

        <!-- Login Pengelola -->
        <div class="mt-5 text-center">
          <router-link
            to="/login"
            class="text-sm font-medium text-[#003A36] underline underline-offset-2 transition hover:text-[#00584F]"
          >
            Login Pengelola
          </router-link>
        </div>

        <!-- Pesan error -->
        <div v-if="error" class="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {{ error }}
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-6 border-t border-slate-200 pt-4 text-center text-sm text-slate-500">
        © 2026 KKN Universitas Buana Perjuangan Karawang
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { UserIcon, PhoneIcon } from "@heroicons/vue/24/solid"
import { loginWarga } from '../services/api'

const router = useRouter()
const username = ref('')
const nomorHp = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  if (!username.value.trim() || !nomorHp.value.trim()) {
    error.value = 'Username dan Nomor HP harus diisi.'
    return
  }
  loading.value = true
  try {
    const response = await loginWarga({
      username: username.value.trim(),
      no_hp: nomorHp.value.trim()
    })
    let dataWarga = null
    if (response?.data) dataWarga = response.data
    else if (response?.nama) dataWarga = response
    else if (typeof response === 'object' && Object.keys(response).length) dataWarga = response

    if (dataWarga) {
      localStorage.setItem('warga', JSON.stringify(dataWarga))
      router.push('/warga')
    } else {
      error.value = 'Username atau Nomor HP salah.'
    }
  } catch (err) {
    error.value = err.message || 'Terjadi kesalahan.'
  } finally {
    loading.value = false
  }
}
</script>