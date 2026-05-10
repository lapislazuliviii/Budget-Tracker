// Week helper — shared utility for calculating week boundaries
// The app treats Monday as the start of the week
// All dates and times use GMT+8 (Philippine Standard Time)

/**
 * Get the current date/time adjusted to GMT+8.
 * This ensures the app always shows Philippine time regardless of the user's system timezone.
 */
export function getNowGMT8(): Date {
  const now = new Date()
  // Get the current UTC time in milliseconds
  const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000)
  // Add 8 hours to get GMT+8
  const gmt8Ms = utcMs + (8 * 60 * 60000)
  return new Date(gmt8Ms)
}

/**
 * Get the Monday of the current week at midnight.
 * JavaScript's getDay() returns 0 for Sunday, 1 for Monday, etc.
 * We shift so that Monday = 0 to find the correct offset.
 */
export function getStartOfWeek(): Date {
  const today = getNowGMT8()
  const d = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const dayOfWeek = d.getDay()
  // Sunday (0) needs to go back 6 days, Monday (1) stays, Tuesday (2) goes back 1, etc.
  let mondayOffset = dayOfWeek - 1
  if (dayOfWeek === 0) {
    mondayOffset = 6
  }
  d.setDate(d.getDate() - mondayOffset)
  return d
}

/**
 * Get the Sunday (end) of the current week at 23:59:59.
 */
export function getEndOfWeek(): Date {
  const monday = getStartOfWeek()
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)
  return sunday
}

/**
 * Format a week range as a readable string.
 * Example: "May 5 – May 11, 2026"
 */
export function formatWeekRange(): string {
  const start = getStartOfWeek()
  const end = getEndOfWeek()

  const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return startStr + ' – ' + endStr
}

/**
 * Format a date as a date string (YYYY-MM-DD) for database queries.
 */
export function toISODate(date: Date): string {
  const year = date.getFullYear()
  // Add a leading zero if the number is single-digit (e.g. 5 → "05")
  let month = String(date.getMonth() + 1)
  if (month.length === 1) {
    month = '0' + month
  }
  let day = String(date.getDate())
  if (day.length === 1) {
    day = '0' + day
  }
  return year + '-' + month + '-' + day
}
