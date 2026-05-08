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
</script>

<template>
  <main class="max-w-6xl mx-auto p-8">
    <!-- Total saved summary card -->
    <div class="bg-white rounded-lg border border-gray-200 p-6 text-center mb-8">
      <p class="text-sm text-gray-500 mb-1">Total Saved</p>
      <p class="text-3xl font-bold text-green-600">${{ totalSaved.toFixed(2) }}</p>
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
