"""
Gestion de la base de données - SQLAlchemy Async
"""

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool
from models import Base
from config import settings

# Engine async
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    poolclass=NullPool if "sqlite" in settings.DATABASE_URL else None,
    future=True
)

# Session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

async def get_db():
    """Dependency pour obtenir une session DB"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

async def init_db():
    """Initialise la base de données (crée les tables)"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Base de données initialisée")

async def close_db():
    """Ferme la connexion à la base de données"""
    await engine.dispose()
