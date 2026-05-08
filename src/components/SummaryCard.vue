<script setup lang="ts">
// SummaryCard — a simple card that displays a label and a dollar amount
// Reusable for any summary statistic (daily, weekly, monthly totals, etc.)
defineProps<{
  label: string
  amount: number
}>()
</script>

<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6 text-center">
    <p class="text-sm text-gray-500 mb-1">{{ label }}</p>
    <p class="text-2xl font-bold text-gray-800">₱{{ amount.toFixed(2) }}</p>
  </div>
</template>
