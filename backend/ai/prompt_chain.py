import json
import re
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from ai.llm_factory import get_llm

AI_TOOL_NOTES = {
    "claude": (
        "Claude Code works best with: full context in each prompt, explicit file paths, "
        "CLAUDE.md-style instructions, detailed acceptance criteria, and asking Claude to "
        "plan before coding. Each prompt should be self-contained and reference the architecture."
    ),
    "cursor": (
        "Cursor works best with: short focused prompts referencing existing files with @mentions, "
        "one feature per prompt, explicit instructions about what NOT to change, and clear expected output."
    ),
    "lovable": (
        "Lovable works best with: feature-focused prompts describing UI/UX behavior, "
        "Supabase-friendly stack references, clear user story format, and visual descriptions."
    ),
    "gpt": (
        "GPT works best with: detailed step-by-step instructions, explicit function signatures, "
        "expected input/output examples, and breaking complex tasks into smaller well-defined sub-tasks."
    ),
}

PROMPT_PIPELINE_TEMPLATE = """You are an expert at writing prompts for AI coding tools.

Generate a step-by-step prompt pipeline for building this project using {target_ai}.

Project Blueprint:
{blueprint}

Optimization notes for {target_ai}:
{ai_notes}

Generate exactly 6 prompts as a JSON array. Return ONLY the JSON array, no markdown:

[
  {{
    "step": 1,
    "title": "Project setup and structure",
    "prompt": "Full detailed prompt text here. This should be copy-paste ready..."
  }},
  ...
]

The 6 steps must be:
1. Project setup, folder structure, dependencies
2. Database models and data layer
3. Authentication and user management
4. Core features (backend logic and APIs)
5. Frontend UI and user interface
6. Integration, testing, and deployment setup

Requirements for each prompt:
- Self-contained: AI should act on it without needing the other prompts
- Include relevant architecture context
- Specify exact file names and folder locations
- Include example code snippets where helpful
- Be optimized for {target_ai}'s strengths and format preferences
- Each prompt should result in working, runnable code
"""

async def generate_prompt_pipeline(blueprint: str, target_ai: str) -> list[dict]:
    llm = get_llm(streaming=False, temperature=0.4)
    prompt = ChatPromptTemplate.from_template(PROMPT_PIPELINE_TEMPLATE)
    chain = prompt | llm | StrOutputParser()

    result = await chain.ainvoke({
        "blueprint": blueprint,
        "target_ai": target_ai,
        "ai_notes": AI_TOOL_NOTES.get(target_ai, "")
    })

    # Remove markdown fences
    result = re.sub(r'^```json\s*', '', result.strip())
    result = re.sub(r'\s*```$', '', result.strip())

    # Extrai o array JSON
    match = re.search(r'\[.*\]', result, re.DOTALL)
    if match:
        result = match.group(0)

    # Remove caracteres de controle inválidos
    result = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', result)

    # Substitui quebras de linha literais dentro de strings por \n
    result = re.sub(r'(?<=": ")(.*?)(?="[,\n\]])', 
                    lambda m: m.group(0).replace('\n', '\\n').replace('\r', '\\r').replace('\t', '\\t'),
                    result, flags=re.DOTALL)

    try:
        return json.loads(result)
    except Exception:
        try:
            return json.loads(result, strict=False)
        except Exception as e:
            print(f"Prompt pipeline parse error: {e}")
            return [{"step": 1, "title": "Error", "prompt": f"Failed to parse: {result[:200]}"}]