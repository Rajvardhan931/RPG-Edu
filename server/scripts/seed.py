import os
import sys
import requests
from app.utils.config import Config

def seed_database():
    print("🚀 Starting SkillQuest Content Seeding via REST API...")

    url = Config.SUPABASE_URL.strip() if Config.SUPABASE_URL else ""
    key = Config.SUPABASE_KEY.strip() if Config.SUPABASE_KEY else ""

    if not url or not key:
        print("❌ Missing SUPABASE_URL or SUPABASE_KEY in .env")
        return

    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }

    def post_request(table, data):
        endpoint = f"{url}/rest/v1/{table}"
        response = requests.post(endpoint, json=data, headers=headers)
        if response.status_code >= 400:
            print(f"❌ Error inserting into {table}: {response.text}")
            return None
        return response.json()

    # 1. Seed Skills
    ai_skill_data = {
        "name": "AI Engineering",
        "description": "The art and science of building production-ready LLM applications.",
        "category": "AI"
    }
    skill_res = post_request("skills", ai_skill_data)
    if not skill_res: return
    skill_id = skill_res[0]['id']
    print(f"✅ Seeded Skill: AI Engineering ({skill_id})")

    # 2. Seed Nodes
    nodes = [
        {"name": "Basics of LLMs", "description": "Understanding Transformers, Tokens, and Probabilistic Next-Token Prediction.", "xp_reward": 100, "xp_type": "knowledge", "content_url": "https://example.com/llm-basics"},
        {"name": "Prompt Engineering", "description": "Mastering Few-Shot, Chain-of-Thought, and System Prompting.", "xp_reward": 150, "xp_type": "capability", "content_url": "https://example.com/prompt-eng"},
        {"name": "RAG Architecture", "description": "Retrieval Augmented Generation: Bridging LLMs with external data.", "xp_reward": 200, "xp_type": "knowledge", "content_url": "https://example.com/rag-arch"},
        {"name": "Vector Databases", "description": "Implementing HNSW, Cosine Similarity, and Semantic Search.", "xp_reward": 250, "xp_type": "capability", "content_url": "https://example.com/vector-db"},
        {"name": "Agentic Workflows", "description": "Building autonomous loops with Tool Use and Planning.", "xp_reward": 400, "xp_type": "capability", "content_url": "https://example.com/agents"},
    ]

    node_ids = {}
    for node in nodes:
        prereq_id = None
        if node["name"] == "Prompt Engineering": prereq_id = node_ids.get("Basics of LLMs")
        elif node["name"] == "RAG Architecture": prereq_id = node_ids.get("Basics of LLMs")
        elif node["name"] == "Vector Databases": prereq_id = node_ids.get("RAG Architecture")
        elif node["name"] == "Agentic Workflows": prereq_id = node_ids.get("Vector Databases")

        node_data = {
            "skill_id": skill_id,
            "name": node["name"],
            "description": node["description"],
            "prerequisite_id": prereq_id,
            "xp_reward": node["xp_reward"],
            "xp_type": node["xp_type"],
            "content_url": node["content_url"]
        }
        res = post_request("nodes", node_data)
        if res:
            node_id = res[0]['id']
            node_ids[node["name"]] = node_id
            print(f"✅ Seeded Node: {node['name']} ({node_id})")

    # 3. Seed Quests
    for node_name, node_id in node_ids.items():
        quest_data = {
            "node_id": node_id,
            "title": f"The Trial of {node_name}",
            "description": f"Complete a practical challenge to prove your mastery of {node_name}.",
            "requirement_type": "project" if "capability" in str(node_id) else "quiz",
            "reward_xp": 100
        }
        post_request("quests", quest_data)

    print("\n🎉 World map successfully seeded via REST API! The realm is ready for adventurers.")

if __name__ == "__main__":
    seed_database()
