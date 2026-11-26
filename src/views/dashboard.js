import { state } from '../state.js';
import { notifications, transactions } from '../data/mock.js';
import { showNotification } from '../lib/notify.js';
import { animateNumber } from '../lib/animate-number.js';

// =============================================
//  INNER DASHBOARD ROUTER
// =============================================
export function renderDashboardView(viewName) {
    state.currentDashView = viewName;
    const container = document.getElementById('dash-content');
    if (!container) return;

    // Update URL hash
    window.location.hash = `#/${viewName}`;

    // Update sidebar active state
    document.querySelectorAll('.dash-nav-item[data-view]').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.view === viewName) {
            item.classList.add('active');
        }
    });

    // Update notification badge
    updateNotificationBadge();

    // Transition out
    container.classList.remove('dash-content-enter');
    container.classList.add('dash-content-exit');

    setTimeout(() => {
        // Swap content
        switch (viewName) {
            case 'dashboard': container.innerHTML = buildDashboardHome(); break;
            case 'post-task': container.innerHTML = buildPostTask(); break;
            case 'notifications': container.innerHTML = buildNotifications(); break;
            case 'wallet': container.innerHTML = buildWallet(); break;
            case 'analytics': container.innerHTML = buildAnalytics(); break;
            default: container.innerHTML = buildDashboardHome();
        }

        // Transition in
        container.classList.remove('dash-content-exit');
        container.classList.add('dash-content-enter');

        // Attach sub-view events
        attachDashViewEvents(viewName);
    }, 150);
}

function updateNotificationBadge() {
    const badge = document.querySelector('.dash-nav-badge');
    if (!badge) return;
    const unread = notifications.filter(n => !n.read).length;
    badge.textContent = unread;
    badge.style.display = unread > 0 ? 'flex' : 'none';

    if (unread > 0) {
        badge.classList.add('pulse');
    } else {
        badge.classList.remove('pulse');
    }
}

// =============================================
//  SUB-VIEW BUILDERS
// =============================================
function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
}

