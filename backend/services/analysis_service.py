from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.analysis import Analysis
from models.project_data import ProjectData
from ai.analysis_chain import generate_analysis


class AnalysisService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_analysis(self, project_id: str):
        result = await self.db.execute(
            select(Analysis).where(Analysis.project_id == project_id).order_by(Analysis.created_at.desc())
        )
        return result.scalar_one_or_none()

    async def create_analysis(self, project_id: str):
        result = await self.db.execute(
            select(ProjectData).where(ProjectData.project_id == project_id)
        )
        pd = result.scalar_one_or_none()

        project_data = {}
        if pd:
            project_data = {
                "idea_summary": pd.idea_summary,
                "platform": pd.platform,
                "target_users": pd.target_users,
                "core_features": pd.core_features,
                "tech_preferences": pd.tech_preferences,
                "constraints": pd.constraints,
            }

        data = await generate_analysis(project_data)

        analysis = Analysis(
            project_id=project_id,
            **{k: v for k, v in data.items() if k in [
                "complexity", "dev_time_days", "team_size",
                "complexity_factors", "similar_products",
                "monetization_models", "suggested_improvements"
            ]}
        )
        self.db.add(analysis)
        await self.db.commit()
        await self.db.refresh(analysis)
        return analysis
