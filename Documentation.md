# Student Budget App — Documentation / Defense Cheat Sheet

## 1. What is this app?

A web-based weekly budgeting application designed for students. It allows users to:

- Set a **weekly budget** and track spending against it
- **Record expenses** with descriptions, amounts, categories, dates, and times
- View **spending statistics** broken down by category (pie chart + table)
- Set **savings goals** and track progress toward each one

The app runs in the browser and targets desktop users (minimum 1024px width).

---

## 2. Tech Stack and Why We Chose Each

| Technology | Role | Why we chose it |
|---|---|---|
| **Vue.js 3** | Frontend framework | Vue's Composition API with `<script setup>` keeps components concise and readable. Vue is easier to learn than React or Angular, making it a good fit for a student project. Its reactivity system automatically updates the UI when data changes. |
| **TypeScript** | Programming language | Adds type safety on top of JavaScript. Catches bugs at development time (e.g., passing a string where a number is expected). Makes the code self-documenting since every variable and function parameter has a declared type. |
| **Vite** | Build tool & dev server | Extremely fast dev server with Hot Module Replacement (HMR) — changes appear in the browser instantly without a full reload. Handles bundling for production. The current standard for Vue projects, replacing the older Vue CLI. |
| **Tailwind CSS** | Styling | Utility-first CSS framework. Styles are applied directly in the HTML using classes like `text-lg`, `bg-blue-500`, `rounded-lg`. Eliminates the need for separate CSS files and avoids naming conflicts. Produces a small final CSS bundle because unused styles are automatically removed. |
| **Supabase** | Database (PostgreSQL) | Open-source Backend-as-a-Service. Provides a hosted PostgreSQL database with a JavaScript SDK for querying directly from the frontend. No need to build or host a separate backend/API server. Free tier is sufficient for a proof of concept. |
| **Chart.js + vue-chartjs** | Data visualization | Lightweight charting library for the pie/doughnut charts. `vue-chartjs` is the official Vue wrapper, making Chart.js work with Vue's reactivity system. |
| **Vue Router** | Navigation | Official routing library for Vue. Enables single-page app navigation — clicking between Home, Expenses, Stats, and Goals doesn't reload the page. |
| **Pinia** | State management | Official state management for Vue. Available for sharing data between components if needed. Included in the project setup for extensibility. |

---

## 3. Project Structure

```
student-budget/
  index.html                  # Entry HTML file — Vite injects the app here
  vite.config.ts              # Vite configuration (plugins: Vue, Tailwind)
  package.json                # Dependencies and npm scripts
  tsconfig.json               # TypeScript configuration
  .env                        # Environment variables (Supabase URL + key)
  supabase/
    schema.sql                # Database table definitions (run in Supabase SQL Editor)
    seed.sql                  # Test data for development
  src/
    main.ts                   # App entry point — creates Vue app, registers plugins
    App.vue                   # Root component — renders NavBar + active page
    router/index.ts           # Route definitions (URL -> page mapping)
    lib/
      supabase.ts             # Supabase client initialization
      week.ts                 # Week boundary helpers (Monday start, GMT+8)
    components/
      NavBar.vue              # Top navigation bar
      BudgetOverview.vue      # Doughnut chart showing budget vs. spent
      SavingsGoalsList.vue    # List of goals with progress bars (used on Home)
      RecentExpenses.vue      # Recent expense list (used on Home)
      SummaryCard.vue         # Reusable card for displaying a label + amount
    pages/
      HomeView.vue            # Dashboard — weekly budget chart, goals, recent expenses
      ExpensesView.vue        # Expense summaries + full history table + add form
      StatsView.vue           # Category breakdown pie chart + percentage table
      GoalsView.vue           # Savings goals list + add/update forms
```

---

## 4. Database Schema

The app uses three tables in Supabase (PostgreSQL). This is a proof of concept so there is no user authentication — all data is shared.

### 4.1 `budgets` — Weekly Budget Records

| Column | Type | Description |
|---|---|---|
| `id` | uuid (PK) | Auto-generated unique identifier |
| `week_start` | date (unique) | The Monday that starts this budget week |
| `total_budget` | numeric(12,2) | The budget amount for this week (in PHP) |
| `created_at` | timestamp | When this record was created |

**How it works:**
- Each week (Monday to Sunday) has its own budget row.
- When the user visits the Home page, the app checks if a row exists for the current week's Monday.
- If no row exists, the app auto-creates one and copies the budget amount from the most recent previous week, so the user doesn't have to re-enter it every Monday.
- The user can edit the weekly budget amount from the Home page.

### 4.2 `expenses` — Expense Transactions

| Column | Type | Description |
|---|---|---|
| `id` | uuid (PK) | Auto-generated unique identifier |
| `description` | text | What the expense was for (e.g., "Jollibee Lunch") |
| `amount` | numeric(12,2) | Cost in PHP |
| `category` | text | Category label (Food, Transport, Education, etc.) |
| `date` | timestamp | When the expense occurred (date + time, no timezone) |
| `created_at` | timestamp | When this record was created |

