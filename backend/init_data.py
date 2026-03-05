"""
Script d'initialisation des données par défaut
"""

import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from database import AsyncSessionLocal, init_db
from models import (
    SiteConfig, Service, NavigationItem, 
    RestaurantConfig, PetitionConfig, User
)
from security import hash_password

async def create_default_admin(db: AsyncSession):
    """Créer un administrateur par défaut"""
    result = await db.execute(
        User.__table__.select().where(User.email == "admin@saas.local")
    )
    existing = result.fetchone()
    
    if not existing:
        admin = User(
            email="admin@saas.local",
            phone="0612345678",
            phone_encrypted=None,
            email_encrypted=None,
            hashed_password=hash_password("admin123"),  # À changer en production!
            role="admin",
            is_verified=True
        )
        db.add(admin)
        await db.commit()
        print("✅ Administrateur créé: admin@saas.local / admin123")
    else:
        print("ℹ️ Administrateur déjà existant")

async def create_default_services(db: AsyncSession):
    """Créer les services par défaut"""
    result = await db.execute(Service.__table__.select())
    existing = result.fetchall()
    
    if not existing:
        services = [
            Service(
                icon="🏗️",
                title="Maçonnerie Traditionnelle",
                description="Construction et rénovation de murs, façades et structures en pierre, brique ou parpaing.",
                order=0,
                is_active=True
            ),
            Service(
                icon="🔨",
                title="Rénovation Complète",
                description="Transformation intégrale de vos espaces avec respect des normes et délais.",
                order=1,
                is_active=True
            ),
            Service(
                icon="🚜",
                title="Terrassement",
                description="Préparation des sols, fondations et aménagements extérieurs.",
                order=2,
                is_active=True
            ),
            Service(
                icon="🏠",
                title="Extension de Maison",
                description="Agrandissement de votre habitat avec des solutions sur mesure.",
                order=3,
                is_active=True
            ),
            Service(
                icon="🎨",
                title="Finitions",
                description="Enduits, peintures et finitions de qualité pour un rendu parfait.",
                order=4,
                is_active=True
            ),
            Service(
                icon="🌿",
                title="Aménagement Extérieur",
                description="Terrasses, allées et espaces verts pour sublimer votre extérieur.",
                order=5,
                is_active=True
            )
        ]
        
        for service in services:
            db.add(service)
        
        await db.commit()
        print("✅ Services par défaut créés")
    else:
        print("ℹ️ Services déjà existants")

async def create_default_navigation(db: AsyncSession):
    """Créer la navigation par défaut"""
    result = await db.execute(NavigationItem.__table__.select())
    existing = result.fetchall()
    
    if not existing:
        items = [
            NavigationItem(label="Accueil", url="/", order=0, is_active=True),
            NavigationItem(label="Services", url="/services", order=1, is_active=True),
            NavigationItem(label="Réalisations", url="/portfolio", order=2, is_active=True),
            NavigationItem(label="Témoignages", url="/testimonials", order=3, is_active=True),
            NavigationItem(label="Contact", url="/contact", order=4, is_active=True),
        ]
        
        for item in items:
            db.add(item)
        
        await db.commit()
        print("✅ Navigation par défaut créée")
    else:
        print("ℹ️ Navigation déjà existante")