function buildDashboardHome() {
    const name = state.currentUser ? state.currentUser.name.split(' ')[0] : 'User';
    return `
    <!-- Header -->
    <div class="dash-header">
        <div>
            <h2 class="dash-greeting">${getGreeting()}, ${name} 🚀</h2>
            <p class="dash-greeting-sub">Manage your tasks and track progress</p>
        </div>
        <button class="dash-btn-post" id="dash-post-task-btn">
            <i class="fa-solid fa-plus"></i> Post Task
        </button>
    </div>

    <!-- Stats Cards -->
    <div class="dash-stats-row">
        <div class="dash-stat-card">
            <div class="dash-stat-icon" style="background: rgba(99, 102, 241, 0.15); color: #6366f1;">
                <i class="fa-solid fa-list-check"></i>
            </div>
            <div class="dash-stat-info">
                <span class="dash-stat-value" id="dash-total-tasks">0</span>
                <span class="dash-stat-label">Total Tasks</span>
            </div>
            <span class="dash-stat-trend up"><i class="fa-solid fa-arrow-trend-up"></i> +5 this week</span>
        </div>
        <div class="dash-stat-card">
            <div class="dash-stat-icon" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b;">
                <i class="fa-solid fa-clock"></i>
            </div>
            <div class="dash-stat-info">
                <span class="dash-stat-value" id="dash-active-tasks">0</span>
                <span class="dash-stat-label">Active</span>
            </div>
            <span class="dash-stat-trend neutral">in progress</span>
        </div>
        <div class="dash-stat-card">
            <div class="dash-stat-icon" style="background: rgba(16, 185, 129, 0.15); color: #10b981;">
                <i class="fa-solid fa-circle-check"></i>
            </div>
            <div class="dash-stat-info">
                <span class="dash-stat-value" id="dash-completed-tasks">0</span>
                <span class="dash-stat-label">Completed</span>
            </div>
            <span class="dash-stat-trend neutral">0% rate</span>
        </div>
        <div class="dash-stat-card">
            <div class="dash-stat-icon" style="background: rgba(168, 85, 247, 0.15); color: #a855f7;">
                <i class="fa-solid fa-dollar-sign"></i>
            </div>
            <div class="dash-stat-info">
                <span class="dash-stat-value" id="dash-total-spent">$0</span>
                <span class="dash-stat-label">Total Spent</span>
            </div>
            <span class="dash-stat-trend neutral">all time</span>
        </div>
    </div>

    <!-- Middle Row: Wallet Card + Task Overview -->
    <div class="dash-middle-row">
        <div class="dash-wallet-card">
            <div class="dash-wallet-bg-orb orb-1"></div>
            <div class="dash-wallet-bg-orb orb-2"></div>
            <button class="dash-wallet-add-btn" id="dash-add-funds">
                <i class="fa-solid fa-plus"></i> Add Funds
            </button>
            <div class="dash-wallet-balance">
                <span class="dash-wallet-label">Available Balance</span>
                <span class="dash-wallet-amount" id="dash-wallet-amount">$0.00</span>
            </div>
        </div>
        <div class="dash-task-overview">
            <h3 class="dash-overview-title">TASK OVERVIEW</h3>
            <div class="dash-overview-rate">
                <span>Completion Rate</span>
                <span class="dash-rate-value" id="dash-comp-rate" style="color: #10b981;">0%</span>
            </div>
            <div class="dash-overview-bar">
                <div class="dash-overview-bar-fill" id="dash-rate-bar" style="width: 0%;"></div>
            </div>
            <div class="dash-overview-stats">
                <div class="dash-overview-stat-item">
                    <span class="dash-dot" style="background: #f59e0b;"></span><span>Active</span>
                    <span class="dash-overview-count" id="dash-ov-active">0</span>
                </div>
                <div class="dash-overview-stat-item">
                    <span class="dash-dot" style="background: #10b981;"></span><span>Completed</span>
                    <span class="dash-overview-count" id="dash-ov-completed">0</span>
                </div>
                <div class="dash-overview-stat-item">
                    <span class="dash-dot" style="background: #ef4444;"></span><span>Rejected</span>
                    <span class="dash-overview-count" id="dash-ov-rejected">0</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Recent Tasks -->
    <div class="dash-tasks-section">
        <div class="dash-tasks-header">
            <h3>Recent Tasks</h3>
            <div class="dash-tasks-tabs">
                <button class="dash-tab active">All</button>
                <button class="dash-tab">Active</button>
                <button class="dash-tab">Completed</button>
            </div>
        </div>
        <div class="dash-tasks-list" id="dash-tasks-list">
            <div class="dash-recent-task-item">
                <div class="dash-recent-task-icon" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b;">
                    <i class="fa-solid fa-clock"></i>
                </div>
                <div class="dash-recent-task-info">
                    <span class="dash-recent-task-title">Verify Central Park Cafe Queue</span>
                    <span class="dash-recent-task-meta">NYC · $15.00 · 2 hrs ago</span>
                </div>
                <span class="status-badge status-assigned">In Progress</span>
            </div>
            <div class="dash-recent-task-item">
                <div class="dash-recent-task-icon" style="background: rgba(16, 185, 129, 0.15); color: #10b981;">
                    <i class="fa-solid fa-circle-check"></i>
                </div>
                <div class="dash-recent-task-info">
                    <span class="dash-recent-task-title">Seattle Waterfront Photo</span>
                    <span class="dash-recent-task-meta">Seattle · $20.00 · 1 day ago</span>
                </div>
                <span class="status-badge status-review">Completed</span>
            </div>
            <div class="dash-recent-task-item">
                <div class="dash-recent-task-icon" style="background: rgba(99, 102, 241, 0.15); color: #6366f1;">
                    <i class="fa-solid fa-location-dot"></i>
                </div>
                <div class="dash-recent-task-info">
                    <span class="dash-recent-task-title">Brooklyn Bridge Condition Check</span>
                    <span class="dash-recent-task-meta">Brooklyn · $25.00 · 2 days ago</span>
                </div>
                <span class="status-badge status-completed">Delivered</span>
            </div>
        </div>
    </div>`;
}

