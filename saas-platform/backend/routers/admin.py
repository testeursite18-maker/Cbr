"""
Router Admin - Configuration du site, gestion des sections
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from typing import List, Optional

from database import get_db
from models import SiteConfig, Service, PortfolioItem, NavigationItem, User, QuoteRequest, Reservation, Signature, SiteMode
from schemas import (
    SiteConfigUpdate, SiteConfigResponse, SectionVisibility,
    ServiceCreate, ServiceUpdate, ServiceResponse,
    PortfolioItemCreate, PortfolioItemUpdate, PortfolioItemResponse,
    NavigationItemCreate, NavigationItemResponse,
    DashboardStats, ModeSwitchRequest
)
from routers.auth import require_admin, get_current_user_dependency

router = APIRouter()

# ==================== SITE CONFIGURATION ====================

@router.get("/config", response_model=SiteConfigResponse)
async def get_site_config(db: AsyncSession = Depends(get_db)):
    """Récupérer la configuration du site"""
    result = await db.execute(select(SiteConfig).limit(1))
    config = result.scalar_one_or_none()
    
    if not config:
        # Créer une configuration par défaut
        config = SiteConfig()
        db.add(config)
        await db.commit()
        await db.refresh(config)
    
    return config

@router.put("/config", response_model=SiteConfigResponse)
async def update_site_config(
    config_update: SiteConfigUpdate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Mettre à jour la configuration du site"""
    result = await db.execute(select(SiteConfig).limit(1))
    config = result.scalar_one_or_none()
    
    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Configuration non trouvée"
        )
    
    # Mettre à jour les champs
    update_data = config_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(config, field, value)
    
    await db.commit()
    await db.refresh(config)
    
    return config

