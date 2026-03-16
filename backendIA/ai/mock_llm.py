"""Fallback templates when LLM extraction/analysis fails. Used by analysis_chain."""

EXTRACTION_TEMPLATE = {
    "idea_summary": "",
    "platform": "",
    "target_users": "",
    "core_features": [],
    "tech_preferences": {"frontend": None, "backend": None, "database": None},
    "constraints": "",
}

ANALYSIS_TEMPLATE = {
    "complexity": "moderate",
    "dev_time_days": 30,
    "team_size": 2,
    "complexity_factors": [],
    "similar_products": [],
    "monetization_models": [],
    "suggested_improvements": [],
}
