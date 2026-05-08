<script setup lang="ts">
// StatsView — displays spending breakdown by category
// Shows a pie chart of category totals, and a table with percentages and amounts
import { ref, computed, onMounted } from 'vue'
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { supabase } from '@/lib/supabase'
import type { Expense } from '@/types/models'

// Register Chart.js components needed for pie chart
ChartJS.register(ArcElement, Tooltip, Legend)

// All expenses fetched from Supabase
const expenses = ref<Expense[]>([])

/**
 * Fetch all expenses for the current user from the database.
 */
async function fetchExpenses() {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    console.error('Failed to fetch expenses:', error.message)
    return
  }

  expenses.value = data.map((row) => ({
    id: row.id,
    description: row.description,
    amount: Number(row.amount),
    category: row.category,
    date: row.date,
  }))
}

// Fetch expenses when the page loads
onMounted(fetchExpenses)

/**
 * Group expenses by category and sum their amounts.
 * Returns a Map where key = category name, value = total spent in that category.
 * Example: { "Food" => 73.20, "Transport" => 30.00, ... }
 */
const categoryTotals = computed(() => {
  const totals = new Map<string, number>()

  for (const expense of expenses.value) {
    const current = totals.get(expense.category) ?? 0
    totals.set(expense.category, current + expense.amount)
  }

  return totals
})

// Total of all expenses — used to calculate each category's percentage
const grandTotal = computed(() => {
  return Array.from(categoryTotals.value.values()).reduce((sum, amount) => sum + amount, 0)
})

// Extract category names and their totals as arrays for the chart and table
const categoryNames = computed(() => Array.from(categoryTotals.value.keys()))
const categoryAmounts = computed(() => Array.from(categoryTotals.value.values()))

// One distinct color per category for the pie chart slices
const categoryColors = [
  '#3B82F6', // blue
  '#EF4444', // red
  '#22C55E', // green
  '#F59E0B', // amber
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#14B8A6', // teal
  '#F97316', // orange
]

// Chart.js data configuration for the pie chart
const chartData = computed(() => ({
  labels: categoryNames.value,
  datasets: [
    {
      data: categoryAmounts.value,
      backgroundColor: categoryColors.slice(0, categoryNames.value.length),
      borderWidth: 2,
      borderColor: '#FFFFFF',
    },
  ],
}))

// Chart.js display options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        padding: 16,
        usePointStyle: true, // show colored circles instead of rectangles
      },
    },
  },
}

/**
 * Calculate what percentage a category's total is of all expenses.
 * Example: if Food = $73.20 and grand total = $281.19, returns 26.03
 */
function categoryPercent(amount: number): number {
  if (grandTotal.value === 0) return 0
  return (amount / grandTotal.value) * 100
}
</script>

<template>
  <main class="max-w-6xl mx-auto p-8">
    <!-- Pie chart showing spending by category -->
    <div class="bg-white rounded-lg border border-gray-200 p-6 mb-8">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Spending by Category</h2>
      <div class="h-72">
        <Pie :data="chartData" :options="chartOptions" />
      </div>
    </div>

    <!-- Table showing each category's percentage and total cost -->
    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table class="w-full text-sm text-left">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-6 py-3 font-medium text-gray-500">Category</th>
            <th class="px-6 py-3 font-medium text-gray-500">Percentage</th>
            <th class="px-6 py-3 font-medium text-gray-500 text-right">Total Cost</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(name, index) in categoryNames"
            :key="name"
            class="border-b border-gray-100 hover:bg-gray-50"
          >
            <!-- Category name with a colored dot matching the pie chart -->
            <td class="px-6 py-4 text-gray-700 font-medium flex items-center gap-2">
              <span
                class="inline-block w-3 h-3 rounded-full"
                :style="{ backgroundColor: categoryColors[index] }"
              />
              {{ name }}
            </td>

            <!-- Percentage with a small bar to visualize the proportion -->
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-24 bg-gray-100 rounded-full h-2">
                  <div
                    class="h-2 rounded-full"
                    :style="{
                      width: categoryPercent(categoryAmounts[index]) + '%',
                      backgroundColor: categoryColors[index],
                    }"
                  />
                </div>
                <span class="text-gray-600">
                  {{ categoryPercent(categoryAmounts[index]).toFixed(1) }}%
                </span>
              </div>
            </td>

            <!-- Total dollar amount for the category -->
            <td class="px-6 py-4 text-gray-800 font-semibold text-right">
              ₱{{ categoryAmounts[index].toFixed(2) }}
            </td>
          </tr>
        </tbody>

        <!-- Grand total row at the bottom -->
        <tfoot class="bg-gray-50 border-t border-gray-200">
          <tr>
            <td class="px-6 py-3 font-semibold text-gray-800">Total</td>
            <td class="px-6 py-3 text-gray-600">100%</td>
            <td class="px-6 py-3 font-bold text-gray-800 text-right">
              ₱{{ grandTotal.toFixed(2) }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </main>
</template>
