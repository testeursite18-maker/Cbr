"""
Modèles SQLAlchemy - Base de données
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float, ForeignKey, JSON, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

Base = declarative_base()

class SiteMode(str, enum.Enum):
    MASONERY = "masonery"
    RESTAURANT = "restaurant"
    PETITION = "petition"

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    USER = "user"
    MODERATOR = "moderator"

# ==================== USER & AUTH ====================

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(50), unique=True, index=True, nullable=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.USER)
    
    # Champs cryptés (AES-256)
    phone_encrypted = Column(Text, nullable=True)
    email_encrypted = Column(Text, nullable=True)
    
    # Vérification
    is_verified = Column(Boolean, default=False)
    phone_verified = Column(Boolean, default=False)
    verification_token = Column(String(255), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    
    # Relations
    signatures = relationship("Signature", back_populates="user")
    reservations = relationship("Reservation", back_populates="user")

# ==================== SITE CONFIGURATION ====================

class SiteConfig(Base):
    __tablename__ = "site_config"
    
    id = Column(Integer, primary_key=True)
    mode = Column(Enum(SiteMode), default=SiteMode.MASONERY)
    
    # Logo & Branding
    logo_url = Column(String(500), nullable=True)
    logo_colors = Column(JSON, default=list)  # Palette extraite du logo
    favicon_url = Column(String(500), nullable=True)
    
    # Header
    company_name = Column(String(255), default="C.B.R. Île-de-France")
    company_tagline = Column(String(255), default="Maçonnerie & Rénovation")
    logo_text = Column(String(10), default="CBR")
    phone = Column(String(50), default="06 12 34 56 78")
    
    # Hero Section
    hero_title = Column(String(255), default="Votre Projet de Construction")
    hero_title_highlight = Column(String(255), default="Entre des Mains Expertes")
    hero_description = Column(Text, default="Entreprise familiale spécialisée...")
    hero_background_url = Column(String(500), nullable=True)
    hero_badge = Column(String(255), default="L'excellence en maçonnerie depuis 15 ans")
    
    # Buttons
    hero_button1_text = Column(String(100), default="📞 Demander un Devis Gratuit")
    hero_button1_url = Column(String(255), default="contact.html")
    hero_button2_text = Column(String(100), default="Voir nos Réalisations")
    hero_button2_url = Column(String(255), default="realisations.html")
    
    # Colors
    primary_color = Column(String(7), default="#f97316")
    secondary_color = Column(String(7), default="#dc2626")
    
    # Map
    map_latitude = Column(Float, default=48.7946)
    map_longitude = Column(Float, default=2.4172)
    map_zoom = Column(Integer, default=16)
    map_marker_title = Column(String(255), default="CBR Travaux")
    map_marker_address = Column(String(500), default="33 Rue des Pivoines, 94140 Alfortville")
    
    # Stats
    stats_experience = Column(Integer, default=15)
    stats_projects = Column(Integer, default=370)
    stats_satisfaction = Column(Integer, default=98)
    stats_this_year = Column(Integer, default=45)
    
    # Company Info
    address = Column(String(500), default="33 Rue des Pivoines, 94140 Alfortville")
    email = Column(String(255), default="contact@cbr-travaux.fr")
    hours_weekday = Column(String(100), default="7h00 - 19h00")
    hours_saturday = Column(String(100), default="8h00 - 17h00")
    hours_sunday = Column(String(100), default="Fermé")
    zones = Column(JSON, default=list)  # ["Alfortville", "Paris", ...]
    
    # Section Visibility (Toggles)
    show_header = Column(Boolean, default=True)
    show_hero = Column(Boolean, default=True)
    show_services = Column(Boolean, default=True)
    show_stats = Column(Boolean, default=True)
    show_portfolio = Column(Boolean, default=True)
    show_testimonials = Column(Boolean, default=True)
    show_map = Column(Boolean, default=True)
    show_cta = Column(Boolean, default=True)
    show_footer = Column(Boolean, default=True)
    show_faq = Column(Boolean, default=False)
    
    # Section Order (pour le drag & drop)
    section_order = Column(JSON, default=lambda: ["hero", "stats", "services", "portfolio", "testimonials", "map", "cta"])
    
    # Mode-specific config
    restaurant_config = Column(JSON, default=dict)
    petition_config = Column(JSON, default=dict)
    
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# ==================== SERVICES ====================

class Service(Base):
    __tablename__ = "services"
    
    id = Column(Integer, primary_key=True)
    icon = Column(String(50), default="🔧")
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    image_url = Column(String(500), nullable=True)
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# ==================== PORTFOLIO / REALISATIONS ====================

class PortfolioItem(Base):
    __tablename__ = "portfolio_items"
    
    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), default="Projet")
    image_url = Column(String(500), nullable=True)
    date = Column(String(100), nullable=True)
    client = Column(String(255), nullable=True)
    surface = Column(String(100), nullable=True)
    duration = Column(String(100), nullable=True)
    featured = Column(Boolean, default=True)
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# ==================== MODE MAÇONNERY - DEVIS ====================

class QuoteRequest(Base):
    __tablename__ = "quote_requests"
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    phone_encrypted = Column(Text, nullable=True)
    email = Column(String(255), nullable=False)
    email_encrypted = Column(Text, nullable=True)
    address = Column(String(500), nullable=True)
    project_type = Column(String(100), nullable=False)
    deadline = Column(String(50), nullable=True)
    message = Column(Text, nullable=False)
    
    # Statut
    status = Column(String(50), default="new")  # new, processing, completed, cancelled
    
    # Métadonnées
    ip_address = Column(String(100), nullable=True)
    user_agent = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# ==================== MODE RESTAURANT - RÉSERVATIONS ====================

class RestaurantConfig(Base):
    __tablename__ = "restaurant_config"
    
    id = Column(Integer, primary_key=True)
    
    # Capacité
    total_capacity = Column(Integer, default=50)
    tables_config = Column(JSON, default=dict)  # { "2": 10, "4": 8, "6": 4, "8+": 2 }
    
    # Horaires d'ouverture
    opening_hours = Column(JSON, default=dict)
    
    # Durée moyenne d'un service (minutes)
    service_duration = Column(Integer, default=120)
    
    # Délai avant réservation (heures)
    min_booking_hours = Column(Integer, default=2)
    max_booking_days = Column(Integer, default=30)
    
    # Options
    allow_online_payment = Column(Boolean, default=False)
    deposit_required = Column(Boolean, default=False)
    deposit_amount = Column(Float, default=0.0)

class Reservation(Base):
    __tablename__ = "reservations"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Informations client
    name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    phone_encrypted = Column(Text, nullable=True)
    email = Column(String(255), nullable=False)
    email_encrypted = Column(Text, nullable=True)
    
    # Détails réservation
    date = Column(DateTime, nullable=False)
    time = Column(String(10), nullable=False)  # "19:30"
    guests = Column(Integer, nullable=False)
    table_preference = Column(String(50), nullable=True)  # "terrasse", "salle", "privé"
    
    # Options
    occasion = Column(String(100), nullable=True)  # "Anniversaire", "Business", etc.
    special_requests = Column(Text, nullable=True)
    
    # Statut
    status = Column(String(50), default="confirmed")  # confirmed, cancelled, completed, no-show
    
    # Paiement
    deposit_paid = Column(Boolean, default=False)
    deposit_amount = Column(Float, default=0.0)
    
    # Relations
    user = relationship("User", back_populates="reservations")
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# ==================== MODE PÉTITION - SIGNATURES ====================

class PetitionConfig(Base):
    __tablename__ = "petition_config"
    
    id = Column(Integer, primary_key=True)
    
    # Informations de la pétition
    title = Column(String(500), default="Pétition pour...")
    description = Column(Text, default="Description de la pétition...")
    goal_signatures = Column(Integer, default=1000)
    
    # Image
    image_url = Column(String(500), nullable=True)
    
    # Destinataire
    recipient_name = Column(String(255), nullable=True)
    recipient_title = Column(String(255), nullable=True)
    
    # Options
    require_phone_verification = Column(Boolean, default=True)
    show_signatures_publicly = Column(Boolean, default=True)
    allow_comments = Column(Boolean, default=True)
    
    # Date butoir
    deadline = Column(DateTime, nullable=True)

class Signature(Base):
    __tablename__ = "signatures"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Informations du signataire
    first_name = Column(String(255), nullable=False)
    last_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    email_encrypted = Column(Text, nullable=True)
    phone = Column(String(50), nullable=True)
    phone_encrypted = Column(Text, nullable=True)
    
    # Vérification
    is_verified = Column(Boolean, default=False)
    verification_code = Column(String(10), nullable=True)
    verified_at = Column(DateTime, nullable=True)
    
    # Commentaire optionnel
    comment = Column(Text, nullable=True)
    
    # Visibilité
    show_name_publicly = Column(Boolean, default=True)
    
    # Relations
    user = relationship("User", back_populates="signatures")
    
    created_at = Column(DateTime, default=datetime.utcnow)

class Testimonial(Base):
    __tablename__ = "testimonials"
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    role = Column(String(255), nullable=True)
    content = Column(Text, nullable=False)
    rating = Column(Integer, default=5)
    image_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# ==================== NAVIGATION ====================

class NavigationItem(Base):
    __tablename__ = "navigation_items"
    
    id = Column(Integer, primary_key=True)
    label = Column(String(100), nullable=False)
    url = Column(String(255), nullable=False)
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    icon = Column(String(50), nullable=True)
