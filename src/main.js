import './styles/main.css';
import { getTemplate } from './templates/index.js';
import { state } from './state.js';
import { showNotification } from './lib/notify.js';
import { initHomeAnimations } from './lib/home-animations.js';
import { renderDashboardView } from './views/dashboard.js';

document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const navLinks = document.getElementById('nav-links');
    const navProfile = document.getElementById('nav-profile');
    const themeToggle = document.getElementById('theme-toggle');

    // Theme toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    // Router function
    window.renderView = function (viewName) {
        mainContent.innerHTML = '';

        let templateId = '';
        switch (viewName) {
            case 'home':
                templateId = 'tmpl-home';
                break;
            case 'login':
            case 'loginForm':
                templateId = 'tmpl-login-form';
                break;
            case 'registerForm':
                templateId = 'tmpl-register-form';
                break;
            case 'dashboard':
                templateId = state.currentRole === 'doer' ? 'tmpl-doer-dashboard' : 'tmpl-full-dashboard';
                break;
            default:
                templateId = 'tmpl-home';
        }

        const template = getTemplate(templateId);
        if (template) {
            mainContent.appendChild(template.content.cloneNode(true));
            attachEvents(viewName);
        } else {
            console.error(`Template ${templateId} not found`);
        }

        updateNav();
    };

    function updateNav() {
        if (!navLinks || !navProfile) return;
        navLinks.innerHTML = '';
        navProfile.innerHTML = '';

        if (state.currentUser) {
            navLinks.innerHTML = `
                <a href="#" onclick="renderView('dashboard'); return false;" style="text-decoration:none; color:var(--text-main); font-weight:600;">Dashboard</a>
            `;
            navProfile.innerHTML = `
                <div style="display:flex; align-items:center; gap:10px;">
                    <div style="width:32px; height:32px; border-radius:50%; background:var(--brand-cyan); color:white; display:flex; align-items:center; justify-content:center;">${state.currentUser.name[0]}</div>
                    <button onclick="logout()" class="btn-magnetic" style="background:transparent; border:1px solid var(--glass-border-strong); color:var(--text-main); padding:0.5rem 1rem; border-radius:8px; cursor:pointer;">Logout</button>
                </div>
            `;
        } else {
            navLinks.innerHTML = `
                <a href="#how-it-works" onclick="renderView('home'); return false;" style="text-decoration:none; color:var(--text-muted); font-size: 0.95rem; font-weight:500; transition: color 0.3s ease;" onmouseover="this.style.color='var(--text-main)';" onmouseout="this.style.color='var(--text-muted)';">How It Works</a>
                <a href="#trust" onclick="renderView('home'); return false;" style="text-decoration:none; color:var(--text-muted); font-size: 0.95rem; font-weight:500; transition: color 0.3s ease;" onmouseover="this.style.color='var(--text-main)';" onmouseout="this.style.color='var(--text-muted)';">Trust</a>
                <a href="#use-cases" onclick="renderView('home'); return false;" style="text-decoration:none; color:var(--text-muted); font-size: 0.95rem; font-weight:500; transition: color 0.3s ease;" onmouseover="this.style.color='var(--text-main)';" onmouseout="this.style.color='var(--text-muted)';">Use Cases</a>
            `;
            navProfile.innerHTML = `
                <button onclick="renderView('login')" style="background:transparent; border:none; color:var(--text-muted); cursor:pointer; font-weight:500; font-size: 0.95rem; transition: color 0.3s ease;" onmouseover="this.style.color='var(--text-main)';" onmouseout="this.style.color='var(--text-muted)';">Sign In</button>
                <button onclick="renderView('registerForm')" class="btn-magnetic ripple-button" style="background:linear-gradient(135deg, #06b6d4, #8b5cf6); color:white; border:none; padding:0.6rem 1.2rem; border-radius:30px; cursor:pointer; font-weight:600; font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);">
                    Get Started <i class="fa-solid fa-arrow-right" style="font-size: 0.8rem;"></i>
                </button>
            `;
        }
    }

    // =============================================
    //  MAIN EVENT ATTACHMENTS
    // =============================================
    function attachEvents(viewName) {
        if (viewName === 'home') {
            document.querySelectorAll('.role-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    state.currentRole = e.target.dataset.role || 'user';
                    renderView('registerForm');
                });
            });
            initHomeAnimations();
        } else if (viewName === 'login' || viewName === 'loginForm') {
            const loginForm = document.getElementById('form-login');
            if (loginForm) {
                loginForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    state.currentUser = { name: 'Alex Johnson', email: 'alex@example.com' };
                    renderView('dashboard');
                });
            }
            // Google login
            const googleBtn = document.getElementById('btn-google-login');
            if (googleBtn) {
                googleBtn.addEventListener('click', () => {
                    state.currentUser = { name: 'Alex Johnson', email: 'alex@example.com' };
                    renderView('dashboard');
                });
            }
        } else if (viewName === 'registerForm') {
            const regForm = document.getElementById('form-register');
            if (regForm) {
                regForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const nameInput = document.getElementById('reg-name');
                    const name = nameInput ? (nameInput.value || 'New User') : 'New User';
                    state.currentUser = { name: name, email: 'new@example.com' };
                    renderView('dashboard');
                });
            }
        } else if (viewName === 'dashboard') {
            // Populate user info in sidebar
            const dashName = document.getElementById('dash-user-name');
            const dashEmail = document.getElementById('dash-user-email');
            const dashAvatar = document.getElementById('dash-avatar');
            if (dashName && state.currentUser) dashName.textContent = state.currentUser.name;
            if (dashEmail && state.currentUser) dashEmail.textContent = state.currentUser.email;
            if (dashAvatar && state.currentUser) dashAvatar.textContent = state.currentUser.name[0];

            // Sign out
            const signoutBtn = document.getElementById('dash-signout');
            if (signoutBtn) {
                signoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    logout();
                });
            }

            // Sidebar navigation click handlers
            document.querySelectorAll('.dash-nav-item[data-view]').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    renderDashboardView(item.dataset.view);
                });
            });

            // Render the default sub-view
            // Check hash
            const hash = window.location.hash;
            if (hash && hash.startsWith('#/')) {
                const page = hash.replace('#/', '');
                renderDashboardView(page);
            } else {
                renderDashboardView(state.currentDashView || 'dashboard');
            }
        }
    }

    // =============================================
    //  UTILITIES
    // =============================================
    window.logout = function () {
        state.currentUser = null;
        state.currentDashView = 'dashboard';
        renderView('home');
    };

    window.togglePassword = function (icon) {
        const input = icon.previousElementSibling;
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    };

    window.selectRole = function (role) {
        state.currentRole = role;
        const userCard = document.getElementById('role-user-card');
        const doerCard = document.getElementById('role-doer-card');
        if (userCard) {
            userCard.style.background = role === 'user' ? 'var(--brand-cyan-muted)' : 'var(--card-dark-bg)';
            userCard.style.borderColor = role === 'user' ? 'var(--brand-cyan)' : 'var(--glass-border-strong)';
        }
        if (doerCard) {
            doerCard.style.background = role === 'doer' ? 'var(--brand-cyan-muted)' : 'var(--card-dark-bg)';
            doerCard.style.borderColor = role === 'doer' ? 'var(--brand-cyan)' : 'var(--glass-border-strong)';
        }
    };

    // Listen to hash changes for browser nav
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash;
        if (state.currentUser && hash && hash.startsWith('#/')) {
            const page = hash.replace('#/', '');
            // Only render if it's different to prevent double-rendering
            if (state.currentDashView !== page) {
                renderDashboardView(page);
            }
        }
    });

    // Initialize
    renderView('home');
});
