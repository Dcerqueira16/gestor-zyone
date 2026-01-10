-- 0. Enable Extensions (Best Practice)
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  is_pro boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table profiles enable row level security;
-- Drop policies if they exist to avoid errors on re-run
drop policy if exists "Users can view own profile" on profiles;
drop policy if exists "Users can update own profile" on profiles;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- 2. SALES TABLE
create table if not exists sales (
  id uuid default gen_random_uuid() primary key, -- Changed to gen_random_uuid() which is built-in
  user_id uuid references auth.users not null,
  product_name text not null,
  cost_price numeric not null,
  sale_price numeric not null,
  date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table sales enable row level security;
drop policy if exists "Users can CRUD own sales" on sales;
create policy "Users can CRUD own sales" on sales for all using (auth.uid() = user_id);

-- 3. GOALS TABLE
create table if not exists goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  month text not null,
  target_profit numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, month)
);

alter table goals enable row level security;
drop policy if exists "Users can CRUD own goals" on goals;
create policy "Users can CRUD own goals" on goals for all using (auth.uid() = user_id);

-- 4. CUSTOMERS TABLE
create table if not exists customers (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  whatsapp text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table customers enable row level security;
drop policy if exists "Users can CRUD own customers" on customers;
create policy "Users can CRUD own customers" on customers for all using (auth.uid() = user_id);

-- 5. UPDATE SALES TABLE (Add customer relationship)
alter table sales add column if not exists customer_id uuid references customers on delete set null;

-- 6. TRIGGER (Safe create)
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger first to allow re-creation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
