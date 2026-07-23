<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div class="absolute inset-0 bg-black/40" @click="close"></div>
      <div class="relative w-full max-w-sm rounded-[28px] bg-white p-6 shadow-2xl">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-bold text-slate-900">{{ title }}</h3>
          <button @click="close" class="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
        <p class="mb-6 text-base text-slate-700">{{ message }}</p>
        <div class="flex gap-3">
          <button
            v-if="showCancel"
            @click="close"
            class="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
          >
            Batal
          </button>
          <button
            @click="confirm"
            class="flex-1 rounded-2xl bg-[#147052] px-4 py-3 text-sm font-semibold text-white"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
const title = ref('')
const message = ref('')
const showCancel = ref(false)
const confirmText = ref('OK')
let resolveCallback = null
let rejectCallback = null

function open({
  title: t = 'Informasi',
  message: m,
  showCancel: sc = false,
  confirmText: ct = 'OK'
}) {
  title.value = t
  message.value = m
  showCancel.value = sc
  confirmText.value = ct
  isOpen.value = true
  return new Promise((resolve, reject) => {
    resolveCallback = resolve
    rejectCallback = reject
  })
}

function close() {
  isOpen.value = false
  if (rejectCallback) rejectCallback()
  resolveCallback = null
  rejectCallback = null
}

function confirm() {
  isOpen.value = false
  if (resolveCallback) resolveCallback()
  resolveCallback = null
  rejectCallback = null
}

defineExpose({ open })
</script>
