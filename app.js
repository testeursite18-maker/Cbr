// ========================================
// TEMPLATE UNIVERSEL - C.B.R. Framework v4.0
// Site dynamique 100% personnalisable via Admin
// ========================================

'use strict';

// ========================================
// CONFIGURATION PAR DÉFAUT (Template vierge)
// ========================================

const defaultData = {
    // ========================================
    // 1. IDENTITÉ DE L'ENTREPRISE (Modifiable)
    // ========================================
    identity: {
        companyName: "C.B.R. Île-de-France",
        companyShortName: "CBR", // Pour logo box
        tagline: "Maçonnerie & Rénovation",
        slogan: "L'excellence en maçonnerie depuis 15 ans",
        description: "Entreprise familiale spécialisée dans la maçonnerie, la rénovation et la construction à Créteil et en Île-de-France.",
        experienceYears: 15,
        address: "33 Rue des Pivoines, 94140 Alfortville",
        phone: "06 12 34 56 78",
        email: "contact@cbr-iledefrance.fr",
        hours: {
            weekday: "7h00 - 19h00",
            saturday: "8h00 - 17h00",
            sunday: "Fermé"
        },
        zones: ["Alfortville", "Créteil", "Paris", "Val-de-Marne", "Seine-Saint-Denis", "Essonne", "Hauts-de-Seine"]
    },
    
    // ========================================
    // 2. MÉDIAS (Logo, Favicon, Hero)
    // ========================================
    media: {
        logoUrl: "", // URL du logo (laisse vide pour texte CBR)
        logoWidth: "120px",
        faviconUrl: "",
        heroImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=2000",
        heroOverlay: "rgba(0,0,0,0.5)" // Opacité du fond hero
    },
    
    // ========================================
    // 3. DESIGN SYSTEM (Couleurs CSS Variables)
    // ========================================
    design: {
        primaryColor: "#f97316",    // --main-color (boutons, titres, accents)
        secondaryColor: "#dc2626",  // --accent-color (secondaire, hover)
        darkColor: "#111827",       // --dark (textes)
        lightColor: "#f9fafb",      // --light (fonds)
        textFont: "'Inter', sans-serif",
        headingFont: "'Inter', sans-serif"
    },
    
    // ========================================
    // 4. CONTENU ÉDITABLE (Services, About, etc.)
    // ========================================
    content: {
        heroTitle: "Votre Projet de Construction",
        heroSubtitle: "Entre des Mains Expertes",
        heroText: "Entreprise familiale spécialisée dans la maçonnerie, la rénovation et la construction à Créteil et en Île-de-France.",
        ctaPrimary: "📞 Demander un Devis Gratuit",
        ctaSecondary: "Voir nos Réalisations",
        
        aboutTitle: "Qui sommes-nous ?",
        aboutText: "Depuis 15 ans, notre entreprise familiale accompagne les particuliers et professionnels dans leurs projets de construction et rénovation. Notre expertise et notre exigence qualité nous permettent de garantir votre satisfaction.",
        
        stats: [
            { value: 15, suffix: "+", label: "Années d'expérience", icon: "🏆" },
            { value: 370, suffix: "+", label: "Projets Réalisés", icon: "🛡️" },
            { value: 98, suffix: "%", label: "Clients Satisfaits", icon: "⭐" },
            { value: 45, suffix: "", label: "Projets cette année", icon: "📈" }
        ]
    },
    
    // ========================================
    // 5. SERVICES (3-4 blocs éditables)
    // ========================================
    services: [
        {
            id: 1,
            title: "Maçonnerie Traditionnelle",
            description: "Construction et rénovation de murs, façades et structures en pierre, brique ou parpaing. Travaux de qualité garantis.",
            icon: "🏗️",
            image: "",
            features: ["Devis gratuit sous 24h", "Garantie décennale incluse", "15 ans d'expertise", "Intervention rapide"]
        },
        {
            id: 2,
            title: "Rénovation Complète",
            description: "Transformation intégrale de vos espaces avec respect des normes et délais. De la conception à la réalisation.",
            icon: "🔨",
            image: "",
            features: ["Devis gratuit sous 24h", "Garantie décennale incluse", "15 ans d'expertise", "Intervention rapide"]
        },
        {
            id: 3,
            title: "Terrassement",
            description: "Préparation des sols, fondations et aménagements extérieurs. Équipements professionnels pour tous terrains.",
            icon: "🚜",
            image: "",
            features: ["Devis gratuit sous 24h", "Garantie décennale incluse", "15 ans d'expertise", "Intervention rapide"]
        }
    ],
    
    // ========================================
    // 6. CARTE LEAFLET (Coordonnées GPS)
    // ========================================
    map: {
        latitude: 48.7946,
        longitude: 2.4172,
        zoom: 16,
        markerTitle: "CBR Travaux",
        markerAddress: "33 Rue des Pivoines, 94140 Alfortville",
        popupContent: "<h4>CBR Travaux</h4><p>33 Rue des Pivoines<br>94140 Alfortville</p>"
    },
    
    // ========================================
    // 7. RÉSEAUX SOCIAUX
    // ========================================
    social: {
        instagram: { url: "", active: false },
        facebook: { url: "", active: false },
        linkedin: { url: "", active: false },
        whatsapp: { url: "", active: false },
        twitter: { url: "", active: false }
    },
    
    // ========================================
    // 8. SEO & MÉTADONNÉES
    // ========================================
    seo: {
        title: "C.B.R. Île-de-France | Maçonnerie & Rénovation",
        description: "Expert en maçonnerie et rénovation à Alfortville depuis 15 ans. Devis gratuit, garantie décennale.",
        keywords: "maçonnerie, rénovation, alfortville, créteil, construction",
        author: "",
        robots: "index, follow"
    },
    
    // ========================================
    // 9. SÉCURITÉ ADMIN (Modifiable)
    // ========================================
    admin: {
        username: "admin",
        password: "admin123",
        email: "admin@entreprise.fr"
    },
    
    // ========================================
    // 10. DONNÉES DYNAMIQUES (Non-modifiables par client)
    // ========================================
    portfolio: [],
    testimonials: [],
    users: [],
    leads: [],
    
    // Version du template
    version: "4.0",
    lastModified: new Date().toISOString()
};

