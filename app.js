// ========================================
// C.B.R. Île-de-France - JavaScript Complet
// Version 3.0 - Corrigé et Fonctionnel
// ========================================

'use strict';

// ========================================
// CONFIGURATION ET DONNÉES PAR DÉFAUT
// ========================================

const defaultData = {
    company: {
        name: "C.B.R. Île-de-France",
        tagline: "Maçonnerie & Rénovation",
        slogan: "L'excellence en maçonnerie depuis 15 ans",
        description: "Entreprise familiale spécialisée dans la maçonnerie, la rénovation et la construction à Créteil et en Île-de-France.",
        experienceYears: 15,
        address: "12 Rue de la Paix, 94000 Créteil",
        phone: "06 12 34 56 78",
        email: "contact@cbr-iledefrance.fr",
        hours: {
            weekday: "7h00 - 19h00",
            saturday: "8h00 - 17h00",
            sunday: "Fermé"
        },
        zones: ["Créteil", "Paris", "Val-de-Marne", "Seine-Saint-Denis", "Essonne", "Hauts-de-Seine"]
    },
    
    customization: {
        primaryColor: "#f97316",
        secondaryColor: "#dc2626",
        logoImage: null,
        heroImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=2000",
        animationsEnabled: true,
        particlesEnabled: true,
        googleMapsPlaceId: "ChIJGT2DyuVz5kcRGgeZhDj3Dgg",
        googleMapsApiKey: ""
    },
    
    social: {
        instagram: { url: "https://instagram.com/cbr.iledefrance", active: true },
        facebook: { url: "https://facebook.com/cbr.iledefrance", active: true },
        linkedin: { url: "https://linkedin.com/company/cbr-iledefrance", active: false },
        whatsapp: { url: "https://wa.me/33612345678", active: true }
    },
    
    stats: {
        projectsPro: 127,
        projectsParticulier: 243,
        satisfaction: 98,
        projectsThisYear: 45
    },
    
    expertises: [
        {
            id: 1,
            title: "Maçonnerie Traditionnelle",
            description: "Construction et rénovation de murs, façades et structures en pierre, brique ou parpaing. Travaux de qualité garantis.",
            icon: "🏗️",
            image: ""
        },
        {
            id: 2,
            title: "Rénovation Complète",
            description: "Transformation intégrale de vos espaces avec respect des normes et délais. De la conception à la réalisation.",
            icon: "🔨",
            image: ""
        },
        {
            id: 3,
            title: "Terrassement",
            description: "Préparation des sols, fondations et aménagements extérieurs. Équipements professionnels pour tous terrains.",
            icon: "🚜",
            image: ""
        }
    ],
    
    portfolio: [],
    testimonials: [],
    users: [],
    
    seo: {
        title: "C.B.R. Île-de-France | Maçonnerie & Rénovation à Créteil",
        description: "Expert en maçonnerie et rénovation à Créteil depuis 15 ans. Devis gratuit, garantie décennale. Interventions sur Paris et Île-de-France.",
        keywords: "maçonnerie, rénovation, créteil, construction, bâtiment, île-de-france"
    },
    
    leads: [],
    
    admin: {
        username: "admin",
        password: "admin123"
    }
};

// ========================================
// SÉCURITÉ
// ========================================

const Security = {
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16);
    },
    
    generateToken() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    checkPasswordStrength(password) {
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*]/.test(password)
        };
        const score = Object.values(checks).filter(Boolean).length;
        return { checks, score, strong: score >= 4 };
    },
    
    sanitizeInput(input) {
        if (!input) return '';
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    },
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    
    isValidPhone(phone) {
        return /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(phone.replace(/\s/g, ''));
    }
};

// ========================================
// STOCKAGE
// ========================================

const Storage = {
    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Storage save error:', e);
            return false;
        }
    },
    
    load(key) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (e) {
            console.error('Storage load error:', e);
            return null;
        }
    },
    
    remove(key) {
        localStorage.removeItem(key);
    }
};

// ========================================
// DONNÉES
// ========================================

function getData() {
    const saved = Storage.load('cbr_data');
    if (saved) {
        return { ...defaultData, ...saved };
    }
    Storage.save('cbr_data', defaultData);
    return defaultData;
}

function saveData(data) {
    Storage.save('cbr_data', data);
}