**How it works:**
- Expenses are added from the Expenses page via a form with fields for description, amount, category, date, and time.
- The Home page shows only this week's expenses (filtered by the current Monday–Sunday range).
- The Expenses page shows all expenses and computes daily, weekly, and monthly totals.
- The Stats page groups all expenses by category to generate the pie chart and percentage table.

### 4.3 `savings_goals` — Savings Goals

| Column | Type | Description |
|---|---|---|
| `id` | uuid (PK) | Auto-generated unique identifier |
| `name` | text | Name of the goal (e.g., "New Laptop") |
| `target` | numeric(12,2) | Target amount to save |
| `saved` | numeric(12,2) | Amount saved so far |
| `created_at` | timestamp | When this record was created |

**How it works:**
- Users create goals from the Goals page with a name and target amount. The saved amount starts at 0.
- The "Update Savings" button lets users add money to a specific goal's saved amount.
- Progress bars show how close each goal is to completion. Completed goals (100%) turn green.
- The Home page also displays goals in a smaller summary list.

### Entity Relationship

```
budgets              expenses              savings_goals
+--------------+     +--------------+      +---------------+
| id (PK)      |     | id (PK)      |      | id (PK)       |
| week_start   |     | description  |      | name          |
| total_budget |     | amount       |      | target        |
| created_at   |     | category     |      | saved         |
+--------------+     | date         |      | created_at    |
                     | created_at   |      +---------------+
                     +--------------+
```

The three tables are independent — there are no foreign keys between them. The budget and expenses are linked logically by date: the Home page filters expenses to the current week and compares them against the matching weekly budget row.

---

## 5. How the App Connects to Supabase

1. **Environment variables** (`.env` file) store the Supabase project URL and publishable key.
2. **`src/lib/supabase.ts`** creates a single Supabase client instance using those variables.
3. **Each page** imports the client and uses it to query the database.
4. Supabase handles the HTTP requests to the PostgreSQL database. No custom backend server is needed.

### All SQL Operations Used in the App

Below is every Supabase query used in the codebase. The Supabase JavaScript SDK translates these method chains into SQL queries behind the scenes. The equivalent SQL is shown for each.

#### Budgets Table

**Fetch this week's budget** (`HomeView.vue`)
```js
supabase
  .from('budgets')
  .select('total_budget')
  .eq('week_start', weekStartStr)
  .single()
```
```sql
SELECT total_budget FROM budgets WHERE week_start = '2026-05-04' LIMIT 1;
```

**Fetch the most recent previous budget** (`HomeView.vue`)
```js
supabase
  .from('budgets')
  .select('total_budget')
  .order('week_start', { ascending: false })
  .limit(1)
  .single()
```
```sql
SELECT total_budget FROM budgets ORDER BY week_start DESC LIMIT 1;
```

**Create a new weekly budget** (`HomeView.vue`)
```js
supabase
  .from('budgets')
  .insert({
    week_start: weekStartStr,
    total_budget: carryOverAmount,
  })
```
```sql
INSERT INTO budgets (week_start, total_budget) VALUES ('2026-05-04', 3000.00);
```

**Update the weekly budget amount** (`HomeView.vue`)
```js
supabase
  .from('budgets')
  .update({ total_budget: editBudgetAmount.value })
  .eq('week_start', weekStartStr)
```
```sql
UPDATE budgets SET total_budget = 3500.00 WHERE week_start = '2026-05-04';
```

#### Expenses Table

**Fetch all expenses sorted by date** (`ExpensesView.vue`, `StatsView.vue`)
```js
supabase
  .from('expenses')
  .select('*')
  .order('date', { ascending: false })
```
```sql
SELECT * FROM expenses ORDER BY date DESC;
```

**Fetch expenses for the current week only** (`HomeView.vue`)
```js
supabase
  .from('expenses')
  .select('*')
  .gte('date', toISODate(weekStart) + 'T00:00:00')
  .lte('date', toISODate(weekEnd) + 'T23:59:59')
  .order('date', { ascending: false })
```
```sql
SELECT * FROM expenses
WHERE date >= '2026-05-04T00:00:00' AND date <= '2026-05-10T23:59:59'
ORDER BY date DESC;
```

**Insert a new expense** (`ExpensesView.vue`)
```js
supabase
  .from('expenses')
  .insert({
    description: 'Jollibee Lunch',
    amount: 189.00,
    category: 'Food',
    date: '2026-05-08T12:30:00',
  })
```
```sql
INSERT INTO expenses (description, amount, category, date)
VALUES ('Jollibee Lunch', 189.00, 'Food', '2026-05-08T12:30:00');
```

#### Savings Goals Table

**Fetch all savings goals** (`GoalsView.vue`, `HomeView.vue`)
```js
supabase
  .from('savings_goals')
  .select('*')
  .order('created_at', { ascending: true })
```
```sql
SELECT * FROM savings_goals ORDER BY created_at ASC;
```

**Insert a new savings goal** (`GoalsView.vue`)
```js
supabase
  .from('savings_goals')
  .insert({
    name: 'New Laptop',
    target: 25000.00,
    saved: 0,
  })
```
```sql
INSERT INTO savings_goals (name, target, saved) VALUES ('New Laptop', 25000.00, 0);
```

