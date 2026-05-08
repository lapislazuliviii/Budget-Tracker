<script setup lang="ts">
// HomeView — main dashboard page
// Layout: left column has budget overview + savings goals, right column has recent expenses
// Data is fetched from Supabase on page load
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import BudgetOverview from '@/components/BudgetOverview.vue'
import SavingsGoalsList from '@/components/SavingsGoalsList.vue'
import RecentExpenses from '@/components/RecentExpenses.vue'
import type { Expense, SavingsGoal } from '@/types/models'

const totalBudget = ref(0)
const savingsGoals = ref<SavingsGoal[]>([])
const recentExpenses = ref<Expense[]>([])

// Total spent is computed from the expenses list
const totalSpent = computed(() => {
  return recentExpenses.value.reduce((sum, exp) => sum + exp.amount, 0)
})

/**
 * Fetch the user's budget from the budgets table.
 * If no budget exists yet, creates one with a default of 0.
 */
async function fetchBudget() {
  const { data, error } = await supabase
    .from('budgets')
    .select('total_budget')
    .limit(1)
    .single()

  if (error && error.code === 'PGRST116') {
    // No budget row exists yet — create one with default value
    await supabase.from('budgets').insert({ total_budget: 0 })
    totalBudget.value = 0
  } else if (data) {
    totalBudget.value = Number(data.total_budget)
  }
}

/**
 * Fetch all savings goals for the current user.
 */
async function fetchGoals() {
  const { data, error } = await supabase
    .from('savings_goals')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Failed to fetch goals:', error.message)
    return
  }

  savingsGoals.value = data.map((row) => ({
    id: row.id,
    name: row.name,
    target: Number(row.target),
    saved: Number(row.saved),
  }))
}

/**
 * Fetch the most recent expenses (limited to 10 for the dashboard).
 */
async function fetchRecentExpenses() {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('date', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Failed to fetch expenses:', error.message)
    return
  }

  recentExpenses.value = data.map((row) => ({
    id: row.id,
    description: row.description,
    amount: Number(row.amount),
    category: row.category,
    date: row.date,
  }))
}

// Fetch all data when the page loads
onMounted(() => {
  fetchBudget()
  fetchGoals()
  fetchRecentExpenses()
})
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
