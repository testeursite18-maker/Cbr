"""
Router Pétition - Gestion des signatures
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, func
from typing import List, Optional
from datetime import datetime, timedelta
from slowapi import Limiter
from slowapi.util import get_remote_address

from database import get_db
from models import Signature, PetitionConfig, User
from schemas import SignatureCreate, SignatureVerify, SignatureResponse, PetitionStats
from security import encrypt_data, generate_verification_code
from routers.auth import require_admin, get_current_user_dependency

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

@router.get("/config")
async def get_petition_config(db: AsyncSession = Depends(get_db)):
    """Récupérer la configuration de la pétition"""
    result = await db.execute(select(PetitionConfig).limit(1))
    config = result.scalar_one_or_none()
    
    if not config:
        config = PetitionConfig()
        db.add(config)
        await db.commit()
        await db.refresh(config)
    
    return config

@router.put("/config")
async def update_petition_config(
    config_update: dict,
    db: AsyncSession = Depends(get_db),
    admin = Depends(require_admin)
):
    """Mettre à jour la configuration de la pétition"""
    result = await db.execute(select(PetitionConfig).limit(1))
    config = result.scalar_one_or_none()
    
    if not config:
        raise HTTPException(status_code=404, detail="Configuration non trouvée")
    
    for field, value in config_update.items():
        if hasattr(config, field):
            setattr(config, field, value)
    
    await db.commit()
    await db.refresh(config)
    
    return config

@router.post("/sign", response_model=SignatureResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("3/hour")
async def sign_petition(
    request: Request,
    signature: SignatureCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Signer la pétition
    """
    # Vérifier si l'email a déjà signé
    result = await db.execute(select(Signature).where(Signature.email == signature.email))
    existing = result.scalar_one_or_none()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cette adresse email a déjà signé la pétition"
        )
    
    # Générer un code de vérification
    verification_code = generate_verification_code(6)
    
    # Crypter les données sensibles
    phone_encrypted = encrypt_data(signature.phone) if signature.phone else None
    email_encrypted = encrypt_data(signature.email)
    
    new_signature = Signature(
        first_name=signature.first_name,
        last_name=signature.last_name,
        email=signature.email,
        email_encrypted=email_encrypted,
        phone=signature.phone,
        phone_encrypted=phone_encrypted,
        comment=signature.comment,
        show_name_publicly=signature.show_name_publicly,
        is_verified=False,
        verification_code=verification_code
    )
    
    db.add(new_signature)
    await db.commit()
    await db.refresh(new_signature)
    
    # TODO: Envoyer le code de vérification par SMS si téléphone fourni
    
    return new_signature

@router.post("/verify")
async def verify_signature(
    verify_data: SignatureVerify,
    db: AsyncSession = Depends(get_db)
):
    """Vérifier une signature avec le code"""
    result = await db.execute(
        select(Signature).where(Signature.id == verify_data.signature_id)
    )
    signature = result.scalar_one_or_none()
    
    if not signature:
        raise HTTPException(status_code=404, detail="Signature non trouvée")
    
    if signature.verification_code != verify_data.verification_code:
        raise HTTPException(status_code=400, detail="Code de vérification incorrect")
    
    signature.is_verified = True
    signature.verified_at = datetime.utcnow()
    await db.commit()
    
    return {"message": "Signature vérifiée avec succès", "verified": True}

@router.get("/signatures", response_model=List[SignatureResponse])
async def get_signatures(
    verified_only: bool = True,
    limit: int = 100,
    offset: int = 0,
    db: AsyncSession = Depends(get_db)
):
    """Récupérer les signatures publiques"""
    query = select(Signature).order_by(desc(Signature.created_at))
    
    if verified_only:
        query = query.where(Signature.is_verified == True)
    
    query = query.limit(limit).offset(offset)
    result = await db.execute(query)
    
    return result.scalars().all()

@router.get("/signatures/{signature_id}", response_model=SignatureResponse)
async def get_signature(
    signature_id: int,
    db: AsyncSession = Depends(get_db),
    admin = Depends(require_admin)
):
    """Récupérer une signature spécifique (admin uniquement)"""
    result = await db.execute(select(Signature).where(Signature.id == signature_id))
    signature = result.scalar_one_or_none()
    
    if not signature:
        raise HTTPException(status_code=404, detail="Signature non trouvée")
    
    return signature

@router.delete("/signatures/{signature_id}")
async def delete_signature(
    signature_id: int,
    db: AsyncSession = Depends(get_db),
    admin = Depends(require_admin)
):
    """Supprimer une signature"""
    result = await db.execute(select(Signature).where(Signature.id == signature_id))
    signature = result.scalar_one_or_none()
    
    if not signature:
        raise HTTPException(status_code=404, detail="Signature non trouvée")
    
    await db.delete(signature)
    await db.commit()
    
    return {"message": "Signature supprimée"}

@router.get("/stats", response_model=PetitionStats)
async def get_petition_stats(db: AsyncSession = Depends(get_db)):
    """Statistiques de la pétition"""
    result = await db.execute(select(PetitionConfig).limit(1))
    config = result.scalar_one_or_none()
    
    if not config:
        config = PetitionConfig()
    
    # Compter les signatures
    total_result = await db.execute(select(func.count(Signature.id)))
    total_signatures = total_result.scalar()
    
    verified_result = await db.execute(
        select(func.count(Signature.id)).where(Signature.is_verified == True)
    )
    verified_signatures = verified_result.scalar()
    
    # Signatures récentes (7 derniers jours)
    week_ago = datetime.utcnow() - timedelta(days=7)
    recent_result = await db.execute(
        select(Signature)
        .where(Signature.created_at >= week_ago)
        .order_by(desc(Signature.created_at))
        .limit(10)
    )
    recent_signatures = recent_result.scalars().all()
    
    # Calculer le pourcentage d'objectif
    goal = config.goal_signatures if config else 1000
    progress_percentage = (verified_signatures / goal * 100) if goal > 0 else 0
    
    return PetitionStats(
        total_signatures=total_signatures,
        verified_signatures=verified_signatures,
        goal_signatures=goal,
        progress_percentage=round(progress_percentage, 2),
        recent_signatures=recent_signatures
    )

@router.get("/progress")
async def get_petition_progress(db: AsyncSession = Depends(get_db)):
    """Progression de la pétition pour affichage public"""
    result = await db.execute(select(PetitionConfig).limit(1))
    config = result.scalar_one_or_none()
    
    if not config:
        config = PetitionConfig()
    
    verified_result = await db.execute(
        select(func.count(Signature.id)).where(Signature.is_verified == True)
    )
    verified_signatures = verified_result.scalar()
    
    goal = config.goal_signatures
    progress_percentage = (verified_signatures / goal * 100) if goal > 0 else 0
    
    return {
        "current": verified_signatures,
        "goal": goal,
        "percentage": round(progress_percentage, 2),
        "remaining": max(0, goal - verified_signatures)
    }
