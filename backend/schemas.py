"""
Schémas Pydantic - Validation des données
"""

from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum

# ==================== ENUMS ====================

class SiteMode(str, Enum):
    MASONERY = "masonery"
    RESTAURANT = "restaurant"
    PETITION = "petition"

class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"
    MODERATOR = "moderator"

# ==================== AUTH ====================

class UserCreate(BaseModel):
    email: EmailStr
    phone: Optional[str] = None
    password: str = Field(..., min_length=8)
    
    @validator('phone')
    def validate_phone(cls, v):
        if v and not v.replace(' ', '').replace('-', '').isdigit():
            raise ValueError('Numéro de téléphone invalide')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    phone: Optional[str]
    role: UserRole
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int

# ==================== SITE CONFIG ====================

class SectionVisibility(BaseModel):
    show_header: bool = True
    show_hero: bool = True
    show_services: bool = True
    show_stats: bool = True
    show_portfolio: bool = True
    show_testimonials: bool = True
    show_map: bool = True
    show_cta: bool = True
    show_footer: bool = True
    show_faq: bool = False

class SiteConfigBase(BaseModel):
    mode: SiteMode = SiteMode.MASONERY
    
    # Branding
    company_name: str = "C.B.R. Île-de-France"
    company_tagline: str = "Maçonnerie & Rénovation"
    logo_text: str = "CBR"
    phone: str = "06 12 34 56 78"
    
    # Hero
    hero_title: str = "Votre Projet de Construction"
    hero_title_highlight: str = "Entre des Mains Expertes"
    hero_description: str = "Entreprise familiale spécialisée..."
    hero_badge: str = "L'excellence en maçonnerie depuis 15 ans"
    hero_button1_text: str = "📞 Demander un Devis Gratuit"
    hero_button1_url: str = "contact"
    hero_button2_text: str = "Voir nos Réalisations"
    hero_button2_url: str = "portfolio"
    
    # Colors
    primary_color: str = "#f97316"
    secondary_color: str = "#dc2626"
    
    # Map
    map_latitude: float = 48.7946
    map_longitude: float = 2.4172
    map_zoom: int = 16
    map_marker_title: str = "CBR Travaux"
    map_marker_address: str = "33 Rue des Pivoines, 94140 Alfortville"
    
    # Stats
    stats_experience: int = 15
    stats_projects: int = 370
    stats_satisfaction: int = 98
    stats_this_year: int = 45
    
    # Company
    address: str = "33 Rue des Pivoines, 94140 Alfortville"
    email: str = "contact@cbr-travaux.fr"
    hours_weekday: str = "7h00 - 19h00"
    hours_saturday: str = "8h00 - 17h00"
    hours_sunday: str = "Fermé"
    zones: List[str] = []
    
    # Sections
    section_order: List[str] = ["hero", "stats", "services", "portfolio", "testimonials", "map", "cta"]

class SiteConfigUpdate(BaseModel):
    mode: Optional[SiteMode] = None
    company_name: Optional[str] = None
    company_tagline: Optional[str] = None
    logo_text: Optional[str] = None
    phone: Optional[str] = None
    hero_title: Optional[str] = None
    hero_title_highlight: Optional[str] = None
    hero_description: Optional[str] = None
    hero_badge: Optional[str] = None
    hero_button1_text: Optional[str] = None
    hero_button1_url: Optional[str] = None
    hero_button2_text: Optional[str] = None
    hero_button2_url: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    map_latitude: Optional[float] = None
    map_longitude: Optional[float] = None
    map_zoom: Optional[int] = None
    map_marker_title: Optional[str] = None
    map_marker_address: Optional[str] = None
    stats_experience: Optional[int] = None
    stats_projects: Optional[int] = None
    stats_satisfaction: Optional[int] = None
    stats_this_year: Optional[int] = None
    address: Optional[str] = None
    email: Optional[str] = None
    hours_weekday: Optional[str] = None
    hours_saturday: Optional[str] = None
    hours_sunday: Optional[str] = None
    zones: Optional[List[str]] = None
    section_order: Optional[List[str]] = None

class SiteConfigResponse(SiteConfigBase):
    id: int
    logo_url: Optional[str]
    logo_colors: List[str]
    show_header: bool
    show_hero: bool
    show_services: bool
    show_stats: bool
    show_portfolio: bool
    show_testimonials: bool
    show_map: bool
    show_cta: bool
    show_footer: bool
    show_faq: bool
    updated_at: datetime
    
    class Config:
        from_attributes = True

