<script setup lang="ts">
// BudgetOverview — displays the user's total budget as a doughnut (pie) chart
// The chart shows how much of the budget has been spent vs. what remains
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

// Register the Chart.js components we need for the doughnut chart
ChartJS.register(ArcElement, Tooltip, Legend)

// Props allow the parent component to pass in the budget values
const props = defineProps<{
  totalBudget: number
  totalSpent: number
}>()

// Calculate remaining budget (cannot go below zero)
const remaining = computed(() => Math.max(props.totalBudget - props.totalSpent, 0))

// Chart.js data configuration for the doughnut chart
const chartData = computed(() => ({
  labels: ['Spent', 'Remaining'],
  datasets: [
    {
      data: [props.totalSpent, remaining.value],
      backgroundColor: ['#EF4444', '#22C55E'], // red for spent, green for remaining
      borderWidth: 0,
    },
  ],
}))

// Chart.js options — disable the legend since we show our own labels below
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
}
</script>

<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <h2 class="text-lg font-semibold text-gray-800 mb-4">Budget</h2>

    <!-- Doughnut chart container with fixed height -->
    <div class="h-48 flex items-center justify-center">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>

    <!-- Budget summary numbers below the chart -->
    <div class="mt-4 space-y-2 text-sm">
      <div class="flex justify-between">
        <span class="text-gray-500">Total Budget</span>
        <span class="font-medium text-gray-800">₱{{ totalBudget.toFixed(2) }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-500">Spent</span>
        <span class="font-medium text-red-500">₱{{ totalSpent.toFixed(2) }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-500">Remaining</span>
        <span class="font-medium text-green-600">₱{{ remaining.toFixed(2) }}</span>
      </div>
    </div>
  </div>
</template>
