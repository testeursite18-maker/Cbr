"""
Router Restaurant - Gestion des réservations
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, and_
from typing import List, Optional
from datetime import datetime, date, time, timedelta
from slowapi import Limiter
from slowapi.util import get_remote_address

from database import get_db
from models import Reservation, RestaurantConfig
from schemas import ReservationCreate, ReservationUpdate, ReservationResponse
from security import encrypt_data
from routers.auth import require_admin, get_current_user_dependency

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

@router.get("/config")
async def get_restaurant_config(db: AsyncSession = Depends(get_db)):
    """Récupérer la configuration du restaurant"""
    result = await db.execute(select(RestaurantConfig).limit(1))
    config = result.scalar_one_or_none()
    
    if not config:
        # Créer config par défaut
        config = RestaurantConfig()
        db.add(config)
        await db.commit()
        await db.refresh(config)
    
    return config

@router.put("/config")
async def update_restaurant_config(
    config_update: dict,
    db: AsyncSession = Depends(get_db),
    admin = Depends(require_admin)
):
    """Mettre à jour la configuration du restaurant"""
    result = await db.execute(select(RestaurantConfig).limit(1))
    config = result.scalar_one_or_none()
    
    if not config:
        raise HTTPException(status_code=404, detail="Configuration non trouvée")
    
    for field, value in config_update.items():
        if hasattr(config, field):
            setattr(config, field, value)
    
    await db.commit()
    await db.refresh(config)
    
    return config

@router.post("/reservations", response_model=ReservationResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/hour")
async def create_reservation(
    request: Request,
    reservation: ReservationCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Créer une nouvelle réservation
    """
    # Vérifier la disponibilité
    result = await db.execute(select(RestaurantConfig).limit(1))
    config = result.scalar_one_or_none()
    
    if config:
        # Vérifier le délai minimum
        min_time = datetime.utcnow() + timedelta(hours=config.min_booking_hours)
        reservation_datetime = datetime.combine(reservation.date.date(), 
            datetime.strptime(reservation.time, "%H:%M").time())
        
        if reservation_datetime < min_time:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Les réservations doivent être faites au moins {config.min_booking_hours}h à l'avance"
            )
    
    # Crypter les données sensibles
    phone_encrypted = encrypt_data(reservation.phone)
    email_encrypted = encrypt_data(reservation.email)
    
    new_reservation = Reservation(
        name=reservation.name,
        phone=reservation.phone,
        phone_encrypted=phone_encrypted,
        email=reservation.email,
        email_encrypted=email_encrypted,
        date=reservation.date,
        time=reservation.time,
        guests=reservation.guests,
        table_preference=reservation.table_preference,
        occasion=reservation.occasion,
        special_requests=reservation.special_requests,
        status="confirmed"
    )
    
    db.add(new_reservation)
    await db.commit()
    await db.refresh(new_reservation)
    
    return new_reservation

@router.get("/reservations", response_model=List[ReservationResponse])
async def get_reservations(
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    admin = Depends(require_admin)
):
    """Récupérer les réservations (admin uniquement)"""
    query = select(Reservation).order_by(desc(Reservation.date))
    
    if date_from:
        query = query.where(Reservation.date >= datetime.combine(date_from, time.min))
    if date_to:
        query = query.where(Reservation.date <= datetime.combine(date_to, time.max))
    if status:
        query = query.where(Reservation.status == status)
    
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/reservations/today", response_model=List[ReservationResponse])
async def get_today_reservations(
    db: AsyncSession = Depends(get_db),
    admin = Depends(require_admin)
):
    """Récupérer les réservations du jour"""
    today = datetime.utcnow().date()
    
    result = await db.execute(
        select(Reservation)
        .where(
            and_(
                Reservation.date >= datetime.combine(today, time.min),
                Reservation.date <= datetime.combine(today, time.max)
            )
        )
        .order_by(Reservation.time)
    )
    
    return result.scalars().all()

@router.get("/reservations/{reservation_id}", response_model=ReservationResponse)
async def get_reservation(
    reservation_id: int,
    db: AsyncSession = Depends(get_db),
    admin = Depends(require_admin)
):
    """Récupérer une réservation spécifique"""
    result = await db.execute(select(Reservation).where(Reservation.id == reservation_id))
    reservation = result.scalar_one_or_none()
    
    if not reservation:
        raise HTTPException(status_code=404, detail="Réservation non trouvée")
    
    return reservation

@router.patch("/reservations/{reservation_id}")
async def update_reservation_status(
    reservation_id: int,
    update: ReservationUpdate,
    db: AsyncSession = Depends(get_db),
    admin = Depends(require_admin)
):
    """Mettre à jour le statut d'une réservation"""
    result = await db.execute(select(Reservation).where(Reservation.id == reservation_id))
    reservation = result.scalar_one_or_none()
    
    if not reservation:
        raise HTTPException(status_code=404, detail="Réservation non trouvée")
    
    reservation.status = update.status
    await db.commit()
    
    return {"message": "Statut mis à jour", "status": update.status}

@router.delete("/reservations/{reservation_id}")
async def delete_reservation(
    reservation_id: int,
    db: AsyncSession = Depends(get_db),
    admin = Depends(require_admin)
):
    """Supprimer une réservation"""
    result = await db.execute(select(Reservation).where(Reservation.id == reservation_id))
    reservation = result.scalar_one_or_none()
    
    if not reservation:
        raise HTTPException(status_code=404, detail="Réservation non trouvée")
    
    await db.delete(reservation)
    await db.commit()
    
    return {"message": "Réservation supprimée"}

@router.get("/availability")
async def check_availability(
    date: date,
    guests: int,
    db: AsyncSession = Depends(get_db)
):
    """Vérifier la disponibilité pour une date et un nombre de personnes"""
    result = await db.execute(select(RestaurantConfig).limit(1))
    config = result.scalar_one_or_none()
    
    if not config:
        return {"available": True, "slots": []}
    
    # Récupérer les réservations existantes pour cette date
    reservations_result = await db.execute(
        select(Reservation)
        .where(
            and_(
                Reservation.date >= datetime.combine(date, time.min),
                Reservation.date <= datetime.combine(date, time.max),
                Reservation.status == "confirmed"
            )
        )
    )
    reservations = reservations_result.scalars().all()
    
    # Calculer les créneaux disponibles
    # Simplification: retourner les créneaux standards
    standard_slots = ["12:00", "12:30", "13:00", "19:00", "19:30", "20:00", "20:30", "21:00"]
    
    # Filtrer les créneaux complets (simplification)
    available_slots = standard_slots  # À améliorer avec la logique de capacité réelle
    
    return {
        "date": date.isoformat(),
        "guests": guests,
        "available_slots": available_slots,
        "total_reservations": len(reservations)
    }

@router.get("/stats")
async def get_restaurant_stats(
    db: AsyncSession = Depends(get_db),
    admin = Depends(require_admin)
):
    """Statistiques pour le mode restaurant"""
    today = datetime.utcnow().date()
    
    result = await db.execute(select(Reservation))
    reservations = result.scalars().all()
    
    total = len(reservations)
    today_count = len([r for r in reservations if r.date.date() == today])
    upcoming = len([r for r in reservations if r.date.date() >= today and r.status == "confirmed"])
    
    # Ce mois-ci
    month_ago = datetime.utcnow() - timedelta(days=30)
    this_month = len([r for r in reservations if r.created_at >= month_ago])
    
    return {
        "total_reservations": total,
        "today": today_count,
        "upcoming": upcoming,
        "this_month": this_month
    }
