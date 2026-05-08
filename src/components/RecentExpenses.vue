<script setup lang="ts">
// RecentExpenses — shows the most recent expense transactions
// Displayed on the right side of the home dashboard
import type { Expense } from '@/types/models'

// Receive the list of recent expenses from the parent component
defineProps<{
  expenses: Expense[]
}>()

/**
 * Format a date string into a short readable format (e.g. "May 8, 2026").
 */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>

<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <h2 class="text-lg font-semibold text-gray-800 mb-4">Recent Expenses</h2>

    <!-- Show a message if no expenses exist yet -->
    <p v-if="expenses.length === 0" class="text-sm text-gray-400">
      No expenses recorded yet.
    </p>

    <!-- List each expense as a row with category, date, and amount -->
    <ul class="space-y-3">
      <li
        v-for="expense in expenses"
        :key="expense.id"
        class="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
      >
        <div>
          <p class="text-sm font-medium text-gray-700">{{ expense.description }}</p>
          <p class="text-xs text-gray-400">{{ expense.category }} · {{ formatDate(expense.date) }}</p>
        </div>
        <span class="text-sm font-semibold text-red-500">
          -₱{{ expense.amount.toFixed(2) }}
        </span>
      </li>
    </ul>
  </div>
</template>