function initData() {
    if (!Storage.load('cbr_data')) {
        saveData(defaultData);
    }
}

// ========================================
// SESSION
// ========================================

const Session = {
    CURRENT_USER_KEY: 'cbr_current_user',
    ADMIN_KEY: 'cbr_admin_session',
    
    startUserSession(user) {
        const sessionData = {
            id: user.id,
            name: Security.sanitizeInput(user.name),
            email: user.email,
            token: Security.generateToken(),
            timestamp: Date.now()
        };
        sessionStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(sessionData));
        return sessionData;
    },
    
    startAdminSession() {
        const sessionData = {
            token: Security.generateToken(),
            timestamp: Date.now(),
            expires: Date.now() + (2 * 60 * 60 * 1000)
        };
        sessionStorage.setItem(this.ADMIN_KEY, JSON.stringify(sessionData));
        return sessionData;
    },
    
    getCurrentUser() {
        try {
            const userJson = sessionStorage.getItem(this.CURRENT_USER_KEY);
            if (!userJson) return null;
            const user = JSON.parse(userJson);
            if (Date.now() - user.timestamp > 24 * 60 * 60 * 1000) {
                this.clearUserSession();
                return null;
            }
            return user;
        } catch (e) {
            return null;
        }
    },
    
    isAdminLoggedIn() {
        try {
            const adminJson = sessionStorage.getItem(this.ADMIN_KEY);
            if (!adminJson) return false;
            const admin = JSON.parse(adminJson);
            if (Date.now() > admin.expires) {
                this.clearAdminSession();
                return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    },
    
    clearUserSession() {
        sessionStorage.removeItem(this.CURRENT_USER_KEY);
    },
    
    clearAdminSession() {
        sessionStorage.removeItem(this.ADMIN_KEY);
    }
};

// ========================================
// SYSTÈME UTILISATEURS
// ========================================

const UserSystem = {
    register(name, email, password, phone = '') {
        const data = getData();
        
        name = Security.sanitizeInput(name.trim());
        email = email.trim().toLowerCase();
        
        if (!name || name.length < 2) {
            return { success: false, message: 'Le nom doit contenir au moins 2 caractères' };
        }
        
        if (!Security.isValidEmail(email)) {
            return { success: false, message: 'Email invalide' };
        }
        
        if (password.length < 6) {
            return { success: false, message: 'Le mot de passe doit contenir au moins 6 caractères' };
        }
        
        if (data.users.find(u => u.email === email)) {
            return { success: false, message: 'Cet email est déjà utilisé' };
        }
        
        const newUser = {
            id: Date.now().toString(),
            name: name,
            email: email,
            passwordHash: Security.hashPassword(password),
            phone: phone,
            createdAt: new Date().toISOString(),
            isVerified: false
        };
        
        data.users.push(newUser);
        saveData(data);
        
        const session = Session.startUserSession(newUser);
        
        return { 
            success: true, 
            message: 'Compte créé avec succès !',
            user: session
        };
    },
    
    login(email, password) {
        const data = getData();
        email = email.trim().toLowerCase();
        
        const user = data.users.find(u => 
            u.email === email && 
            u.passwordHash === Security.hashPassword(password)
        );
        
        if (!user) {
            return { success: false, message: 'Email ou mot de passe incorrect' };
        }
        
        const session = Session.startUserSession(user);
        
        return { 
            success: true, 
            message: `Bonjour ${user.name} !`,
            user: session
        };
    },
    
    logout() {
        Session.clearUserSession();
        return { success: true, message: 'Déconnexion réussie' };
    }
};

// ========================================
// SYSTÈME TÉMOIGNAGES
// ========================================

const TestimonialSystem = {
    submit(projectName, rating, content) {
        const currentUser = Session.getCurrentUser();
        
        if (!currentUser) {
            return { success: false, message: 'Vous devez être connecté pour laisser un avis' };
        }
        
        projectName = Security.sanitizeInput(projectName.trim());
        content = Security.sanitizeInput(content.trim());
        rating = parseInt(rating);
        
        if (!projectName || projectName.length < 3) {
            return { success: false, message: 'Veuillez préciser le nom du projet' };
        }
        
        if (!rating || rating < 1 || rating > 5) {
            return { success: false, message: 'Veuillez sélectionner une note' };
        }
        
        if (!content || content.length < 20) {
            return { success: false, message: 'Votre avis doit contenir au moins 20 caractères' };
        }
        
        const data = getData();
        
        const testimonialData = {
            id: Date.now().toString(),
            userId: currentUser.id,
            userName: currentUser.name,
            userEmail: currentUser.email,
            projectName: projectName,
            rating: rating,
            content: content,
            date: new Date().toISOString(),
            visible: false,
            featured: false
        };
        
        data.testimonials.push(testimonialData);
        saveData(data);
        
        return { 
            success: true, 
            message: 'Votre avis a été soumis et est en attente de validation'
        };
    },
    
    getVisible(featuredOnly = false) {
        const data = getData();
        let testimonials = data.testimonials.filter(t => t.visible === true);
        
        if (featuredOnly) {
            testimonials = testimonials.filter(t => t.featured === true);
        }
        
        return testimonials.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    
    getAll(filter = 'all') {
        if (!Session.isAdminLoggedIn()) return [];
        
        const data = getData();
        let testimonials = data.testimonials;
        
        if (filter === 'pending') {
            testimonials = testimonials.filter(t => !t.visible);
        } else if (filter === 'visible') {
            testimonials = testimonials.filter(t => t.visible);
        } else if (filter === 'featured') {
            testimonials = testimonials.filter(t => t.featured);
        }
        
        return testimonials.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    
    moderate(id, updates) {
        if (!Session.isAdminLoggedIn()) {
            return { success: false, message: 'Accès non autorisé' };
        }
        
        const data = getData();
        const index = data.testimonials.findIndex(t => t.id === id);
        
        if (index === -1) {
            return { success: false, message: 'Témoignage non trouvé' };
        }
        
        if (updates.visible !== undefined) {
            data.testimonials[index].visible = updates.visible;
        }
        if (updates.featured !== undefined) {
            data.testimonials[index].featured = updates.featured;
        }
        
        saveData(data);
        return { success: true, message: 'Témoignage mis à jour' };
    },
    
    delete(id) {
        if (!Session.isAdminLoggedIn()) {
            return { success: false, message: 'Accès non autorisé' };
        }
        
        const data = getData();
        data.testimonials = data.testimonials.filter(t => t.id !== id);
        saveData(data);
        return { success: true, message: 'Témoignage supprimé' };
    }
};

// ========================================
// SYSTÈME CONTACT
// ========================================

const ContactSystem = {
    submit(formData) {
        const data = getData();
        
        const lead = {
            id: Date.now().toString(),
            name: Security.sanitizeInput(formData.get('name') || ''),
            email: (formData.get('email') || '').trim().toLowerCase(),
            phone: (formData.get('phone') || '').trim(),
            projectType: formData.get('projectType') || '',
            address: Security.sanitizeInput(formData.get('address') || ''),
            message: Security.sanitizeInput(formData.get('message') || ''),
            date: new Date().toISOString(),
            status: 'new'
        };
        
        if (!lead.name || lead.name.length < 2) {
            return { success: false, message: 'Veuillez entrer votre nom' };
        }
        
        if (!Security.isValidEmail(lead.email)) {
            return { success: false, message: 'Veuillez entrer un email valide' };
        }
        
        if (!lead.message || lead.message.length < 10) {
            return { success: false, message: 'Veuillez décrire votre projet (min 10 caractères)' };
        }
        
        data.leads.push(lead);
        saveData(data);
        
        return { success: true, message: 'Votre demande a été envoyée ! Nous vous répondrons sous 24h.' };
    },
    
    getLeads(filter = 'all') {
        if (!Session.isAdminLoggedIn()) return [];
        
        const data = getData();
        let leads = data.leads;
        
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
    
    Customization.applyColors();
    Customization.applyLogo();
    Customization.applyHeroImage();
    
    renderStats();
    renderExpertises();
    renderServicesDetailed();
    renderPortfolioPreview();
    renderPortfolioFull();
    renderFilterButtons();
    renderTestimonials();
    renderFooter();
    
    const data = getData();
    if (data.seo?.title) {
        document.title = data.seo.title;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && data.seo?.description) {
        metaDesc.content = data.seo.description;
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});

// Expositions globales
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
window.getData = getData;
window.saveData = saveData;
window.Security = Security;
