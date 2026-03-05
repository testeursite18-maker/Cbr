"""
Traitement d'images - Upload, redimensionnement, extraction de couleurs
"""

from PIL import Image
from colorthief import ColorThief
import io
import os
import uuid
from typing import List, Tuple

from config import settings

ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp'}
MAX_DIMENSION = 1200  # Maximum dimension pour le redimensionnement intelligent
THUMBNAIL_SIZE = (300, 300)

def validate_image(file_content: bytes, content_type: str) -> bool:
    """Valide le type et la taille d'une image"""
    if content_type not in settings.ALLOWED_IMAGE_TYPES:
        return False
    
    if len(file_content) > settings.MAX_UPLOAD_SIZE:
        return False
    
    try:
        img = Image.open(io.BytesIO(file_content))
        img.verify()
        return True
    except Exception:
        return False

def process_image(
    file_content: bytes,
    filename: str,
    folder: str = "logos",
    generate_thumbnail: bool = False
) -> dict:
    """
    Traite une image : validation, redimensionnement intelligent, sauvegarde
    """
    # Validation
    ext = os.path.splitext(filename.lower())[1]
    if ext not in ALLOWED_EXTENSIONS:
        raise ValueError(f"Extension non autorisée. Autorisées: {ALLOWED_EXTENSIONS}")
    
    # Ouvrir l'image
    img = Image.open(io.BytesIO(file_content))
    original_format = img.format
    original_size = img.size
    
    # Conversion en RGB si nécessaire (pour les PNG avec transparence)
    if img.mode in ('RGBA', 'LA', 'P'):
        background = Image.new('RGB', img.size, (255, 255, 255))
        if img.mode == 'P':
            img = img.convert('RGBA')
        if img.mode in ('RGBA', 'LA'):
            background.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
            img = background
    
    # Redimensionnement intelligent
    width, height = img.size
    if width > MAX_DIMENSION or height > MAX_DIMENSION:
        ratio = min(MAX_DIMENSION / width, MAX_DIMENSION / height)
        new_size = (int(width * ratio), int(height * ratio))
        img = img.resize(new_size, Image.Resampling.LANCZOS)
    
    # Générer un nom de fichier unique
    file_id = str(uuid.uuid4())[:8]
    new_filename = f"{file_id}_{folder}.jpg"
    
    # Créer le dossier si nécessaire
    upload_path = os.path.join(settings.UPLOAD_DIR, folder)
    os.makedirs(upload_path, exist_ok=True)
    
    # Sauvegarder l'image principale
    file_path = os.path.join(upload_path, new_filename)
    img.save(file_path, 'JPEG', quality=85, optimize=True)
    
    result = {
        "filename": new_filename,
        "path": file_path,
        "url": f"/uploads/{folder}/{new_filename}",
        "original_size": original_size,
        "processed_size": img.size,
        "format": original_format,
    }
    
    # Générer une miniature si demandé
    if generate_thumbnail:
        thumb = img.copy()
        thumb.thumbnail(THUMBNAIL_SIZE, Image.Resampling.LANCZOS)
        thumb_filename = f"{file_id}_{folder}_thumb.jpg"
        thumb_path = os.path.join(upload_path, thumb_filename)
        thumb.save(thumb_path, 'JPEG', quality=75, optimize=True)
        result["thumbnail_url"] = f"/uploads/{folder}/{thumb_filename}"
    
    return result

def extract_color_palette(image_path: str, color_count: int = 5) -> List[str]:
    """
    Extrait une palette de couleurs dominantes d'une image
    """
    try:
        color_thief = ColorThief(image_path)
        # Obtenir les couleurs dominantes
        palette = color_thief.get_palette(color_count=color_count, quality=10)
        
        # Convertir en hexadécimal
        hex_colors = ['#%02x%02x%02x' % color for color in palette]
        
        return hex_colors
    except Exception as e:
        print(f"Erreur extraction couleurs: {e}")
        return ["#f97316", "#dc2626"]  # Couleurs par défaut

def suggest_color_scheme(palette: List[str]) -> dict:
    """
    Suggère un schéma de couleurs basé sur la palette extraite
    """
    if not palette or len(palette) < 2:
        return {
            "primary": "#f97316",
            "secondary": "#dc2626",
            "accent": "#fbbf24",
            "background": "#ffffff",
            "text": "#111827"
        }
    
    # Trier les couleurs par luminosité
    def get_luminance(hex_color):
        r, g, b = tuple(int(hex_color[i:i+2], 16) for i in (1, 3, 5))
        return 0.299 * r + 0.587 * g + 0.114 * b
    
    sorted_colors = sorted(palette, key=get_luminance, reverse=True)
    
    # Sélectionner les couleurs
    primary = sorted_colors[0] if len(sorted_colors) > 0 else "#f97316"
    secondary = sorted_colors[1] if len(sorted_colors) > 1 else "#dc2626"
    accent = sorted_colors[2] if len(sorted_colors) > 2 else "#fbbf24"
    
    # Déterminer si le fond doit être clair ou foncé
    bg_luminance = get_luminance(primary)
    background = "#ffffff" if bg_luminance < 128 else "#1f2937"
    text = "#111827" if background == "#ffffff" else "#ffffff"
    
    return {
        "primary": primary,
        "secondary": secondary,
        "accent": accent,
        "background": background,
        "text": text,
        "full_palette": palette
    }

def delete_image(image_path: str) -> bool:
    """Supprime une image du système de fichiers"""
    try:
        if os.path.exists(image_path):
            os.remove(image_path)
            return True
        return False
    except Exception as e:
        print(f"Erreur suppression image: {e}")
        return False
