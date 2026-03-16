import json
from langchain_core.messages import HumanMessage
from ai.llm_factory import get_llm

EXTRACTION_PROMPT = """Extraia informações estruturadas de projeto desta conversa.
Retorne APENAS JSON válido, sem markdown:

{{"idea_summary": "resumo em 1-2 frases", "platform": "web|mobile|saas|api|", "target_users": "descrição dos usuários", "core_features": [{{"name": "...", "description": "...", "details": {{}}}}], "tech_preferences": {{"frontend": null, "backend": null, "database": null}}, "constraints": "restrições mencionadas"}}

Conversa:
{conversation}"""

ANALYSIS_PROMPT = """Analise este projeto e forneça estimativas. Retorne APENAS JSON válido:

{{"complexity": "simple|moderate|complex|enterprise", "dev_time_days": 30, "team_size": 2, "complexity_factors": ["fator1", "fator2"], "similar_products": [{{"name": "...", "url": "...", "similarity": "..."}}], "monetization_models": [{{"model": "...", "fit": "high|medium|low", "reasoning": "..."}}], "suggested_improvements": ["melhoria1", "melhoria2"]}}

Projeto:
{project_data}"""


async def extract_project_data(conversation: list) -> dict:
    llm = get_llm(streaming=False, temperature=0.1)
    conv_text = "\n".join([f"{m['role'].upper()}: {m['content']}" for m in conversation[-30:]])
    try:
        result = await llm.ainvoke([HumanMessage(content=EXTRACTION_PROMPT.format(conversation=conv_text))])
        content = result.content if hasattr(result, "content") else str(result)
        content = content.strip().lstrip("```json").lstrip("```").rstrip("```").strip()
        return json.loads(content)
    except Exception:
        from ai.mock_llm import EXTRACTION_TEMPLATE
        return EXTRACTION_TEMPLATE


async def analyze_project(project_data: dict) -> dict:
    llm = get_llm(streaming=False, temperature=0.2)
    try:
        result = await llm.ainvoke([HumanMessage(content=ANALYSIS_PROMPT.format(project_data=json.dumps(project_data, ensure_ascii=False, indent=2)))])
        content = result.content if hasattr(result, "content") else str(result)
        content = content.strip().lstrip("```json").lstrip("```").rstrip("```").strip()
        return json.loads(content)
    except Exception:
        from ai.mock_llm import ANALYSIS_TEMPLATE
        return ANALYSIS_TEMPLATE
