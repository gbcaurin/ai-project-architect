import json
import re
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from ai.llm_factory import get_llm

EXTRACTION_PROMPT = """Extract structured project information from this conversation history.
Return ONLY valid JSON — no markdown, no explanation, just the JSON object.

Schema:
{{
  "idea_summary": "one paragraph description of what the product does",
  "platform": "web|mobile|saas|api|desktop|null",
  "target_users": "description of who uses this",
  "core_features": [
    {{"name": "feature name", "description": "what it does", "details": {{}}}}
  ],
  "tech_preferences": {{
    "frontend": "React/Vue/etc or null",
    "backend": "FastAPI/Node/etc or null",
    "database": "Postgres/MySQL/etc or null",
    "other": []
  }},
  "constraints": "any constraints mentioned (budget, time, team, etc)"
}}

If information is not mentioned, use null for strings or [] for arrays.

Conversation:
{conversation}
"""

async def extract_project_data(messages: list[dict]) -> dict:
    if len(messages) < 2:
        return {}

    conv_text = "\n".join([
        f"{m['role'].upper()}: {m['content']}"
        for m in messages
    ])

    llm = get_llm(streaming=False, temperature=0.1)
    prompt = ChatPromptTemplate.from_template(EXTRACTION_PROMPT)
    chain = prompt | llm | StrOutputParser()

    try:
        result = await chain.ainvoke({"conversation": conv_text})
        # Strip markdown if present
        result = re.sub(r'^```json\s*', '', result.strip())
        result = re.sub(r'\s*```$', '', result.strip())
        return json.loads(result)
    except Exception as e:
        print(f"Extraction error: {e}")
        return {}