// ========================================
// SYSTÈME DE STOCKAGE AVEC MIGRATION
// ========================================

const Storage = {
    KEY: 'universal_template_data',
    BACKUP_KEY: 'universal_template_backup',
    
    save(data) {
        try {
            // Sauvegarde avant modification
            const current = this.load();
            if (current) {
                localStorage.setItem(this.BACKUP_KEY, JSON.stringify(current));
            }
            
            data.lastModified = new Date().toISOString();
            localStorage.setItem(this.KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Erreur sauvegarde:', e);
            return false;
        }
    },
    
    load() {
        try {
            const data = localStorage.getItem(this.KEY);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Erreur chargement:', e);
            return null;
        }
    },
    
    // Migration depuis ancienne structure CBR
    migrateFromLegacy() {
        const legacy = localStorage.getItem('cbr_data');
        if (!legacy) return null;
        
        try {
            const old = JSON.parse(legacy);
            // Conversion vers nouvelle structure
            const migrated = {
                ...defaultData,
                identity: {
                    companyName: old.company?.name || defaultData.identity.companyName,
                    companyShortName: "CBR",
                    tagline: old.company?.tagline || defaultData.identity.tagline,
                    slogan: old.company?.slogan || defaultData.identity.slogan,
                    description: old.company?.description || defaultData.identity.description,
                    experienceYears: old.company?.experienceYears || 15,
                    address: old.company?.address || defaultData.identity.address,
                    phone: old.company?.phone || defaultData.identity.phone,
                    email: old.company?.email || defaultData.identity.email,
                    hours: old.company?.hours || defaultData.identity.hours,
                    zones: old.company?.zones || defaultData.identity.zones
                },
                design: {
                    primaryColor: old.customization?.primaryColor || "#f97316",
                    secondaryColor: old.customization?.secondaryColor || "#dc2626",
                    darkColor: "#111827",
                    lightColor: "#f9fafb",
                    textFont: "'Inter', sans-serif",
                    headingFont: "'Inter', sans-serif"
                },
                map: old.map || defaultData.map,
                portfolio: old.portfolio || [],
                testimonials: old.testimonials || [],
                users: old.users || [],
                leads: old.leads || [],
                admin: old.admin || defaultData.admin
            };
            
            this.save(migrated);
            return migrated;
        } catch (e) {
            return null;
        }
    },
    
    export() {
        const data = this.load();
        return data ? JSON.stringify(data, null, 2) : null;
    },
    
    import(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            return this.save(data);
        } catch (e) {
            return false;
        }
    },
    
    reset() {
        localStorage.removeItem(this.KEY);
        localStorage.removeItem(this.BACKUP_KEY);
        location.reload();
    }
};

// ========================================
// GESTION DES DONNÉES UNIVERSELLES
// ========================================

function getData() {
    // Essaie de charger les nouvelles données
    let data = Storage.load();
    
    // Si pas de données, essaie migration legacy
    if (!data) {
        data = Storage.migrateFromLegacy();
    }
    
    // Si toujours rien, utilise défaut
    if (!data) {
        data = { ...defaultData };
        Storage.save(data);
    }
    
    // Fusion avec défaut pour nouvelles propriétés
    return deepMerge(defaultData, data);
}

function saveData(data) {
    return Storage.save(data);
}

function deepMerge(target, source) {
    const output = { ...target };
    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            output[key] = deepMerge(target[key] || {}, source[key]);
        } else {
            output[key] = source[key];
        }
    }
    return output;
}

// ========================================
// SYSTÈME CSS VARIABLES DYNAMIQUES
// ========================================

const StyleSystem = {
    apply(data = getData()) {
        const root = document.documentElement;
        const d = data.design;
        
        // Couleurs principales
        root.style.setProperty('--main-color', d.primaryColor);
        root.style.setProperty('--accent-color', d.secondaryColor);
        root.style.setProperty('--primary', d.primaryColor);
        root.style.setProperty('--secondary', d.secondaryColor);
        root.style.setProperty('--dark', d.darkColor);
        root.style.setProperty('--light', d.lightColor);
        
        // Calculs automatiques
        root.style.setProperty('--primary-dark', this.adjustColor(d.primaryColor, -20));
        root.style.setProperty('--main-color-rgb', this.hexToRgb(d.primaryColor));
        
        // Typographie
        root.style.setProperty('--font-main', d.textFont);
        root.style.setProperty('--font-heading', d.headingFont);
        
        // Mise à jour meta theme-color
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) metaTheme.content = d.primaryColor;
    },
    
    adjustColor(hex, amount) {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = Math.min(255, Math.max(0, (num >> 16) + amount));
        const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
        const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
        return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
    },
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
            '249, 115, 22';
    }
};

