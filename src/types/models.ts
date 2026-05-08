// Shared TypeScript types used across the application
// Keeping types in one place makes them easy to update and reference

/** Represents a single expense transaction */
export interface Expense {
  id: string
  description: string
  amount: number       // stored as a positive number (display adds the minus sign)
  category: string
  date: string         // ISO date string, e.g. "2026-05-08"
}

/** Represents a savings goal the user is working toward */
export interface SavingsGoal {
  id: string
  name: string
  target: number       // the amount the user wants to save
  saved: number        // how much has been saved so far
}
