from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.prompt_pipeline import PromptPipeline
from models.blueprint import Blueprint
from ai.prompt_chain import generate_prompt_pipeline


class PromptService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_pipeline(self, project_id: str, target_ai: str):
        result = await self.db.execute(
            select(PromptPipeline)
            .where(PromptPipeline.project_id == project_id, PromptPipeline.target_ai == target_ai)
            .order_by(PromptPipeline.created_at.desc())
        )
        return result.scalar_one_or_none()

    async def create_pipeline(self, project_id: str, target_ai: str):
        result = await self.db.execute(
            select(Blueprint).where(Blueprint.project_id == project_id).order_by(Blueprint.created_at.desc())
        )
        blueprint = result.scalar_one_or_none()
        blueprint_content = blueprint.content if blueprint else "No blueprint available."

        prompts = await generate_prompt_pipeline(blueprint_content, target_ai)

        pipeline = PromptPipeline(project_id=project_id, target_ai=target_ai, prompts=prompts)
        self.db.add(pipeline)
        await self.db.commit()
        await self.db.refresh(pipeline)
        return pipeline
