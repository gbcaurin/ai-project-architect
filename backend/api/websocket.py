import json
import uuid
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy import select, desc
from core.database import AsyncSessionLocal
from models import Project, Message, ProjectData, Blueprint, PromptPipeline, Analysis
from ai.interview_chain import run_interview_chain
from ai.analysis_chain import extract_project_data, analyze_project
from ai.blueprint_chain import generate_blueprint
from ai.prompt_chain import generate_prompt_pipeline

router = APIRouter(tags=["websocket"])


async def get_project_messages(db, project_id: str) -> list:
    result = await db.execute(
        select(Message).where(Message.project_id == project_id).order_by(Message.created_at)
    )
    msgs = result.scalars().all()
    return [{"role": m.role, "content": m.content} for m in msgs]


async def get_or_create_project_data(db, project_id: str) -> dict:
    result = await db.execute(select(ProjectData).where(ProjectData.project_id == project_id))
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


async def save_project_data(db, project_id: str, data: dict):
    result = await db.execute(select(ProjectData).where(ProjectData.project_id == project_id))
    pd = result.scalar_one_or_none()
    if not pd:
        pd = ProjectData(id=str(uuid.uuid4()), project_id=project_id)
        db.add(pd)

    pd.idea_summary = str(data.get("idea_summary", ""))[:500]
    pd.platform = str(data.get("platform", ""))[:50]
    pd.target_users = str(data.get("target_users", ""))[:500]
    pd.core_features = data.get("core_features", [])
    pd.tech_preferences = data.get("tech_preferences", {})
    pd.constraints = str(data.get("constraints", ""))[:500]
    await db.commit()

    project = await db.get(Project, project_id)
    if project and pd.idea_summary:
        project.title = pd.idea_summary[:60]
        await db.commit()


async def run_generation(db, project_id: str):
    messages = await get_project_messages(db, project_id)
    project_data = await get_or_create_project_data(db, project_id)

    title = str(project_data.get("idea_summary") or "Project")[:60]
    blueprint_content = await generate_blueprint(project_data, title)
    bp = Blueprint(id=str(uuid.uuid4()), project_id=project_id, content=blueprint_content)
    db.add(bp)
    await db.commit()

    for target_ai in ["claude", "cursor", "lovable", "gpt"]:
        try:
            prompts = await generate_prompt_pipeline(blueprint_content, target_ai)
            pp = PromptPipeline(
                id=str(uuid.uuid4()),
                project_id=project_id,
                target_ai=target_ai,
                prompts=prompts,
            )
            db.add(pp)
        except Exception:
            pass
    await db.commit()

    analysis_data = await analyze_project(project_data)
    analysis = Analysis(
        id=str(uuid.uuid4()),
        project_id=project_id,
        complexity=analysis_data.get("complexity", "moderate"),
        dev_time_days=int(analysis_data.get("dev_time_days", 30)),
        team_size=int(analysis_data.get("team_size", 2)),
        complexity_factors=analysis_data.get("complexity_factors", []),
        similar_products=analysis_data.get("similar_products", []),
        monetization_models=analysis_data.get("monetization_models", []),
        suggested_improvements=analysis_data.get("suggested_improvements", []),
    )
    db.add(analysis)

    project = await db.get(Project, project_id)
    if project:
        project.status = "complete"
        project.interview_phase = "complete"
    await db.commit()


@router.websocket("/ws/interview/{project_id}")
async def interview_websocket(websocket: WebSocket, project_id: str):
    await websocket.accept()

    async with AsyncSessionLocal() as db:
        project = await db.get(Project, project_id)
        if not project:
            await websocket.send_json({"type": "error", "content": "Projeto não encontrado"})
            await websocket.close()
            return

        try:
            while True:
                raw = await websocket.receive_text()
                data = json.loads(raw)
                user_content = data.get("content", "").strip()
                if not user_content:
                    continue

                user_msg = Message(
                    id=str(uuid.uuid4()),
                    project_id=project_id,
                    role="user",
                    content=user_content,
                )
                db.add(user_msg)
                await db.commit()

                messages = await get_project_messages(db, project_id)
                extracted_data = await get_or_create_project_data(db, project_id)
                phase = project.interview_phase

                full_response = ""
                async for token in run_interview_chain(messages, extracted_data, phase):
                    full_response += token
                    await websocket.send_json({"type": "token", "content": token})

                ai_msg = Message(
                    id=str(uuid.uuid4()),
                    project_id=project_id,
                    role="assistant",
                    content=full_response,
                )
                db.add(ai_msg)

                msg_count = len([m for m in messages if m["role"] == "user"])
                if "[INTERVIEW_COMPLETE]" in full_response or msg_count >= 9:
                    project.interview_phase = "complete"
                    await db.commit()

                    all_messages = await get_project_messages(db, project_id)
                    extracted = await extract_project_data(all_messages)
                    await save_project_data(db, project_id, extracted)

                    await websocket.send_json({"type": "done", "phase": "complete"})
                    await websocket.send_json({"type": "generating", "message": "Gerando blueprint..."})

                    await run_generation(db, project_id)
                    await websocket.send_json({"type": "generation_complete"})
                    break
                else:
                    if msg_count < 2:
                        project.interview_phase = "initial"
                    elif msg_count < 5:
                        project.interview_phase = "features"
                    elif msg_count < 8:
                        project.interview_phase = "technical"

                    if msg_count % 3 == 0:
                        all_messages = await get_project_messages(db, project_id)
                        extracted = await extract_project_data(all_messages)
                        await save_project_data(db, project_id, extracted)

                    await db.commit()
                    await websocket.send_json({"type": "done", "phase": project.interview_phase})

        except WebSocketDisconnect:
            pass
        except Exception as e:
            try:
                await websocket.send_json({"type": "error", "content": str(e)})
            except Exception:
                pass
