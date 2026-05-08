<script setup lang="ts">
// App.vue — root component that wraps the entire application
// NavBar is always visible; RouterView swaps in the active page
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <NavBar />
  <RouterView />
</template>
