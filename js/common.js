// ---------- Helper functions ----------
function getCurrentUser() {
    return localStorage.getItem('currentUser');
}

function setCurrentUser(username) {
    localStorage.setItem('currentUser', username);
}

function logout() {
    localStorage.removeItem('currentUser');
    updateNavbar();
    window.location.href = 'index.html';
}

// Custom Notification System
function showNotification(message, type = 'info') {
    // remove any existing notification first (only one shows at a time)
    const existing = document.getElementById('customNotification');
    if (existing) existing.remove();

    const icons = {
        success: 'check-circle',
        error: 'times-circle',
        info: 'info-circle'
    };

    const notification = document.createElement('div');
    notification.id = 'customNotification';
    notification.className = `custom-notification ${type}`;
    notification.innerHTML = `
        <div class="custom-notification-content">
            <i class="fas fa-${icons[type] || 'info-circle'} custom-notification-icon"></i>
            <span class="custom-notification-message">${message}</span>
            <button class="custom-notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentElement) notification.remove();
    }, 4000);
}

function updateNavbar() {
    const user = getCurrentUser();
    const loginLink = document.getElementById('loginNavLink') || document.getElementById('profileLoginLink');
    const logoutBtn = document.getElementById('logoutBtn');
    if (!loginLink) return;

    if (user) {
        loginLink.textContent = user;
        loginLink.href = 'profile.html';
        loginLink.onclick = null;
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
    } else {
        loginLink.textContent = 'Login';
        loginLink.href = 'login.html';
        loginLink.onclick = null;
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
}

// ---------- Live chat popout (front-end only) ----------
// To add the chat to any page, just call injectChat() — for example
// from an inline <script>injectChat();</script> tag at the bottom of
// the page. Currently used on index.html.
const chatHTML = `
    <button id="chatToggle" class="chat-toggle" type="button" onclick="toggleChat()" aria-label="Open chat">
        <i class="fas fa-comment-dots"></i>
    </button>
    <div id="chatPanel" class="chat-panel" style="display: none;">
        <div class="chat-header">
            <span><i class="fas fa-headset"></i> Live Support</span>
            <button class="chat-close" type="button" onclick="toggleChat()" aria-label="Close chat">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div id="chatMessages" class="chat-messages"></div>
        <form class="chat-input-row" onsubmit="sendChatMessage(event)">
            <input type="text" id="chatInput" placeholder="Type a message..." autocomplete="off">
            <button type="submit" aria-label="Send"><i class="fas fa-paper-plane"></i></button>
        </form>
    </div>
`;

function injectChat() {
    if (document.getElementById('chatToggle')) return; // already injected
    document.body.insertAdjacentHTML('beforeend', chatHTML);
}

function toggleChat() {
    const panel = document.getElementById('chatPanel');
    if (!panel) return;
    if (panel.style.display === 'flex') {
        panel.style.display = 'none';
    } else {
        panel.style.display = 'flex';
        document.getElementById('chatInput').focus();
    }
}

function sendChatMessage(e) {
    e.preventDefault();
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;

    const messages = document.getElementById('chatMessages');
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble user';
    bubble.textContent = text;
    messages.appendChild(bubble);

    input.value = '';
    input.focus();
    messages.scrollTop = messages.scrollHeight;
}

//===============================================================
// ---------- Generic search-page helpers ----------
// Used by destinations / hotels / flights search pages.
// Each page builds its own card HTML via a small `cardBuilder`
// function and lets these helpers handle the container, results
// count, empty state, and grid/list switching.
//===============================================================

// Render a list of items into a container, with results count + empty state.
function renderItems(containerId, items, cardBuilder) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const countEl = document.getElementById('resultsCount');

    if (items.length === 0) {
        container.innerHTML = `<div class="empty-posts" style="grid-column: 1/-1; text-align: center; padding: 3rem;">No results match your filters.</div>`;
        countEl.textContent = '0 results found';
        return;
    }

    // if (countEl) {
        countEl.textContent = `${items.length} result${items.length !== 1 ? 's' : ''} found`;
    // }

    items.forEach(item => {
        container.innerHTML += cardBuilder(item);
    });
}

// Booking guard: if not logged in, save where to come back and redirect to login.
function requireLogin(redirectPage) {
    if (getCurrentUser()) return true;
    localStorage.setItem('redirectAfterLogin', redirectPage);
    window.location.href = 'login.html';
    return false;
}

// Toggle grid/list view on whichever search page is active.
function switchView(view) {
    if (document.getElementById('hotelsContainer')) {
        currentHotelView = view;
        renderHotels();
    } else if (document.getElementById('destinationsContainer')) {
        currentView = view;
        renderDestinations();
    }
}

// Shared by both Dist_Search and Hotel_Search pages (they use the same DOM ids).
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('ratingFilter').value = '0';
    document.getElementById('locationFilter').value = 'all';
    if (document.getElementById('classFilter')) document.getElementById('classFilter').value = 'all';
    document.querySelectorAll('.amenity-checkboxes input').forEach(el => el.checked = false);

    if (document.getElementById('hotelsContainer')) {
        currentHotels = [...hotelsData];
        renderHotels();
    } else {
        currentDestinations = [...destinationsData];
        renderDestinations();
    }
}

// ============================================================
// ---------- Detail page helpers (shared) ----------
// ============================================================

// Render the comments list for a detail page (destination or hotel).
function renderDetailComments(item) {

    if (!item.comments || item.comments.length === 0) {
        list.innerHTML = '<p style="color: #94a3b8;">No reviews yet. Be the first to leave one!</p>';
        return;
    }

    list.innerHTML = '';
    item.comments.forEach(c => {
        list.innerHTML += `
        <div class="comment">
            <div class="comment-author"><i class="fas fa-user-circle"></i> ${c.author}</div>
            <div class="comment-text">${c.text}</div>
        </div>`;
    });
}

// Add a comment to whichever item is currently being viewed.
function addDetailComment(storageKey) {
    const input = document.getElementById('commentText');
    const text = input.value.trim();

    if (!text) {
        showNotification('Please write a review.', 'error');
        return;
    }
    if (!getCurrentUser()) {
        showNotification('Please login to leave a review.', 'error');
        return;
    }

    const item = JSON.parse(localStorage.getItem(storageKey));
    if (!item.comments) item.comments = [];
    item.comments.push({ author: getCurrentUser(), text });
    renderDetailComments(item);
    input.value = '';
}

function addDestinationComment() { addDetailComment('selectedDestination'); }
function addHotelComment()       { addDetailComment('selectedHotel'); }

// ============================================================
// ---------- Layout (theme) toggle ----------
// Each page has a <link id="layoutTheme"> + a tiny inline pre-paint
// script in <head> that reads localStorage('layout') and sets the
// href + body.layout-new class before paint to avoid flash.
// data-newhref on the <link> tells us which NewLayout file this
// page should load when the new layout is active.
// ============================================================
function applyLayout(name) {
    const link = document.getElementById('layoutTheme');
    const newHref = link ? link.getAttribute('data-newhref') : '';
    if (name === 'new') {
        document.documentElement.classList.add('layout-new');
        document.body.classList.add('layout-new');
        if (link && newHref) link.setAttribute('href', newHref);
    } else {
        document.documentElement.classList.remove('layout-new');
        document.body.classList.remove('layout-new');
        if (link) link.setAttribute('href', '');
    }
    const btn = document.getElementById('layoutToggleBtn');
    if (btn) btn.textContent = name === 'new' ? 'Light' : 'Dark';
}

function toggleLayout() {
    const next = localStorage.getItem('layout') === 'new' ? 'main' : 'new';
    localStorage.setItem('layout', next);
    applyLayout(next);
}

// Always-on init: layout theme + navbar state.
document.addEventListener('DOMContentLoaded', () => {
    applyLayout(localStorage.getItem('layout') === 'new' ? 'new' : 'main');
    updateNavbar();
});