function buildPostTask() {
    return `
    <div class="dash-header">
        <div>
            <h2 class="dash-greeting"><i class="fa-solid fa-crosshairs" style="color: var(--brand-cyan); margin-right: 0.5rem;"></i>New Targeting Request</h2>
            <p class="dash-greeting-sub">Create a new ground verification task</p>
        </div>
    </div>
    <div class="req-glass-card req-max-w-card" style="margin: 0;">
        <form id="form-post-task" class="req-form">
            <div class="req-form-group">
                <label>Target Designation</label>
                <input type="text" id="pt-title" class="req-input-premium" required placeholder="e.g. Verify Parker's queue length" />
            </div>
            <div class="req-form-group">
                <label>Intelligence Details</label>
                <textarea id="pt-desc" class="req-input-premium" required rows="3" placeholder="Need a 10s video of the main entrance to check current capacity..."></textarea>
            </div>
            <div class="req-form-group">
                <label>Coordinates (Location)</label>
                <div class="req-map-radar" id="map-picker">
                    <div class="req-radar-pulse"></div>
                    <i class="fa-solid fa-location-crosshairs req-radar-pin"></i>
                    <span class="req-radar-text">Click to set target zone</span>
                </div>
            </div>
            <div class="req-form-row">
                <div class="req-form-group req-half">
                    <label>Capture Mode</label>
                    <div class="req-media-segmented" id="req-media-toggle">
                        <input type="hidden" id="pt-media" value="photo">
                        <button type="button" class="req-seg-btn active" data-val="photo"><i class="fa-solid fa-camera"></i> Photo</button>
                        <button type="button" class="req-seg-btn" data-val="video"><i class="fa-solid fa-video"></i> Video</button>
                    </div>
                </div>
                <div class="req-form-group req-half">
                    <label>Bounty ($)</label>
                    <div class="req-budget-wrapper">
                        <span class="req-budget-currency">$</span>
                        <input type="number" id="pt-budget" class="req-input-premium req-input-budget" min="5" step="1" required placeholder="15" />
                    </div>
                </div>
            </div>
            <div class="req-form-group">
                <label>Deadline</label>
                <input type="datetime-local" id="pt-deadline" class="req-input-premium" />
            </div>
            <div class="req-form-actions">
                <button type="button" class="req-btn-cancel" id="btn-pt-cancel">Cancel</button>
                <button type="submit" class="req-btn-primary">Initialize Scan</button>
            </div>
        </form>
    </div>`;
}

function buildNotifications() {
    const unreadCount = notifications.filter(n => !n.read).length;
    const listHTML = notifications.map(n => `
        <div class="notif-item ${n.read ? 'read' : 'unread'}" data-id="${n.id}">
            <div class="notif-icon" style="background: ${n.color}20; color: ${n.color};">
                <i class="${n.icon}"></i>
            </div>
            <div class="notif-body">
                <div class="notif-title">${n.title}</div>
                <div class="notif-message">${n.message}</div>
                <div class="notif-time"><i class="fa-regular fa-clock"></i> ${n.time}</div>
            </div>
            ${!n.read ? '<div class="notif-unread-dot"></div>' : ''}
            <button class="notif-mark-btn" data-id="${n.id}" title="${n.read ? 'Marked as read' : 'Mark as read'}">
                <i class="fa-solid ${n.read ? 'fa-check-double' : 'fa-check'}"></i>
            </button>
        </div>
    `).join('');

    return `
    <div class="dash-header">
        <div>
            <h2 class="dash-greeting"><i class="fa-solid fa-bell" style="color: var(--brand-cyan); margin-right: 0.5rem;"></i>Notifications</h2>
            <p class="dash-greeting-sub">${unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}</p>
        </div>
        <button class="dash-btn-post" id="btn-mark-all-read" style="background: linear-gradient(135deg, #06b6d4, #0891b2);">
            <i class="fa-solid fa-check-double"></i> Mark All Read
        </button>
    </div>
    <div class="notif-list">
        ${listHTML}
    </div>`;
}

