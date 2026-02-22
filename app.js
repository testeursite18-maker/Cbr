



// ========================================
// C.B.R. Île-de-France - JavaScript Complet
// Version 2.0 - Sécurisé & Responsive
// ========================================

'use strict';

// ========================================
// CONFIGURATION ET DONNÉES PAR DÉFAUT
// ========================================

const defaultData = {
    // Informations entreprise
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
    
    // Personnalisation
    customization: {
        primaryColor: "#f97316",
        secondaryColor: "#dc2626",
        logoImage: null, // Base64 ou URL
        heroImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=2000",
        animationsEnabled: true,
        particlesEnabled: true
    },
    
    // Réseaux sociaux
    social: {
        instagram: { url: "https://instagram.com/cbr.iledefrance", active: true },
        facebook: { url: "https://facebook.com/cbr.iledefrance", active: true },
        linkedin: { url: "https://linkedin.com/company/cbr-iledefrance", active: false },
        whatsapp: { url: "https://wa.me/33612345678", active: true }
    },
    
    // Statistiques
    stats: {
        projectsPro: 127,
        projectsParticulier: 243,
        satisfaction: 98,
        projectsThisYear: 45
    },
    
    // Expertises
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
    
    // Portfolio
    portfolio: [],
    
    // Témoignages (avec système de modération)
    testimonials: [],
    
    // Utilisateurs clients (sécurisé - mots de passe hashés en production)
    users: [],
    
    // SEO
    seo: {
        title: "C.B.R. Île-de-France | Maçonnerie & Rénovation à Créteil",
        description: "Expert en maçonnerie et rénovation à Créteil depuis 15 ans. Devis gratuit, garantie décennale. Interventions sur Paris et Île-de-France.",
        keywords: "maçonnerie, rénovation, créteil, construction, bâtiment, île-de-france"
    },
    
    // Leads (demandes de devis)
    leads: [],
    
    // Admin credentials (à changer en production !)
    admin: {
        username: "cbr",
        password: "1098"
    }
};

// ========================================
// SÉCURITÉ ET CHIFFREMENT BASIQUE
// ========================================

const Security = {
    // Génère un hash simple (à remplacer par bcrypt en production)
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16);
    },
    
    // Génère un token de session unique
    generateToken() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    // Vérifie la force du mot de passe
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
    
    // Sanitize input pour prévenir XSS
    sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    },
    
    // Validation email
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    
    // Validation téléphone français
    isValidPhone(phone) {
        return /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(phone.replace(/\s/g, ''));
    }
};

// ========================================
// GESTION DU STOCKAGE SÉCURISÉ
// ========================================

const Storage = {
    // Clé de chiffrement simple (à remplacer par une vraie clé en production)
    ENCRYPTION_KEY: 'cbr_secure_key_2024',
    
    // Chiffrement basique des données sensibles
    encrypt(data) {
        try {
            const json = JSON.stringify(data);
            return btoa(json.split('').map((char, i) => 
                String.fromCharCode(char.charCodeAt(0) ^ this.ENCRYPTION_KEY.charCodeAt(i % this.ENCRYPTION_KEY.length))
            ).join(''));
        } catch (e) {
            console.error('Encryption error:', e);
            return null;
        }
    },
    
    // Déchiffrement
    decrypt(encrypted) {
        try {
            const decoded = atob(encrypted);
            const json = decoded.split('').map((char, i) => 
                String.fromCharCode(char.charCodeAt(0) ^ this.ENCRYPTION_KEY.charCodeAt(i % this.ENCRYPTION_KEY.length))
            ).join('');
            return JSON.parse(json);
        } catch (e) {
            console.error('Decryption error:', e);
            return null;
        }
    },
    
    // Sauvegarde sécurisée
    save(key, data, encrypt = false) {
        try {
            const value = encrypt ? this.encrypt(data) : JSON.stringify(data);
            localStorage.setItem(key, value);
            return true;
        } catch (e) {
            console.error('Storage save error:', e);
            return false;
        }
    },
    
    // Chargement sécurisé
    load(key, encrypted = false) {
        try {
            const value = localStorage.getItem(key);
            if (!value) return null;
            return encrypted ? this.decrypt(value) : JSON.parse(value);
        } catch (e) {
            console.error('Storage load error:', e);
            return null;
        }
    },
    
    // Suppression
    remove(key) {
        localStorage.removeItem(key);
    },
    
    // Nettoyage complet
    clear() {
        localStorage.clear();
    }
};

// ========================================
// GESTION DES DONNÉES
// ========================================

