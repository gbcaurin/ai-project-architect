from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.project import Project
from models.message import Message
from models.project_data import ProjectData
from ai.interview_chain import run_interview
from ai.extraction_chain import extract_project_data


class InterviewService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_messages(self, project_id: str) -> list[dict]:
        result = await self.db.execute(
            select(Message)
            .where(Message.project_id == project_id)
            .order_by(Message.created_at)
        )
        msgs = result.scalars().all()
        return [{"role": m.role, "content": m.content} for m in msgs]

    async def save_message(self, project_id: str, role: str, content: str):
        msg = Message(project_id=project_id, role=role, content=content)
        self.db.add(msg)
        await self.db.commit()

    async def get_project_data(self, project_id: str) -> dict:
        result = await self.db.execute(
            select(ProjectData).where(ProjectData.project_id == project_id)
        )
        pd = result.scalar_one_or_none()
        if not pd:
            return {}
        return {
            "idea_summary": pd.idea_summary,
            "platform": pd.platform,
            "target_users": pd.target_users,
            "core_features": pd.core_features,
            "tech_preferences": pd.tech_preferences,
            "constraints": pd.constraints,
        }

    async def update_project_data(self, project_id: str, data: dict):
        if not data:
            return
        result = await self.db.execute(
            select(ProjectData).where(ProjectData.project_id == project_id)
        )
        pd = result.scalar_one_or_none()
        if not pd:
            pd = ProjectData(project_id=project_id)
            self.db.add(pd)
        for key, value in data.items():
            if value and hasattr(pd, key):
                setattr(pd, key, value)
        await self.db.commit()

    async def update_phase(self, project_id: str, phase: str):
        project = await self.db.get(Project, project_id)
        if project:
            project.interview_phase = phase
            await self.db.commit()

    async def set_complete(self, project_id: str):
        project = await self.db.get(Project, project_id)
        if project:
            project.status = "complete"
            project.interview_phase = "complete"
            await self.db.commit()

    async def update_title(self, project_id: str, title: str):
        project = await self.db.get(Project, project_id)
        if project and not project.title:
            project.title = title[:80]
            await self.db.commit()

    async def process_message(self, project_id: str, user_input: str):
        project = await self.db.get(Project, project_id)
        messages = await self.get_messages(project_id)
        extracted = await self.get_project_data(project_id)
        phase = project.interview_phase if project else "initial"

        await self.save_message(project_id, "user", user_input)

        full_response = ""
        async for token in run_interview(messages, user_input, extracted, phase):
            full_response += token
            yield token

        await self.save_message(project_id, "assistant", full_response)

        if len(messages) < 2 and user_input:
            short = user_input[:60] + ("..." if len(user_input) > 60 else "")
            await self.update_title(project_id, short)

        all_messages = messages + [
            {"role": "user", "content": user_input},
            {"role": "assistant", "content": full_response},
        ]

        if "[INTERVIEW_COMPLETE]" in full_response:
            await self.set_complete(project_id)
        elif phase == "initial" and len(all_messages) >= 4:
            await self.update_phase(project_id, "features")
        elif phase == "features" and len(all_messages) >= 10:
            await self.update_phase(project_id, "technical")

        try:
            extracted_data = await extract_project_data(all_messages)
            if extracted_data:
                await self.update_project_data(project_id, extracted_data)
        except Exception as e:
            print(f"Extraction failed: {e}")