function buildWallet() {
    const txRows = transactions.map(tx => `
        <div class="wallet-tx-row">
            <div class="wallet-tx-icon ${tx.type}">
                <i class="fa-solid ${tx.type === 'credit' ? 'fa-arrow-down' : 'fa-arrow-up'}"></i>
            </div>
            <div class="wallet-tx-info">
                <span class="wallet-tx-desc">${tx.desc}</span>
                <span class="wallet-tx-date">${tx.date} · ${tx.id}</span>
            </div>
            <div class="wallet-tx-amount ${tx.type}">
                ${tx.amount}
            </div>
        </div>
    `).join('');

    return `
    <div class="dash-header">
        <div>
            <h2 class="dash-greeting"><i class="fa-solid fa-wallet" style="color: var(--brand-cyan); margin-right: 0.5rem;"></i>Wallet</h2>
            <p class="dash-greeting-sub">Manage your funds and transactions</p>
        </div>
    </div>

    <!-- Balance Cards -->
    <div class="wallet-balance-row">
        <div class="dash-wallet-card" style="flex: 1;">
            <div class="dash-wallet-bg-orb orb-1"></div>
            <div class="dash-wallet-bg-orb orb-2"></div>
            <div class="dash-wallet-balance">
                <span class="dash-wallet-label">Available Balance</span>
                <span class="dash-wallet-amount" id="wallet-balance">$0.00</span>
            </div>
            <div style="display: flex; gap: 0.75rem; z-index: 2; margin-top: 1rem;">
                <button class="dash-wallet-add-btn" id="wallet-add-funds">
                    <i class="fa-solid fa-plus"></i> Add Funds
                </button>
                <button class="wallet-withdraw-btn" id="wallet-withdraw">
                    <i class="fa-solid fa-arrow-up-from-bracket"></i> Withdraw
                </button>
            </div>
        </div>
        <div class="wallet-stats-col">
            <div class="wallet-mini-stat">
                <div class="wallet-mini-stat-icon" style="background: rgba(16, 185, 129, 0.15); color: #10b981;">
                    <i class="fa-solid fa-arrow-down"></i>
                </div>
                <div>
                    <span class="wallet-mini-stat-label">Total Earned</span>
                    <span class="wallet-mini-stat-value" id="wallet-earned">$0</span>
                </div>
            </div>
            <div class="wallet-mini-stat">
                <div class="wallet-mini-stat-icon" style="background: rgba(239, 68, 68, 0.15); color: #ef4444;">
                    <i class="fa-solid fa-arrow-up"></i>
                </div>
                <div>
                    <span class="wallet-mini-stat-label">Total Spent</span>
                    <span class="wallet-mini-stat-value" id="wallet-spent">$0</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Transaction History -->
    <div class="dash-tasks-section" style="margin-top: 1.5rem;">
        <div class="dash-tasks-header">
            <h3>Transaction History</h3>
        </div>
        <div class="wallet-tx-list">
            ${txRows}
        </div>
    </div>`;
}