@router.patch("/config/visibility")
async def update_section_visibility(
    visibility: SectionVisibility,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Mettre à jour la visibilité des sections"""
    result = await db.execute(select(SiteConfig).limit(1))
    config = result.scalar_one_or_none()
    
    if not config:
        raise HTTPException(status_code=404, detail="Configuration non trouvée")
    
    config.show_header = visibility.show_header
    config.show_hero = visibility.show_hero
    config.show_services = visibility.show_services
    config.show_stats = visibility.show_stats
    config.show_portfolio = visibility.show_portfolio
    config.show_testimonials = visibility.show_testimonials
    config.show_map = visibility.show_map
    config.show_cta = visibility.show_cta
    config.show_footer = visibility.show_footer
    config.show_faq = visibility.show_faq
    
    await db.commit()
    await db.refresh(config)
    
    return {"message": "Visibilité des sections mise à jour"}

@router.post("/config/mode")
async def switch_site_mode(
    mode_request: ModeSwitchRequest,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Changer le mode du site (maçonnerie, restaurant, pétition)"""
    result = await db.execute(select(SiteConfig).limit(1))
    config = result.scalar_one_or_none()
    
    if not config:
        raise HTTPException(status_code=404, detail="Configuration non trouvée")
    
    old_mode = config.mode
    config.mode = mode_request.mode
    
    # Adapter les sections visibles selon le mode
    if mode_request.mode == SiteMode.RESTAURANT:
        config.show_reservation = True
        config.show_portfolio = False
    elif mode_request.mode == SiteMode.PETITION:
        config.show_signature_form = True
        config.show_stats = True
    
    await db.commit()
    
    return {
        "message": f"Mode changé de {old_mode} à {mode_request.mode}",
        "mode": mode_request.mode,
        "preserve_data": mode_request.preserve_data
    }

@router.put("/config/section-order")
async def update_section_order(
    section_order: List[str],
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Mettre à jour l'ordre des sections (drag & drop)"""
    result = await db.execute(select(SiteConfig).limit(1))
    config = result.scalar_one_or_none()
    
    if not config:
        raise HTTPException(status_code=404, detail="Configuration non trouvée")
    
    config.section_order = section_order
    await db.commit()
    
    return {"message": "Ordre des sections mis à jour", "order": section_order}

# ==================== SERVICES ====================

@router.get("/services", response_model=List[ServiceResponse])
async def get_services(db: AsyncSession = Depends(get_db)):
    """Récupérer tous les services"""
    result = await db.execute(
        select(Service).where(Service.is_active == True).order_by(Service.order)
    )
    return result.scalars().all()

@router.post("/services", response_model=ServiceResponse, status_code=status.HTTP_201_CREATED)
async def create_service(
    service: ServiceCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Créer un nouveau service"""
    new_service = Service(**service.dict())
    db.add(new_service)
    await db.commit()
    await db.refresh(new_service)
    return new_service

@router.put("/services/{service_id}", response_model=ServiceResponse)
async def update_service(
    service_id: int,
    service_update: ServiceUpdate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Mettre à jour un service"""
    result = await db.execute(select(Service).where(Service.id == service_id))
    service = result.scalar_one_or_none()
    
    if not service:
        raise HTTPException(status_code=404, detail="Service non trouvé")
    
    update_data = service_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(service, field, value)
    
    await db.commit()
    await db.refresh(service)
    return service

@router.delete("/services/{service_id}")
async def delete_service(
    service_id: int,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Supprimer un service"""
    result = await db.execute(select(Service).where(Service.id == service_id))
    service = result.scalar_one_or_none()
    
    if not service:
        raise HTTPException(status_code=404, detail="Service non trouvé")
    
    await db.delete(service)
    await db.commit()
    
    return {"message": "Service supprimé"}

# ==================== PORTFOLIO ====================

@router.get("/portfolio", response_model=List[PortfolioItemResponse])
async def get_portfolio_items(db: AsyncSession = Depends(get_db)):
    """Récupérer toutes les réalisations"""
    result = await db.execute(
        select(PortfolioItem)
        .where(PortfolioItem.is_active == True)
        .order_by(PortfolioItem.order)
    )
    return result.scalars().all()

@router.post("/portfolio", response_model=PortfolioItemResponse, status_code=status.HTTP_201_CREATED)
async def create_portfolio_item(
    item: PortfolioItemCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Créer une nouvelle réalisation"""
    new_item = PortfolioItem(**item.dict())
    db.add(new_item)
    await db.commit()
    await db.refresh(new_item)
    return new_item

@router.put("/portfolio/{item_id}", response_model=PortfolioItemResponse)
async def update_portfolio_item(
    item_id: int,
    item_update: PortfolioItemUpdate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Mettre à jour une réalisation"""
    result = await db.execute(select(PortfolioItem).where(PortfolioItem.id == item_id))
    item = result.scalar_one_or_none()
    
    if not item:
        raise HTTPException(status_code=404, detail="Réalisation non trouvée")
    
    update_data = item_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(item, field, value)
    
    await db.commit()
    await db.refresh(item)
    return item

@router.delete("/portfolio/{item_id}")
async def delete_portfolio_item(
    item_id: int,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Supprimer une réalisation"""
    result = await db.execute(select(PortfolioItem).where(PortfolioItem.id == item_id))
    item = result.scalar_one_or_none()
    
    if not item:
        raise HTTPException(status_code=404, detail="Réalisation non trouvée")
    
    await db.delete(item)
    await db.commit()
    
    return {"message": "Réalisation supprimée"}

# ==================== NAVIGATION ====================

@router.get("/navigation", response_model=List[NavigationItemResponse])
async def get_navigation(db: AsyncSession = Depends(get_db)):
    """Récupérer les éléments de navigation"""
    result = await db.execute(
        select(NavigationItem)
        .where(NavigationItem.is_active == True)
        .order_by(NavigationItem.order)
    )
    return result.scalars().all()

@router.post("/navigation", response_model=NavigationItemResponse)
async def create_navigation_item(
    item: NavigationItemCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Créer un élément de navigation"""
    new_item = NavigationItem(**item.dict())
    db.add(new_item)
    await db.commit()
    await db.refresh(new_item)
    return new_item

@router.put("/navigation/{item_id}")
async def update_navigation_item(
    item_id: int,
    item_update: NavigationItemCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Mettre à jour un élément de navigation"""
    result = await db.execute(select(NavigationItem).where(NavigationItem.id == item_id))
    item = result.scalar_one_or_none()
    
    if not item:
        raise HTTPException(status_code=404, detail="Élément non trouvé")
    
    for field, value in item_update.dict().items():
        setattr(item, field, value)
    
    await db.commit()
    await db.refresh(item)
    return item

@router.delete("/navigation/{item_id}")
async def delete_navigation_item(
    item_id: int,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Supprimer un élément de navigation"""
    result = await db.execute(select(NavigationItem).where(NavigationItem.id == item_id))
    item = result.scalar_one_or_none()
    
    if not item:
        raise HTTPException(status_code=404, detail="Élément non trouvé")
    
    await db.delete(item)
    await db.commit()
    
    return {"message": "Élément supprimé"}

# ==================== DASHBOARD ====================

@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Récupérer les statistiques du dashboard"""
    result = await db.execute(select(SiteConfig).limit(1))
    config = result.scalar_one_or_none()
    
    if not config:
        raise HTTPException(status_code=404, detail="Configuration non trouvée")
    
    stats = DashboardStats(mode=config.mode)
    
    # Stats selon le mode
    if config.mode == SiteMode.MASONERY:
        from sqlalchemy import func
        quotes_result = await db.execute(select(QuoteRequest))
        quotes = quotes_result.scalars().all()
        stats.masonery_quotes_total = len(quotes)
        stats.masonery_quotes_pending = len([q for q in quotes if q.status == "new"])
    
    elif config.mode == SiteMode.RESTAURANT:
        from datetime import datetime, timedelta
        today = datetime.utcnow().date()
        reservations_result = await db.execute(select(Reservation))
        reservations = reservations_result.scalars().all()
        
        stats.restaurant_reservations_total = len(reservations)
        stats.restaurant_reservations_today = len([
            r for r in reservations 
            if r.date.date() == today
        ])
        stats.restaurant_reservations_upcoming = len([
            r for r in reservations 
            if r.date.date() >= today and r.status == "confirmed"
        ])
    
    elif config.mode == SiteMode.PETITION:
        signatures_result = await db.execute(select(Signature))
        signatures = signatures_result.scalars().all()
        
        stats.petition_signatures_total = len(signatures)
        stats.petition_signatures_verified = len([s for s in signatures if s.is_verified])
        
        # Récupérer la config de la pétition
        from models import PetitionConfig
        petition_result = await db.execute(select(PetitionConfig).limit(1))
        petition_config = petition_result.scalar_one_or_none()
        
        if petition_config:
            goal = petition_config.goal_signatures
            stats.petition_goal_percentage = (stats.petition_signatures_verified / goal * 100) if goal > 0 else 0
    
    return stats
