<script setup lang="ts">
// HomeView — main dashboard page
// Layout: left column has weekly budget overview + savings goals, right column has recent expenses
// The budget is weekly — each week (Mon–Sun) has its own budget row in the database
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { getStartOfWeek, getEndOfWeek, formatWeekRange, toISODate } from '@/lib/week'
import BudgetOverview from '@/components/BudgetOverview.vue'
import SavingsGoalsList from '@/components/SavingsGoalsList.vue'
import RecentExpenses from '@/components/RecentExpenses.vue'

// Current week boundaries
const weekStart = getStartOfWeek()
const weekEnd = getEndOfWeek()
const weekLabel = formatWeekRange()

// Weekly budget amount — editable by the user
const weeklyBudget = ref(0)

// Controls whether the budget edit form is visible
const isEditingBudget = ref(false)
const editBudgetAmount = ref(0)

const savingsGoals = ref<any[]>([])
const weeklyExpenses = ref<any[]>([])

// Total spent this week — computed from only this week's expenses
const totalSpentThisWeek = computed(() => {
  let total = 0
  for (const exp of weeklyExpenses.value) {
    total += exp.amount
  }
  return total
})

/**
 * Fetch or create the budget row for the current week.
 * If no row exists for this week, a new one is created.
 * The new row copies the budget amount from the most recent previous week,
 * so the user doesn't have to re-enter it every Monday.
 */
async function fetchWeeklyBudget() {
  const weekStartStr = toISODate(weekStart)

  const { data, error } = await supabase
    .from('budgets')
    .select('total_budget')
    .eq('week_start', weekStartStr)
    .single()

  if (error && error.code === 'PGRST116') {
    // No budget for this week yet — look up the most recent week's budget to copy it
    const { data: previous } = await supabase
      .from('budgets')
      .select('total_budget')
      .order('week_start', { ascending: false })
      .limit(1)
      .single()

    const carryOverAmount = previous ? Number(previous.total_budget) : 0

    await supabase.from('budgets').insert({
      week_start: weekStartStr,
      total_budget: carryOverAmount,
    })

    weeklyBudget.value = carryOverAmount
  } else if (data) {
    weeklyBudget.value = Number(data.total_budget)
  }
}

/**
 * Save the edited weekly budget amount to the database.
 */
async function saveBudget() {
  const weekStartStr = toISODate(weekStart)

  await supabase
    .from('budgets')
    .update({ total_budget: editBudgetAmount.value })
    .eq('week_start', weekStartStr)

  weeklyBudget.value = editBudgetAmount.value
  isEditingBudget.value = false
}

/**
 * Open the budget edit form with the current value pre-filled.
 */
function startEditingBudget() {
  editBudgetAmount.value = weeklyBudget.value
  isEditingBudget.value = true
}

/**
 * Fetch all savings goals.
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
 * Fetch expenses for the current week only (Mon–Sun).
 * These are used for the pie chart and the recent expenses list.
 */
async function fetchWeeklyExpenses() {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .gte('date', weekStart.toISOString())
    .lte('date', weekEnd.toISOString())
    .order('date', { ascending: false })

  if (error) {
    console.error('Failed to fetch expenses:', error.message)
    return
  }

  weeklyExpenses.value = data.map((row) => ({
    id: row.id,
    description: row.description,
    amount: Number(row.amount),
    category: row.category,
    date: row.date,
  }))
}

// Fetch all data when the page loads
onMounted(() => {
  fetchWeeklyBudget()
  fetchGoals()
  fetchWeeklyExpenses()
})
</script>

<template>
  <main class="max-w-6xl mx-auto p-8">
    <!-- Week label so the user knows which week they're viewing -->
    <p class="text-sm text-gray-500 mb-6">Week of {{ weekLabel }}</p>

    <!-- Two-column grid: left (budget + goals) and right (recent expenses) -->
    <div class="grid grid-cols-3 gap-6">

      <!-- Left column — takes up 1/3 of the width -->
      <div class="col-span-1 space-y-6">
        <BudgetOverview :total-budget="weeklyBudget" :total-spent="totalSpentThisWeek" />

        <!-- Edit weekly budget inline -->
        <div class="bg-white rounded-lg border border-gray-200 p-4">
          <div v-if="!isEditingBudget" class="flex items-center justify-between">
            <span class="text-sm text-gray-500">Weekly Budget</span>
            <button
              @click="startEditingBudget"
              class="text-sm text-blue-500 hover:underline"
            >
              Edit
            </button>
          </div>

          <!-- Budget edit form -->
          <div v-else>
            <label class="block text-sm text-gray-500 mb-1">Weekly Budget (₱)</label>
            <div class="flex gap-2">
              <input
                v-model.number="editBudgetAmount"
                type="number"
                min="0"
                step="0.01"
                class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                @click="saveBudget"
                class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Save
              </button>
              <button
                @click="isEditingBudget = false"
                class="text-gray-500 hover:text-gray-700 px-2 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        <SavingsGoalsList :goals="savingsGoals" />
      </div>

      <!-- Right column — takes up 2/3 of the width -->
      <div class="col-span-2">
        <RecentExpenses :expenses="weeklyExpenses" />
      </div>

    </div>
  </main>
</template>
