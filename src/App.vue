<template>
  <div :class="{ 'lg:pl-64': hasOperatorSidebar }">
    <router-view />
  </div>
  <CustomModal ref="modalRef" />
</template>

<script setup>
import CustomModal from './components/CustomModal.vue'
import { computed, ref, provide } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const operatorNavRoutes = ['/dashboard', '/keuangan', '/katalog-pengelola', '/laporan']
const hasOperatorSidebar = computed(() => operatorNavRoutes.includes(route.path))

const modalRef = ref(null)

function showModal(options) {
  if (modalRef.value) {
    return modalRef.value.open(options)
  }
}

provide('showModal', showModal)
window.showModal = showModal
</script>
