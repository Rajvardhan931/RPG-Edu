# SkillQuest Database Schema (Adaptive Edition)

## 1. Profiles (`profiles`)
The "Character Sheet" and AI guidance state.
- `id`: UUID (PK, references `auth.users`)
- `username`: TEXT (Unique)
- `knowledge_xp`: INTEGER
- `capability_xp`: INTEGER
- `knowledge_level`: INTEGER
- `capability_level`: INTEGER
- `total_xp`: INTEGER
- `class_type`: TEXT (e.g., 'Architect', 'Coder')
- `current_goal`: TEXT (The user's current AI-driven objective)
- `ai_guidance_enabled`: BOOLEAN (Whether the AI is currently routing the user)
- `current_path_id`: UUID (FK to `learning_paths`)
- `created_at`: TIMESTAMPTZ
- `updated_at`: TIMESTAMPTZ

## 2. Skills (`skills`)
Domain categories.
- `id`: UUID (PK)
- `name`: TEXT
- `description`: TEXT
- `category`: TEXT
- `created_at`: TIMESTAMPTZ

## 3. Nodes (`nodes`)
The individual learning units.
- `id`: UUID (PK)
- `skill_id`: UUID (FK to `skills`)
- `name`: TEXT
- `description`: TEXT
- `prerequisite_id`: UUID (FK to `nodes`, self-reference)
- `xp_reward`: INTEGER
- `xp_type`: TEXT ('knowledge' or 'capability')
- `content_url`: TEXT
- `created_at`: TIMESTAMPTZ

## 4. User Skills (`user_skills`)
The skill ledger tracking progress.
- `user_id`: UUID (FK to `profiles`)
- `node_id`: UUID (FK to `nodes`)
- `status`: TEXT ('locked', 'unlocked', 'completed')
- `proficiency_level`: INTEGER
- `completed_at`: TIMESTAMPTZ
- PK: `(user_id, node_id)`

## 5. Quests (`quests`)
Actionable tasks to unlock nodes.
- `id`: UUID (PK)
- `node_id`: UUID (FK to `nodes`)
- `title`: TEXT
- `description`: TEXT
- `requirement_type`: TEXT ('quiz', 'project', 'research')
- `reward_xp`: INTEGER
- `created_at`: TIMESTAMPTZ

## 6. Learning Paths (`learning_paths`)
AI-generated routes based on goals.
- `id`: UUID (PK)
- `user_id`: UUID (FK to `profiles`)
- `goal_text`: TEXT
- `created_at`: TIMESTAMPTZ

## 7. Path Nodes (`path_nodes`)
The ordered sequence of nodes within a path.
- `path_id`: UUID (FK to `learning_paths`)
- `node_id`: UUID (FK to `nodes`)
- `sequence_order`: INTEGER
- PK: `(path_id, node_id)`
