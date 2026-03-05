# 🚀 Multi-SaaS Platform

Plateforme SaaS multimodale permettant de créer des sites web pour différents secteurs d'activité avec une seule codebase.

## 🎯 Modes disponibles

| Mode | Description | Fonctionnalités |
|------|-------------|-----------------|
| 🏗️ **Maçonnerie** | Entreprises de BTP | Devis en ligne, portfolio, témoignages |
| 🍽️ **Restauration** | Restaurants, cafés | Réservations, plan de salle, menu |
| ✍️ **Pétition** | Campagnes citoyennes | Signatures, compteur, partage social |

## ✨ Fonctionnalités clés

### 🎨 Personnalisation
- **Upload de logo** avec extraction automatique de la palette de couleurs
- **Toggle par section** : activez/désactivez chaque section individuellement
- **Drag & drop** pour réorganiser les sections
- **Couleurs personnalisables** avec aperçu en temps réel

### 🔐 Sécurité
- **Argon2** pour le hashage des mots de passe
- **AES-256** pour le chiffrement des données sensibles
- **JWT** pour l'authentification
- **Rate limiting** pour la protection contre les attaques
- **CSRF protection**

### 📊 Dashboard centralisé
- Statistiques selon le mode actif
- Gestion des devis/réservations/signatures
- Aperçu des activités récentes

## 🏗️ Architecture

```
saas-platform/
├── backend/              # API FastAPI (Python)
│   ├── main.py          # Point d'entrée
│   ├── models.py        # Modèles SQLAlchemy
│   ├── schemas.py       # Schémas Pydantic
│   ├── security.py      # Auth, encryption
│   ├── image_processor.py # Upload & couleurs
│   └── routers/         # Endpoints API
│       ├── auth.py
│       ├── admin.py
│       ├── upload.py
│       ├── masonery.py
│       ├── restaurant.py
│       └── petition.py
├── frontend/            # React + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/  # Composants React
│   │   ├── pages/       # Pages
│   │   ├── sections/    # Sections admin
│   │   ├── api/         # Client API
│   │   ├── store/       # Zustand store
│   │   └── types/       # Types TypeScript
│   └── Dockerfile
├── docker-compose.yml   # Orchestration Docker
└── start.sh            # Script de démarrage
```

## 🚀 Démarrage rapide

### Option 1 : Docker (Recommandé)

```bash
# 1. Cloner le projet
cd saas-platform

# 2. Lancer la plateforme
./start.sh
```

L'application sera accessible sur :
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:8000
- **API Docs** : http://localhost:8000/docs

### Option 2 : Développement local

#### Backend
```bash
cd backend

# Créer l'environnement virtuel
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos paramètres

# Initialiser la base de données
python init_data.py

# Lancer le serveur
python main.py
```

#### Frontend
```bash
cd frontend

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Éditer .env avec VITE_API_URL=http://localhost:8000

# Lancer le serveur de développement
npm run dev
```

## 🔐 Authentification

### Compte admin par défaut
- **Email** : `admin@saas.local`
- **Mot de passe** : `admin123`

> ⚠️ **Important** : Changez ce mot de passe en production !

### Créer un utilisateur
```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "phone": "0612345678",
    "password": "securepassword"
  }'
```

## 🎨 Configuration du site

### Changer de mode
```bash
curl -X POST "http://localhost:8000/api/admin/config/mode" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "restaurant",
    "preserve_data": true
  }'
```

### Upload du logo avec extraction de couleurs
1. Allez dans **Admin > Couleurs & Logo**
2. Cliquez sur "Uploader un nouveau logo"
3. Le système extraira automatiquement une palette de 5 couleurs
4. Les couleurs suggérées seront appliquées automatiquement

### Gérer les sections visibles
1. Allez dans **Admin > Configuration > Sections**
2. Activez/désactivez chaque section avec les toggles
3. Les changements sont appliqués immédiatement

## 📊 Dashboard

Récupérer les statistiques selon le mode actif :

```bash
curl "http://localhost:8000/api/admin/dashboard" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🛠️ API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/refresh` - Rafraîchir token
- `GET /api/auth/me` - Profil utilisateur

### Admin
- `GET /api/admin/config` - Configuration du site
- `PUT /api/admin/config` - Modifier configuration
- `PATCH /api/admin/config/visibility` - Visibilité sections
- `POST /api/admin/config/mode` - Changer de mode
- `GET /api/admin/dashboard` - Statistiques

### Services
- `GET /api/admin/services` - Liste des services
- `POST /api/admin/services` - Créer un service
- `PUT /api/admin/services/{id}` - Modifier
- `DELETE /api/admin/services/{id}` - Supprimer

### Portfolio
- `GET /api/admin/portfolio` - Liste des réalisations
- `POST /api/admin/portfolio` - Ajouter
- `PUT /api/admin/portfolio/{id}` - Modifier
- `DELETE /api/admin/portfolio/{id}` - Supprimer

### Upload
- `POST /api/upload/logo` - Upload logo (avec extraction de couleurs)
- `POST /api/upload/portfolio` - Upload image portfolio
- `POST /api/upload/service-image` - Upload image service

### Mode Maçonnerie
- `POST /api/masonery/quotes` - Demande de devis
- `GET /api/masonery/quotes` - Liste des devis (admin)
- `PATCH /api/masonery/quotes/{id}` - Modifier statut

### Mode Restaurant
- `GET /api/restaurant/config` - Configuration
- `POST /api/restaurant/reservations` - Créer réservation
- `GET /api/restaurant/reservations` - Liste (admin)
- `GET /api/restaurant/availability` - Disponibilité

### Mode Pétition
- `GET /api/petition/config` - Configuration
- `POST /api/petition/sign` - Signer
- `POST /api/petition/verify` - Vérifier signature
- `GET /api/petition/stats` - Statistiques

## 📁 Structure de la base de données

### Tables principales
- `users` - Utilisateurs (admin, modérateurs, signataires)
- `site_config` - Configuration globale du site
- `services` - Services proposés
- `portfolio_items` - Réalisations/projets
- `navigation_items` - Menu de navigation
- `quote_requests` - Demandes de devis (mode maçonnerie)
- `reservations` - Réservations (mode restaurant)
- `signatures` - Signatures (mode pétition)

## 🎨 Extraction de couleurs

Le système utilise `colorthief` pour extraire une palette de 5 couleurs du logo uploadé :

```python
from image_processor import extract_color_palette, suggest_color_scheme

palette = extract_color_palette("path/to/logo.png", color_count=5)
color_scheme = suggest_color_scheme(palette)

# Retourne :
# {
#   "primary": "#f97316",
#   "secondary": "#dc2626",
#   "accent": "#fbbf24",
#   "background": "#ffffff",
#   "text": "#111827",
#   "full_palette": ["#f97316", "#dc2626", "#fbbf24", "#ffffff", "#111827"]
# }
```

## 🔒 Sécurité

| Fonctionnalité | Implémentation |
|----------------|----------------|
| Hashage mots de passe | Argon2 |
| Encryption données | AES-256 |
| Tokens JWT | HS256 |
| Rate limiting | 100 req/min |
| CSRF Protection | URLSafeTimedSerializer |
| SQL Injection | ORM SQLAlchemy |

## 📝 License

MIT License - Libre d'utilisation et de modification.

## 🤝 Contribution

Les contributions sont les bienvenues ! Ouvrez une issue ou une pull request.

---

**Développé avec ❤️ par l'équipe Multi-SaaS**
