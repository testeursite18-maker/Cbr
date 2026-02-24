// ========================================
// TEMPLATE UNIVERSEL WHITE-LABEL v5.0
// Connexion Admin: cbr / 1098
// ========================================

'use strict';

// ========================================
// CONFIGURATION PAR DÉFAUT - MODIFIABLE VIA ADMIN
// ========================================

const DEFAULT_CONFIG = {
    // Identifiants Admin (NE PAS MODIFIER - utilisés pour la connexion)
    admin: {
        username: "cbr",
        password: "1098"
    },
    
    // HEADER
    header: {
        logoText: "CBR",                    // Texte dans le carré logo
        companyName: "C.B.R. Île-de-France", // Nom principal
        companyTagline: "Maçonnerie & Rénovation", // Sous-titre
        phone: "06 12 34 56 78"             // Numéro affiché dans le bouton
    },
    
    // NAVIGATION
    navigation: {
        items: [
            { label: "Accueil", url: "index.html", active: true },
            { label: "Services", url: "services.html", active: false },
            { label: "Réalisations", url: "realisations.html", active: false },
            { label: "Témoignages", url: "temoignages.html", active: false },
            { label: "Contact", url: "contact.html", active: false }
        ]
    },
    
    // SECTION HERO
    hero: {
        badge: "L'excellence en maçonnerie depuis 15 ans",
        title: "Votre Projet de Construction",
        titleHighlight: "Entre des Mains Expertes",
        description: "Entreprise familiale spécialisée dans la maçonnerie, la rénovation et la construction à Alfortville et en Île-de-France.",
        backgroundImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=2000",
        button1: {
            text: "📞 Demander un Devis Gratuit",
            url: "contact.html",
            style: "primary"
        },
        button2: {
            text: "Voir nos Réalisations",
            url: "realisations.html",
            style: "secondary"
        }
    },
    
    // CARTE
    map: {
        latitude: 48.7946,
        longitude: 2.4172,
        zoom: 16,
        markerTitle: "CBR Travaux",
        markerAddress: "33 Rue des Pivoines, 94140 Alfortville"
    },
    
    // COULEURS
    colors: {
        primary: "#f97316",
        secondary: "#dc2626"
    },
    
    // ENTREPRISE
    company: {
        address: "33 Rue des Pivoines, 94140 Alfortville",
        email: "contact@cbr-travaux.fr",
        hours: {
            weekday: "7h00 - 19h00",
            saturday: "8h00 - 17h00",
            sunday: "Fermé"
        },
        zones: ["Alfortville", "Paris", "Val-de-Marne", "Seine-Saint-Denis", "Essonne", "Hauts-de-Seine"]
    },
    
    // STATS
    stats: {
        experience: 15,
        projects: 370,
        satisfaction: 98,
        thisYear: 45
    },
    
    // SERVICES
    services: [
        {
            id: 1,
            title: "Maçonnerie Traditionnelle",
            description: "Construction et rénovation de murs, façades et structures en pierre, brique ou parpaing.",
            icon: "🏗️"
        },
        {
            id: 2,
            title: "Rénovation Complète",
            description: "Transformation intégrale de vos espaces avec respect des normes et délais.",
            icon: "🔨"
        },
        {
            id: 3,
            title: "Terrassement",
            description: "Préparation des sols, fondations et aménagements extérieurs.",
            icon: "🚜"
        }
    ],
    
    // TÉMOIGNAGES
    testimonials: [],
    
    // PORTFOLIO
    portfolio: [],
    
    // LEADS
    leads: []
};

// ========================================
// CLÉ LOCALSTORAGE
// ========================================
const STORAGE_KEY = 'whitelabel_config_v5';
const ADMIN_SESSION_KEY = 'whitelabel_admin_session';

// ========================================
// FONCTIONS DE STOCKAGE
// ========================================