// ========================================
// SYSTÈME D'IDENTITÉ (Logo, Texte, Favicon)
// ========================================

const IdentitySystem = {
    apply(data = getData()) {
        const i = data.identity;
        const m = data.media;
        
        // Titre de page
        document.title = data.seo.title || `${i.companyName} | ${i.tagline}`;
        
        // Logo texte ou image
        document.querySelectorAll('#logoBox, #footerLogoBox').forEach(el => {
            if (!el) return;
            if (m.logoUrl) {
                el.innerHTML = `<img src="${m.logoUrl}" alt="${i.companyShortName}" style="width:100%;height:100%;object-fit:contain;">`;
            } else {
                el.textContent = i.companyShortName;
            }
        });
        
        // Noms d'entreprise
        document.querySelectorAll('#companyName, #footerCompanyName').forEach(el => {
            if (el) el.textContent = i.companyName;
        });
        
        // Taglines
        document.querySelectorAll('#companyTagline, #footerTagline').forEach(el => {
            if (el) el.textContent = i.tagline;
        });
        
        // Favicon
        if (m.faviconUrl) {
            let favicon = document.querySelector('link[rel="icon"]');
            if (!favicon) {
                favicon = document.createElement('link');
                favicon.rel = 'icon';
                document.head.appendChild(favicon);
            }
            favicon.href = m.faviconUrl;
        }
        
        // Hero background
        const heroBg = document.getElementById('heroBg');
        if (heroBg && m.heroImage) {
            heroBg.style.backgroundImage = `linear-gradient(${m.heroOverlay}, ${m.heroOverlay}), url('${m.heroImage}')`;
        }
    }
};

// ========================================
// SYSTÈME DE CONTENU DYNAMIQUE
// ========================================

const ContentSystem = {
    apply(data = getData()) {
        const c = data.content;
        const i = data.identity;
        
        // Hero Section
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.innerHTML = `${c.heroTitle}<br><span class="gradient-text">${c.heroSubtitle}</span>`;
        }
        
        const heroText = document.querySelector('.hero-text');
        if (heroText) heroText.textContent = c.heroText;
        
        // Boutons CTA
        const ctaPrimary = document.querySelector('.hero-buttons .btn-primary span');
        if (ctaPrimary) ctaPrimary.textContent = c.ctaPrimary;
        
        const ctaSecondary = document.querySelector('.hero-buttons .btn-secondary span');
        if (ctaSecondary) ctaSecondary.textContent = c.ctaSecondary;
        
        // Téléphones dynamiques
        const phoneFormatted = i.phone;
        const phoneLink = i.phone.replace(/\s/g, '');
        
        document.querySelectorAll('#headerPhone').forEach(el => {
            if (el) el.textContent = phoneFormatted;
        });
        
        document.querySelectorAll('#ctaPhone, #ctaPhoneBtn').forEach(el => {
            if (el) {
                el.href = `tel:${phoneLink}`;
                const span = el.querySelector('span');
                if (span) span.textContent = phoneFormatted;
            }
        });
        
        // Footer coordonnées
        const footerElements = {
            footerAddress: `📍 ${i.address}`,
            footerPhone: `📞 <a href="tel:${phoneLink}">${phoneFormatted}</a>`,
            footerEmail: `✉️ <a href="mailto:${i.email}">${i.email}</a>`,
            footerHours: `🕐 Lun-Ven: ${i.hours.weekday}`,
            footerDesc: i.description
        };
        
        Object.entries(footerElements).forEach(([id, content]) => {
            const el = document.getElementById(id);
            if (el) {
                if (id === 'footerDesc') el.textContent = content;
                else el.innerHTML = content;
            }
        });
        
        // Zones
        const zonesTags = document.getElementById('zonesTags');
        if (zonesTags) {
            zonesTags.innerHTML = i.zones.map(z => `<span>${z}</span>`).join('');
        }
        
        // Année copyright
        document.querySelectorAll('#currentYear').forEach(el => {
            if (el) el.textContent = new Date().getFullYear();
        });
        
        document.querySelectorAll('#copyrightName').forEach(el => {
            if (el) el.textContent = i.companyName;
        });
    },
    
    // Rendu des stats dynamiques
    renderStats(data = getData()) {
        const container = document.getElementById('statsGrid');
        if (!container) return;
        
        const stats = data.content.stats || defaultData.content.stats;
        
        // Mise à jour avec années d'expérience réelles
        const experienceStat = stats.find(s => s.label.includes("expérience"));
        if (experienceStat) {
            experienceStat.value = data.identity.experienceYears;
        }
        
        container.innerHTML = stats.map((stat, i) => `
            <div class="stat-box animate-on-scroll" style="transition-delay: ${i * 0.1}s">
                <div class="stat-icon">${stat.icon}</div>
                <div class="stat-number">${stat.value}${stat.suffix}</div>
                <div class="stat-label">${stat.label}</div>
            </div>
        `).join('');
    }
};

// ========================================
// SYSTÈME DE SERVICES (3-4 blocs éditables)
// ========================================