function getData() {
    const saved = Storage.load('cbr_data');
    if (saved) {
        // Fusion avec les valeurs par défaut pour les nouveaux champs
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
// SYSTÈME DE SESSION
// ========================================

const Session = {
    CURRENT_USER_KEY: 'cbr_current_user',
    ADMIN_KEY: 'cbr_admin_session',
    TOKEN_KEY: 'cbr_session_token',
    
    // Démarre une session utilisateur
    startUserSession(user) {
        const sessionData = {
            id: user.id,
            name: Security.sanitizeInput(user.name),
            email: user.email,
            token: Security.generateToken(),
            timestamp: Date.now()
        };
        sessionStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(sessionData));
        sessionStorage.setItem(this.TOKEN_KEY, sessionData.token);
        return sessionData;
    },
    
    // Démarre une session admin
    startAdminSession() {
        const sessionData = {
            token: Security.generateToken(),
            timestamp: Date.now(),
            expires: Date.now() + (2 * 60 * 60 * 1000) // 2 heures
        };
        sessionStorage.setItem(this.ADMIN_KEY, JSON.stringify(sessionData));
        sessionStorage.setItem(this.TOKEN_KEY, sessionData.token);
        return sessionData;
    },
    
    // Récupère l'utilisateur connecté
    getCurrentUser() {
        try {
            const userJson = sessionStorage.getItem(this.CURRENT_USER_KEY);
            if (!userJson) return null;
            const user = JSON.parse(userJson);
            // Vérifie si la session n'est pas expirée (24h)
            if (Date.now() - user.timestamp > 24 * 60 * 60 * 1000) {
                this.clearUserSession();
                return null;
            }
            return user;
        } catch (e) {
            return null;
        }
    },
    
    // Vérifie si admin est connecté
    isAdminLoggedIn() {
        try {
            const adminJson = sessionStorage.getItem(this.ADMIN_KEY);
            if (!adminJson) return false;
            const admin = JSON.parse(adminJson);
            // Vérifie expiration
            if (Date.now() > admin.expires) {
                this.clearAdminSession();
                return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    },
    
    // Déconnexion utilisateur
    clearUserSession() {
        sessionStorage.removeItem(this.CURRENT_USER_KEY);
        sessionStorage.removeItem(this.TOKEN_KEY);
    },
    
    // Déconnexion admin
    clearAdminSession() {
        sessionStorage.removeItem(this.ADMIN_KEY);
        sessionStorage.removeItem(this.TOKEN_KEY);
    },
    
    // Déconnexion complète
    clearAll() {
        sessionStorage.clear();
    }
};

// ========================================
// SYSTÈME UTILISATEURS CLIENTS
// ========================================

const UserSystem = {
    // Inscription d'un nouveau client
    register(name, email, password, phone = '') {
        const data = getData();
        
        // Validation
        name = Security.sanitizeInput(name.trim());
        email = email.trim().toLowerCase();
        
        if (!name || name.length < 2) {
            return { success: false, message: 'Le nom doit contenir au moins 2 caractères' };
        }
        
        if (!Security.isValidEmail(email)) {
            return { success: false, message: 'Email invalide' };
        }
        
        const passwordCheck = Security.checkPasswordStrength(password);
        if (!passwordCheck.strong) {
            return { success: false, message: 'Mot de passe trop faible. Utilisez au moins 8 caractères avec majuscules, minuscules, chiffres et caractères spéciaux.' };
        }
        
        // Vérifie si l'email existe déjà
        if (data.users.find(u => u.email === email)) {
            return { success: false, message: 'Cet email est déjà utilisé' };
        }
        
        // Crée le nouvel utilisateur
        const newUser = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            name: name,
            email: email,
            passwordHash: Security.hashPassword(password),
            phone: phone,
            createdAt: new Date().toISOString(),
            isVerified: false, // Pour validation email future
            projects: [] // Liste des projets associés
        };
        
        data.users.push(newUser);
        saveData(data);
        
        // Connecte automatiquement
        const session = Session.startUserSession(newUser);
        
        return { 
            success: true, 
            message: 'Compte créé avec succès ! Bienvenue chez C.B.R.',
            user: session
        };
    },
    
    // Connexion
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
    
    // Déconnexion
    logout() {
        Session.clearUserSession();
        return { success: true, message: 'Déconnexion réussie' };
    },
    
    // Récupère l'utilisateur complet par ID
    getUserById(userId) {
        const data = getData();
        return data.users.find(u => u.id === userId);
    },
    
    // Met à jour le profil
    updateProfile(userId, updates) {
        const data = getData();
        const userIndex = data.users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
            return { success: false, message: 'Utilisateur non trouvé' };
        }
        
        // Mise à jour sécurisée
        if (updates.name) {
            data.users[userIndex].name = Security.sanitizeInput(updates.name.trim());
        }
        if (updates.phone) {
            data.users[userIndex].phone = updates.phone;
        }
        
        saveData(data);
        return { success: true, message: 'Profil mis à jour' };
    }
};

// ========================================
// SYSTÈME DE TÉMOIGNAGES
// ========================================

const TestimonialSystem = {
    // Soumettre un nouvel avis (client connecté requis)
    submit(projectName, rating, content, images = []) {
        const currentUser = Session.getCurrentUser();
        
        if (!currentUser) {
            return { success: false, message: 'Vous devez être connecté pour laisser un avis. <a href="#" onclick="showAuthModal()">Se connecter</a>' };
        }
        
        // Validation
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
        
        // Vérifie si l'utilisateur a déjà laissé un avis pour ce projet
        const existingIndex = data.testimonials.findIndex(t => 
            t.userId === currentUser.id && t.projectName === projectName
        );
        
        const testimonialData = {
            id: existingIndex >= 0 ? data.testimonials[existingIndex].id : Date.now().toString(),
            userId: currentUser.id,
            userName: currentUser.name,
            userEmail: currentUser.email,
            projectName: projectName,
            rating: rating,
            content: content,
            images: images.slice(0, 5), // Max 5 images
            date: new Date().toISOString(),
            visible: false, // En attente de modération
            featured: false,
            adminResponse: null,
            likes: 0
        };
        
        if (existingIndex >= 0) {
            // Met à jour l'avis existant (remet en modération)
            data.testimonials[existingIndex] = {
                ...data.testimonials[existingIndex],
                ...testimonialData,
                visible: false, // Remet en modération
                featured: false,
                updatedAt: new Date().toISOString()
            };
        } else {
            data.testimonials.push(testimonialData);
        }
        
        saveData(data);
        
        return { 
            success: true, 
            message: 'Votre avis a été soumis et est en attente de validation par notre équipe. Merci !'
        };
    },
    
    // Récupérer les témoignages visibles
    getVisible(featuredOnly = false) {
        const data = getData();
        let testimonials = data.testimonials.filter(t => t.visible === true);
        
        if (featuredOnly) {
            testimonials = testimonials.filter(t => t.featured === true);
        }
        
        // Trie par date décroissante
        return testimonials.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    
    // Récupérer tous les témoignages (admin)
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
    
    // Modérer un témoignage (admin)
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
        if (updates.adminResponse !== undefined) {
            data.testimonials[index].adminResponse = Security.sanitizeInput(updates.adminResponse);
        }
        
        saveData(data);
        return { success: true, message: 'Témoignage mis à jour' };
    },
    
    // Supprimer un témoignage
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
// GESTION DU FORMULAIRE DE CONTACT
// ========================================

const ContactSystem = {
    submit(formData) {
        const data = getData();
        
        // Validation et sanitization
        const lead = {
            id: Date.now().toString(),
            name: Security.sanitizeInput(formData.get('name') || ''),
            email: (formData.get('email') || '').trim().toLowerCase(),
            phone: (formData.get('phone') || '').trim(),
            projectType: formData.get('projectType') || '',
            address: Security.sanitizeInput(formData.get('address') || ''),
            message: Security.sanitizeInput(formData.get('message') || ''),
            date: new Date().toISOString(),
            status: 'new',
            notes: [],
            contactedAt: null,
            convertedAt: null
        };
        
        // Validation
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
        
        // Notification admin (simulation)
        this.notifyAdmin(lead);
        
        return { success: true, message: 'Votre demande a été envoyée ! Nous vous répondrons sous 24h.' };
    },
    
    notifyAdmin(lead) {
        // Simulation de notification
        console.log('Nouveau lead:', lead);
        // En production: envoi d'email ou notification push
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
        
        if (status === 'contacted') {
            lead.contactedAt = new Date().toISOString();
        } else if (status === 'converted') {
            lead.convertedAt = new Date().toISOString();
        }
        
        saveData(data);
        return { success: true, message: 'Statut mis à jour' };
    }
};

// ========================================
// SYSTÈME DE PERSONNALISATION
// ========================================

const Customization = {
    applyColors() {
        const data = getData();
        const colors = data.customization || defaultData.customization;
        
        const root = document.documentElement;
        root.style.setProperty('--primary', colors.primaryColor);
        root.style.setProperty('--secondary', colors.secondaryColor);
        
        // Calcule les dérivés
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
        
        // Applique immédiatement
        this.applyColors();
        this.applyLogo();
        this.applyHeroImage();
        
        return { success: true, message: 'Personnalisation mise à jour' };
    }
};

// ========================================
// UTILITAIRES UI
// ========================================

const UI = {
    // Toast notifications
    toast(message, type = 'info', duration = 4000) {
        const container = document.getElementById('toastContainer') || this.createToastContainer();
        
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
            toast.classList.add('hiding');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },
    
    createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    },
    
    // Toggle menu mobile
    toggleMenu() {
        const menu = document.getElementById('mobileMenu');
        const toggle = document.querySelector('.menu-toggle');
        
        if (menu && toggle) {
            menu.classList.toggle('show');
            toggle.classList.toggle('active');
            document.body.style.overflow = menu.classList.contains('show') ? 'hidden' : '';
        }
    },
    
    // Animation au scroll
    initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Animation des nombres
                    if (entry.target.classList.contains('stat-number')) {
                        this.animateNumber(entry.target);
                    }
                }
            });
        }, { 
            threshold: 0.1, 
            rootMargin: '0px 0px -50px 0px' 
        });
        
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    },
    
    animateNumber(element) {
        const target = parseInt(element.textContent);
        const suffix = element.textContent.replace(/[0-9]/g, '');
        const duration = 2000;
        const start = performance.now();
        
        element.textContent = '0' + suffix;
        
        const update = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            const current = Math.floor(easeProgress * target);
            
            element.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        
        requestAnimationFrame(update);
    },
    
    // Header scroll effect
    initHeaderScroll() {
        const header = document.getElementById('header');
        if (!header) return;
        
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
    },
    
    // Effet magnétique sur les boutons
    initMagneticButtons() {
        if (window.matchMedia('(pointer: coarse)').matches) return; // Désactive sur tactile
        
        document.querySelectorAll('.magnetic-btn').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }
};