**Update the saved amount on a goal** (`GoalsView.vue`)
```js
supabase
  .from('savings_goals')
  .update({ saved: newSaved })
  .eq('id', selectedGoalId)
```
```sql
UPDATE savings_goals SET saved = 15000.00 WHERE id = 'goal-uuid-here';
```

### Summary of SQL Operations

| Operation | Table | Used In | Count |
|---|---|---|---|
| SELECT | budgets | HomeView | 2 |
| INSERT | budgets | HomeView | 1 |
| UPDATE | budgets | HomeView | 1 |
| SELECT | expenses | HomeView, ExpensesView, StatsView | 3 |
| INSERT | expenses | ExpensesView | 1 |
| SELECT | savings_goals | HomeView, GoalsView | 2 |
| INSERT | savings_goals | GoalsView | 1 |
| UPDATE | savings_goals | GoalsView | 1 |

**Total: 12 database operations** (7 SELECTs, 3 INSERTs, 2 UPDATEs). No DELETE operations are used in the current version.

---

## 6. Key Features Explained

### Weekly Budget System
- The budget resets every Monday. The Home page shows a doughnut chart comparing this week's budget vs. this week's spending.
- When a new week starts, the app automatically creates a new budget row and carries over the previous week's budget amount.
- All dates and times use GMT+8 (Philippine Standard Time). The `getNowGMT8()` helper in `src/lib/week.ts` converts the system clock to GMT+8, and all week boundary functions use it internally.

### Expense Tracking
- Users add expenses with a description, amount, category (dropdown), date, and time.
- Date and time default to the current moment for convenience.
- The Expenses page shows three summary cards (spent today, this week, this month) and a full history table.

### Category Statistics
- The Stats page groups all expenses by category and displays a pie chart showing the proportion of spending in each category.
- Below the chart, a table shows each category's percentage and total cost, with a colored dot and mini progress bar matching the chart.

### Savings Goals
- Users create goals with a name and target amount.
- The "Update Savings" form lets users add savings to any goal.
- Progress bars visually show completion. Goals that reach 100% turn green.

---

## 7. Page-by-Page Breakdown

| Page | URL | What it shows |
|---|---|---|
| **Home** | `/` | Weekly budget doughnut chart, edit budget button, savings goals summary, this week's recent expenses |
| **Expenses** | `/expenses` | Daily/weekly/monthly spending cards, add expense form, full expense history table |
| **Stats** | `/stats` | Category breakdown pie chart, category percentage + cost table |
| **Goals** | `/goals` | Add goal form, update savings form, list of all goals with progress bars |

---

## 8. How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file and fill in Supabase credentials
cp .env.example .env

# 3. Run the database schema in Supabase SQL Editor
#    (paste contents of supabase/schema.sql)

# 4. Optionally load test data
#    (paste contents of supabase/seed.sql)

# 5. Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173/`.

---

## 9. Potential Panel Questions and Answers

**Q: Why Vue instead of React?**
A: Vue's Composition API with `<script setup>` produces shorter, more readable components. Vue has a gentler learning curve and its template syntax is closer to standard HTML, making it easier to understand at a glance.

**Q: Why Supabase instead of building your own backend?**
A: Supabase provides a hosted PostgreSQL database with a JavaScript SDK, eliminating the need to build, deploy, and maintain a separate API server. For a proof of concept, this lets us focus on the frontend features rather than backend infrastructure.

**Q: Why is the budget weekly instead of monthly?**
A: Students typically receive allowances weekly. A weekly budget cycle provides more frequent feedback on spending habits and is easier to manage than a monthly lump sum.

**Q: How does the app handle timezones?**
A: All dates and times are fixed to GMT+8 (Philippine Standard Time). The `getNowGMT8()` function in `src/lib/week.ts` converts the system clock to GMT+8 by adding 8 hours to UTC. All week boundary calculations, date defaults, and database queries use this function. The database stores timestamps without timezone information (`timestamp` instead of `timestamptz`), so dates are stored exactly as entered with no conversion.

**Q: Why not use authentication?**
A: This is a proof of concept focused on demonstrating the budgeting features. Authentication (login/registration with Supabase Auth) was originally implemented but removed to keep the scope focused. The database schema could easily add a `user_id` column and Row Level Security to support multiple users.

**Q: What is Row Level Security (RLS)?**
A: A PostgreSQL feature that restricts which rows a user can read or modify based on policies. In a production version, each table would have a `user_id` column and RLS policies ensuring users can only access their own data.

**Q: Why TypeScript instead of plain JavaScript?**
A: TypeScript catches type errors during development, before the code runs. For example, if we accidentally pass a string where a number is expected, TypeScript flags it immediately. It also helps IDEs provide better autocomplete and error checking.

**Q: What does `numeric(12, 2)` mean in the database?**
A: It stores numbers with up to 12 total digits and 2 decimal places. We use this instead of `float` because floating-point arithmetic can produce rounding errors with currency (e.g., 0.1 + 0.2 = 0.30000000000000004). `numeric` stores exact decimal values.
