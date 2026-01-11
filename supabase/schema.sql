--
-- Create custom ENUM types
--
CREATE TYPE public.gear_slot AS ENUM (
    'main',
    'sub',
    'range',
    'ammo',
    'head',
    'body',
    'hands',
    'legs',
    'feet',
    'neck',
    'waist',
    'ear1',
    'ear2',
    'ring1',
    'ring2',
    'back'
);

--
-- Create tables
--

CREATE TABLE public.game_accounts (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    color_code text
);

CREATE TABLE public.items (
    id text NOT NULL,
    category text NOT NULL,
    
    name_en text,
    name_ja text,

    description_en text,
    description_ja text,
    
    slot public.gear_slot,
    jobs text[],
    
    equip_level integer DEFAULT 0,
    item_level integer DEFAULT 0,

    base_stats jsonb,

    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.characters (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    name text NOT NULL,
    world text NOT NULL,
    account_label text,
    race text,
    gender text,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    game_account_id uuid,
    last_job_code text DEFAULT 'WAR'::text
);

CREATE TABLE public.character_gears (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    character_id uuid,
    job_code text NOT NULL,
    slot public.gear_slot NOT NULL,
    item_id text,
    status text DEFAULT 'owned'::text,
    updated_at timestamp with time zone DEFAULT now(),
    category text
);

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    username text,
    avatar_url text
);

CREATE TABLE public.recipe_groups (
    id text NOT NULL,
    name text NOT NULL,
    category text,
    description text
);

CREATE TABLE public.inventories (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    character_id uuid NOT NULL,
    item_id text NOT NULL,
    quantity integer NOT NULL DEFAULT 0,
    location text NOT NULL DEFAULT 'inventory'::text,
    updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.recipes (
    id integer NOT NULL,
    result_item_id text NOT NULL,
    recipe_type text DEFAULT 'upgrade'::text,
    base_item_id text,
    material_item_id text NOT NULL,
    quantity integer DEFAULT 1,
    acquisition_note text
);

CREATE TABLE public.recipe_requirements (
    id integer NOT NULL,
    group_id text NOT NULL,
    item_id text NOT NULL,
    quantity integer NOT NULL,
    step_name text
);

CREATE TABLE public.user_targets (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    character_id uuid NOT NULL,
    group_id text NOT NULL,
    status text DEFAULT 'in_progress'::text,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    priority integer DEFAULT 1,
    user_note text
);

CREATE TABLE public.gear_progression (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    character_id uuid NOT NULL,
    group_name text NOT NULL,
    job_code text,
    slot text NOT NULL,
    current_item_id integer,
    updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.user_roles (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    role text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

--
-- Add constraints
--

-- Primary Keys
ALTER TABLE public.game_accounts ADD CONSTRAINT game_accounts_pkey PRIMARY KEY (id);
ALTER TABLE public.items ADD CONSTRAINT items_pkey PRIMARY KEY (id);
ALTER TABLE public.characters ADD CONSTRAINT characters_pkey PRIMARY KEY (id);
ALTER TABLE public.character_gears ADD CONSTRAINT character_gears_pkey PRIMARY KEY (id);
ALTER TABLE public.profiles ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);
ALTER TABLE public.recipe_groups ADD CONSTRAINT recipe_groups_pkey PRIMARY KEY (id);
ALTER TABLE public.inventories ADD CONSTRAINT inventories_pkey PRIMARY KEY (id);
ALTER TABLE public.recipes ADD CONSTRAINT recipes_pkey PRIMARY KEY (id);
ALTER TABLE public.recipe_requirements ADD CONSTRAINT recipe_requirements_pkey PRIMARY KEY (id);
ALTER TABLE public.user_targets ADD CONSTRAINT user_targets_pkey PRIMARY KEY (id);
ALTER TABLE public.gear_progression ADD CONSTRAINT gear_progression_pkey PRIMARY KEY (id);
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);

-- Unique Constraints
ALTER TABLE public.character_gears ADD CONSTRAINT character_gears_upsert_key UNIQUE (character_id, job_code, category, slot);
ALTER TABLE public.inventories ADD CONSTRAINT inventories_character_id_item_id_location_key UNIQUE (character_id, item_id, location);
ALTER TABLE public.user_targets ADD CONSTRAINT user_targets_character_id_group_id_key UNIQUE (character_id, group_id);
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


-- Foreign Keys
ALTER TABLE public.game_accounts ADD CONSTRAINT game_accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);

ALTER TABLE public.characters ADD CONSTRAINT characters_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);
ALTER TABLE public.characters ADD CONSTRAINT characters_account_id_fkey FOREIGN KEY (game_account_id) REFERENCES public.game_accounts(id) ON DELETE SET NULL;

ALTER TABLE public.character_gears ADD CONSTRAINT character_gears_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id) ON DELETE CASCADE;
ALTER TABLE public.character_gears ADD CONSTRAINT character_gears_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(id);

ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id);

ALTER TABLE public.inventories ADD CONSTRAINT inventories_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id) ON DELETE CASCADE;
ALTER TABLE public.inventories ADD CONSTRAINT inventories_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(id);

ALTER TABLE public.recipes ADD CONSTRAINT recipes_result_item_id_fkey FOREIGN KEY (result_item_id) REFERENCES public.items(id);
ALTER TABLE public.recipes ADD CONSTRAINT recipes_base_item_id_fkey FOREIGN KEY (base_item_id) REFERENCES public.items(id);
ALTER TABLE public.recipes ADD CONSTRAINT recipes_material_item_id_fkey FOREIGN KEY (material_item_id) REFERENCES public.items(id);

ALTER TABLE public.recipe_requirements ADD CONSTRAINT recipe_requirements_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.recipe_groups(id) ON DELETE CASCADE;
ALTER TABLE public.recipe_requirements ADD CONSTRAINT recipe_requirements_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(id);

ALTER TABLE public.user_targets ADD CONSTRAINT user_targets_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);
ALTER TABLE public.user_targets ADD CONSTRAINT user_targets_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id) ON DELETE CASCADE;
ALTER TABLE public.user_targets ADD CONSTRAINT user_targets_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.recipe_groups(id);

ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
