// ========================================
// TEMPLATE UNIVERSEL WHITE-LABEL v6.0
// Connexion Admin: cbr / 1098
// ========================================

'use strict';

// ========================================
// CONFIGURATION PAR DÉFAUT - MODIFIABLE VIA ADMIN
// ========================================

const DEFAULT_CONFIG = {
    // Identifiants Admin
    admin: {
        username: "cbr",
        password: "1098"
    },
    
    // HEADER
    header: {
        logoText: "CBR",
        companyName: "C.B.R. Île-de-France",
        companyTagline: "Maçonnerie & Rénovation",
        phone: "06 12 34 56 78"
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
        name: "C.B.R. Île-de-France",
        tagline: "Maçonnerie & Rénovation",
        address: "33 Rue des Pivoines, 94140 Alfortville",
        email: "contact@cbr-travaux.fr",
        phone: "06 12 34 56 78",
        hours: {
            weekday: "7h00 - 19h00",
            saturday: "8h00 - 17h00",
            sunday: "Fermé"
        },
        zones: ["Alfortville", "Paris", "Val-de-Marne", "Seine-Saint-Denis", "Essonne", "Hauts-de-Seine"],
        description: "Entreprise familiale spécialisée dans la maçonnerie, la rénovation et la construction."
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
    
    // DEVIS/LEADS
    leads: []
};

// ========================================
// CLÉS LOCALSTORAGE
// ========================================
const STORAGE_KEY = 'whitelabel_config_v6';
const ADMIN_SESSION_KEY = 'whitelabel_admin_session';
const LEADS_KEY = 'whitelabel_leads_v6';

// ========================================
// FONCTIONS DE STOCKAGE
// ========================================

function getConfig() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            return mergeDeep(DEFAULT_CONFIG, parsed);
        }
    } catch (e) {
        console.error('Erreur lecture config:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
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
    login(username, password) {
        console.log('=== TENTATIVE DE CONNEXION ===');
        console.log('Username entré:', username);
        console.log('Password entré:', password);
        
        // Vérification directe des identifiants
        if (username === 'cbr' && password === '1098') {
            const session = {
                loggedIn: true,
                timestamp: Date.now(),
                expires: Date.now() + (4 * 60 * 60 * 1000)
            };
            sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
            console.log('✅ Connexion réussie!');
            return { success: true, message: 'Connexion réussie' };
        }
        
        console.log('❌ Identifiants incorrects');
        return { success: false, message: 'Identifiants incorrects' };
    },
    
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
    
    logout() {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
    }
};

// ========================================
// SYSTÈME DE DEVIS/LEADS
// ========================================

const LeadSystem = {
    getAll() {
        try {
            const leads = localStorage.getItem(LEADS_KEY);
            return leads ? JSON.parse(leads) : [];
        } catch (e) {
            return [];
        }
    },
    
    save(lead) {
        try {
            const leads = this.getAll();
            lead.id = Date.now();
            lead.date = new Date().toISOString();
            lead.status = 'new';
            leads.unshift(lead);
            localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
            return { success: true, message: 'Devis enregistré' };
        } catch (e) {
            return { success: false, message: 'Erreur lors de l\'enregistrement' };
        }
    },
    
    updateStatus(id, status) {
        const leads = this.getAll();
        const lead = leads.find(l => l.id === id);
        if (lead) {
            lead.status = status;
            localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
            return { success: true };
        }
        return { success: false };
    },
    
    delete(id) {
        let leads = this.getAll();
        leads = leads.filter(l => l.id !== id);
        localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
        return { success: true };
    },
    
    submit(formData) {
        const lead = {};
        formData.forEach((value, key) => {
            lead[key] = value;
        });
        return this.save(lead);
    }
};

// ========================================
// RENDU DU SITE
// ========================================

const SiteRenderer = {
    render() {
        const config = getConfig();
        
        this.renderHeader(config);
        this.renderNavigation(config);
        this.renderHero(config);
        this.renderColors(config);
        this.renderFooter(config);
        this.renderStats(config);
        this.renderServices(config);
        this.renderServicesDetailed(config);
        this.renderPortfolio(config);
        this.renderContactInfo(config);
        this.initMap(config);
    },
    
    renderHeader(config) {
        const logoBox = document.getElementById('logoBox');
        const companyName = document.getElementById('companyName');
        const companyTagline = document.getElementById('companyTagline');
        const headerPhone = document.getElementById('headerPhone');
        const footerCompanyName = document.getElementById('footerCompanyName');
        const footerTagline = document.getElementById('footerTagline');
        const footerLogoBox = document.getElementById('footerLogoBox');
        const ctaPhoneText = document.getElementById('ctaPhoneText');
        const ctaPhone = document.getElementById('ctaPhone');
        
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
        
        if (ctaPhoneText) ctaPhoneText.textContent = config.header.phone;
        if (ctaPhone) ctaPhone.href = `tel:${config.header.phone.replace(/\s/g, '')}`;
    },
    
    renderNavigation(config) {
        const navContainer = document.getElementById('mainNav');
        const mobileNavContainer = document.getElementById('mobileNav');
        
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        const navHTML = config.navigation.items.map(item => {
            const isActive = currentPage === item.url || (currentPage === '' && item.url === 'index.html');
            const activeClass = isActive ? 'active' : '';
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
        
        if (heroBg && config.hero.backgroundImage) {
            heroBg.style.backgroundImage = `url('${config.hero.backgroundImage}')`;
            heroBg.style.backgroundSize = 'cover';
            heroBg.style.backgroundPosition = 'center';
        }
        
        if (heroBtn1) {
            heroBtn1.textContent = config.hero.button1.text;
            heroBtn1.href = config.hero.button1.url;
        }
        if (heroBtn2) {
            heroBtn2.textContent = config.hero.button2.text;
            heroBtn2.href = config.hero.button2.url;
        }
    },
    
    renderColors(config) {
        const root = document.documentElement;
        root.style.setProperty('--primary', config.colors.primary);
        root.style.setProperty('--secondary', config.colors.secondary);
        
        const primaryDark = adjustColor(config.colors.primary, -20);
        root.style.setProperty('--primary-dark', primaryDark);
        
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) metaTheme.content = config.colors.primary;
    },
    
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
    
    renderServices(config) {
        const servicesGrid = document.getElementById('servicesGrid');
        if (!servicesGrid) return;
        
        servicesGrid.innerHTML = config.services.map((service, i) => `
            <div class="service-card animate-on-scroll" style="animation-delay: ${i * 0.15}s">
                <div class="service-icon">${service.icon}</div>
                <h3>${service.title}</h3>
                <p>${service.description}</p>
                <a href="services.html" class="service-link">En savoir plus →</a>
            </div>
        `).join('');
    },
    
    renderServicesDetailed(config) {
        const container = document.getElementById('servicesDetailed');
        if (!container) return;
        
        container.innerHTML = config.services.map((service, i) => `
            <div class="service-detailed animate-on-scroll" style="animation-delay: ${i * 0.1}s">
                <div class="service-detailed-icon">${service.icon}</div>
                <div class="service-detailed-content">
                    <h3>${service.title}</h3>
                    <p>${service.description}</p>
                    <a href="contact.html" class="btn-primary" style="margin-top: 16px; display: inline-flex;">Demander un devis →</a>
                </div>
            </div>
        `).join('');
    },
    
    renderPortfolio(config) {
        const container = document.getElementById('portfolioMasonry');
        const emptyMsg = document.getElementById('emptyPortfolio');
        if (!container) return;
        
        const portfolio = config.portfolio || [];
        
        if (portfolio.length === 0) {
            container.innerHTML = '';
            if (emptyMsg) emptyMsg.style.display = 'block';
            return;
        }
        
        if (emptyMsg) emptyMsg.style.display = 'none';
        
        container.innerHTML = portfolio.map((item, i) => `
            <div class="portfolio-item animate-on-scroll" style="animation-delay: ${i * 0.1}s" onclick="openPortfolioModal(${i})">
                <img src="${item.image || 'https://via.placeholder.com/400x300?text=Pas+d\'image'}" alt="${item.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300?text=Image+non+disponible'">
                <div class="portfolio-overlay">
                    <span class="portfolio-category">${item.category || 'Projet'}</span>
                    <h4>${item.title}</h4>
                </div>
            </div>
        `).join('');
        
        // Mettre à jour les filtres
        this.renderPortfolioFilters(config);
    },
    
    renderPortfolioFilters(config) {
        const container = document.getElementById('filterButtons');
        if (!container) return;
        
        const portfolio = config.portfolio || [];
        const categories = ['all', ...new Set(portfolio.map(p => p.category).filter(Boolean))];
        
        container.innerHTML = categories.map(cat => `
            <button class="${cat === 'all' ? 'active' : ''}" onclick="setPortfolioFilter('${cat}')">${cat === 'all' ? 'Tous' : cat}</button>
        `).join('');
    },
    
    renderFooter(config) {
        const footerAddress = document.getElementById('footerAddress');
        const footerPhone = document.getElementById('footerPhone');
        const footerEmail = document.getElementById('footerEmail');
        const footerHours = document.getElementById('footerHours');
        const zonesTags = document.getElementById('zonesTags');
        const currentYear = document.getElementById('currentYear');
        const copyrightName = document.getElementById('copyrightName');
        const footerDesc = document.querySelector('.footer-desc');
        
        if (footerAddress) footerAddress.innerHTML = `📍 ${config.company.address}`;
        if (footerPhone) footerPhone.innerHTML = `📞 <a href="tel:${config.company.phone.replace(/\s/g, '')}">${config.company.phone}</a>`;
        if (footerEmail) footerEmail.innerHTML = `✉️ <a href="mailto:${config.company.email}">${config.company.email}</a>`;
        if (footerHours) footerHours.innerHTML = `🕐 Lun-Ven: ${config.company.hours.weekday}`;
        if (zonesTags) zonesTags.innerHTML = config.company.zones.map(z => `<span>${z}</span>`).join('');
        if (currentYear) currentYear.textContent = new Date().getFullYear();
        if (copyrightName) copyrightName.textContent = config.company.name;
        if (footerDesc) footerDesc.textContent = config.company.description;
    },
    
    renderContactInfo(config) {
        const contactAddress = document.getElementById('contactAddress');
        const contactPhone = document.getElementById('contactPhone');
        const contactEmail = document.getElementById('contactEmail');
        const contactHours = document.getElementById('contactHours');
        const zonesList = document.getElementById('zonesList');
        const mapAddress = document.getElementById('mapAddress');
        
        if (contactAddress) contactAddress.textContent = config.company.address;
        if (contactPhone) {
            contactPhone.textContent = config.company.phone;
            contactPhone.href = `tel:${config.company.phone.replace(/\s/g, '')}`;
        }
        if (contactEmail) {
            contactEmail.textContent = config.company.email;
            contactEmail.href = `mailto:${config.company.email}`;
        }
        if (contactHours) {
            contactHours.innerHTML = `Lun-Ven: ${config.company.hours.weekday}<br>Sam: ${config.company.hours.saturday}`;
        }
        if (zonesList) {
            zonesList.innerHTML = config.company.zones.map(z => `<span>${z}</span>`).join('');
        }
        if (mapAddress) {
            mapAddress.textContent = `${config.map.markerTitle} - ${config.map.markerAddress}`;
        }
    },
    
    initMap(config) {
        const mapContainer = document.getElementById('map');
        if (!mapContainer || typeof L === 'undefined') return;
        
        if (mapContainer._leaflet_id) return;
        
        const map = L.map('map', {
            scrollWheelZoom: false
        }).setView([config.map.latitude, config.map.longitude], config.map.zoom);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);
        
        const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background: ${config.colors.secondary}; border: 3px solid white; border-radius: 50%; width: 36px; height: 36px; box-shadow: 0 4px 12px rgba(220,38,38,0.4); display: flex; align-items: center; justify-content: center; color: white; font-size: 16px;">📍</div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
            popupAnchor: [0, -20]
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
// UTILITAIRES
// ========================================

function adjustColor(color, amount) {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

function showToast(message, type = 'success') {
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
    }, 4000);
}

// ========================================
// WIDGET ADMIN DEVIS (bas gauche)
// ========================================

const AdminWidget = {
    init() {
        // Ne pas afficher sur la page admin
        if (window.location.pathname.includes('admin.html')) return;
        
        // Créer le bouton flottant
        const btn = document.createElement('button');
        btn.id = 'adminWidgetBtn';
        btn.innerHTML = '📋 Devis';
        btn.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 9998;
            padding: 12px 20px;
            background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
            color: white;
            border: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px)';
            btn.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
        });
        
        btn.addEventListener('click', () => this.showLoginModal());
        
        document.body.appendChild(btn);
    },
    
    showLoginModal() {
        // Supprimer modal existant
        const existingModal = document.getElementById('adminWidgetModal');
        if (existingModal) existingModal.remove();
        
        const modal = document.createElement('div');
        modal.id = 'adminWidgetModal';
        modal.style.cssText = `
            position: fixed;
            inset: 0;
            z-index: 99999;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 16px;
                padding: 32px;
                width: 100%;
                max-width: 400px;
                box-shadow: 0 20px 50px rgba(0,0,0,0.3);
                animation: slideUp 0.3s ease;
            ">
                <h3 style="margin: 0 0 20px 0; font-size: 20px;">🔐 Accès Admin</h3>
                <div class="form-group" style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 6px; font-size: 14px; font-weight: 600;">Identifiant</label>
                    <input type="text" id="widgetUsername" placeholder="cbr" style="
                        width: 100%;
                        padding: 12px 16px;
                        border: 2px solid #e5e7eb;
                        border-radius: 8px;
                        font-size: 15px;
                    ">
                </div>
                <div class="form-group" style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 6px; font-size: 14px; font-weight: 600;">Mot de passe</label>
                    <input type="password" id="widgetPassword" placeholder="1098" style="
                        width: 100%;
                        padding: 12px 16px;
                        border: 2px solid #e5e7eb;
                        border-radius: 8px;
                        font-size: 15px;
                    ">
                </div>
                <div id="widgetError" style="color: #ef4444; font-size: 14px; margin-bottom: 16px; display: none;">
                    Identifiants incorrects
                </div>
                <div style="display: flex; gap: 12px;">
                    <button onclick="AdminWidget.closeModal()" style="
                        flex: 1;
                        padding: 12px;
                        background: #f3f4f6;
                        border: none;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                    ">Annuler</button>
                    <button onclick="AdminWidget.doLogin()" style="
                        flex: 1;
                        padding: 12px;
                        background: linear-gradient(135deg, #f97316 0%, #dc2626 100%);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                    ">Connexion</button>
                </div>
            </div>
        `;
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal();
        });
        
        document.body.appendChild(modal);
        
        // Focus sur le champ username
        setTimeout(() => document.getElementById('widgetUsername')?.focus(), 100);
        
        // Enter key
        document.getElementById('widgetPassword')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.doLogin();
        });
    },
    
    closeModal() {
        const modal = document.getElementById('adminWidgetModal');
        if (modal) modal.remove();
    },
    
    doLogin() {
        const username = document.getElementById('widgetUsername').value.trim();
        const password = document.getElementById('widgetPassword').value;
        
        const result = AdminAuth.login(username, password);
        
        if (result.success) {
            this.closeModal();
            this.showLeadsPanel();
        } else {
            document.getElementById('widgetError').style.display = 'block';
            document.getElementById('widgetPassword').value = '';
            document.getElementById('widgetPassword').focus();
        }
    },
    
    showLeadsPanel() {
        const leads = LeadSystem.getAll();
        
        const panel = document.createElement('div');
        panel.id = 'leadsPanel';
        panel.style.cssText = `
            position: fixed;
            inset: 0;
            z-index: 99999;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;
        
        const leadsHTML = leads.length === 0 
            ? `<div style="text-align: center; padding: 40px; color: #6b7280;">
                <div style="font-size: 48px; margin-bottom: 16px;">📭</div>
                <p>Aucun devis reçu pour le moment.</p>
               </div>`
            : leads.map(lead => `
                <div style="
                    background: #f9fafb;
                    border-radius: 12px;
                    padding: 16px;
                    margin-bottom: 12px;
                    border-left: 4px solid ${lead.status === 'new' ? '#f97316' : '#10b981'};
                ">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                        <div>
                            <strong style="font-size: 16px;">${lead.name || 'Sans nom'}</strong>
                            <span style="
                                display: inline-block;
                                padding: 2px 8px;
                                background: ${lead.status === 'new' ? '#ffedd5' : '#d1fae5'};
                                color: ${lead.status === 'new' ? '#ea580c' : '#059669'};
                                border-radius: 50px;
                                font-size: 12px;
                                margin-left: 8px;
                            ">${lead.status === 'new' ? 'Nouveau' : 'Traité'}</span>
                        </div>
                        <small style="color: #6b7280;">${new Date(lead.date).toLocaleDateString('fr-FR')}</small>
                    </div>
                    <div style="font-size: 14px; color: #4b5563; margin-bottom: 8px;">
                        📞 ${lead.phone || '-'} | ✉️ ${lead.email || '-'}
                    </div>
                    <div style="font-size: 14px; color: #374151; margin-bottom: 12px;">
                        <strong>Type:</strong> ${lead.projectType || '-'} | 
                        <strong>Délai:</strong> ${lead.deadline || '-'}
                    </div>
                    <div style="font-size: 13px; color: #6b7280; background: white; padding: 10px; border-radius: 8px; margin-bottom: 12px;">
                        ${lead.message || 'Pas de message'}
                    </div>
                    <div style="display: flex; gap: 8px;">
                        ${lead.status === 'new' 
                            ? `<button onclick="AdminWidget.updateLeadStatus(${lead.id}, 'processed')" style="padding: 6px 12px; background: #10b981; color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer;">✓ Marquer comme traité</button>`
                            : `<button onclick="AdminWidget.updateLeadStatus(${lead.id}, 'new')" style="padding: 6px 12px; background: #f97316; color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer;">↩ Marquer comme nouveau</button>`
                        }
                        <button onclick="AdminWidget.deleteLead(${lead.id})" style="padding: 6px 12px; background: #ef4444; color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer;">🗑 Supprimer</button>
                    </div>
                </div>
            `).join('');
        
        panel.innerHTML = `
            <div style="
                background: white;
                border-radius: 16px;
                width: 100%;
                max-width: 600px;
                max-height: 80vh;
                box-shadow: 0 20px 50px rgba(0,0,0,0.3);
                animation: slideUp 0.3s ease;
                display: flex;
                flex-direction: column;
            ">
                <div style="
                    padding: 20px 24px;
                    border-bottom: 1px solid #e5e7eb;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <h3 style="margin: 0; font-size: 18px;">📋 Demandes de devis (${leads.length})</h3>
                    <button onclick="AdminWidget.closeLeadsPanel()" style="
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: #6b7280;
                    ">×</button>
                </div>
                <div style="padding: 20px; overflow-y: auto; flex: 1;">
                    ${leadsHTML}
                </div>
                <div style="
                    padding: 16px 24px;
                    border-top: 1px solid #e5e7eb;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <button onclick="AdminWidget.logout()" style="
                        padding: 10px 20px;
                        background: #fef2f2;
                        color: #ef4444;
                        border: none;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                    ">🚪 Déconnexion</button>
                    <a href="admin.html" style="
                        padding: 10px 20px;
                        background: linear-gradient(135deg, #f97316 0%, #dc2626 100%);
                        color: white;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: 600;
                    ">⚙️ Panneau Admin Complet</a>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
    },
    
    closeLeadsPanel() {
        const panel = document.getElementById('leadsPanel');
        if (panel) panel.remove();
    },
    
    updateLeadStatus(id, status) {
        LeadSystem.updateStatus(id, status);
        this.closeLeadsPanel();
        this.showLeadsPanel();
        showToast('Statut mis à jour', 'success');
    },
    
    deleteLead(id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce devis ?')) {
            LeadSystem.delete(id);
            this.closeLeadsPanel();
            this.showLeadsPanel();
            showToast('Devis supprimé', 'success');
        }
    },
    
    logout() {
        AdminAuth.logout();
        this.closeLeadsPanel();
        showToast('Déconnecté', 'info');
    }
};