function getConfig() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            // Fusion avec les valeurs par défaut pour les nouvelles propriétés
            return mergeDeep(DEFAULT_CONFIG, parsed);
        }
    } catch (e) {
        console.error('Erreur lecture config:', e);
    }
    return DEFAULT_CONFIG;
}

function saveConfig(config) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        return true;
    } catch (e) {
        console.error('Erreur sauvegarde config:', e);
        return false;
    }
}

function mergeDeep(defaults, saved) {
    const result = JSON.parse(JSON.stringify(defaults));
    for (const key in saved) {
        if (saved.hasOwnProperty(key)) {
            if (typeof saved[key] === 'object' && saved[key] !== null && !Array.isArray(saved[key])) {
                result[key] = mergeDeep(defaults[key] || {}, saved[key]);
            } else {
                result[key] = saved[key];
            }
        }
    }
    return result;
}

// ========================================
// SYSTÈME DE CONNEXION ADMIN
// ========================================

const AdminAuth = {
    // Vérifie les identifiants
    login(username, password) {
        const config = getConfig();
        console.log('Tentative connexion:', username, '| Attendu:', config.admin.username);
        console.log('MDP fourni:', password, '| Attendu:', config.admin.password);
        
        if (username === config.admin.username && password === config.admin.password) {
            // Crée une session
            const session = {
                loggedIn: true,
                timestamp: Date.now(),
                expires: Date.now() + (4 * 60 * 60 * 1000) // 4 heures
            };
            sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
            console.log('✅ Connexion réussie!');
            return { success: true, message: 'Connexion réussie' };
        }
        console.log('❌ Identifiants incorrects');
        return { success: false, message: 'Identifiants incorrects' };
    },
    
    // Vérifie si connecté
    isLoggedIn() {
        try {
            const sessionJson = sessionStorage.getItem(ADMIN_SESSION_KEY);
            if (!sessionJson) return false;
            
            const session = JSON.parse(sessionJson);
            if (Date.now() > session.expires) {
                this.logout();
                return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    },
    
    // Déconnexion
    logout() {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
    }
};

// ========================================
// RENDU DU SITE
// ========================================

const SiteRenderer = {
    // Applique toutes les personnalisations
    render() {
        const config = getConfig();
        
        this.renderHeader(config);
        this.renderNavigation(config);
        this.renderHero(config);
        this.renderColors(config);
        this.renderFooter(config);
        this.renderStats(config);
        this.renderServices(config);
        this.initMap(config);
    },
    
    // HEADER
    renderHeader(config) {
        const logoBox = document.getElementById('logoBox');
        const companyName = document.getElementById('companyName');
        const companyTagline = document.getElementById('companyTagline');
        const headerPhone = document.getElementById('headerPhone');
        const footerCompanyName = document.getElementById('footerCompanyName');
        const footerTagline = document.getElementById('footerTagline');
        const footerLogoBox = document.getElementById('footerLogoBox');
        
        if (logoBox) logoBox.textContent = config.header.logoText;
        if (footerLogoBox) footerLogoBox.textContent = config.header.logoText;
        if (companyName) companyName.textContent = config.header.companyName;
        if (footerCompanyName) footerCompanyName.textContent = config.header.companyName;
        if (companyTagline) companyTagline.textContent = config.header.companyTagline;
        if (footerTagline) footerTagline.textContent = config.header.companyTagline;
        if (headerPhone) {
            headerPhone.textContent = config.header.phone;
            headerPhone.href = `tel:${config.header.phone.replace(/\s/g, '')}`;
        }
    },
    
    // NAVIGATION
    renderNavigation(config) {
        const navContainer = document.getElementById('mainNav');
        const mobileNavContainer = document.getElementById('mobileNav');
        
        const navHTML = config.navigation.items.map(item => {
            const activeClass = item.active ? 'active' : '';
            return `<a href="${item.url}" class="${activeClass}">${item.label}</a>`;
        }).join('');
        
        if (navContainer) navContainer.innerHTML = navHTML;
        if (mobileNavContainer) {
            mobileNavContainer.innerHTML = navHTML + `
                <div class="mobile-menu-footer">
                    <a href="tel:${config.header.phone.replace(/\s/g, '')}" class="btn-primary">📞 Appeler maintenant</a>
                </div>
            `;
        }
    },
    
    // HERO
    renderHero(config) {
        const heroBadge = document.getElementById('heroBadge');
        const heroTitle = document.getElementById('heroTitle');
        const heroTitleHighlight = document.getElementById('heroTitleHighlight');
        const heroDescription = document.getElementById('heroDescription');
        const heroBg = document.getElementById('heroBg');
        const heroBtn1 = document.getElementById('heroBtn1');
        const heroBtn2 = document.getElementById('heroBtn2');
        
        if (heroBadge) heroBadge.textContent = config.hero.badge;
        if (heroTitle) heroTitle.textContent = config.hero.title;
        if (heroTitleHighlight) heroTitleHighlight.textContent = config.hero.titleHighlight;
        if (heroDescription) heroDescription.textContent = config.hero.description;
        if (heroBg) heroBg.style.backgroundImage = `url('${config.hero.backgroundImage}')`;
        
        if (heroBtn1) {
            heroBtn1.textContent = config.hero.button1.text;
            heroBtn1.href = config.hero.button1.url;
        }
        if (heroBtn2) {
            heroBtn2.textContent = config.hero.button2.text;
            heroBtn2.href = config.hero.button2.url;
        }
    },
    
    // COULEURS
    renderColors(config) {
        const root = document.documentElement;
        root.style.setProperty('--primary', config.colors.primary);
        root.style.setProperty('--secondary', config.colors.secondary);
        
        // Met à jour la meta theme-color
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) metaTheme.content = config.colors.primary;
    },
    
    // STATS
    renderStats(config) {
        const statsGrid = document.getElementById('statsGrid');
        if (!statsGrid) return;
        
        const stats = [
            { value: config.stats.experience, suffix: "+", label: "Années d'expérience", icon: "🏆" },
            { value: config.stats.projects, suffix: "+", label: "Projets Réalisés", icon: "🛠️" },
            { value: config.stats.satisfaction, suffix: "%", label: "Clients Satisfaits", icon: "⭐" },
            { value: config.stats.thisYear, suffix: "", label: "Projets cette année", icon: "📈" }
        ];
        
        statsGrid.innerHTML = stats.map((stat, i) => `
            <div class="stat-box" style="animation-delay: ${i * 0.1}s">
                <div class="stat-icon">${stat.icon}</div>
                <div class="stat-number">${stat.value}${stat.suffix}</div>
                <div class="stat-label">${stat.label}</div>
            </div>
        `).join('');
    },
    
    // SERVICES
    renderServices(config) {
        const servicesGrid = document.getElementById('servicesGrid');
        if (!servicesGrid) return;
        
        servicesGrid.innerHTML = config.services.map((service, i) => `
            <div class="service-card" style="animation-delay: ${i * 0.15}s">
                <div class="service-icon">${service.icon}</div>
                <h3>${service.title}</h3>
                <p>${service.description}</p>
                <a href="services.html" class="service-link">En savoir plus →</a>
            </div>
        `).join('');
    },
    
    // FOOTER
    renderFooter(config) {
        const footerAddress = document.getElementById('footerAddress');
        const footerPhone = document.getElementById('footerPhone');
        const footerEmail = document.getElementById('footerEmail');
        const footerHours = document.getElementById('footerHours');
        const zonesTags = document.getElementById('zonesTags');
        const currentYear = document.getElementById('currentYear');
        const copyrightName = document.getElementById('copyrightName');
        
        if (footerAddress) footerAddress.innerHTML = `📍 ${config.company.address}`;
        if (footerPhone) footerPhone.innerHTML = `📞 <a href="tel:${config.header.phone.replace(/\s/g, '')}">${config.header.phone}</a>`;
        if (footerEmail) footerEmail.innerHTML = `✉️ <a href="mailto:${config.company.email}">${config.company.email}</a>`;
        if (footerHours) footerHours.innerHTML = `🕐 Lun-Ven: ${config.company.hours.weekday}`;
        if (zonesTags) zonesTags.innerHTML = config.company.zones.map(z => `<span>${z}</span>`).join('');
        if (currentYear) currentYear.textContent = new Date().getFullYear();
        if (copyrightName) copyrightName.textContent = config.header.companyName;
    },
    
    // CARTE LEAFLET
    initMap(config) {
        const mapContainer = document.getElementById('map');
        if (!mapContainer || typeof L === 'undefined') return;
        
        // Évite les initialisations multiples
        if (mapContainer._leaflet_id) return;
        
        const map = L.map('map', {
            scrollWheelZoom: false
        }).setView([config.map.latitude, config.map.longitude], config.map.zoom);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);
        
        // Icône personnalisée
        const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background: ${config.colors.secondary}; border: 3px solid white; border-radius: 50%; width: 36px; height: 36px; box-shadow: 0 4px 12px rgba(220,38,38,0.4); display: flex; align-items: center; justify-content: center;">📍</div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 36],
            popupAnchor: [0, -36]
        });
        
        L.marker([config.map.latitude, config.map.longitude], { icon: customIcon })
            .addTo(map)
            .bindPopup(`<b>${config.map.markerTitle}</b><br>${config.map.markerAddress}`)
            .openPopup();
    }
};

