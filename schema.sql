-- =============================================================================
-- SKILLQUEST FINAL DEMO SCHEMA
-- =============================================================================

-- 1. SKILLS: The Domain Categories
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. NODES: The Skill Tree Map
CREATE TABLE nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    prerequisite_id UUID REFERENCES nodes(id),
    xp_reward INTEGER NOT NULL CHECK (xp_reward >= 0),
    xp_type TEXT NOT NULL CHECK (xp_type IN ('knowledge', 'capability')),
    content_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. PROFILES: The "Character Sheet"
-- Note: current_path_id is added later via ALTER TABLE to avoid circular dependencies
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    knowledge_xp INTEGER NOT NULL DEFAULT 0 CHECK (knowledge_xp >= 0),
    capability_xp INTEGER NOT NULL DEFAULT 0 CHECK (capability_xp >= 0),
    knowledge_level INTEGER NOT NULL DEFAULT 1 CHECK (knowledge_level >= 1),
    capability_level INTEGER NOT NULL DEFAULT 1 CHECK (capability_level >= 1),
    total_xp INTEGER NOT NULL DEFAULT 0 CHECK (total_xp >= 0),
    class_type TEXT DEFAULT 'Novice',
    ai_guidance_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. LEARNING_PATHS: AI-Generated Routes
CREATE TABLE learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    goal_text TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Link profiles to their current active path
ALTER TABLE profiles
ADD COLUMN current_path_id UUID REFERENCES learning_paths(id) ON DELETE SET NULL;

-- 5. USER_SKILLS: The Global Skill Ledger
CREATE TABLE user_skills (
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    node_id UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('locked', 'unlocked', 'completed')) DEFAULT 'locked',
    proficiency_level INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (user_id, node_id)
);

-- 6. QUESTS: The Actionable Tasks
CREATE TABLE quests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    requirement_type TEXT NOT NULL CHECK (requirement_type IN ('quiz', 'project', 'research')),
    reward_xp INTEGER NOT NULL CHECK (reward_xp >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 7. PATH_NODES: The Sequence of a Path
CREATE TABLE path_nodes (
    path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
    node_id UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
    sequence_order INTEGER NOT NULL CHECK (sequence_order > 0),
    PRIMARY KEY (path_id, node_id),
    UNIQUE (path_id, sequence_order)
);

-- =============================================================================
-- INDEXES & CONSTRAINTS
-- =============================================================================

-- Prevent multiple active paths for one user
CREATE UNIQUE INDEX idx_one_active_path_per_user
ON learning_paths (user_id)
WHERE (status = 'active');

-- Performance Indexes
CREATE INDEX idx_nodes_skill_id ON nodes(skill_id);
CREATE INDEX idx_nodes_prereq ON nodes(prerequisite_id);
CREATE INDEX idx_user_skills_user ON user_skills(user_id);
CREATE INDEX idx_user_skills_node ON user_skills(node_id);
CREATE INDEX idx_quests_node ON quests(node_id);
CREATE INDEX idx_learning_paths_user ON learning_paths(user_id);
CREATE INDEX idx_path_nodes_path ON path_nodes(path_id);
CREATE INDEX idx_path_nodes_node ON path_nodes(node_id);

-- =============================================================================
-- TRIGGERS
-- =============================================================================

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_modtime
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
