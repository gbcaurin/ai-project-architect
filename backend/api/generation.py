from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from core.database import get_db
from core.auth import get_current_user
from models import User, Project, Blueprint, PromptPipeline, Analysis
from models.project_data import ProjectData
from ai.blueprint_chain import generate_blueprint
from ai.prompt_chain import generate_prompt_pipeline
from ai.analysis_chain import analyze_project
import uuid

router = APIRouter(prefix="/api/projects", tags=["generation"])


async def check_project(project_id: str, user: User, db: AsyncSession) -> Project:
    project = await db.get(Project, project_id)
    if not project or project.user_id != user.id:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


async def get_project_data(project_id: str, db: AsyncSession) -> dict:
    result = await db.execute(
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


@router.post("/{project_id}/blueprint")
async def create_blueprint(
    project_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    project = await check_project(project_id, user, db)
    project_data = await get_project_data(project_id, db)
    content = await generate_blueprint(project_data, project.title or "Project")
    bp = Blueprint(id=str(uuid.uuid4()), project_id=project_id, content=content)
    db.add(bp)
    await db.commit()
    return {"id": bp.id, "content": content}


@router.get("/{project_id}/blueprint")
async def get_blueprint(
    project_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    await check_project(project_id, user, db)
    result = await db.execute(
        select(Blueprint)
        .where(Blueprint.project_id == project_id)
        .order_by(Blueprint.created_at.desc())
    )
    bp = result.scalars().first()
    if not bp:
        raise HTTPException(status_code=404, detail="Blueprint not found")
    return {"id": bp.id, "content": bp.content, "created_at": bp.created_at}


@router.post("/{project_id}/prompts")
async def create_prompts(
    project_id: str,
    body: dict,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    await check_project(project_id, user, db)
    target_ai = body.get("target_ai", "claude")

    result = await db.execute(
        select(Blueprint)
        .where(Blueprint.project_id == project_id)
        .order_by(Blueprint.created_at.desc())
    )
    bp = result.scalars().first()
    blueprint_content = bp.content if bp else "No blueprint available."

    prompts = await generate_prompt_pipeline(blueprint_content, target_ai)
    pp = PromptPipeline(
        id=str(uuid.uuid4()),
        project_id=project_id,
        target_ai=target_ai,
        prompts=prompts
    )
    db.add(pp)
    await db.commit()
    return {"id": pp.id, "target_ai": target_ai, "prompts": prompts}


@router.get("/{project_id}/prompts/{target_ai}")
async def get_prompts(
    project_id: str,
    target_ai: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    await check_project(project_id, user, db)
    result = await db.execute(
        select(PromptPipeline)
        .where(PromptPipeline.project_id == project_id, PromptPipeline.target_ai == target_ai)
        .order_by(PromptPipeline.created_at.desc())
    )
    pp = result.scalars().first()
    if not pp:
        raise HTTPException(status_code=404, detail="Prompts not found")
    return {"id": pp.id, "target_ai": pp.target_ai, "prompts": pp.prompts}


@router.post("/{project_id}/analysis")
async def create_analysis(
    project_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    await check_project(project_id, user, db)
    project_data = await get_project_data(project_id, db)
    data = await analyze_project(project_data)

    analysis = Analysis(
        id=str(uuid.uuid4()),
        project_id=project_id,
        complexity=data.get("complexity", "moderate"),
        dev_time_days=int(data.get("dev_time_days", 30)),
        team_size=int(data.get("team_size", 2)),
        complexity_factors=data.get("complexity_factors", []),
        similar_products=data.get("similar_products", []),
        monetization_models=data.get("monetization_models", []),
        suggested_improvements=data.get("suggested_improvements", []),
    )
    db.add(analysis)
    await db.commit()
    return {"id": analysis.id, **data}


@router.get("/{project_id}/analysis")
async def get_analysis(
    project_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    await check_project(project_id, user, db)
    result = await db.execute(
        select(Analysis)
        .where(Analysis.project_id == project_id)
        .order_by(Analysis.created_at.desc())
    )
    analysis = result.scalars().first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return {
        "id": analysis.id,
        "complexity": analysis.complexity,
        "dev_time_days": analysis.dev_time_days,
        "team_size": analysis.team_size,
        "complexity_factors": analysis.complexity_factors,
        "similar_products": analysis.similar_products,
        "monetization_models": analysis.monetization_models,
        "suggested_improvements": analysis.suggested_improvements,
    }