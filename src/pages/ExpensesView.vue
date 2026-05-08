<script setup lang="ts">
// ExpensesView — shows spending summaries and a full list of all expenses
// Top row: three summary cards (today, this week, this month)
// Below: a table of every expense with date, time, category, name, and cost
import { ref, computed } from 'vue'
import SummaryCard from '@/components/SummaryCard.vue'
import type { Expense } from '@/types/models'

// --- Sample data for development ---
// Will be replaced with Supabase queries later
const expenses = ref<Expense[]>([
  { id: '1', description: 'Grocery Store', amount: 45.20, category: 'Food', date: '2026-05-08T10:30:00' },
  { id: '2', description: 'Bus Pass', amount: 30.00, category: 'Transport', date: '2026-05-08T08:15:00' },
  { id: '3', description: 'Coffee Shop', amount: 5.50, category: 'Food', date: '2026-05-07T14:00:00' },
  { id: '4', description: 'Textbook', amount: 89.99, category: 'Education', date: '2026-05-05T11:45:00' },
  { id: '5', description: 'Phone Bill', amount: 45.00, category: 'Bills', date: '2026-05-03T09:00:00' },
  { id: '6', description: 'Gym Membership', amount: 25.00, category: 'Health', date: '2026-05-01T07:30:00' },
  { id: '7', description: 'Movie Tickets', amount: 18.00, category: 'Entertainment', date: '2026-04-28T19:00:00' },
  { id: '8', description: 'Pizza Night', amount: 22.50, category: 'Food', date: '2026-04-25T20:15:00' },
])

/**
 * Helper: sum up all expense amounts that fall on or after a given date.
 * Used to calculate daily, weekly, and monthly totals.
 */
function sumExpensesSince(expenses: Expense[], sinceDate: Date): number {
  return expenses
    .filter((expense) => new Date(expense.date) >= sinceDate)
    .reduce((total, expense) => total + expense.amount, 0)
}

// Get the start of today (midnight)
const now = new Date('2026-05-08T23:59:59') // pinned for sample data consistency
const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())

// Get the start of this week (Monday)
const startOfWeek = new Date(startOfDay)
const dayOfWeek = startOfDay.getDay()
// Adjust so Monday = 0 (JS treats Sunday as 0)
const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1
startOfWeek.setDate(startOfDay.getDate() - mondayOffset)

// Get the start of this month
const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

// Computed spending totals for each time period
const spentToday = computed(() => sumExpensesSince(expenses.value, startOfDay))
const spentThisWeek = computed(() => sumExpensesSince(expenses.value, startOfWeek))
const spentThisMonth = computed(() => sumExpensesSince(expenses.value, startOfMonth))

/**
 * Format the date portion of an ISO datetime string.
 * Example: "2026-05-08T10:30:00" → "May 8, 2026"
 */
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Format the time portion of an ISO datetime string.
 * Example: "2026-05-08T10:30:00" → "10:30 AM"
 */
function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}
</script>

<template>
  <main class="max-w-6xl mx-auto p-8">
    <!-- Three summary cards: daily, weekly, monthly spending -->
    <div class="grid grid-cols-3 gap-6 mb-8">
      <SummaryCard label="Spent Today" :amount="spentToday" />
      <SummaryCard label="Spent This Week" :amount="spentThisWeek" />
      <SummaryCard label="Spent This Month" :amount="spentThisMonth" />
    </div>

    <!-- Full expense history table -->
    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table class="w-full text-sm text-left">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-6 py-3 font-medium text-gray-500">Date</th>
            <th class="px-6 py-3 font-medium text-gray-500">Time</th>
            <th class="px-6 py-3 font-medium text-gray-500">Category</th>
            <th class="px-6 py-3 font-medium text-gray-500">Name</th>
            <th class="px-6 py-3 font-medium text-gray-500 text-right">Cost</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="expense in expenses"
            :key="expense.id"
            class="border-b border-gray-100 hover:bg-gray-50"
          >
            <td class="px-6 py-4 text-gray-700">{{ formatDate(expense.date) }}</td>
            <td class="px-6 py-4 text-gray-500">{{ formatTime(expense.date) }}</td>
            <td class="px-6 py-4 text-gray-500">{{ expense.category }}</td>
            <td class="px-6 py-4 text-gray-700 font-medium">{{ expense.description }}</td>
            <td class="px-6 py-4 text-red-500 font-semibold text-right">
              -${{ expense.amount.toFixed(2) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>