# ==================== SERVICES ====================

class ServiceCreate(BaseModel):
    icon: str = "🔧"
    title: str
    description: str
    image_url: Optional[str] = None
    order: int = 0
    is_active: bool = True

class ServiceUpdate(BaseModel):
    icon: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None

class ServiceResponse(ServiceCreate):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# ==================== PORTFOLIO ====================

class PortfolioItemCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: str = "Projet"
    image_url: Optional[str] = None
    date: Optional[str] = None
    client: Optional[str] = None
    surface: Optional[str] = None
    duration: Optional[str] = None
    featured: bool = True
    order: int = 0
    is_active: bool = True

class PortfolioItemUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    date: Optional[str] = None
    client: Optional[str] = None
    surface: Optional[str] = None
    duration: Optional[str] = None
    featured: Optional[bool] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None

class PortfolioItemResponse(PortfolioItemCreate):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# ==================== QUOTE REQUESTS (MASONERY) ====================

class QuoteRequestCreate(BaseModel):
    name: str = Field(..., min_length=2)
    phone: str = Field(..., min_length=10)
    email: EmailStr
    address: Optional[str] = None
    project_type: str
    deadline: Optional[str] = None
    message: str = Field(..., min_length=20)

class QuoteRequestUpdate(BaseModel):
    status: str  # new, processing, completed, cancelled

class QuoteRequestResponse(BaseModel):
    id: int
    name: str
    phone: str
    email: str
    address: Optional[str]
    project_type: str
    deadline: Optional[str]
    message: str
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# ==================== RESERVATIONS (RESTAURANT) ====================

class ReservationCreate(BaseModel):
    name: str = Field(..., min_length=2)
    phone: str = Field(..., min_length=10)
    email: EmailStr
    date: datetime
    time: str = Field(..., regex=r"^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$")
    guests: int = Field(..., ge=1, le=20)
    table_preference: Optional[str] = None
    occasion: Optional[str] = None
    special_requests: Optional[str] = None

class ReservationUpdate(BaseModel):
    status: str  # confirmed, cancelled, completed, no-show

class ReservationResponse(BaseModel):
    id: int
    name: str
    phone: str
    email: str
    date: datetime
    time: str
    guests: int
    table_preference: Optional[str]
    occasion: Optional[str]
    special_requests: Optional[str]
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# ==================== SIGNATURES (PETITION) ====================

class SignatureCreate(BaseModel):
    first_name: str = Field(..., min_length=2)
    last_name: str = Field(..., min_length=2)
    email: EmailStr
    phone: Optional[str] = None
    comment: Optional[str] = None
    show_name_publicly: bool = True

class SignatureVerify(BaseModel):
    signature_id: int
    verification_code: str = Field(..., min_length=4, max_length=10)

class SignatureResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    phone: Optional[str]
    comment: Optional[str]
    is_verified: bool
    show_name_publicly: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class PetitionStats(BaseModel):
    total_signatures: int
    verified_signatures: int
    goal_signatures: int
    progress_percentage: float
    recent_signatures: List[SignatureResponse]

# ==================== NAVIGATION ====================

class NavigationItemCreate(BaseModel):
    label: str
    url: str
    order: int = 0
    is_active: bool = True
    icon: Optional[str] = None

class NavigationItemResponse(NavigationItemCreate):
    id: int
    
    class Config:
        from_attributes = True

# ==================== DASHBOARD ====================

class DashboardStats(BaseModel):
    mode: SiteMode
    
    # Global stats
    total_visitors: int = 0
    total_page_views: int = 0
    
    # Mode-specific stats
    masonery_quotes_pending: Optional[int] = None
    masonery_quotes_total: Optional[int] = None
    
    restaurant_reservations_today: Optional[int] = None
    restaurant_reservations_upcoming: Optional[int] = None
    restaurant_capacity_percentage: Optional[float] = None
    
    petition_signatures_total: Optional[int] = None
    petition_signatures_verified: Optional[int] = None
    petition_goal_percentage: Optional[float] = None
    
    # Recent activity
    recent_activity: List[dict] = []

class ModeSwitchRequest(BaseModel):
    mode: SiteMode
    preserve_data: bool = True