// ========================================
// RENDU DES SECTIONS
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
            <div class="stat-number animate-on-scroll">${stat.value}${stat.suffix}</div>
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
    
    const testimonials = TestimonialSystem.getVisible(true); // Uniquement les mis en avant
    
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
    
    // Description
    const desc = document.getElementById('footerDesc');
    if (desc) desc.textContent = data.company.description;
    
    // Réseaux sociaux
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
    
    // Contact
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
    
    // Zones
    const zones = document.getElementById('zonesTags');
    if (zones) {
        zones.innerHTML = data.company.zones.map(z => `<span>${z}</span>`).join('');
    }
    
    // Année copyright
    document.querySelectorAll('#currentYear').forEach(el => {
        el.textContent = new Date().getFullYear();
    });
    
    // Noms entreprise
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

function renderContactInfo() {
    const data = getData();
    
    const container = document.getElementById('contactInfoItems');
    if (container) {
        container.innerHTML = `
            <div class="info-item animate-on-scroll">
                <div class="info-icon">📍</div>
                <div>
                    <h4>Adresse</h4>
                    <p>${data.company.address}</p>
                </div>
            </div>
            <div class="info-item animate-on-scroll">
                <div class="info-icon">📞</div>
                <div>
                    <h4>Téléphone</h4>
                    <a href="tel:${data.company.phone.replace(/\s/g, '')}">${data.company.phone}</a>
                </div>
            </div>
            <div class="info-item animate-on-scroll">
                <div class="info-icon">✉️</div>
                <div>
                    <h4>Email</h4>
                    <a href="mailto:${data.company.email}">${data.company.email}</a>
                </div>
            </div>
            <div class="info-item animate-on-scroll">
                <div class="info-icon">🕐</div>
                <div>
                    <h4>Horaires</h4>
                    <p>Lun-Ven: ${data.company.hours.weekday}<br>Sam: ${data.company.hours.saturday}</p>
                </div>
            </div>
        `;
    }
    
    const zones = document.getElementById('contactZones');
    if (zones) {
        zones.innerHTML = data.company.zones.map(z => `<span>${z}</span>`).join('');
    }
}