// ========================================
// MENU MOBILE
// ========================================

function toggleMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (mobileMenu && menuToggle) {
        mobileMenu.classList.toggle('show');
        menuToggle.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('show') ? 'hidden' : '';
    }
}

// ========================================
// INITIALISATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialise le site avec la config
    SiteRenderer.render();
    
    // Animation au scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
});

// ========================================
// EXPOSITION GLOBALE
// ========================================
window.toggleMenu = toggleMenu;
window.AdminAuth = AdminAuth;
window.getConfig = getConfig;
window.saveConfig = saveConfig;
a.leads;
        
        if (filter !== 'all') {
            leads = leads.filter(l => l.status === filter);
        }
        
        return leads.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    
    updateStatus(leadId, status) {
        if (!Session.isAdminLoggedIn()) {
            return { success: false, message: 'Accès non autorisé' };
        }
        
        const data = getData();
        const lead = data.leads.find(l => l.id === leadId);
        
        if (!lead) {
            return { success: false, message: 'Lead non trouvé' };
        }
        
        lead.status = status;
        saveData(data);
        return { success: true, message: 'Statut mis à jour' };
    }
};

// ========================================
// PERSONNALISATION
// ========================================

const Customization = {
    applyColors() {
        const data = getData();
        const colors = data.customization || defaultData.customization;
        
        const root = document.documentElement;
        root.style.setProperty('--primary', colors.primaryColor);
        root.style.setProperty('--secondary', colors.secondaryColor);
        
        const primaryDark = this.adjustColor(colors.primaryColor, -20);
        root.style.setProperty('--primary-dark', primaryDark);
        
        // Met à jour la couleur du thème mobile
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.content = colors.primaryColor;
        }
    },
    
    applyLogo() {
        const data = getData();
        const logoBox = document.getElementById('logoBox');
        const footerLogoBox = document.getElementById('footerLogoBox');
        
        if (data.customization?.logoImage && logoBox) {
            logoBox.innerHTML = `<img src="${data.customization.logoImage}" alt="Logo" style="width:100%;height:100%;object-fit:cover;">`;
            if (footerLogoBox) {
                footerLogoBox.innerHTML = `<img src="${data.customization.logoImage}" alt="Logo" style="width:100%;height:100%;object-fit:cover;">`;
            }
        }
    },
    
    applyHeroImage() {
        const data = getData();
        const heroBg = document.getElementById('heroBg');
        
        if (heroBg && data.customization?.heroImage) {
            heroBg.style.backgroundImage = `url('${data.customization.heroImage}')`;
        }
    },
    
    adjustColor(color, amount) {
        const num = parseInt(color.replace('#', ''), 16);
        const r = Math.min(255, Math.max(0, (num >> 16) + amount));
        const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
        const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
        return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
    },
    
    updateSettings(settings) {
        if (!Session.isAdminLoggedIn()) {
            return { success: false, message: 'Accès non autorisé' };
        }
        
        const data = getData();
        data.customization = { ...data.customization, ...settings };
        saveData(data);
        
        this.applyColors();
        this.applyLogo();
        this.applyHeroImage();
        
        return { success: true, message: 'Personnalisation mise à jour' };
    }
};

