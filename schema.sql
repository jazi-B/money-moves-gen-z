-- Settings Table
create table if not exists public.settings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid default auth.uid() references auth.users not null unique,
  income numeric not null default 0,
  target numeric not null default 0,
  duration integer not null default 30,
  start_date date not null default current_date,
  gemini_api_key text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Savings Plan Table
create table if not exists public.savings_plan (
  id uuid default gen_random_uuid() primary key,
  user_id uuid default auth.uid() references auth.users not null,
  date date not null,
  amount numeric not null,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Transactions Table
create table if not exists public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid default auth.uid() references auth.users not null,
  amount numeric not null,
  category text not null,
  date date not null default current_date,
  note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS)
alter table public.settings enable row level security;
alter table public.savings_plan enable row level security;
alter table public.transactions enable row level security;

-- Policies for Settings
create policy "Users can view own settings" on public.settings
  for select using (auth.uid() = user_id);

create policy "Users can insert own settings" on public.settings
  for insert with check (auth.uid() = user_id);

create policy "Users can update own settings" on public.settings
  for update using (auth.uid() = user_id);

create policy "Users can delete own settings" on public.settings
  for delete using (auth.uid() = user_id);

-- Policies for Savings Plan
create policy "Users can view own savings plan" on public.savings_plan
  for select using (auth.uid() = user_id);

create policy "Users can insert own savings plan" on public.savings_plan
  for insert with check (auth.uid() = user_id);

create policy "Users can update own savings plan" on public.savings_plan
  for update using (auth.uid() = user_id);
  
create policy "Users can delete own savings plan" on public.savings_plan
  for delete using (auth.uid() = user_id);

-- Policies for Transactions
create policy "Users can view own transactions" on public.transactions
  for select using (auth.uid() = user_id);

create policy "Users can insert own transactions" on public.transactions
  for insert with check (auth.uid() = user_id);

create policy "Users can update own transactions" on public.transactions
  for update using (auth.uid() = user_id);

create policy "Users can delete own transactions" on public.transactions
  for delete using (auth.uid() = user_id);
