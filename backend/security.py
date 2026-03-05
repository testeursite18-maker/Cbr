"""
Module de sécurité - Hashing Argon2, Encryption AES-256, JWT
"""

from passlib.context import CryptContext
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from jose import JWTError, jwt
from datetime import datetime, timedelta
import base64
import os

from config import settings

# ==================== PASSWORD HASHING (Argon2) ====================

pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto",
    argon2__time_cost=settings.ARGON2_TIME_COST,
    argon2__memory_cost=settings.ARGON2_MEMORY_COST,
    argon2__parallelism=settings.ARGON2_PARALLELISM,
)

def hash_password(password: str) -> str:
    """Hash un mot de passe avec Argon2"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Vérifie un mot de passe contre son hash"""
    return pwd_context.verify(plain_password, hashed_password)

# ==================== AES-256 ENCRYPTION ====================

def get_encryption_key() -> bytes:
    """Génère une clé de chiffrement à partir de la clé configurée"""
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=b'saas_platform_salt',  # En production, utiliser un salt unique par donnée
        iterations=100000,
    )
    key = base64.urlsafe_b64encode(kdf.derive(settings.ENCRYPTION_KEY.encode()))
    return key

def encrypt_data(data: str) -> str:
    """Crypte une donnée avec AES-256"""
    if not data:
        return None
    f = Fernet(get_encryption_key())
    encrypted = f.encrypt(data.encode())
    return encrypted.decode()

def decrypt_data(encrypted_data: str) -> str:
    """Décrypte une donnée avec AES-256"""
    if not encrypted_data:
        return None
    try:
        f = Fernet(get_encryption_key())
        decrypted = f.decrypt(encrypted_data.encode())
        return decrypted.decode()
    except Exception:
        return None

# ==================== JWT TOKENS ====================

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    """Crée un token JWT d'accès"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict) -> str:
    """Crée un token JWT de rafraîchissement"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> dict:
    """Décode et vérifie un token JWT"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None

# ==================== CSRF PROTECTION ====================

from itsdangerous import URLSafeTimedSerializer

def generate_csrf_token() -> str:
    """Génère un token CSRF"""
    serializer = URLSafeTimedSerializer(settings.SECRET_KEY)
    return serializer.dumps("csrf_token")

def validate_csrf_token(token: str, max_age: int = 3600) -> bool:
    """Valide un token CSRF"""
    serializer = URLSafeTimedSerializer(settings.SECRET_KEY)
    try:
        serializer.loads(token, max_age=max_age)
        return True
    except Exception:
        return False

# ==================== VERIFICATION CODES ====================

import random
import string

def generate_verification_code(length: int = 6) -> str:
    """Génère un code de vérification alphanumérique"""
    return ''.join(random.choices(string.digits, k=length))

def generate_secure_token(length: int = 32) -> str:
    """Génère un token sécurisé aléatoire"""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))