// ========================================
// CARTE LEAFLET - OPENSTREETMAP
// ========================================

const MapSystem = {
    map: null,
    marker: null,
    
    // ========================================
    // INITIALISATION DE LA CARTE
    // ========================================
    init() {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) return; // Pas de carte sur cette page
        
        // Vérifie si Leaflet est chargé
        if (typeof L === 'undefined') {
            console.error('Leaflet n\'est pas chargé');
            return;
        }
        
        const data = getData();
        const mapConfig = data.map || defaultData.map;
        
        // Crée la carte centrée sur les coordonnées configurées
        this.map = L.map('map', {
            scrollWheelZoom: false,  // Désactive le zoom avec la molette pour éviter les problèmes de scroll
            zoomControl: true        // Affiche les contrôles de zoom
        }).setView([mapConfig.latitude, mapConfig.longitude], mapConfig.zoom);
        
        // Ajoute la couche OpenStreetMap (gratuite, sans clé API)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(this.map);
        
        // Crée l'icône personnalisée rouge
        const customIcon = L.divIcon({
            className: 'custom-marker-wrapper',
            html: `<div class="custom-marker-icon custom-marker-pulse"></div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
            popupAnchor: [0, -20]
        });
        
        // Ajoute le marqueur avec popup
        this.marker = L.marker([mapConfig.latitude, mapConfig.longitude], { icon: customIcon })
            .addTo(this.map)
            .bindPopup(`
                <h4>${mapConfig.markerTitle}</h4>
                <p>${mapConfig.markerAddress}</p>
            `);
        
        // Ouvre le popup automatiquement après 1 seconde
        setTimeout(() => {
            this.marker.openPopup();
        }, 1000);
        
        console.log('✅ Carte Leaflet initialisée avec succès');
    },
    
    // ========================================
    // MISE À JOUR DES COORDONNÉES (depuis Admin)
    // ========================================
    updateCoordinates(lat, lng, zoom = 16) {
        if (!Session.isAdminLoggedIn()) {
            return { success: false, message: 'Accès non autorisé' };
        }
        
        const data = getData();
        data.map.latitude = parseFloat(lat);
        data.map.longitude = parseFloat(lng);
        data.map.zoom = parseInt(zoom);
        saveData(data);
        
        // Met à jour la carte si elle existe
        if (this.map && this.marker) {
            const newLatLng = [data.map.latitude, data.map.longitude];
            this.map.setView(newLatLng, data.map.zoom);
            this.marker.setLatLng(newLatLng);
        }
        
        return { success: true, message: 'Coordonnées mises à jour' };
    },
    
    // ========================================
    // MISE À JOUR DU TEXTE DU MARQUEUR
    // ========================================
    updateMarkerInfo(title, address) {
        if (!Session.isAdminLoggedIn()) {
            return { success: false, message: 'Accès non autorisé' };
        }
        
        const data = getData();
        data.map.markerTitle = title;
        data.map.markerAddress = address;
        saveData(data);
        
        // Met à jour le popup si la carte existe
        if (this.marker) {
            this.marker.setPopupContent(`
                <h4>${title}</h4>
                <p>${address}</p>
            `);
        }
        
        return { success: true, message: 'Informations du marqueur mises à jour' };
    }
};

// ========================================
// UI UTILITAIRES
// ========================================

const UI = {
    toast(message, type = 'info', duration = 4000) {
        let container = document.getElementById('toastContainer');
        
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: '✓',
            error: '✕',
            info: 'ℹ',
            warning: '⚠'
        };
        
        toast.innerHTML = `
            <span style="font-size: 20px;">${icons[type]}</span>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },
    
    toggleMenu() {
        const menu = document.getElementById('mobileMenu');
        const toggle = document.querySelector('.menu-toggle');
        
        if (menu && toggle) {
            menu.classList.toggle('show');
            toggle.classList.toggle('active');
            document.body.style.overflow = menu.classList.contains('show') ? 'hidden' : '';
        }
    }
};

// ========================================
// FONCTIONS DE RENDU
// ========================================

function renderStats() {
    const container = document.getElementById('statsGrid');
    if (!container) return;
    
    const data = getData();
    const stats = [
        { value: data.company.experienceYears, suffix: "+", label: "Années d'expérience", icon: "🏆" },
        { value: (data.stats.projectsPro + data.stats.projectsParticulier), suffix: "+", label: "Projets Réalisés", icon: "🛡️" },
        { value: data.stats.satisfaction, suffix: "%", label: "Clients Satisfaits", icon: "⭐" },
        { value: data.stats.projectsThisYear, suffix: "", label: "Projets cette année", icon: "📈" }
    ];

    container.innerHTML = stats.map((stat, i) => `
        <div class="stat-box animate-on-scroll" style="transition-delay: ${i * 0.1}s">
            <div class="stat-icon">${stat.icon}</div>
            <div class="stat-number">${stat.value}${stat.suffix}</div>
            <div class="stat-label">${stat.label}</div>
        </div>
    `).join('');
}

function renderExpertises() {
    const container = document.getElementById('expertisesGrid');
    if (!container) return;
    
    const data = getData();
    container.innerHTML = data.expertises.map((exp, i) => `
        <div class="expertise-card animate-on-scroll" style="transition-delay: ${i * 0.15}s">
            <div class="expertise-image">
                ${exp.image ? `<img src="${exp.image}" alt="${exp.title}" loading="lazy">` : `<span>${exp.icon}</span>`}
            </div>
            <div class="expertise-content">
                <h3>${exp.title}</h3>
                <p>${exp.description}</p>
                <a href="services.html" class="expertise-link">En savoir plus →</a>
            </div>
        </div>
    `).join('');
}

function renderServicesDetailed() {
    const container = document.getElementById('servicesDetailed');
    if (!container) return;
    
    const data = getData();
    container.innerHTML = data.expertises.map((service, i) => `
        <div class="service-detailed-card animate-on-scroll" style="transition-delay: ${i * 0.1}s">
            <div class="service-image">
                ${service.image ? `<img src="${service.image}" alt="${service.title}" loading="lazy">` : ''}
                <h3><span>${service.icon}</span> ${service.title}</h3>
            </div>
            <div class="service-content">
                <p>${service.description}</p>
                <ul class="service-features">
                    <li>Devis gratuit sous 24h</li>
                    <li>Garantie décennale incluse</li>
                    <li>${data.company.experienceYears} ans d'expertise</li>
                    <li>Intervention rapide</li>
                </ul>
                <a href="contact.html" class="btn-primary">Demander un devis →</a>
            </div>
        </div>
    `).join('');
}

function renderPortfolioPreview() {
    const container = document.getElementById('portfolioPreview');
    if (!container) return;
    
    const data = getData();
    const featured = data.portfolio.filter(p => p.featured).slice(0, 3);
    
    if (featured.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--gray-500);">
                <div style="font-size: 48px; margin-bottom: 16px;">📸</div>
                <p>Aucun projet en avant pour le moment.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = featured.map((project, i) => `
        <div class="portfolio-item animate-on-scroll" onclick="openProjectModal(${project.id})" style="transition-delay: ${i * 0.1}s">
            ${project.image ? 
                `<img src="${project.image}" alt="${project.title}" loading="lazy">` : 
                '<div style="width:100%;height:100%;background:var(--gray-200);display:flex;align-items:center;justify-content:center;color:var(--gray-400);">Pas d\'image</div>'
            }
            <div class="portfolio-overlay">
                <span class="portfolio-category">${project.category}</span>
                <h4>${project.title}</h4>
            </div>
        </div>
    `).join('');
}

function renderPortfolioFull() {
    const container = document.getElementById('portfolioMasonry');
    if (!container) return;
    
    const data = getData();
    const filter = window.currentPortfolioFilter || 'all';
    const filtered = filter === 'all' ? data.portfolio : data.portfolio.filter(p => p.category === filter);
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--gray-500);">
                <p>Aucun projet dans cette catégorie.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filtered.map((project, i) => `
        <div class="portfolio-item animate-on-scroll" onclick="openProjectModal(${project.id})" style="transition-delay: ${i * 0.05}s">
            ${project.image ? 
                `<img src="${project.image}" alt="${project.title}" loading="lazy">` : 
                '<div style="width:100%;height:100%;background:var(--gray-200);display:flex;align-items:center;justify-content:center;color:var(--gray-400);">Pas d\'image</div>'
            }
            <div class="portfolio-overlay">
                <span class="portfolio-category">${project.category}</span>
                <h4>${project.title}</h4>
            </div>
        </div>
    `).join('');
}

