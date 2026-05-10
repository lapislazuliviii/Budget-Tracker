<script setup lang="ts">
// GoalsView — displays the total amount saved and a list of all savings goals
// Each goal shows its name, progress bar, saved amount, and target amount
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

// All savings goals fetched from Supabase
const goals = ref<any[]>([])

/**
 * Fetch all savings goals from the database.
 */
async function fetchGoals() {
  const result = await supabase
    .from('savings_goals')
    .select('*')
    .order('created_at', { ascending: true })
  const data = result.data
  const error = result.error

  if (error) {
    console.error('Failed to fetch goals:', error.message)
    return
  }
  if (!data) return

  const list = []
  for (const row of data) {
    list.push({
      id: row.id,
      name: row.name,
      target: Number(row.target),
      saved: Number(row.saved),
    })
  }
  goals.value = list
}

// Fetch goals when the page loads
onMounted(fetchGoals)

/**
 * Calculate the progress percentage for a goal.
 * Caps at 100% so the progress bar doesn't overflow.
 */
function progressPercent(saved: number, target: number): number {
  if (target <= 0) return 0
  return Math.min((saved / target) * 100, 100)
}

/**
 * Return 'bg-green-500' if the goal is complete, otherwise 'bg-blue-500'.
 */
function progressColor(saved: number, target: number): string {
  if (progressPercent(saved, target) >= 100) {
    return 'bg-green-500'
  }
  return 'bg-blue-500'
}

// Controls whether the "Add Goal" form is visible
const showForm = ref(false)

// Form fields for creating a new goal
const newGoalName = ref('')
const newGoalTarget = ref<number | null>(null)

/**
 * Add a new savings goal to the database and refresh the list.
 */
async function addGoal() {
  // Validate: name must not be empty and target must be a positive number
  if (!newGoalName.value.trim()) return
  if (!newGoalTarget.value) return
  if (newGoalTarget.value <= 0) return

  const insertResult = await supabase.from('savings_goals').insert({
    name: newGoalName.value.trim(),
    target: newGoalTarget.value,
    saved: 0,
  })

  if (insertResult.error) {
    console.error('Failed to add goal:', insertResult.error.message)
    return
  }

  // Refresh the goals list from the database
  await fetchGoals()

  // Reset form and hide it
  newGoalName.value = ''
  newGoalTarget.value = null
  showForm.value = false
}

// Controls whether the "Update Savings" form is visible
const showUpdateForm = ref(false)

// Form fields for updating savings on a goal
const selectedGoalId = ref('')
const addSavingsAmount = ref<number | null>(null)

/**
 * Add savings to an existing goal.
 * Adds the entered amount to the goal's current saved value in the database.
 */
async function updateSavings() {
  if (!selectedGoalId.value) return
  if (!addSavingsAmount.value) return
  if (addSavingsAmount.value <= 0) return

  // Find the selected goal to get its current saved amount
  let goal = null
  for (const g of goals.value) {
    if (g.id === selectedGoalId.value) {
      goal = g
      break
    }
  }
  if (!goal) return

  const newSaved = goal.saved + addSavingsAmount.value

  const updateResult = await supabase
    .from('savings_goals')
    .update({ saved: newSaved })
    .eq('id', selectedGoalId.value)

  if (updateResult.error) {
    console.error('Failed to update savings:', updateResult.error.message)
    return
  }

  // Refresh the goals list
  await fetchGoals()

  // Reset form and hide it
  selectedGoalId.value = ''
  addSavingsAmount.value = null
  showUpdateForm.value = false
}
</script>

<template>
  <main class="max-w-6xl mx-auto p-8">
    <!-- Add Goal button -->
    <button
      @click="showForm = !showForm"
      class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors mb-6"
    >
      <span class="text-xl leading-none">+</span>
      <span>Add Goal</span>
    </button>

    <!-- Add Goal form — shown when the plus button is clicked -->
    <div v-if="showForm" class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">New Goal</h3>
      <div class="flex gap-4 items-end">
        <div class="flex-1">
          <label class="block text-sm text-gray-500 mb-1">Goal Name</label>
          <input
            v-model="newGoalName"
            type="text"
            placeholder="e.g. New Laptop"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="flex-1">
          <label class="block text-sm text-gray-500 mb-1">Target Amount (₱)</label>
          <input
            v-model.number="newGoalTarget"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          @click="addGoal"
          class="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-2 rounded-lg text-sm transition-colors"
        >
          Add
        </button>
      </div>
    </div>

    <!-- Update Savings button -->
    <button
      @click="showUpdateForm = !showUpdateForm"
      class="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors mb-6"
    >
      <span>Update Savings</span>
    </button>

    <!-- Update Savings form — pick a goal and add an amount -->
    <div v-if="showUpdateForm" class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Add Savings to a Goal</h3>
      <div class="flex gap-4 items-end">
        <div class="flex-1">
          <label class="block text-sm text-gray-500 mb-1">Goal</label>
          <select
            v-model="selectedGoalId"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="" disabled>Select a goal</option>
            <option v-for="goal in goals" :key="goal.id" :value="goal.id">
              {{ goal.name }} (₱{{ goal.saved.toFixed(2) }} / ₱{{ goal.target.toFixed(2) }})
            </option>
          </select>
        </div>
        <div class="flex-1">
          <label class="block text-sm text-gray-500 mb-1">Amount to Add (₱)</label>
          <input
            v-model.number="addSavingsAmount"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          @click="updateSavings"
          class="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-2 rounded-lg text-sm transition-colors"
        >
          Save
        </button>
      </div>
    </div>

    <!-- List of all savings goals -->
    <div class="space-y-4">
      <div
        v-for="goal in goals"
        :key="goal.id"
        class="bg-white rounded-lg border border-gray-200 p-6"
      >
        <!-- Goal name and saved/target amounts -->
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-lg font-semibold text-gray-800">{{ goal.name }}</h3>
          <span class="text-base text-gray-500">
            ₱{{ goal.saved.toFixed(2) }} / ₱{{ goal.target.toFixed(2) }}
          </span>
        </div>

        <!-- Progress bar -->
        <div class="w-full bg-gray-100 rounded-full h-3">
          <div
            class="h-3 rounded-full transition-all"
            :class="progressColor(goal.saved, goal.target)"
            :style="{ width: progressPercent(goal.saved, goal.target) + '%' }"
          />
        </div>

        <!-- Percentage label below the bar -->
        <p class="text-sm text-gray-400 mt-2">
          {{ progressPercent(goal.saved, goal.target).toFixed(1) }}% complete
        </p>
      </div>
    </div>
  </main>
</template>
