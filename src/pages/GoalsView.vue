<script setup lang="ts">
// GoalsView — displays the total amount saved and a list of all savings goals
// Each goal shows its name, progress bar, saved amount, and target amount
import { ref, computed } from 'vue'
import type { SavingsGoal } from '@/types/models'

// --- Sample data for development ---
// Will be replaced with Supabase queries later
const goals = ref<SavingsGoal[]>([
  { id: '1', name: 'New Laptop', target: 800, saved: 350 },
  { id: '2', name: 'Emergency Fund', target: 500, saved: 120 },
  { id: '3', name: 'Spring Break Trip', target: 300, saved: 300 },
  { id: '4', name: 'New Phone', target: 20000, saved: 0 },
])

// Sum of all saved amounts across every goal
const totalSaved = computed(() => {
  return goals.value.reduce((sum, goal) => sum + goal.saved, 0)
})

/**
 * Calculate the progress percentage for a goal.
 * Caps at 100% so the progress bar doesn't overflow.
 */
function progressPercent(saved: number, target: number): number {
  if (target <= 0) return 0
  return Math.min((saved / target) * 100, 100)
}

// Controls whether the "Add Goal" form is visible
const showForm = ref(false)

// Form fields for creating a new goal
const newGoalName = ref('')
const newGoalTarget = ref<number | null>(null)

/**
 * Add a new savings goal to the list.
 * Generates a simple unique ID and resets the form fields.
 */
function addGoal() {
  // Validate: name must not be empty and target must be a positive number
  if (!newGoalName.value.trim() || !newGoalTarget.value || newGoalTarget.value <= 0) return

  goals.value.push({
    id: Date.now().toString(),
    name: newGoalName.value.trim(),
    target: newGoalTarget.value,
    saved: 0,
  })

  // Reset form and hide it
  newGoalName.value = ''
  newGoalTarget.value = null
  showForm.value = false
}
</script>

<template>
  <main class="max-w-6xl mx-auto p-8">
    <!-- Total saved summary card -->
    <div class="bg-white rounded-lg border border-gray-200 p-6 text-center mb-8">
      <p class="text-sm text-gray-500 mb-1">Total Saved</p>
      <p class="text-3xl font-bold text-green-600">${{ totalSaved.toFixed(2) }}</p>
    </div>

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
          <label class="block text-sm text-gray-500 mb-1">Target Amount ($)</label>
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
          <span class="text-sm text-gray-500">
            ${{ goal.saved.toFixed(2) }} / ${{ goal.target.toFixed(2) }}
          </span>
        </div>

        <!-- Progress bar -->
        <div class="w-full bg-gray-100 rounded-full h-3">
          <div
            class="h-3 rounded-full transition-all"
            :class="progressPercent(goal.saved, goal.target) >= 100 ? 'bg-green-500' : 'bg-blue-500'"
            :style="{ width: progressPercent(goal.saved, goal.target) + '%' }"
          />
        </div>

        <!-- Percentage label below the bar -->
        <p class="text-xs text-gray-400 mt-2">
          {{ progressPercent(goal.saved, goal.target).toFixed(1) }}% complete
        </p>
      </div>
    </div>
  </main>
</template>
