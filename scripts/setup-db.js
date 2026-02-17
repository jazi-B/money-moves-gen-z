
const { Client } = require('pg');

const DATABASE_URL = "postgres://postgres.icaczzqdevksycqnshpe:OWmYxi2KktRJJHwu@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true";
// Creating connection without pgbouncer for direct queries if needed, but pgbouncer is fine for simple queries usually.
// Actually standard client is safer for direct connection: 
// "postgres://postgres.icaczzqdevksycqnshpe:OWmYxi2KktRJJHwu@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
const DIRECT_URL = "postgres://postgres.icaczzqdevksycqnshpe:OWmYxi2KktRJJHwu@aws-1-us-east-1.pooler.supabase.com:5432/postgres";


const client = new Client({
    connectionString: DIRECT_URL,
    ssl: { rejectUnauthorized: false }
});

const setupSQL = `
-- 1. Create Tables if they don't exist
CREATE TABLE IF NOT EXISTS public.settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  income numeric NOT NULL DEFAULT 0,
  target numeric NOT NULL DEFAULT 0,
  duration integer NOT NULL DEFAULT 30,
  start_date date NOT NULL DEFAULT current_date,
  gemini_api_key text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS public.savings_plan (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  date date NOT NULL,
  amount numeric NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  amount numeric NOT NULL,
  category text NOT NULL,
  date date NOT NULL DEFAULT current_date,
  note text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Disable Security Policies (RLS) for Single User Mode
ALTER TABLE public.settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_plan DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;

-- 3. Just in case foreign key exists from Auth setup (User doesn't exist now)
-- We use DO block to avoid errors if constraint does not exist
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'settings_user_id_fkey') THEN
        ALTER TABLE public.settings DROP CONSTRAINT settings_user_id_fkey;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'savings_plan_user_id_fkey') THEN
        ALTER TABLE public.savings_plan DROP CONSTRAINT savings_plan_user_id_fkey;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'transactions_user_id_fkey') THEN
        ALTER TABLE public.transactions DROP CONSTRAINT transactions_user_id_fkey;
    END IF;
END $$;
`;

async function main() {
    console.log("Connecting to Database...");
    try {
        await client.connect();
        console.log("Connected! Running setup SQL...");
        await client.query(setupSQL);
        console.log("✅ Database tables created and configured successfully!");
    } catch (err) {
        console.error("❌ Error setting up database:", err);
    } finally {
        await client.end();
    }
}

main();
