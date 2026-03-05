"""
Router Maçonnerie - Gestion des devis
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List
from slowapi import Limiter
from slowapi.util import get_remote_address

from database import get_db
from models import QuoteRequest
from schemas import QuoteRequestCreate, QuoteRequestUpdate, QuoteRequestResponse
from security import encrypt_data
from routers.auth import require_admin, get_current_user_dependency

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

@router.post("/quotes", response_model=QuoteRequestResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("3/hour")
async def create_quote_request(
    request: Request,
    quote: QuoteRequestCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Soumettre une demande de devis (limité à 3 par heure par IP)
    """
    # Crypter les données sensibles
    phone_encrypted = encrypt_data(quote.phone)
    email_encrypted = encrypt_data(quote.email)
    
    new_quote = QuoteRequest(
        name=quote.name,
        phone=quote.phone,
        phone_encrypted=phone_encrypted,
        email=quote.email,
        email_encrypted=email_encrypted,
        address=quote.address,
        project_type=quote.project_type,
        deadline=quote.deadline,
        message=quote.message,
        ip_address=request.client.host,
        user_agent=request.headers.get("user-agent")
    )
    
    db.add(new_quote)
    await db.commit()
    await db.refresh(new_quote)
    
    return new_quote

@router.get("/quotes", response_model=List[QuoteRequestResponse])
async def get_quote_requests(
    status: str = None,
    limit: int = 50,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
    admin = Depends(require_admin)
):
    """
    Récupérer les demandes de devis (admin uniquement)
    """
    query = select(QuoteRequest).order_by(desc(QuoteRequest.created_at))
    
    if status:
        query = query.where(QuoteRequest.status == status)
    
    query = query.limit(limit).offset(offset)
    result = await db.execute(query)
    
    return result.scalars().all()

@router.get("/quotes/{quote_id}", response_model=QuoteRequestResponse)
async def get_quote_request(
    quote_id: int,
    db: AsyncSession = Depends(get_db),
    admin = Depends(require_admin)
):
    """
    Récupérer une demande de devis spécifique
    """
    result = await db.execute(select(QuoteRequest).where(QuoteRequest.id == quote_id))
    quote = result.scalar_one_or_none()
    
    if not quote:
        raise HTTPException(status_code=404, detail="Demande non trouvée")
    
    return quote

@router.patch("/quotes/{quote_id}")
async def update_quote_status(
    quote_id: int,
    update: QuoteRequestUpdate,
    db: AsyncSession = Depends(get_db),
    admin = Depends(require_admin)
):
    """
    Mettre à jour le statut d'une demande de devis
    """
    result = await db.execute(select(QuoteRequest).where(QuoteRequest.id == quote_id))
    quote = result.scalar_one_or_none()
    
    if not quote:
        raise HTTPException(status_code=404, detail="Demande non trouvée")
    
    quote.status = update.status
    await db.commit()
    
    return {"message": "Statut mis à jour", "status": update.status}

@router.delete("/quotes/{quote_id}")
async def delete_quote_request(
    quote_id: int,
    db: AsyncSession = Depends(get_db),
    admin = Depends(require_admin)
):
    """
    Supprimer une demande de devis
    """
    result = await db.execute(select(QuoteRequest).where(QuoteRequest.id == quote_id))
    quote = result.scalar_one_or_none()
    
    if not quote:
        raise HTTPException(status_code=404, detail="Demande non trouvée")
    
    await db.delete(quote)
    await db.commit()
    
    return {"message": "Demande supprimée"}

@router.get("/stats")
async def get_masonery_stats(
    db: AsyncSession = Depends(get_db),
    admin = Depends(require_admin)
):
    """
    Statistiques pour le mode maçonnerie
    """
    from sqlalchemy import func
    
    result = await db.execute(select(QuoteRequest))
    quotes = result.scalars().all()
    
    total = len(quotes)
    pending = len([q for q in quotes if q.status == "new"])
    processing = len([q for q in quotes if q.status == "processing"])
    completed = len([q for q in quotes if q.status == "completed"])
    
    # Ce mois-ci
    from datetime import datetime, timedelta
    month_ago = datetime.utcnow() - timedelta(days=30)
    this_month = len([q for q in quotes if q.created_at >= month_ago])
    
    return {
        "total_quotes": total,
        "pending": pending,
        "processing": processing,
        "completed": completed,
        "this_month": this_month
    }
