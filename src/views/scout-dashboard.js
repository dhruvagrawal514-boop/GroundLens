import { nearbyTasks } from '../data/mock.js';
import { showNotification } from '../lib/notify.js';
import { escapeHtml } from '../lib/escape-html.js';

const acceptedTaskIds = new Set();

/** Renders the radar pins and task panel for the Scout ("doer") dashboard. */
export function renderScoutDashboard() {
    const radar = document.getElementById('radar-markers-container');
    const panel = document.getElementById('doer-task-action-panel');
    if (!radar || !panel) return;

    radar.innerHTML = nearbyTasks.map(task => `
        <button type="button"
            class="radar-marker ${acceptedTaskIds.has(task.id) ? 'accepted' : ''}"
            style="left: ${task.x}%; top: ${task.y}%;"
            data-task-id="${task.id}"
            aria-label="${escapeHtml(task.title)}, ${task.distance} away">
            <i class="fa-solid ${acceptedTaskIds.has(task.id) ? 'fa-check' : 'fa-location-dot'}" aria-hidden="true"></i>
        </button>`).join('');

    radar.addEventListener('click', (e) => {
        const marker = e.target.closest('.radar-marker');
        if (!marker) return;
        radar.querySelectorAll('.radar-marker').forEach(m => m.classList.toggle('selected', m === marker));
        showTask(panel, nearbyTasks.find(t => t.id === marker.dataset.taskId), marker);
    });
}

function showTask(panel, task, marker) {
    if (!task) return;
    const accepted = acceptedTaskIds.has(task.id);

    panel.innerHTML = `
        <span style="font-size: 0.8rem; color: var(--text-muted);">${task.id}</span>
        <h3 style="margin: 0.25rem 0 0;">${escapeHtml(task.title)}</h3>
        <div class="scout-task-meta">
            <span><i class="fa-solid fa-location-crosshairs"></i> ${task.distance} away</span>
            <span><i class="fa-solid fa-dollar-sign"></i> ${task.bounty} bounty</span>
            <span><i class="fa-regular fa-clock"></i> ${task.deadline}</span>
            <span><i class="fa-solid fa-camera"></i> ${task.media}</span>
        </div>
        <button type="button" class="scout-accept-btn" ${accepted ? 'disabled' : ''}>
            ${accepted ? '<i class="fa-solid fa-check"></i> Accepted' : 'Accept task'}
        </button>`;

    panel.querySelector('.scout-accept-btn').addEventListener('click', () => {
        acceptedTaskIds.add(task.id);
        marker.classList.add('accepted');
        marker.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i>';
        showNotification(`Task accepted: ${escapeHtml(task.title)}`, 'success');
        showTask(panel, task, marker);
    });
}