function buildAnalytics() {
    return `
    <div class="dash-header">
        <div>
            <h2 class="dash-greeting"><i class="fa-solid fa-chart-line" style="color: var(--brand-cyan); margin-right: 0.5rem;"></i>Analytics</h2>
            <p class="dash-greeting-sub">Insights into your GroundLens activity</p>
        </div>
    </div>

    <!-- Stats Cards -->
    <div class="dash-stats-row">
        <div class="dash-stat-card">
            <div class="dash-stat-icon" style="background: rgba(99, 102, 241, 0.15); color: #6366f1;">
                <i class="fa-solid fa-bullseye"></i>
            </div>
            <div class="dash-stat-info">
                <span class="dash-stat-value analytics-counter" data-target="156">0</span>
                <span class="dash-stat-label">Tasks Completed</span>
            </div>
            <span class="dash-stat-trend up"><i class="fa-solid fa-arrow-trend-up"></i> +12% this month</span>
        </div>
        <div class="dash-stat-card">
            <div class="dash-stat-icon" style="background: rgba(6, 182, 212, 0.15); color: #06b6d4;">
                <i class="fa-solid fa-bolt"></i>
            </div>
            <div class="dash-stat-info">
                <span class="dash-stat-value analytics-counter" data-target="8" data-suffix=" min">0</span>
                <span class="dash-stat-label">Avg. Response Time</span>
            </div>
            <span class="dash-stat-trend up"><i class="fa-solid fa-arrow-trend-up"></i> 15% faster</span>
        </div>
        <div class="dash-stat-card">
            <div class="dash-stat-icon" style="background: rgba(16, 185, 129, 0.15); color: #10b981;">
                <i class="fa-solid fa-sack-dollar"></i>
            </div>
            <div class="dash-stat-info">
                <span class="dash-stat-value analytics-counter" data-target="3250" data-prefix="$">0</span>
                <span class="dash-stat-label">Total Earnings</span>
            </div>
            <span class="dash-stat-trend up"><i class="fa-solid fa-arrow-trend-up"></i> +$420 this month</span>
        </div>
        <div class="dash-stat-card">
            <div class="dash-stat-icon" style="background: rgba(168, 85, 247, 0.15); color: #a855f7;">
                <i class="fa-solid fa-star"></i>
            </div>
            <div class="dash-stat-info">
                <span class="dash-stat-value analytics-counter" data-target="98" data-suffix="%">0</span>
                <span class="dash-stat-label">Satisfaction Rate</span>
            </div>
            <span class="dash-stat-trend neutral">consistent</span>
        </div>
    </div>

    <!-- Charts Row -->
    <div class="analytics-charts-row">
        <!-- Tasks Chart -->
        <div class="analytics-chart-card">
            <h3 class="analytics-chart-title">Tasks This Week</h3>
            <div class="analytics-bar-chart" id="chart-tasks">
                <div class="analytics-bar-wrapper">
                    <div class="analytics-bar" data-height="40" style="background: linear-gradient(180deg, #6366f1, #818cf8);"></div>
                    <span class="analytics-bar-label">Mon</span>
                </div>
                <div class="analytics-bar-wrapper">
                    <div class="analytics-bar" data-height="65" style="background: linear-gradient(180deg, #6366f1, #818cf8);"></div>
                    <span class="analytics-bar-label">Tue</span>
                </div>
                <div class="analytics-bar-wrapper">
                    <div class="analytics-bar" data-height="30" style="background: linear-gradient(180deg, #6366f1, #818cf8);"></div>
                    <span class="analytics-bar-label">Wed</span>
                </div>
                <div class="analytics-bar-wrapper">
                    <div class="analytics-bar" data-height="85" style="background: linear-gradient(180deg, #6366f1, #818cf8);"></div>
                    <span class="analytics-bar-label">Thu</span>
                </div>
                <div class="analytics-bar-wrapper">
                    <div class="analytics-bar" data-height="55" style="background: linear-gradient(180deg, #6366f1, #818cf8);"></div>
                    <span class="analytics-bar-label">Fri</span>
                </div>
                <div class="analytics-bar-wrapper">
                    <div class="analytics-bar" data-height="90" style="background: linear-gradient(180deg, #6366f1, #818cf8);"></div>
                    <span class="analytics-bar-label">Sat</span>
                </div>
                <div class="analytics-bar-wrapper">
                    <div class="analytics-bar" data-height="70" style="background: linear-gradient(180deg, #6366f1, #818cf8);"></div>
                    <span class="analytics-bar-label">Sun</span>
                </div>
            </div>
        </div>

        <!-- Earnings Chart -->
        <div class="analytics-chart-card">
            <h3 class="analytics-chart-title">Earnings ($)</h3>
            <div class="analytics-bar-chart" id="chart-earnings">
                <div class="analytics-bar-wrapper">
                    <div class="analytics-bar" data-height="50" style="background: linear-gradient(180deg, #10b981, #34d399);"></div>
                    <span class="analytics-bar-label">Mon</span>
                </div>
                <div class="analytics-bar-wrapper">
                    <div class="analytics-bar" data-height="80" style="background: linear-gradient(180deg, #10b981, #34d399);"></div>
                    <span class="analytics-bar-label">Tue</span>
                </div>
                <div class="analytics-bar-wrapper">
                    <div class="analytics-bar" data-height="35" style="background: linear-gradient(180deg, #10b981, #34d399);"></div>
                    <span class="analytics-bar-label">Wed</span>
                </div>
                <div class="analytics-bar-wrapper">
                    <div class="analytics-bar" data-height="95" style="background: linear-gradient(180deg, #10b981, #34d399);"></div>
                    <span class="analytics-bar-label">Thu</span>
                </div>
                <div class="analytics-bar-wrapper">
                    <div class="analytics-bar" data-height="60" style="background: linear-gradient(180deg, #10b981, #34d399);"></div>
                    <span class="analytics-bar-label">Fri</span>
                </div>
                <div class="analytics-bar-wrapper">
                    <div class="analytics-bar" data-height="75" style="background: linear-gradient(180deg, #10b981, #34d399);"></div>
                    <span class="analytics-bar-label">Sat</span>
                </div>
                <div class="analytics-bar-wrapper">
                    <div class="analytics-bar" data-height="45" style="background: linear-gradient(180deg, #10b981, #34d399);"></div>
                    <span class="analytics-bar-label">Sun</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Performance Overview -->
    <div class="analytics-perf-section">
        <h3 class="analytics-chart-title" style="margin-bottom: 1.5rem;">Performance Overview</h3>
        <div class="analytics-perf-grid">
            <div class="analytics-perf-item">
                <div class="analytics-perf-ring" data-percent="92" style="--ring-color: #10b981;">
                    <svg viewBox="0 0 36 36">
                        <path class="analytics-ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                        <path class="analytics-ring-fill" stroke-dasharray="0, 100" data-dash="92" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                    </svg>
                    <span class="analytics-ring-text">92%</span>
                </div>
                <span class="analytics-perf-label">Completion</span>
            </div>
            <div class="analytics-perf-item">
                <div class="analytics-perf-ring" data-percent="87" style="--ring-color: #6366f1;">
                    <svg viewBox="0 0 36 36">
                        <path class="analytics-ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                        <path class="analytics-ring-fill" stroke-dasharray="0, 100" data-dash="87" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                    </svg>
                    <span class="analytics-ring-text">87%</span>
                </div>
                <span class="analytics-perf-label">On-Time</span>
            </div>
            <div class="analytics-perf-item">
                <div class="analytics-perf-ring" data-percent="95" style="--ring-color: #f59e0b;">
                    <svg viewBox="0 0 36 36">
                        <path class="analytics-ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                        <path class="analytics-ring-fill" stroke-dasharray="0, 100" data-dash="95" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                    </svg>
                    <span class="analytics-ring-text">95%</span>
                </div>
                <span class="analytics-perf-label">Quality</span>
            </div>
            <div class="analytics-perf-item">
                <div class="analytics-perf-ring" data-percent="78" style="--ring-color: #ec4899;">
                    <svg viewBox="0 0 36 36">
                        <path class="analytics-ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                        <path class="analytics-ring-fill" stroke-dasharray="0, 100" data-dash="78" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                    </svg>
                    <span class="analytics-ring-text">78%</span>
                </div>
                <span class="analytics-perf-label">Response</span>
            </div>
        </div>
    </div>`;
}