// ========================================
// INTERACTIONS
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

// Gestion du formulaire de contact
function handleContactSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('.btn-submit');
    
    // Loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    const formData = new FormData(form);
    const result = ContactSystem.submit(formData);
    
    setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        if (result.success) {
            form.style.display = 'none';
            const success = document.getElementById('formSuccess');
            if (success) {
                success.style.display = 'block';
                success.classList.add('animate-scale');
            }
            UI.toast(result.message, 'success');
        } else {
            UI.toast(result.message, 'error');
        }
    }, 1000);
}

// Gestion des témoignages
function handleTestimonialSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    const formData = new FormData(form);
    const result = TestimonialSystem.submit(
        formData.get('projectName'),
        formData.get('rating'),
        formData.get('content')
    );
    
    setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        if (result.success) {
            form.reset();
            UI.toast(result.message, 'success');
        } else {
            UI.toast(result.message, 'error');
        }
    }, 1000);
}

// ========================================
// AUTHENTIFICATION UI
// ========================================

function showAuthModal() {
    // Crée le modal si nécessaire
    let modal = document.getElementById('authModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'authModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <button class="modal-close" onclick="closeAuthModal()">&times;</button>
                <div class="auth-tabs">
                    <button class="auth-tab active" onclick="switchAuthTab('login')">Connexion</button>
                    <button class="auth-tab" onclick="switchAuthTab('register')">Inscription</button>
                </div>
                
                <form id="loginForm" class="auth-form active" onsubmit="handleLogin(event)">
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" name="email" required placeholder="votre@email.com">
                    </div>
                    <div class="form-group">
                        <label>Mot de passe</label>
                        <input type="password" name="password" required placeholder="••••••••">
                    </div>
                    <button type="submit" class="btn-submit">Se connecter</button>
                </form>
                
                <form id="registerForm" class="auth-form" onsubmit="handleRegister(event)">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Nom complet</label>
                            <input type="text" name="name" required placeholder="Jean Dupont">
                        </div>
                        <div class="form-group">
                            <label>Téléphone</label>
                            <input type="tel" name="phone" placeholder="06 12 34 56 78">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" name="email" required placeholder="votre@email.com">
                    </div>
                    <div class="form-group">
                        <label>Mot de passe</label>
                        <input type="password" name="password" required placeholder="Min. 8 caractères" minlength="8">
                        <small style="color: var(--gray-500); font-size: 12px;">8 caractères minimum avec majuscules, minuscules, chiffres et caractères spéciaux</small>
                    </div>
                    <button type="submit" class="btn-submit">Créer mon compte</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tab + 'Form').classList.add('active');
}

