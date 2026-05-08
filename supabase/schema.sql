-- ============================================================
-- Student Budget App — Database Schema (Proof of Concept)
-- Run this in the Supabase SQL Editor (supabase.com > your project > SQL Editor)
-- No authentication — single-user proof of concept
-- ============================================================

-- 1. BUDGETS TABLE
-- Stores the monthly budget amount
create table budgets (
  id uuid default gen_random_uuid() primary key,
  total_budget numeric(12, 2) not null default 0,
  created_at timestamptz default now() not null
);

-- 2. EXPENSES TABLE
-- Stores every expense transaction
create table expenses (
  id uuid default gen_random_uuid() primary key,
  description text not null,
  amount numeric(12, 2) not null,
  category text not null,
  date timestamptz not null default now(),
  created_at timestamptz default now() not null
);

-- 3. SAVINGS GOALS TABLE
-- Stores savings goals with target and progress
create table savings_goals (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  target numeric(12, 2) not null,
  saved numeric(12, 2) not null default 0,
  created_at timestamptz default now() not null
);

-- ============================================================
-- DISABLE ROW LEVEL SECURITY (proof of concept — no auth)
-- ============================================================
alter table budgets disable row level security;
alter table expenses disable row level security;
alter table savings_goals disable row level security;
