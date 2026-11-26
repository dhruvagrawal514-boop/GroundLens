import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/main.css';
import './styles/layout.css';
import { getTemplate } from './templates/index.js';
import { state } from './state.js';
import { showNotification } from './lib/notify.js';
import { initHomeAnimations } from './lib/home-animations.js';
import { renderDashboardView } from './views/dashboard.js';
import { renderScoutDashboard } from './views/scout-dashboard.js';
import { escapeHtml } from './lib/escape-html.js';

document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const navLinks = document.getElementById('nav-links');
    const navProfile = document.getElementById('nav-profile');

    // Router function (also exposed on window for the dashboard sub-views)
    window.renderView = renderView;
    function renderView(viewName) {
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
    }

    function updateNav() {
        if (!navLinks || !navProfile) return;

        if (state.currentUser) {
            const initial = escapeHtml(state.currentUser.name.trim()[0] || '?').toUpperCase();
            navLinks.innerHTML = `<a href="#" class="nav-link nav-link-active" data-nav="dashboard">Dashboard</a>`;
            navProfile.innerHTML = `
                <div class="nav-user">
                    <div class="nav-avatar" aria-hidden="true">${initial}</div>
                    <button type="button" class="nav-btn-outline btn-magnetic" data-nav="logout">Log out</button>
                </div>`;
        } else {
            navLinks.innerHTML = `
                <a href="#how-it-works" class="nav-link" data-section="how-it-works">How It Works</a>
                <a href="#features" class="nav-link" data-section="features">Trust</a>
                <a href="#testimonials" class="nav-link" data-section="testimonials">Reviews</a>`;
            navProfile.innerHTML = `
                <button type="button" class="nav-btn-text" data-nav="loginForm">Sign In</button>
                <button type="button" class="nav-btn-primary btn-magnetic ripple-button" data-nav="registerForm">
                    Get Started <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                </button>`;
        }
    }

    // One delegated handler for every nav link and button.
    document.querySelector('.glass-nav').addEventListener('click', (e) => {
        const logo = e.target.closest('.logo');
        const navTarget = e.target.closest('[data-nav]');
        const sectionLink = e.target.closest('[data-section]');

        if (logo) {
            e.preventDefault();
            renderView(state.currentUser ? 'dashboard' : 'home');
        } else if (navTarget) {
            e.preventDefault();
            if (navTarget.dataset.nav === 'logout') logout();
            else renderView(navTarget.dataset.nav);
        } else if (sectionLink) {
            e.preventDefault();
            scrollToSection(sectionLink.dataset.section);
        }
    });

    function scrollToSection(id) {
        if (!document.getElementById(id)) renderView('home');
        requestAnimationFrame(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // Password show/hide toggles (login + register forms)
    mainContent.addEventListener('click', (e) => {
        const toggle = e.target.closest('[data-toggle-password]');
        if (toggle) togglePassword(toggle);
    });
    mainContent.addEventListener('keydown', (e) => {
        const toggle = e.target.closest('[data-toggle-password]');
        if (toggle && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            togglePassword(toggle);
        }
    });

    // =============================================
    //  MAIN EVENT ATTACHMENTS
    // =============================================
    function attachEvents(viewName) {
        if (viewName === 'home') {
            document.querySelectorAll('.role-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    state.currentRole = e.currentTarget.dataset.role || 'user';
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
            document.querySelectorAll('[data-role-card]').forEach(card => {
                card.addEventListener('click', () => selectRole(card.dataset.roleCard));
                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        selectRole(card.dataset.roleCard);
                    }
                });
            });
            selectRole(state.currentRole);

            const regForm = document.getElementById('form-register');
            if (regForm) {
                regForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const password = document.getElementById('reg-password')?.value || '';
                    const confirm = document.getElementById('reg-confirm')?.value || '';
                    if (password.length < 8) {
                        showNotification('Password must be at least 8 characters', 'warning');
                        return;
                    }
                    if (password !== confirm) {
                        showNotification('Passwords do not match', 'warning');
                        return;
                    }
                    const nameInput = document.getElementById('reg-name');
                    const emailInput = document.getElementById('reg-email');
                    const name = nameInput?.value.trim() || 'New User';
                    const email = emailInput?.value.trim() || 'new@example.com';
                    state.currentUser = { name, email };
                    renderView('dashboard');
                });
            }
        } else if (viewName === 'dashboard' && state.currentRole === 'doer') {
            renderScoutDashboard();
        } else if (viewName === 'dashboard') {
            // Populate user info in sidebar
            const dashName = document.getElementById('dash-user-name');
            const dashEmail = document.getElementById('dash-user-email');
            const dashAvatar = document.getElementById('dash-avatar');
            if (dashName && state.currentUser) dashName.textContent = state.currentUser.name;
            if (dashEmail && state.currentUser) dashEmail.textContent = state.currentUser.email;
            if (dashAvatar && state.currentUser) dashAvatar.textContent = (state.currentUser.name.trim()[0] || '?').toUpperCase();

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
    function logout() {
        state.currentUser = null;
        state.currentRole = 'user';
        state.currentDashView = 'dashboard';
        history.replaceState(null, '', window.location.pathname);
        renderView('home');
        window.scrollTo(0, 0);
    }

    function togglePassword(icon) {
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
        icon.setAttribute('aria-label', input.type === 'password' ? 'Show password' : 'Hide password');
    }

    function selectRole(role) {
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
        userCard?.setAttribute('aria-pressed', String(role === 'user'));
        doerCard?.setAttribute('aria-pressed', String(role === 'doer'));
    }

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

    // Keyboard support for the logo
    document.querySelector('.glass-nav .logo')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') renderView(state.currentUser ? 'dashboard' : 'home');
    });

    // Initialize
    renderView('home');
});
