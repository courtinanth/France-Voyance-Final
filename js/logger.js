/**
 * Simple Logger
 * Collects basic user interactions and stores them in localStorage.
 * Data is kept for 30 days.
 */

const LOG_RETENTION_DAYS = 30;
const LOG_STORAGE_KEY = 'fva_user_logs';

function initLogger() {
    // 1. Clean old logs
    cleanOldLogs();

    // 2. Log Page View
    logEvent('page_view', {
        path: window.location.pathname,
        referrer: document.referrer,
        timestamp: new Date().toISOString()
    });

    // 3. Log Clicks on CTAs
    document.addEventListener('click', (e) => {
        const target = e.target.closest('a, button');
        if (target) {
            const isCTA = target.classList.contains('btn') || target.classList.contains('yn-btn-action');
            if (isCTA) {
                logEvent('click_cta', {
                    text: target.innerText,
                    href: target.href || null,
                    class: target.className,
                    timestamp: new Date().toISOString()
                });
            }
        }
    });

    // 4. Log JS Errors
    window.addEventListener('error', (e) => {
        logEvent('js_error', {
            message: e.message,
            filename: e.filename,
            lineno: e.lineno,
            timestamp: new Date().toISOString()
        });
    });
}

function logEvent(type, data) {
    let logs = getLogs();
    logs.push({ type, data });
    localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logs));
}

function getLogs() {
    const logs = localStorage.getItem(LOG_STORAGE_KEY);
    return logs ? JSON.parse(logs) : [];
}

function cleanOldLogs() {
    let logs = getLogs();
    const now = new Date();
    const retentionMs = LOG_RETENTION_DAYS * 24 * 60 * 60 * 1000;

    const filteredLogs = logs.filter(log => {
        const logDate = new Date(log.data.timestamp);
        return (now - logDate) < retentionMs;
    });

    if (logs.length !== filteredLogs.length) {
        localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(filteredLogs));
    }
}

// Function to export logs (can be called from console or hidden admin page)
window.exportLogs = function () {
    const logs = getLogs();
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user_logs_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    console.log('Logs exported!');
};

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLogger);
} else {
    initLogger();
}
