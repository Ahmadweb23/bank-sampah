<template>
  <div
    class="min-h-screen flex items-center justify-center overflow-x-hidden bg-[#f9f9ff] px-5"
  >
    <!-- Background -->
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        class="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#acefe6]/40 blur-[120px]"
      ></div>

      <div
        class="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-200/30 blur-[120px]"
      ></div>
    </div>

    <!-- Card -->
    <main
      class="w-full max-w-[420px] rounded-3xl bg-white p-8 shadow-[0_10px_30px_rgba(0,83,77,.08)]"
    >
      <!-- Logo -->
      <div class="mb-8 flex flex-col items-center">

        <div
          class="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00534d] shadow-lg"
        >
          <span
            class="material-symbols-outlined text-4xl text-white"
            style="font-variation-settings:'FILL' 1;"
          >
            account_balance_wallet
          </span>
        </div>

        <h1 class="mt-4 text-xl font-semibold text-[#003A36]">
          Bank Sampah
        </h1>

        <p
          class="mt-1 text-xs uppercase tracking-[4px] text-slate-500"
        >
          Bojong Karya 2
        </p>

      </div>

      <!-- Heading -->
      <div class="mb-8 text-center">

        <h2 class="text-2xl font-bold text-slate-800">
          Masuk sebagai Pengelola
        </h2>

        <p class="mt-2 text-slate-500">
          Kelola ekosistem lingkungan Anda
        </p>

      </div>

      <!-- Form -->
      <form
        class="space-y-6"
        @submit.prevent="handleLogin"
      >

        <!-- Username -->
        <div>

          <label
            class="mb-2 ml-1 block text-sm font-semibold text-[#003A36]"
          >
            Username
          </label>

          <div
            class="group flex items-center rounded-xl border border-slate-200 bg-[#f9f9ff] px-4 py-3 transition focus-within:border-[#003A36] focus-within:ring-2 focus-within:ring-[#003A36]/10"
          >
            <input
              v-model="username"
              type="text"
              placeholder="Username"
              class="w-full border-none bg-transparent p-0 outline-none focus:ring-0"
            />

          </div>

        </div>

        <!-- Password -->
        <div>

          <div class="mb-2 flex items-center justify-between">

            <label
              class="ml-1 text-sm font-semibold text-[#003A36]"
            >
              Password
            </label>

            <router-link
              to="/password"
              class="text-xs text-blue-600 hover:underline"
            >
              Lupa Password?
            </router-link>

          </div>

          <div
            class="flex items-center rounded-xl border border-slate-200 bg-[#f9f9ff] px-4 py-3 transition focus-within:border-[#003A36] focus-within:ring-2 focus-within:ring-[#003A36]/10"
          >

            <span
              class="material-symbols-outlined mr-3 text-slate-500"
            >
              lock
            </span>

            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              class="w-full border-none bg-transparent p-0 outline-none focus:ring-0"
            />

            <button
              type="button"
              class="text-slate-500 transition hover:text-[#003A36]"
              @click="showPassword = !showPassword"
            >

              <span class="material-symbols-outlined">
                {{ showPassword ? 'visibility_off' : 'visibility' }}
              </span>

            </button>

          </div>

        </div>

        <!-- Button -->
        <button
          type="submit"
          class="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#003A36] py-4 font-semibold text-white transition hover:opacity-90 active:scale-[.98]"
        >

          <span>
            {{ loading ? 'Memproses...' : 'Masuk Sekarang' }}
          </span>

          <span class="material-symbols-outlined text-xl">
            arrow_forward
          </span>

        </button>

      </form>
      <!-- Login -->
        <div class="mt-5 text-center">

          <router-link
            to="/login-warga"
            class="text-sm font-medium text-[#003A36] underline underline-offset-2 transition hover:text-[#00584F]"
          >
            Masuk sebagai Warga
          </router-link>

        </div>

      <!-- Footer -->
      <p
        class="mt-10 text-center text-xs leading-6 text-slate-500"
      >
        Butuh bantuan akses?

        <span class="font-semibold text-[#003A36]">
          IT Support Center
        </span>
        <br />

        KKN UBP Rengasdengklok Selatan 2026

      </p>

    </main>

  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { loginOperator } from "../services/api";

const router = useRouter();

const username = ref("");
const password = ref("");

const showPassword = ref(false);
const loading = ref(false);

async function handleLogin() {

  if (!username.value || !password.value) {
    alert("Silakan isi username dan password.");
    return;
  }

  loading.value = true;

  try {
    const response = await loginOperator({
      username: username.value.trim(),
      password: password.value,
    });

    if (!response?.success) {
      throw new Error(response?.message || "Username atau password salah.");
    }

    const userData = response?.data || {};
    localStorage.setItem("operator", JSON.stringify(userData));
    router.push("/dashboard");

  } catch (error) {
    console.error("Login gagal:", error);
    alert(error?.message || "Login gagal. Periksa username dan password Anda.");

  } finally {
    loading.value = false;

  }

}
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings:
    "FILL" 1,
    "wght" 500,
    "GRAD" 0,
    "opsz" 24;
}

input::placeholder{
  color:#94a3b8;
}

button{
  transition:all .25s ease;
}

button:hover{
  transform:translateY(-1px);
}

button:active{
  transform:scale(.98);
}

main{
  animation:fadeUp .5s ease;
}

@keyframes fadeUp{
  from{
    opacity:0;
    transform:translateY(20px);
  }
  to{
    opacity:1;
    transform:translateY(0);
  }
}

::-webkit-scrollbar{
  width:8px;
}

::-webkit-scrollbar-thumb{
  background:#003A36;
  border-radius:999px;
}

::-webkit-scrollbar-track{
  background:transparent;
}
</style>