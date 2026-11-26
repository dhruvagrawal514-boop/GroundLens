/** Shows a toast in the top-right notification container. */
export function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    if (!container) return;
    const colors = { success: '#10b981', warning: '#f59e0b', info: '#6366f1', error: '#ef4444' };
    const icons = { success: 'fa-circle-check', warning: 'fa-triangle-exclamation', info: 'fa-circle-info', error: 'fa-circle-xmark' };
    const notif = document.createElement('div');
    notif.style.cssText = `
        display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.5rem;
        background: rgba(15, 23, 42, 0.95); border: 1px solid ${colors[type]}40;
        border-left: 3px solid ${colors[type]}; border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5); backdrop-filter: blur(20px);
        color: var(--text-main); font-size: 0.9rem; margin-bottom: 0.5rem;
        animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    `;
    notif.innerHTML = `<i class="fa-solid ${icons[type]}" style="color: ${colors[type]}; font-size: 1.1rem;"></i> ${message}`;
    container.appendChild(notif);
    setTimeout(() => {
        notif.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}
