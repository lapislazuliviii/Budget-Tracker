<script setup lang="ts">
// SavingsGoalsList — displays the user's savings goals with progress bars
// Each goal shows how much has been saved toward the target amount
import type { SavingsGoal } from '@/types/models'

// Receive the list of savings goals from the parent component
defineProps<{
  goals: SavingsGoal[]
}>()

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
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <h2 class="text-lg font-semibold text-gray-800 mb-4">Savings Goals</h2>

    <!-- Show a message if no goals exist yet -->
    <p v-if="goals.length === 0" class="text-sm text-gray-400">
      No savings goals yet.
    </p>

    <!-- List each goal with a progress bar -->
    <ul class="space-y-4">
      <li v-for="goal in goals" :key="goal.id">
        <div class="flex justify-between text-sm mb-1">
          <span class="font-medium text-gray-700">{{ goal.name }}</span>
          <span class="text-gray-500">
            ₱{{ goal.saved.toFixed(2) }} / ₱{{ goal.target.toFixed(2) }}
          </span>
        </div>

        <!-- Progress bar background -->
        <div class="w-full bg-gray-100 rounded-full h-2">
          <!-- Filled portion of the progress bar -->
          <div
            class="bg-blue-500 h-2 rounded-full transition-all"
            :style="{ width: progressPercent(goal.saved, goal.target) + '%' }"
          />
        </div>
      </li>
    </ul>
  </div>
</template>