function renderFilterButtons() {
    const container = document.getElementById('filterButtons');
    if (!container) return;
    
    const data = getData();
    const categories = ['all', ...new Set(data.portfolio.map(p => p.category).filter(Boolean))];
    
    container.innerHTML = categories.map(cat => `
        <button class="${cat === 'all' ? 'active' : ''}" onclick="setPortfolioFilter('${cat}')">
            ${cat === 'all' ? 'Tous' : cat}
        </button>
    `).join('');
}

function renderTestimonials() {
    const container = document.getElementById('testimonialsGrid');
    if (!container) return;
    
    const testimonials = TestimonialSystem.getVisible(true);
    
    if (testimonials.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--gray-400);">
                <p>Aucun témoignage client pour le moment.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = testimonials.slice(0, 3).map((t, i) => `
        <div class="testimonial-card animate-on-scroll" style="transition-delay: ${i * 0.1}s">
            <div class="stars">${'★'.repeat(t.rating)}${'☆'.repeat(5-t.rating)}</div>
            <p class="testimonial-text">"${t.content}"</p>
            <div class="testimonial-project">
                <small>📁 Projet : ${t.projectName}</small>
            </div>
            <div class="testimonial-author">
                <div class="author-avatar">${t.userName.charAt(0).toUpperCase()}</div>
                <div class="author-info">
                    <h4>${t.userName}</h4>
                    <p>Client vérifié</p>
                </div>
            </div>
        </div>
    `).join('');
}

