-- ============================================================
-- Student Budget App — Test Data
-- Run this AFTER schema.sql in the Supabase SQL Editor
-- ============================================================

-- Weekly budget for the current week (May 5, 2026 is a Monday)
insert into budgets (week_start, total_budget) values
  ('2026-04-20', 2500.00),
  ('2026-04-27', 2500.00),
  ('2026-05-04', 3000.00);

-- Expenses across the past few weeks
insert into expenses (description, amount, category, date) values
  -- This week (May 4–10, 2026)
  ('Jollibee Lunch',          189.00, 'Food',          '2026-05-08T12:30:00'),
  ('Grab to School',           85.00, 'Transport',     '2026-05-08T07:45:00'),
  ('Milk Tea',                 120.00, 'Food',          '2026-05-07T15:00:00'),
  ('Photocopy Notes',           25.00, 'Education',     '2026-05-07T10:20:00'),
  ('Globe Load',              100.00, 'Bills',         '2026-05-06T09:00:00'),
  ('7-Eleven Snacks',          78.50, 'Food',          '2026-05-06T16:30:00'),
  ('Jeepney Fare',             26.00, 'Transport',     '2026-05-05T07:30:00'),
  ('School Supplies',         245.00, 'Education',     '2026-05-05T13:00:00'),
  ('Netflix Subscription',    249.00, 'Entertainment', '2026-05-04T08:00:00'),

  -- Last week (Apr 27 – May 3, 2026)
  ('Grocery (SM)',             650.00, 'Food',          '2026-05-03T11:00:00'),
  ('Grab to Mall',             120.00, 'Transport',     '2026-05-03T10:00:00'),
  ('Samgyupsal Dinner',       399.00, 'Food',          '2026-05-02T19:00:00'),
  ('Gym Membership',          500.00, 'Health',        '2026-05-01T07:00:00'),
  ('Laundry',                 150.00, 'Bills',         '2026-04-30T09:30:00'),
  ('Coffee Shop Study',        165.00, 'Food',          '2026-04-29T14:00:00'),
  ('Jeepney Fare',             26.00, 'Transport',     '2026-04-28T07:30:00'),
  ('Textbook Secondhand',     350.00, 'Education',     '2026-04-27T12:00:00'),

  -- Two weeks ago (Apr 20–26, 2026)
  ('Water Bill Split',        200.00, 'Bills',         '2026-04-25T10:00:00'),
  ('Chicken Inasal',          159.00, 'Food',          '2026-04-24T12:30:00'),
  ('Movie Night',             250.00, 'Entertainment', '2026-04-23T19:30:00'),
  ('Tricycle Fare',            30.00, 'Transport',     '2026-04-22T08:00:00'),
  ('Vitamins',                380.00, 'Health',        '2026-04-21T09:00:00'),
  ('Rice & Ulam',              95.00, 'Food',          '2026-04-20T12:00:00');

-- Savings goals with varying progress
insert into savings_goals (name, target, saved) values
  ('New Laptop',       25000.00, 12500.00),
  ('Emergency Fund',    5000.00,  1800.00),
  ('Semester Books',    3000.00,  3000.00),
  ('Birthday Gift',    1500.00,   400.00),
  ('Summer Trip',      8000.00,     0.00);