const ServiceSystem = {
    renderGrid(data = getData()) {
        const container = document.getElementById('expertisesGrid');
        if (!container) return;
        
        container.innerHTML = data.services.map((service, i) => `
            <div class="expertise-card animate-on-scroll" style="transition-delay: ${i * 0.15}s">
                <div class="expertise-image">
                    ${service.image ? 
                        `<img src="${service.image}" alt="${service.title}" loading="lazy">` : 
                        `<span>${service.icon}</span>`
                    }
                </div>
                <div class="expertise-content">
                    <h3>${service.title}</h3>
                    <p>${service.description}</p>
                    <a href="services.html" class="expertise-link">En savoir plus →</a>
                </div>
            </div>
        `).join('');
    },
    
    renderDetailed(data = getData()) {
        const container = document.getElementById('servicesDetailed');
        if (!container) return;
        
        container.innerHTML = data.services.map((service, i) => `
            <div class="service-detailed-card animate-on-scroll" style="transition-delay: ${i * 0.1}s">
                <div class="service-image">
                    ${service.image ? `<img src="${service.image}" alt="${service.title}" loading="lazy">` : ''}
                    <h3><span>${service.icon}</span> ${service.title}</h3>
                </div>
                <div class="service-content">
                    <p>${service.description}</p>
                    <ul class="service-features">
                        ${service.features.map(f => `<li>${f}</li>`).join('')}
                    </ul>
                    <a href="contact.html" class="btn-primary">Demander un devis →</a>
                </div>
            </div>
        `).join('');
    }
};

// ========================================
// SYSTÈME DE CARTE LEAFLET (v2.0 Corrigé)
// ========================================