function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const result = UserSystem.login(
        formData.get('email'),
        formData.get('password')
    );
    
    if (result.success) {
        UI.toast(result.message, 'success');
        closeAuthModal();
        updateUIForLoggedUser(result.user);
    } else {
        UI.toast(result.message, 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const result = UserSystem.register(
        formData.get('name'),
        formData.get('email'),
        formData.get('password'),
        formData.get('phone')
    );
    
    if (result.success) {
        UI.toast(result.message, 'success');
        closeAuthModal();
        updateUIForLoggedUser(result.user);
    } else {
        UI.toast(result.message, 'error');
    }
}

function updateUIForLoggedUser(user) {
    // Met à jour l'UI pour montrer que l'utilisateur est connecté
    // Par exemple, change le bouton "Se connecter" en "Mon compte"
    const authButtons = document.querySelectorAll('.auth-button');
    authButtons.forEach(btn => {
        btn.textContent = `👤 ${user.name}`;
        btn.onclick = () => {
            // Menu déroulant ou redirection vers profil
            if (confirm('Se déconnecter ?')) {
                UserSystem.logout();
                location.reload();
            }
        };
    });
}

// ========================================
// INITIALISATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialise les données
    initData();
    
    // Applique la personnalisation
    Customization.applyColors();
    Customization.applyLogo();
    Customization.applyHeroImage();
    
    // Rendu des sections
    renderStats();
    renderExpertises();
    renderServicesDetailed();
    renderPortfolioPreview();
    renderPortfolioFull();
    renderFilterButtons();
    renderTestimonials();
    renderFooter();
    renderContactInfo();
    
    // Initialise les interactions
    UI.initHeaderScroll();
    UI.initScrollAnimations();
    UI.initMagneticButtons();
    
    // Vérifie si utilisateur connecté
    const currentUser = Session.getCurrentUser();
    if (currentUser) {
        updateUIForLoggedUser(currentUser);
    }
    
    // SEO
    const data = getData();
    if (data.seo?.title) {
        document.title = data.seo.title;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && data.seo?.description) {
        metaDesc.content = data.seo.description;
    }
    
    // Fermeture modals avec Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeAuthModal();
        }
    });
});

// Expose les fonctions globales nécessaires
window.toggleMenu = UI.toggleMenu;
window.openProjectModal = openProjectModal;
window.closeModal = closeModal;
window.setPortfolioFilter = setPortfolioFilter;
window.showAuthModal = showAuthModal;
window.closeAuthModal = closeAuthModal;
window.switchAuthTab = switchAuthTab;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.submitForm = handleContactSubmit;
window.submitTestimonial = handleTestimonialSubmit;
app.js
Affichage de app.js en cours...
