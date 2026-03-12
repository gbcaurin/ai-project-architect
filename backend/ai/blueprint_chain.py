from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from ai.llm_factory import get_llm

BLUEPRINT_PROMPT = """You are a senior software architect. Based on this project data, generate a complete software blueprint in Markdown.

Project data:
{project_data}

Generate a detailed blueprint with these exact sections. Be specific and technical:

# {title} — Software Blueprint

## Product Overview
[What it does, who it's for, the core value proposition]

## Target Users
[Detailed user personas]

## Core MVP Features
[List each feature with:
- Description
- User story: "As a [user], I want to [action] so that [benefit]"
- Acceptance criteria]

## Recommended Tech Stack
[Frontend, Backend, Database, Auth, Deployment — with brief reasoning for each choice]

## System Architecture
[Describe the main components and how they interact. Include a text-based architecture diagram using ASCII]

## Database Design
[Key entities, their fields, and relationships. Use simple table notation]

## Project Folder Structure
[The recommended folder structure with brief comments]

## Development Roadmap
[Phase 1 (MVP), Phase 2 (growth), Phase 3 (scale) — with time estimates and priorities]

## Key Technical Decisions
[Important trade-offs and recommendations]

Be concrete and actionable. This blueprint will be fed directly into an AI coding assistant.
"""

async def generate_blueprint(project_data: dict, title: str) -> str:
    llm = get_llm(streaming=False, temperature=0.3)
    prompt = ChatPromptTemplate.from_template(BLUEPRINT_PROMPT)
    chain = prompt | llm | StrOutputParser()

    return await chain.ainvoke({
        "project_data": str(project_data),
        "title": title or "Project"
    })