const MapSystem = {
    instance: null,
    marker: null,
    
    init(containerId = 'map') {
        const container = document.getElementById(containerId);
        if (!container) return false;
        
        // Nettoie l'ancienne instance
        if (this.instance) {
            this.instance.remove();
            this.instance = null;
        }
        
        const data = getData();
        const m = data.map;
        
        // Crée la carte
        this.instance = L.map(containerId, {
            scrollWheelZoom: false,
            zoomControl: true
        }).setView([m.latitude, m.longitude], m.zoom);
        
        // Couche OpenStreetMap (GRATUITE)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(this.instance);
        
        // Icône personnalisée avec couleur du design
        const iconHtml = `
            <div style="
                background: ${data.design.secondaryColor};
                border: 3px solid white;
                border-radius: 50%;
                width: 36px;
                height: 36px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 14px;
            ">📍</div>
        `;
        
        const customIcon = L.divIcon({
            html: iconHtml,
            className: 'custom-marker',
            iconSize: [36, 36],
            iconAnchor: [18, 18],
            popupAnchor: [0, -20]
        });
        
        // Marqueur
        this.marker = L.marker([m.latitude, m.longitude], { icon: customIcon })
            .addTo(this.instance)
            .bindPopup(m.popupContent);
        
        // Ouvre le popup après 1 seconde
        setTimeout(() => this.marker.openPopup(), 1000);
        
        // Responsive
        window.addEventListener('resize', () => {
            if (this.instance) this.instance.invalidateSize();
        });
        
        return true;
    },
    
    // Pour l'aperçu dans l'Admin
    initAdminPreview(containerId = 'adminMapPreview') {
        const container = document.getElementById(containerId);
        if (!container) return null;
        
        // Force un nettoyage complet
        container.innerHTML = '';
        
        const data = getData();
        const m = data.map;
        
        const map = L.map(containerId, {
            scrollWheelZoom: false,
            zoomControl: false // Plus discret pour l'aperçu
        }).setView([m.latitude, m.longitude], m.zoom);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '',
            maxZoom: 19
        }).addTo(map);
        
        const iconHtml = `
            <div style="
                background: ${data.design.secondaryColor};
                border: 3px solid white;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            "></div>
        `;
        
        const customIcon = L.divIcon({
            html: iconHtml,
            className: 'admin-marker',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        
        L.marker([m.latitude, m.longitude], { icon: customIcon })
            .addTo(map)
            .bindPopup('Position actuelle')
            .openPopup();
        
        return map;
    },
    
    updateCoordinates(lat, lng, zoom) {
        const data = getData();
        
        // Validation stricte
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        const zoomLevel = parseInt(zoom);
        
        if (isNaN(latitude) || latitude < -90 || latitude > 90) {
            return { success: false, message: 'Latitude invalide (-90 à 90)' };
        }
        if (isNaN(longitude) || longitude < -180 || longitude > 180) {
            return { success: false, message: 'Longitude invalide (-180 à 180)' };
        }
        if (isNaN(zoomLevel) || zoomLevel < 1 || zoomLevel > 20) {
            return { success: false, message: 'Zoom invalide (1 à 20)' };
        }
        
        data.map.latitude = latitude;
        data.map.longitude = longitude;
        data.map.zoom = zoomLevel;
        
        saveData(data);
        
        // Recharge la carte si visible
        if (this.instance) {
            this.init();
        }
        
        return { success: true, message: 'Coordonnées mises à jour' };
    },
    
    updatePopup(title, address) {
        const data = getData();
        
        const safeTitle = this.sanitize(title);
        const safeAddress = this.sanitize(address);
        
        data.map.markerTitle = safeTitle;
        data.map.markerAddress = safeAddress;
        data.map.popupContent = `<h4>${safeTitle}</h4><p>${safeAddress.replace(/\n/g, '<br>')}</p>`;
        
        saveData(data);
        
        if (this.instance && this.marker) {
            this.marker.setPopupContent(data.map.popupContent);
        }
        
        return { success: true, message: 'Popup mis à jour' };
    },
    
    sanitize(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// ========================================
// SYSTÈME RÉSEAUX SOCIAUX
// ========================================

const SocialSystem = {
    render(data = getData()) {
        const container = document.getElementById('socialLinks');
        if (!container) return;
        
        const icons = {
            instagram: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>',
            facebook: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>',
            linkedin: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>',
            whatsapp: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>',
            twitter: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>'
        };
        
        const active = Object.entries(data.social)
            .filter(([_, s]) => s.active && s.url)
            .map(([key, s]) => `
                <a href="${s.url}" target="_blank" rel="noopener noreferrer" title="${key}">
                    ${icons[key] || ''}
                </a>
            `).join('');
        
        container.innerHTML = active || '<span style="color: var(--gray-500); font-size: 14px;">Aucun réseau social configuré</span>';
    }
};

// ========================================
// SYSTÈME LEADS/DEVIS (Corrigé)
// ========================================

const LeadSystem = {
    submit(formData) {
        const data = getData();
        
        const lead = {
            id: Date.now().toString(),
            name: sanitize(formData.get('name') || ''),
            email: (formData.get('email') || '').trim().toLowerCase(),
            phone: (formData.get('phone') || '').trim(),
            projectType: formData.get('projectType') || '',
            address: sanitize(formData.get('address') || ''),
            message: sanitize(formData.get('message') || ''),
            deadline: formData.get('deadline') || '',
            date: new Date().toISOString(),
            status: 'new',
            notes: ''
        };
        
        // Validation
        if (!lead.name || lead.name.length < 2) {
            return { success: false, message: 'Veuillez entrer votre nom complet' };
        }
        
        if (!isValidEmail(lead.email)) {
            return { success: false, message: 'Veuillez entrer un email valide' };
        }
        
        if (!lead.message || lead.message.length < 10) {
            return { success: false, message: 'Veuillez décrire votre projet (minimum 10 caractères)' };
        }
        
        data.leads.push(lead);
        saveData(data);
        
        return { 
            success: true, 
            message: 'Votre demande a bien été envoyée ! Nous vous répondrons sous 24h.',
            leadId: lead.id
        };
    },
    
    getAll(filter = 'all') {
        if (!Session.isAdminLoggedIn()) return [];
        
        const data = getData();
        let leads = [...data.leads].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (filter !== 'all') {
            leads = leads.filter(l => l.status === filter);
        }
        
        return leads;
    },
    
    updateStatus(id, status) {
        if (!Session.isAdminLoggedIn()) {
            return { success: false, message: 'Accès non autorisé' };
        }
        
        const data = getData();
        const lead = data.leads.find(l => l.id === id);
        
        if (!lead) return { success: false, message: 'Demande non trouvée' };
        
        lead.status = status;
        lead.updatedAt = new Date().toISOString();
        
        saveData(data);
        return { success: true, message: `Statut mis à jour: ${status}` };
    },
    
    addNote(id, note) {
        if (!Session.isAdminLoggedIn()) return { success: false, message: 'Accès non autorisé' };
        
        const data = getData();
        const lead = data.leads.find(l => l.id === id);
        if (!lead) return { success: false, message: 'Demande non trouvée' };
        
        lead.notes = sanitize(note);
        saveData(data);
        return { success: true, message: 'Note ajoutée' };
    },
    
    delete(id) {
        if (!Session.isAdminLoggedIn()) return { success: false, message: 'Accès non autorisé' };
        
        const data = getData();
        data.leads = data.leads.filter(l => l.id !== id);
        saveData(data);
        return { success: true, message: 'Demande supprimée' };
    }
};

// ========================================
// SYSTÈME TÉMOIGNAGES
// ========================================

const TestimonialSystem = {
    submit(projectName, rating, content) {
        const user = Session.getCurrentUser();
        if (!user) return { success: false, message: 'Connexion requise pour laisser un avis' };
        
        const pName = sanitize(projectName.trim());
        const cont = sanitize(content.trim());
        const rat = parseInt(rating);
        
        if (!pName || pName.length < 3) {
            return { success: false, message: 'Nom du projet trop court (min 3 caractères)' };
        }
        if (!rat || rat < 1 || rat > 5) {
            return { success: false, message: 'Veuillez sélectionner une note de 1 à 5 étoiles' };
        }
        if (!cont || cont.length < 20) {
            return { success: false, message: 'Votre avis est trop court (min 20 caractères)' };
        }
        
        const data = getData();
        const testimonial = {
            id: Date.now().toString(),
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            projectName: pName,
            rating: rat,
            content: cont,
            date: new Date().toISOString(),
            visible: false, // En attente de modération
            featured: false
        };
        
        data.testimonials.push(testimonial);
        saveData(data);
        
        return { 
            success: true, 
            message: 'Merci ! Votre avis est en attente de validation par notre équipe.'
        };
    },
    
    getVisible(featuredOnly = false) {
        const data = getData();
        let t = data.testimonials.filter(x => x.visible);
        if (featuredOnly) t = t.filter(x => x.featured);
        return t.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    
    getAll(filter = 'all') {
        if (!Session.isAdminLoggedIn()) return [];
        
        const data = getData();
        let t = [...data.testimonials];
        
        if (filter === 'pending') t = t.filter(x => !x.visible);
        else if (filter === 'visible') t = t.filter(x => x.visible);
        else if (filter === 'featured') t = t.filter(x => x.featured);
        
        return t.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    
    moderate(id, updates) {
        if (!Session.isAdminLoggedIn()) return { success: false, message: 'Accès non autorisé' };
        
        const data = getData();
        const t = data.testimonials.find(x => x.id === id);
        if (!t) return { success: false, message: 'Avis non trouvé' };
        
        if (updates.visible !== undefined) t.visible = !!updates.visible;
        if (updates.featured !== undefined) t.featured = !!updates.featured;
        
        saveData(data);
        return { success: true, message: 'Avis mis à jour' };
    },
    
    delete(id) {
        if (!Session.isAdminLoggedIn()) return { success: false, message: 'Accès non autorisé' };
        
        const data = getData();
        data.testimonials = data.testimonials.filter(x => x.id !== id);
        saveData(data);
        return { success: true, message: 'Avis supprimé' };
    }
};

// ========================================
// SYSTÈME UTILISATEURS
// ========================================

const UserSystem = {
    register(name, email, password, phone = '') {
        const data = getData();
        
        const n = sanitize(name.trim());
        const e = email.trim().toLowerCase();
        
        if (!n || n.length < 2) return { success: false, message: 'Nom trop court' };
        if (!isValidEmail(e)) return { success: false, message: 'Email invalide' };
        if (password.length < 6) return { success: false, message: 'Mot de passe trop court (min 6)' };
        if (data.users.find(u => u.email === e)) return { success: false, message: 'Cet email est déjà utilisé' };
        
        const user = {
            id: Date.now().toString(),
            name: n,
            email: e,
            passwordHash: hashPassword(password),
            phone: phone,
            createdAt: new Date().toISOString(),
            isVerified: true
        };
        
        data.users.push(user);
        saveData(data);
        
        const session = Session.start(user);
        return { success: true, message: 'Compte créé avec succès !', user: session };
    },
    
    login(email, password) {
        const data = getData();
        const e = email.trim().toLowerCase();
        
        const user = data.users.find(u => u.email === e && u.passwordHash === hashPassword(password));
        if (!user) return { success: false, message: 'Email ou mot de passe incorrect' };
        
        const session = Session.start(user);
        return { success: true, message: `Bonjour ${user.name} !`, user: session };
    },
    
    logout() {
        Session.clear();
        return { success: true, message: 'Déconnexion réussie' };
    }
};

// ========================================
// SYSTÈME SESSION
// ========================================

const Session = {
    USER_KEY: 'template_user_session',
    ADMIN_KEY: 'template_admin_session',
    
    start(user) {
        const session = {
            id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(),
            createdAt: Date.now()
        };
        sessionStorage.setItem(this.USER_KEY, JSON.stringify(session));
        return session;
    },
    
    startAdmin() {
        const data = getData();
        const session = {
            username: data.admin.username,
            token: generateToken(),
            createdAt: Date.now(),
            expires: Date.now() + (4 * 60 * 60 * 1000) // 4 heures
        };
        sessionStorage.setItem(this.ADMIN_KEY, JSON.stringify(session));
        return session;
    },
    
    getCurrent() {
        try {
            const s = JSON.parse(sessionStorage.getItem(this.USER_KEY));
            if (!s) return null;
            if (Date.now() - s.createdAt > 24 * 60 * 60 * 1000) {
                this.clear();
                return null;
            }
            return s;
        } catch (e) { return null; }
    },
    
    isAdminLoggedIn() {
        try {
            const s = JSON.parse(sessionStorage.getItem(this.ADMIN_KEY));
            if (!s) return false;
            if (Date.now() > s.expires) {
                this.clearAdmin();
                return false;
            }
            return true;
        } catch (e) { return false; }
    },
    
    clear() {
        sessionStorage.removeItem(this.USER_KEY);
    },
    
    clearAdmin() {
        sessionStorage.removeItem(this.ADMIN_KEY);
    }
};

// ========================================
// SYSTÈME ADMIN (Configuration complète)
// ========================================

const AdminSystem = {
    // Change identifiants admin
    updateCredentials(currentPassword, newUsername, newPassword, newEmail) {
        if (!Session.isAdminLoggedIn()) {
            return { success: false, message: 'Session admin requise' };
        }
        
        const data = getData();
        
        // Vérifie mot de passe actuel
        if (hashPassword(currentPassword) !== data.admin.password) {
            return { success: false, message: 'Mot de passe actuel incorrect' };
        }
        
        // Validation nouveau mot de passe
        if (newPassword && newPassword.length < 6) {
            return { success: false, message: 'Nouveau mot de passe trop court (min 6)' };
        }
        
        // Mise à jour
        if (newUsername) data.admin.username = sanitize(newUsername);
        if (newPassword) data.admin.password = hashPassword(newPassword);
        if (newEmail && isValidEmail(newEmail)) data.admin.email = newEmail;
        
        saveData(data);
        return { success: true, message: 'Identifiants mis à jour. Reconnectez-vous.' };
    },
    
    // Update complète identité
    updateIdentity(identityData) {
        if (!Session.isAdminLoggedIn()) return { success: false, message: 'Accès non autorisé' };
        
        const data = getData();
        data.identity = { ...data.identity, ...identityData };
        saveData(data);
        
        // Réapplique immédiatement
        IdentitySystem.apply();
        ContentSystem.apply();
        
        return { success: true, message: 'Identité entreprise mise à jour' };
    },
    
    // Update design
    updateDesign(designData) {
        if (!Session.isAdminLoggedIn()) return { success: false, message: 'Accès non autorisé' };
        
        const data = getData();
        data.design = { ...data.design, ...designData };
        saveData(data);
        
        StyleSystem.apply();
        
        return { success: true, message: 'Design mis à jour' };
    },
    
    // Update médias
    updateMedia(mediaData) {
        if (!Session.isAdminLoggedIn()) return { success: false, message: 'Accès non autorisé' };
        
        const data = getData();
        data.media = { ...data.media, ...mediaData };
        saveData(data);
        
        IdentitySystem.apply();
        
        return { success: true, message: 'Médias mis à jour' };
    },
    
    // Update contenu
    updateContent(contentData) {
        if (!Session.isAdminLoggedIn()) return { success: false, message: 'Accès non autorisé' };
        
        const data = getData();
        data.content = { ...data.content, ...contentData };
        saveData(data);
        
        ContentSystem.apply();
        
        return { success: true, message: 'Contenu mis à jour' };
    },
    
    // Update services
    updateService(id, serviceData) {
        if (!Session.isAdminLoggedIn()) return { success: false, message: 'Accès non autorisé' };
        
        const data = getData();
        const idx = data.services.findIndex(s => s.id === id);
        
        if (idx === -1) return { success: false, message: 'Service non trouvé' };
        
        data.services[idx] = { ...data.services[idx], ...serviceData };
        saveData(data);
        
        ServiceSystem.renderGrid();
        ServiceSystem.renderDetailed();
        
        return { success: true, message: 'Service mis à jour' };
    },
    
    addService(serviceData) {
        if (!Session.isAdminLoggedIn()) return { success: false, message: 'Accès non autorisé' };
        
        const data = getData();
        const newService = {
            id: Date.now(),
            ...serviceData,
            features: serviceData.features || ["Devis gratuit", "Garantie incluse"]
        };
        
        data.services.push(newService);
        saveData(data);
        
        return { success: true, message: 'Service ajouté', id: newService.id };
    },
    
    deleteService(id) {
        if (!Session.isAdminLoggedIn()) return { success: false, message: 'Accès non autorisé' };
        
        const data = getData();
        if (data.services.length <= 1) {
            return { success: false, message: 'Impossible de supprimer le dernier service' };
        }
        
        data.services = data.services.filter(s => s.id !== id);
        saveData(data);
        
        return { success: true, message: 'Service supprimé' };
    },
    
    // Réinitialisation complète
    resetAll() {
        if (!Session.isAdminLoggedIn()) return { success: false, message: 'Accès non autorisé' };
        
        if (!confirm('⚠️ ATTENTION : Toutes les données seront perdues. Continuer ?')) {
            return { success: false, message: 'Opération annulée' };
        }
        
        Storage.reset();
        return { success: true, message: 'Site réinitialisé' };
    },
    
    // Export/Import configuration
    exportConfig() {
        if (!Session.isAdminLoggedIn()) return null;
        return Storage.export();
    },
    
    importConfig(jsonString) {
        if (!Session.isAdminLoggedIn()) return { success: false, message: 'Accès non autorisé' };
        
        try {
            const success = Storage.import(jsonString);
            if (success) {
                location.reload();
                return { success: true, message: 'Configuration importée' };
            }
            return { success: false, message: 'Erreur lors de l\'import' };
        } catch (e) {
            return { success: false, message: 'Fichier invalide' };
        }
    }
};

// ========================================
// UI SYSTÈME
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
        
        const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<span style="font-size: 20px;">${icons[type]}</span><span>${message}</span>`;
        
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
// PORTFOLIO SYSTÈME
// ========================================

const PortfolioSystem = {
    renderPreview(containerId = 'portfolioPreview', limit = 3) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const data = getData();
        const items = data.portfolio.filter(p => p.featured).slice(0, limit);
        
        if (items.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px; color: var(--gray-500);">
                    <div style="font-size: 48px; margin-bottom: 16px;">📸</div>
                    <p>Aucun projet en avant pour le moment.<br>Ajoutez-en depuis l'Admin.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = items.map((p, i) => `
            <div class="portfolio-item animate-on-scroll" onclick="openProjectModal(${p.id})" style="transition-delay: ${i * 0.1}s">
                ${p.image ? 
                    `<img src="${p.image}" alt="${p.title}" loading="lazy">` : 
                    `<div style="width:100%;height:100%;background:var(--gray-200);display:flex;align-items:center;justify-content:center;color:var(--gray-400);">📷 ${p.title}</div>`
                }
                <div class="portfolio-overlay">
                    <span class="portfolio-category">${p.category}</span>
                    <h4>${p.title}</h4>
                </div>
            </div>
        `).join('');
    },
    
    renderFull(containerId = 'portfolioMasonry', filter = 'all') {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const data = getData();
        const items = filter === 'all' ? data.portfolio : data.portfolio.filter(p => p.category === filter);
        
        if (items.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px; color: var(--gray-500);">
                    <p>Aucun projet ${filter !== 'all' ? 'dans cette catégorie' : 'pour le moment'}.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = items.map((p, i) => `
            <div class="portfolio-item animate-on-scroll" onclick="openProjectModal(${p.id})" style="transition-delay: ${i * 0.05}s">
                ${p.image ? 
                    `<img src="${p.image}" alt="${p.title}" loading="lazy">` : 
                    `<div style="width:100%;height:100%;background:var(--gray-200);display:flex;align-items:center;justify-content:center;color:var(--gray-400);">📷 ${p.title}</div>`
                }
                <div class="portfolio-overlay">
                    <span class="portfolio-category">${p.category}</span>
                    <h4>${p.title}</h4>
                </div>
            </div>
        `).join('');
    },
    
    // Admin functions
    add(projectData) {
        if (!Session.isAdminLoggedIn()) return { success: false, message: 'Accès non autorisé' };
        
        const data = getData();
        const project = {
            id: Date.now(),
            ...projectData,
            createdAt: new Date().toISOString()
        };
        
        data.portfolio.push(project);
        saveData(data);
        
        return { success: true, message: 'Projet ajouté', id: project.id };
    },
    
    update(id, updates) {
        if (!Session.isAdminLoggedIn()) return { success: false, message: 'Accès non autorisé' };
        
        const data = getData();
        const idx = data.portfolio.findIndex(p => p.id === id);
        if (idx === -1) return { success: false, message: 'Projet non trouvé' };
        
        data.portfolio[idx] = { ...data.portfolio[idx], ...updates };
        saveData(data);
        
        return { success: true, message: 'Projet mis à jour' };
    },
    
    delete(id) {
        if (!Session.isAdminLoggedIn()) return { success: false, message: 'Accès non autorisé' };
        
        const data = getData();
        data.portfolio = data.portfolio.filter(p => p.id !== id);
        saveData(data);
        
        return { success: true, message: 'Projet supprimé' };
    }
};

// ========================================
// FONCTIONS UTILITAIRES
// ========================================

function sanitize(input) {
    if (!input) return '';
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(16);
}

function generateToken() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ========================================
// INITIALISATION GLOBALE
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Charge et migre les données si nécessaire
    const data = getData();
    
    // 2. Applique le design system (CSS variables)
    StyleSystem.apply();
    
    // 3. Applique l'identité (logo, textes, favicon)
    IdentitySystem.apply();
    
    // 4. Applique le contenu dynamique
    ContentSystem.apply();
    ContentSystem.renderStats();
    
    // 5. Rendu des services
    ServiceSystem.renderGrid();
    ServiceSystem.renderDetailed();
    
    // 6. Rendu réseaux sociaux
    SocialSystem.render();
    
    // 7. Rendu portfolio
    PortfolioSystem.renderPreview();
    
    // 8. Rendu témoignages
    renderTestimonials();
    
    // 9. Initialise la carte Leaflet
    MapSystem.init();
    
    // 10. SEO dynamique
    if (data.seo?.title) document.title = data.seo.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && data.seo?.description) metaDesc.content = data.seo.description;
    
    // 11. Gestion touche Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
});

// ========================================
// FONCTIONS GLOBALES EXPOSÉES
// ========================================

window.toggleMenu = UI.toggleMenu;
window.UI = UI;
window.Session = Session;
window.UserSystem = UserSystem;
window.LeadSystem = LeadSystem;
window.TestimonialSystem = TestimonialSystem;
window.AdminSystem = AdminSystem;
window.MapSystem = MapSystem;
window.PortfolioSystem = PortfolioSystem;
window.ServiceSystem = ServiceSystem;
window.getData = getData;
window.saveData = saveData;
window.Storage = Storage;

// Fonctions modales portfolio
window.openProjectModal = function(id) {
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
};

window.closeModal = function(e) {
    if (e && e.target !== e.currentTarget && !e.target.classList.contains('modal-close')) return;
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('show'));
    document.body.style.overflow = '';
};

window.setPortfolioFilter = function(category) {
    window.currentPortfolioFilter = category;
    document.querySelectorAll('.filter-buttons button').forEach(btn => {
        btn.classList.toggle('active', 
            (category === 'all' && btn.textContent === 'Tous') || 
            btn.textContent === category
        );
    });
    PortfolioSystem.renderFull('portfolioMasonry', category);
};

function renderTestimonials() {
    const container = document.getElementById('testimonialsGrid');
    if (!container) return;
    
    const t = TestimonialSystem.getVisible(true);
    
    if (t.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--gray-400);">
                <p>Aucun témoignage client pour le moment.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = t.slice(0, 3).map((item, i) => `
        <div class="testimonial-card animate-on-scroll" style="transition-delay: ${i * 0.1}s">
            <div class="stars">${'★'.repeat(item.rating)}${'☆'.repeat(5-item.rating)}</div>
            <p class="testimonial-text">"${item.content}"</p>
            <div class="testimonial-project"><small>📁 Projet : ${item.projectName}</small></div>
            <div class="testimonial-author">
                <div class="author-avatar">${item.userName.charAt(0).toUpperCase()}</div>
                <div class="author-info">
                    <h4>${item.userName}</h4>
                    <p>Client vérifié</p>
                </div>
            </div>
        </div>
    `).join('');
}
