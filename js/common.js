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
    if (!loginLink) return;
    loginLink.textContent = user || 'Login';
    loginLink.href = user ? 'profile.html' : 'login.html';
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
    const list = document.getElementById('detailComments');
    if (!list) return;

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

// Push a comment onto an item's in-memory array, then re-render.
// Called from addDestinationComment / addHotelComment in their page JS.
function addCommentTo(item) {
    const input = document.getElementById('commentText');
    const text = input.value.trim();

    if (!text) { showNotification('Please write a review.', 'error'); return; }
    if (!getCurrentUser()) { showNotification('Please login to leave a review.', 'error'); return; }

    item.comments = item.comments || [];
    item.comments.push({ author: getCurrentUser(), text });
    renderDetailComments(item);
    input.value = '';
}

// ============================================================
// ---------- Layout (theme) toggle ----------
// Dark CSS is always loaded; the .layout-new class on <html>
// flips the dark rules on/off. localStorage remembers the choice.
// ============================================================
function applyLayout(name) {
    document.documentElement.classList.toggle('layout-new', name === 'new');
    const btn = document.getElementById('layoutToggleBtn');
    if (btn) btn.textContent = name === 'new' ? 'Light' : 'Dark';
}

function toggleLayout() {
    const next = localStorage.getItem('layout') === 'new' ? 'main' : 'new';
    localStorage.setItem('layout', next);
    applyLayout(next);
}

// ============================================================
// ---------- Currency toggle (USD <-> EGP) ----------
// Raw prices live in USD. currencyRate = 1 means USD, 50 means EGP.
// formatPrice(usd) prints the price in whichever is active.
// ============================================================
let currencyRate = localStorage.getItem('currency') === 'EGP' ? 50 : 1;

function formatPrice(usd) {
    const symbol = currencyRate === 50 ? 'E£' : '$';
    return symbol + Math.round(usd * currencyRate);
}

function rerenderPrices() {
    if (document.getElementById('destinationsContainer') ) {
        renderDestinations();
    }
    if (document.getElementById('hotelsContainer') ){
        renderHotels();
    }
    if (document.getElementById('flightsContainer') ) {
        renderFlights();
    }
    if (document.getElementById('detailDestPrice')) {
        loadDestinationDetail();
    }
    if (document.getElementById('detailHotelPrice') ) {
        loadHotelDetail();
    }
    if (document.getElementById('detailAirlineName')) {
        loadFlightDetail();
    }
    if (typeof refreshPriceRangeLabel === 'function') refreshPriceRangeLabel();
}

function toggleCurrency() {
    currencyRate = currencyRate === 1 ? 50 : 1;
    localStorage.setItem('currency', currencyRate === 50 ? 'EGP' : 'USD');
    document.getElementById('currencyToggleBtn').textContent = currencyRate === 50 ? 'USD' : 'EGP';
    rerenderPrices();
}

// ============================================================
// ---------- Feedback / Complaints popup ----------
// Floating button opens a modal with a complaint form + a table
// of previously submitted feedback (kept in localStorage).
// ============================================================
const feedbackHTML = `
    <div id="feedbackModal" class="feedback-modal" style="display: none;" onclick="if(event.target===this)toggleFeedback()">
        <div class="feedback-card">
            <div class="feedback-header">
                <span><i class="fas fa-comment-alt"></i> Feedback & Complaints</span>
                <button class="feedback-close" type="button" onclick="toggleFeedback()" aria-label="Close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form class="feedback-form" onsubmit="submitFeedback(event)" novalidate>
                <div class="feedback-row">
                    <input type="text" id="feedbackName" placeholder="Your name">
                    <input type="email" id="feedbackEmail" placeholder="Your email">
                </div>
                <select id="feedbackSubject">
                    <option value="Complaint">Complaint</option>
                    <option value="Suggestion">Suggestion</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Praise">Praise</option>
                </select>
                <textarea id="feedbackMessage" rows="3" placeholder="Tell us what's on your mind..."></textarea>
                <div id="feedbackError" class="error-msg"></div>
                <button type="submit" class="feedback-submit">Submit</button>
            </form>
        </div>
    </div>
`;

function injectFeedback() {
    if (document.getElementById('feedbackModal')) return;
    document.body.insertAdjacentHTML('beforeend', feedbackHTML);
}

function toggleFeedback() {
    const m = document.getElementById('feedbackModal');
    if (!m) return;
    m.style.display = (m.style.display === 'flex') ? 'none' : 'flex';
}

function submitFeedback(e) {
    e.preventDefault();
    const name = document.getElementById('feedbackName').value.trim();
    const email = document.getElementById('feedbackEmail').value.trim();
    const message = document.getElementById('feedbackMessage').value.trim();
    const err = document.getElementById('feedbackError');

    if (!name || !email || !message) { err.textContent = 'All fields are required.'; return; }
    if (!email.includes('@'))         { err.textContent = 'Enter a valid email address.'; return; }
    if (message.length < 5)           { err.textContent = 'Message is too short.'; return; }
    err.textContent = '';

    document.getElementById('feedbackName').value = '';
    document.getElementById('feedbackEmail').value = '';
    document.getElementById('feedbackMessage').value = '';
    toggleFeedback();
    showNotification('Thanks! Your feedback was submitted.', 'success');
}

// Always-on init: layout theme + navbar state + currency button + feedback popup.
document.addEventListener('DOMContentLoaded', () => {
    applyLayout(localStorage.getItem('layout') === 'new' ? 'new' : 'main');
    updateNavbar();
    const cb = document.getElementById('currencyToggleBtn');
    if (cb) cb.textContent = currencyRate === 50 ? 'USD' : 'EGP';
    injectFeedback();
});