function renderFooter() {
    const data = getData();
    
    const desc = document.getElementById('footerDesc');
    if (desc) desc.textContent = data.company.description;
    
    const socialContainer = document.getElementById('socialLinks');
    if (socialContainer) {
        const icons = {
            instagram: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>',
            facebook: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>',
            linkedin: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>',
            whatsapp: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>'
        };
        
        const links = Object.entries(data.social)
            .filter(([_, s]) => s.active && s.url)
            .map(([key, s]) => `<a href="${s.url}" target="_blank" rel="noopener noreferrer" title="${key}">${icons[key]}</a>`)
            .join('');
        
        socialContainer.innerHTML = links || '<span style="color: var(--gray-500); font-size: 14px;">Aucun réseau social</span>';
    }
    
    const elements = {
        footerAddress: `📍 ${data.company.address}`,
        footerPhone: `📞 <a href="tel:${data.company.phone.replace(/\s/g, '')}">${data.company.phone}</a>`,
        footerEmail: `✉️ <a href="mailto:${data.company.email}">${data.company.email}</a>`,
        footerHours: `🕐 Lun-Ven: ${data.company.hours.weekday}`
    };
    
    Object.entries(elements).forEach(([id, content]) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = content;
    });
    
    const zones = document.getElementById('zonesTags');
    if (zones) {
        zones.innerHTML = data.company.zones.map(z => `<span>${z}</span>`).join('');
    }
    
    document.querySelectorAll('#currentYear').forEach(el => {
        el.textContent = new Date().getFullYear();
    });
    
    document.querySelectorAll('#copyrightName, #footerCompanyName').forEach(el => {
        el.textContent = data.company.name;
    });
    
    document.querySelectorAll('#companyName').forEach(el => {
        el.textContent = data.company.name;
    });
    
    document.querySelectorAll('#companyTagline, #footerTagline').forEach(el => {
        el.textContent = data.company.tagline;
    });
    
    // Met à jour l'adresse sur la carte
    const mapAddress = document.getElementById('mapAddress');
    if (mapAddress && data.map) {
        mapAddress.textContent = `${data.map.markerTitle} - ${data.map.markerAddress}`;
    }
}

