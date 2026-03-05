"""
Router Upload - Gestion des images (logo, portfolio, etc.)
"""

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database import get_db
from models import SiteConfig
from schemas import SiteConfigResponse
from image_processor import (
    validate_image, 
    process_image, 
    extract_color_palette, 
    suggest_color_scheme,
    delete_image
)
from routers.auth import require_admin
import os

router = APIRouter()

@router.post("/logo")
async def upload_logo(
    file: UploadFile = File(...),
    extract_colors: bool = True,
    db: AsyncSession = Depends(get_db),
    admin = Depends(require_admin)
):
    """
    Upload du logo avec extraction automatique de la palette de couleurs
    """
    # Lire le contenu du fichier
    contents = await file.read()
    
    # Valider l'image
    if not validate_image(contents, file.content_type):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Fichier invalide. Types acceptés: JPEG, PNG, WebP. Taille max: 5MB"
        )
    
    try:
        # Traiter l'image
        result = process_image(
            file_content=contents,
            filename=file.filename,
            folder="logos",
            generate_thumbnail=True
        )
        
        # Extraire la palette de couleurs
        color_palette = []
        color_scheme = {}
        
        if extract_colors:
            color_palette = extract_color_palette(result["path"], color_count=5)
            color_scheme = suggest_color_scheme(color_palette)
        
        # Mettre à jour la configuration du site
        config_result = await db.execute(select(SiteConfig).limit(1))
        config = config_result.scalar_one_or_none()
        
        if config:
            # Supprimer l'ancien logo si existe
            if config.logo_url:
                old_path = os.path.join("uploads", config.logo_url.lstrip("/uploads/"))
                delete_image(old_path)
            
            config.logo_url = result["url"]
            config.logo_colors = color_palette
            
            # Appliquer les couleurs suggérées
            if color_scheme:
                config.primary_color = color_scheme.get("primary", config.primary_color)
                config.secondary_color = color_scheme.get("secondary", config.secondary_color)
            
            await db.commit()
            await db.refresh(config)
        
        return {
            "message": "Logo uploadé avec succès",
            "logo_url": result["url"],
            "thumbnail_url": result.get("thumbnail_url"),
            "color_palette": color_palette,
            "suggested_colors": color_scheme,
            "processed_size": result["processed_size"]
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors du traitement de l'image: {str(e)}"
        )

@router.post("/portfolio")
async def upload_portfolio_image(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    admin = Depends(require_admin)
):
    """
    Upload d'une image pour le portfolio
    """
    contents = await file.read()
    
    if not validate_image(contents, file.content_type):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Fichier invalide. Types acceptés: JPEG, PNG, WebP. Taille max: 5MB"
        )
    
    try:
        result = process_image(
            file_content=contents,
            filename=file.filename,
            folder="portfolio",
            generate_thumbnail=True
        )
        
        return {
            "message": "Image uploadée avec succès",
            "image_url": result["url"],
            "thumbnail_url": result.get("thumbnail_url"),
            "processed_size": result["processed_size"]
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors du traitement de l'image: {str(e)}"
        )

@router.post("/service-image")
async def upload_service_image(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    admin = Depends(require_admin)
):
    """
    Upload d'une image pour un service
    """
    contents = await file.read()
    
    if not validate_image(contents, file.content_type):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Fichier invalide"
        )
    
    try:
        result = process_image(
            file_content=contents,
            filename=file.filename,
            folder="services",
            generate_thumbnail=False
        )
        
        return {
            "message": "Image uploadée avec succès",
            "image_url": result["url"],
            "processed_size": result["processed_size"]
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur: {str(e)}"
        )

@router.delete("/image")
async def delete_uploaded_image(
    image_path: str,
    db: AsyncSession = Depends(get_db),
    admin = Depends(require_admin)
):
    """
    Supprimer une image uploadée
    """
    # Sécurité: vérifier que le chemin est dans uploads/
    if not image_path.startswith("/uploads/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Chemin d'image invalide"
        )
    
    full_path = os.path.join("uploads", image_path.lstrip("/uploads/"))
    
    if delete_image(full_path):
        return {"message": "Image supprimée avec succès"}
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image non trouvée"
        )

@router.get("/colors/extract")
async def extract_colors_from_image(
    image_url: str,
    color_count: int = 5,
    admin = Depends(require_admin)
):
    """
    Extraire une palette de couleurs d'une image existante
    """
    if not image_url.startswith("/uploads/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="URL d'image invalide"
        )
    
    image_path = os.path.join("uploads", image_url.lstrip("/uploads/"))
    
    if not os.path.exists(image_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image non trouvée"
        )
    
    try:
        palette = extract_color_palette(image_path, color_count)
        color_scheme = suggest_color_scheme(palette)
        
        return {
            "color_palette": palette,
            "suggested_colors": color_scheme
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de l'extraction des couleurs: {str(e)}"
        )