async def create_default_configs(db: AsyncSession):
    """Créer les configurations par défaut"""
    # Site Config
    result = await db.execute(SiteConfig.__table__.select())
    site_config = result.fetchone()
    
    if not site_config:
        config = SiteConfig(
            mode="masonery",
            company_name="C.B.R. Île-de-France",
            company_tagline="Maçonnerie & Rénovation",
            logo_text="CBR",
            phone="06 12 34 56 78",
            hero_title="Votre Projet de Construction",
            hero_title_highlight="Entre des Mains Expertes",
            hero_description="Entreprise familiale spécialisée dans la maçonnerie, la rénovation et la construction à Alfortville et en Île-de-France.",
            hero_badge="L'excellence en maçonnerie depuis 15 ans",
            hero_button1_text="📞 Demander un Devis Gratuit",
            hero_button1_url="/contact",
            hero_button2_text="Voir nos Réalisations",
            hero_button2_url="/portfolio",
            primary_color="#f97316",
            secondary_color="#dc2626",
            map_latitude=48.7946,
            map_longitude=2.4172,
            map_zoom=16,
            map_marker_title="CBR Travaux",
            map_marker_address="33 Rue des Pivoines, 94140 Alfortville",
            stats_experience=15,
            stats_projects=370,
            stats_satisfaction=98,
            stats_this_year=45,
            address="33 Rue des Pivoines, 94140 Alfortville",
            email="contact@cbr-travaux.fr",
            hours_weekday="7h00 - 19h00",
            hours_saturday="8h00 - 17h00",
            hours_sunday="Fermé",
            zones=["Alfortville", "Paris", "Val-de-Marne", "Seine-Saint-Denis", "Essonne", "Hauts-de-Seine"],
            show_header=True,
            show_hero=True,
            show_services=True,
            show_stats=True,
            show_portfolio=True,
            show_testimonials=True,
            show_map=True,
            show_cta=True,
            show_footer=True,
            show_faq=False,
            section_order=["hero", "stats", "services", "portfolio", "testimonials", "map", "cta"]
        )
        db.add(config)
        await db.commit()
        print("✅ Configuration du site créée")
    else:
        print("ℹ️ Configuration du site déjà existante")
    
    # Restaurant Config
    result = await db.execute(RestaurantConfig.__table__.select())
    restaurant_config = result.fetchone()
    
    if not restaurant_config:
        resto = RestaurantConfig(
            total_capacity=50,
            tables_config={"2": 10, "4": 8, "6": 4, "8+": 2},
            opening_hours={
                "monday": {"open": "12:00", "close": "14:30", "open_evening": "19:00", "close_evening": "22:30"},
                "tuesday": {"open": "12:00", "close": "14:30", "open_evening": "19:00", "close_evening": "22:30"},
                "wednesday": {"open": "12:00", "close": "14:30", "open_evening": "19:00", "close_evening": "22:30"},
                "thursday": {"open": "12:00", "close": "14:30", "open_evening": "19:00", "close_evening": "22:30"},
                "friday": {"open": "12:00", "close": "14:30", "open_evening": "19:00", "close_evening": "23:00"},
                "saturday": {"open": "12:00", "close": "15:00", "open_evening": "19:00", "close_evening": "23:00"},
                "sunday": {"open": "12:00", "close": "15:00", "open_evening": "19:00", "close_evening": "22:00"},
            },
            service_duration=120,
            min_booking_hours=2,
            max_booking_days=30,
            allow_online_payment=False,
            deposit_required=False,
            deposit_amount=0.0
        )
        db.add(resto)
        await db.commit()
        print("✅ Configuration restaurant créée")
    else:
        print("ℹ️ Configuration restaurant déjà existante")
    
    # Petition Config
    result = await db.execute(PetitionConfig.__table__.select())
    petition_config = result.fetchone()
    
    if not petition_config:
        petition = PetitionConfig(
            title="Pour une ville plus verte et durable",
            description="Nous demandons à la mairie d'engager des actions concrètes pour réduire l'empreinte carbone de notre ville et améliorer la qualité de l'air.",
            goal_signatures=1000,
            recipient_name="Monsieur le Maire",
            recipient_title="Maire de la ville",
            require_phone_verification=True,
            show_signatures_publicly=True,
            allow_comments=True,
            deadline=None
        )
        db.add(petition)
        await db.commit()
        print("✅ Configuration pétition créée")
    else:
        print("ℹ️ Configuration pétition déjà existante")

async def init_all_data():
    """Initialiser toutes les données par défaut"""
    await init_db()
    
    async with AsyncSessionLocal() as db:
        await create_default_admin(db)
        await create_default_services(db)
        await create_default_navigation(db)
        await create_default_configs(db)
    
    print("\n✅ Initialisation terminée!")

if __name__ == "__main__":
    asyncio.run(init_all_data())