// ========================================
// FONCTIONS GLOBALES
// ========================================

function openProjectModal(id) {
    const data = getData();
    const project = data.portfolio.find(p => p.id === id);
    if (!project) return;
    
    const modal = document.getElementById('projectModal');
    const body = document.getElementById('modalBody');
    
    if (!modal || !body) return;
    
    body.innerHTML = `
        ${project.image ? `<img src="${project.image}" class="modal-image" alt="${project.title}">` : ''}
        <div class="modal-body">
            <div class="modal-meta">
                <span>📁 ${project.category}</span>
                ${project.date ? `<span>📅 ${new Date(project.date).toLocaleDateString('fr-FR')}</span>` : ''}
                ${project.client ? `<span>👤 ${project.client}</span>` : ''}
                ${project.surface ? `<span>📐 ${project.surface}</span>` : ''}
                ${project.duration ? `<span>⏱️ ${project.duration}</span>` : ''}
            </div>
            <h2>${project.title}</h2>
            <p style="color: var(--gray-600); line-height: 1.8; margin-top: 16px;">${project.description}</p>
        </div>
    `;
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal(e) {
    if (e && e.target !== e.currentTarget && !e.target.classList.contains('modal-close')) return;
    
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('show'));
    document.body.style.overflow = '';
}

function setPortfolioFilter(category) {
    window.currentPortfolioFilter = category;
    
    document.querySelectorAll('.filter-buttons button').forEach(btn => {
        btn.classList.toggle('active', 
            (category === 'all' && btn.textContent === 'Tous') || 
            btn.textContent === category
        );
    });
    
    renderPortfolioFull();
}

