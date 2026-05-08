<script setup lang="ts">
// HomeView — main dashboard page
// Layout: left column has budget overview + savings goals, right column has recent expenses
// Currently uses sample data; will be replaced with Supabase queries later
import { ref } from 'vue'
import BudgetOverview from '@/components/BudgetOverview.vue'
import SavingsGoalsList from '@/components/SavingsGoalsList.vue'
import RecentExpenses from '@/components/RecentExpenses.vue'
import type { Expense, SavingsGoal } from '@/types/models'

// --- Sample data for development ---
// These will be replaced with real data from Supabase

const totalBudget = ref(1500.00)
const totalSpent = ref(620.50)

const savingsGoals = ref<SavingsGoal[]>([
  { id: '1', name: 'New Laptop', target: 800, saved: 350 },
  { id: '2', name: 'Emergency Fund', target: 500, saved: 120 },
  { id: '3', name: 'Spring Break Trip', target: 300, saved: 300 },
  { id: '4', name: 'New Phone', target: 20000, saved: 0 },
])

const recentExpenses = ref<Expense[]>([
  { id: '1', description: 'Grocery Store', amount: 45.20, category: 'Food', date: '2026-05-08' },
  { id: '2', description: 'Bus Pass', amount: 30.00, category: 'Transport', date: '2026-05-07' },
  { id: '3', description: 'Coffee Shop', amount: 5.50, category: 'Food', date: '2026-05-07' },
  { id: '4', description: 'Textbook', amount: 89.99, category: 'Education', date: '2026-05-05' },
  { id: '5', description: 'Phone Bill', amount: 45.00, category: 'Bills', date: '2026-05-03' },
  { id: '6', description: 'Gym Membership', amount: 25.00, category: 'Health', date: '2026-05-01' },
])
</script>

<template>
  <main class="max-w-6xl mx-auto p-8">
    <!-- Two-column grid: left (budget + goals) and right (recent expenses) -->
    <div class="grid grid-cols-3 gap-6">

      <!-- Left column — takes up 1/3 of the width -->
      <div class="col-span-1 space-y-6">
        <BudgetOverview :total-budget="totalBudget" :total-spent="totalSpent" />
        <SavingsGoalsList :goals="savingsGoals" />
      </div>

      <!-- Right column — takes up 2/3 of the width -->
      <div class="col-span-2">
        <RecentExpenses :expenses="recentExpenses" />
      </div>

    </div>
  </main>
</template>