// =============================================
//  SUB-VIEW EVENT HANDLERS
// =============================================
function attachDashViewEvents(viewName) {
    if (viewName === 'dashboard') {
        // Post task buttons
        const postBtn = document.getElementById('dash-post-task-btn');
        if (postBtn) postBtn.addEventListener('click', () => renderDashboardView('post-task'));

        // Animate counters
        setTimeout(() => {
            animateNumber(document.getElementById('dash-total-tasks'), 156, 1200);
            animateNumber(document.getElementById('dash-active-tasks'), 12, 1000);
            animateNumber(document.getElementById('dash-completed-tasks'), 140, 1500);
            animateNumber(document.getElementById('dash-wallet-amount'), 1250, 1500, '$');
            animateNumber(document.getElementById('dash-comp-rate'), 92, 1500, '', '%');
            const rateBar = document.getElementById('dash-rate-bar');
            if (rateBar) setTimeout(() => { rateBar.style.width = '92%'; }, 500);
            animateNumber(document.getElementById('dash-ov-active'), 12, 1000);
            animateNumber(document.getElementById('dash-ov-completed'), 140, 1500);
            animateNumber(document.getElementById('dash-ov-rejected'), 4, 800);
        }, 200);

    } else if (viewName === 'post-task') {
        // Media toggle
        const mediaBtns = document.querySelectorAll('.req-seg-btn');
        const mediaInput = document.getElementById('pt-media');
        if (mediaBtns.length > 0 && mediaInput) {
            mediaBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    mediaBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    mediaInput.value = btn.dataset.val;
                });
            });
        }

        // Cancel button
        const cancelBtn = document.getElementById('btn-pt-cancel');
        if (cancelBtn) cancelBtn.addEventListener('click', () => renderDashboardView('dashboard'));

        // Form submit
        const form = document.getElementById('form-post-task');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const title = document.getElementById('pt-title').value.trim();
                const desc = document.getElementById('pt-desc').value.trim();
                const budget = document.getElementById('pt-budget').value;
                const deadline = document.getElementById('pt-deadline').value;

                if (!title) {
                    showNotification('Please provide a Target Designation', 'warning');
                    return;
                }
                if (!desc || desc.length < 10) {
                    showNotification('Please provide more Intelligence Details (min 10 chars)', 'warning');
                    return;
                }
                if (!budget || isNaN(budget) || Number(budget) < 5) {
                    showNotification('Minimum bounty requirement is $5', 'warning');
                    return;
                }
                if (!deadline) {
                    showNotification('Please specify a Deadline', 'warning');
                    return;
                }
                showNotification('Targeting Scan Initialized! Task posted successfully.', 'success');
                setTimeout(() => renderDashboardView('dashboard'), 1200);
            });
        }

    } else if (viewName === 'notifications') {
        // Mark individual as read
        document.querySelectorAll('.notif-mark-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                const notif = notifications.find(n => n.id === id);
                if (notif && !notif.read) {
                    notif.read = true;
                    renderDashboardView('notifications');
                }
            });
        });

        // Mark all as read
        const markAllBtn = document.getElementById('btn-mark-all-read');
        if (markAllBtn) {
            markAllBtn.addEventListener('click', () => {
                notifications.forEach(n => n.read = true);
                renderDashboardView('notifications');
            });
        }

    } else if (viewName === 'wallet') {
        // Animate wallet values
        setTimeout(() => {
            animateNumber(document.getElementById('wallet-balance'), 1250, 1500, '$');
            animateNumber(document.getElementById('wallet-earned'), 3250, 1500, '$');
            animateNumber(document.getElementById('wallet-spent'), 2000, 1500, '$');
        }, 200);

        const withdrawBtn = document.getElementById('wallet-withdraw');
        if (withdrawBtn) {
            withdrawBtn.addEventListener('click', () => {
                showNotification('Withdrawal request submitted. Funds will arrive in 2-3 business days.', 'success');
            });
        }

    } else if (viewName === 'analytics') {
        // Animate analytics counters
        setTimeout(() => {
            document.querySelectorAll('.analytics-counter').forEach(el => {
                const target = parseInt(el.dataset.target);
                const prefix = el.dataset.prefix || '';
                const suffix = el.dataset.suffix || '';
                animateNumber(el, target, 1500, prefix, suffix);
            });
        }, 200);

        // Animate chart bars
        setTimeout(() => {
            document.querySelectorAll('.analytics-bar').forEach(bar => {
                const height = bar.dataset.height;
                bar.style.height = height + '%';
            });
        }, 400);

        // Animate ring charts
        setTimeout(() => {
            document.querySelectorAll('.analytics-ring-fill').forEach(ring => {
                const dash = ring.dataset.dash;
                ring.style.strokeDasharray = `${dash}, 100`;
            });
        }, 600);
    }
}
