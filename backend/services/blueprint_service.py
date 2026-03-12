from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.blueprint import Blueprint
from models.project_data import ProjectData
from models.project import Project
from ai.blueprint_chain import generate_blueprint


class BlueprintService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_blueprint(self, project_id: str):
        result = await self.db.execute(
            select(Blueprint).where(Blueprint.project_id == project_id).order_by(Blueprint.created_at.desc())
        )
        return result.scalar_one_or_none()

    async def create_blueprint(self, project_id: str):
        project = await self.db.get(Project, project_id)
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

        content = await generate_blueprint(project_data, project.title if project else "Project")

        blueprint = Blueprint(project_id=project_id, content=content)
        self.db.add(blueprint)
        await self.db.commit()
        await self.db.refresh(blueprint)
        return blueprint