// ========================================
// INITIALISATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initData();
    
    // Applique la personnalisation
    Customization.applyColors();
    Customization.applyLogo();
    Customization.applyHeroImage();
    
    // Rendu des différentes sections
    renderStats();
    renderExpertises();
    renderServicesDetailed();
    renderPortfolioPreview();
    renderPortfolioFull();
    renderFilterButtons();
    renderTestimonials();
    renderFooter();
    
    // Initialise la carte Leaflet
    MapSystem.init();
    
    // Met à jour le titre et la meta description
    const data = getData();
    if (data.seo?.title) {
        document.title = data.seo.title;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && data.seo?.description) {
        metaDesc.content = data.seo.description;
    }
    
    // Ferme les modals avec Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});

// ========================================
// EXPOSITIONS GLOBALES
// ========================================
window.toggleMenu = UI.toggleMenu;
window.openProjectModal = openProjectModal;
window.closeModal = closeModal;
window.setPortfolioFilter = setPortfolioFilter;
window.UI = UI;
window.Session = Session;
window.UserSystem = UserSystem;
window.TestimonialSystem = TestimonialSystem;
window.ContactSystem = ContactSystem;
window.Customization = Customization;
window.MapSystem = MapSystem;
window.getData = getData;
window.saveData = saveData;
window.Security = Security;
