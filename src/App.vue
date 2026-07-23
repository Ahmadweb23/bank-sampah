<template>
  <router-view />
  <CustomModal ref="modalRef" />
</template>

<script setup>
import CustomModal from './components/CustomModal.vue'
import { ref, provide } from 'vue'

const modalRef = ref(null)

function showModal(options) {
  if (modalRef.value) {
    return modalRef.value.open(options)
  }
}

provide('showModal', showModal)
window.showModal = showModal
</script>