// ========================================
// ANIMATIONS AU SCROLL
// ========================================

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

// ========================================
// INITIALISATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Rendu du site avec la config
    SiteRenderer.render();
    
    // Animations
    initScrollAnimations();
    
    // Widget admin devis
    AdminWidget.init();
});

// ========================================
// FONCTIONS PORTFOLIO
// ========================================
let currentPortfolioFilter = 'all';

function setPortfolioFilter(category) {
    currentPortfolioFilter = category;
    
    // Mettre à jour les boutons actifs
    document.querySelectorAll('.filter-buttons button').forEach(btn => {
        btn.classList.toggle('active', 
            (category === 'all' && btn.textContent === 'Tous') || 
            btn.textContent === category
        );
    });
    
    // Filtrer et afficher les éléments
    const config = getConfig();
    const portfolio = config.portfolio || [];
    const filtered = category === 'all' 
        ? portfolio 
        : portfolio.filter(p => p.category === category);
    
    const container = document.getElementById('portfolioMasonry');
    if (!container) return;
    
    if (filtered.length === 0) {
        container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--gray-500);"><p>Aucun projet dans cette catégorie.</p></div>';
        return;
    }
    
    container.innerHTML = filtered.map((item, i) => `
        <div class="portfolio-item animate-on-scroll visible" style="animation-delay: ${i * 0.05}s" onclick="openPortfolioModal(${portfolio.indexOf(item)})">
            <img src="${item.image || 'https://via.placeholder.com/400x300?text=Pas+d\'image'}" alt="${item.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300?text=Image+non+disponible'">
            <div class="portfolio-overlay">
                <span class="portfolio-category">${item.category || 'Projet'}</span>
                <h4>${item.title}</h4>
            </div>
        </div>
    `).join('');
}

