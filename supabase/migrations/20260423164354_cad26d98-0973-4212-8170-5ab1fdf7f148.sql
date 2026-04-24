-- Roles enum (Idempotent)
DO $$ BEGIN CREATE TYPE public.app_role AS ENUM ('admin', 'ngo', 'government'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE public.team_type AS ENUM ('ngo', 'government'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE public.availability_status AS ENUM ('available', 'busy', 'offline'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE public.disaster_status AS ENUM ('pending', 'in_progress', 'completed'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE public.disaster_severity AS ENUM ('low', 'medium', 'high', 'critical'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE public.assignment_status AS ENUM ('assigned', 'started', 'completed'); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT,
  role public.app_role NOT NULL DEFAULT 'ngo',
  team_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Teams
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type public.team_type NOT NULL,
  availability_status public.availability_status NOT NULL DEFAULT 'available',
  lat DOUBLE PRECISION NOT NULL DEFAULT 0,
  lng DOUBLE PRECISION NOT NULL DEFAULT 0,
  location_label TEXT NOT NULL DEFAULT '',
  workload INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Disasters
CREATE TABLE IF NOT EXISTS public.disasters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  location_label TEXT NOT NULL DEFAULT '',
  severity public.disaster_severity NOT NULL DEFAULT 'medium',
  status public.disaster_status NOT NULL DEFAULT 'pending',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.disasters ENABLE ROW LEVEL SECURITY;

-- Assignments
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disaster_id UUID NOT NULL REFERENCES public.disasters(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  status public.assignment_status NOT NULL DEFAULT 'assigned',
  notes TEXT NOT NULL DEFAULT '',
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Resources
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  lat DOUBLE PRECISION NOT NULL DEFAULT 0,
  lng DOUBLE PRECISION NOT NULL DEFAULT 0,
  location_label TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Messages (chat + broadcasts)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  is_broadcast BOOLEAN NOT NULL DEFAULT false,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- has_role security definer to avoid recursive RLS
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.current_team_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT team_id FROM public.profiles WHERE id = auth.uid()
$$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'ngo')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at trigger for disasters
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS disasters_updated_at ON public.disasters;
CREATE TRIGGER disasters_updated_at
BEFORE UPDATE ON public.disasters
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ===== RLS POLICIES =====
DO $$ BEGIN
  -- Profiles
  DROP POLICY IF EXISTS "profiles_select_all_authed" ON public.profiles;
  DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
  DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
  CREATE POLICY "profiles_select_all_authed" ON public.profiles FOR SELECT TO authenticated USING (true);
  CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());
  CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

  -- Teams
  DROP POLICY IF EXISTS "teams_select_all_authed" ON public.teams;
  DROP POLICY IF EXISTS "teams_admin_all" ON public.teams;
  DROP POLICY IF EXISTS "teams_update_own_status" ON public.teams;
  CREATE POLICY "teams_select_all_authed" ON public.teams FOR SELECT TO authenticated USING (true);
  CREATE POLICY "teams_admin_all" ON public.teams FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
  CREATE POLICY "teams_update_own_status" ON public.teams FOR UPDATE TO authenticated USING (id = public.current_team_id());

  -- Disasters
  DROP POLICY IF EXISTS "disasters_select_all_authed" ON public.disasters;
  DROP POLICY IF EXISTS "disasters_admin_all" ON public.disasters;
  CREATE POLICY "disasters_select_all_authed" ON public.disasters FOR SELECT TO authenticated USING (true);
  CREATE POLICY "disasters_admin_all" ON public.disasters FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

  -- Assignments
  DROP POLICY IF EXISTS "assignments_select_all_authed" ON public.assignments;
  DROP POLICY IF EXISTS "assignments_admin_all" ON public.assignments;
  DROP POLICY IF EXISTS "assignments_team_update" ON public.assignments;
  CREATE POLICY "assignments_select_all_authed" ON public.assignments FOR SELECT TO authenticated USING (true);
  CREATE POLICY "assignments_admin_all" ON public.assignments FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
  CREATE POLICY "assignments_team_update" ON public.assignments FOR UPDATE TO authenticated USING (team_id = public.current_team_id());

  -- Resources
  DROP POLICY IF EXISTS "resources_select_all_authed" ON public.resources;
  DROP POLICY IF EXISTS "resources_admin_all" ON public.resources;
  CREATE POLICY "resources_select_all_authed" ON public.resources FOR SELECT TO authenticated USING (true);
  CREATE POLICY "resources_admin_all" ON public.resources FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

  -- Messages
  DROP POLICY IF EXISTS "messages_select_relevant" ON public.messages;
  DROP POLICY IF EXISTS "messages_insert_self" ON public.messages;
  CREATE POLICY "messages_select_relevant" ON public.messages FOR SELECT TO authenticated USING (is_broadcast = true OR sender_id = auth.uid() OR recipient_id = auth.uid() OR (team_id IS NOT NULL AND team_id = public.current_team_id()));
  CREATE POLICY "messages_insert_self" ON public.messages FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid());

  -- Notifications
  DROP POLICY IF EXISTS "notifications_select_own" ON public.notifications;
  DROP POLICY IF EXISTS "notifications_update_own" ON public.notifications;
  DROP POLICY IF EXISTS "notifications_insert_admin" ON public.notifications;
  CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
  CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid());
  CREATE POLICY "notifications_insert_admin" ON public.notifications FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR user_id = auth.uid());
END $$;

-- Realtime
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.disasters;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.assignments;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.teams;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
EXCEPTION WHEN duplicate_object THEN null; END $$;