function openPortfolioModal(index) {
    const config = getConfig();
    const portfolio = config.portfolio || [];
    const item = portfolio[index];
    if (!item) return;
    
    // Créer le modal
    const modal = document.createElement('div');
    modal.id = 'portfolioModal';
    modal.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 99999;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 16px;
            max-width: 800px;
            width: 100%;
            max-height: 90vh;
            overflow: hidden;
            position: relative;
        ">
            <button onclick="closePortfolioModal()" style="
                position: absolute;
                top: 16px;
                right: 16px;
                width: 40px;
                height: 40px;
                background: rgba(0,0,0,0.5);
                color: white;
                border: none;
                border-radius: 50%;
                font-size: 24px;
                cursor: pointer;
                z-index: 10;
            ">×</button>
            ${item.image ? `
                <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 300px; object-fit: cover;" onerror="this.style.display='none'">
            ` : ''}
            <div style="padding: 32px;">
                <span style="
                    display: inline-block;
                    padding: 4px 12px;
                    background: var(--primary);
                    color: white;
                    border-radius: 50px;
                    font-size: 12px;
                    font-weight: 600;
                    margin-bottom: 12px;
                ">${item.category || 'Projet'}</span>
                <h2 style="margin-bottom: 16px;">${item.title}</h2>
                ${item.date ? `<p style="color: var(--gray-500); margin-bottom: 16px;">📅 ${item.date}</p>` : ''}
                <p style="color: var(--gray-600); line-height: 1.7;">${item.description || 'Aucune description disponible.'}</p>
            </div>
        </div>
    `;
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closePortfolioModal();
    });
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function closePortfolioModal() {
    const modal = document.getElementById('portfolioModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// ========================================
// EXPOSITION GLOBALE
// ========================================
window.toggleMenu = toggleMenu;
window.AdminAuth = AdminAuth;
window.LeadSystem = LeadSystem;
window.getConfig = getConfig;
window.saveConfig = saveConfig;
window.showToast = showToast;
window.AdminWidget = AdminWidget;
window.setPortfolioFilter = setPortfolioFilter;
window.openPortfolioModal = openPortfolioModal;
window.closePortfolioModal = closePortfolioModal;
