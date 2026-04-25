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

function updateNavbar() {
    const user = getCurrentUser();
    const loginLink = document.getElementById('loginNavLink') || document.getElementById('profileLoginLink');
    if (!loginLink) return;

    if (user) {
        loginLink.textContent = user;
        loginLink.href = '#';
        loginLink.onclick = () => logout();
    } else {
        loginLink.textContent = 'Login';
        loginLink.href = 'login.html';
        loginLink.onclick = null;
    }
}

// ---------- Load posts on index.html ----------
function loadPostsToHome() {
    const container = document.getElementById('postsContainer');
    if (!container) return;

    const posts = JSON.parse(localStorage.getItem('travelPosts')) || [];

    if (posts.length === 0) {
        container.innerHTML = '<div class="empty-posts">no posts yet. Go to Profile and share your experience!</div>';
        return;
    }

    container.innerHTML = ''; // clear first

    posts.forEach((post, index) => {
        container.innerHTML += `
        <div class="post-item" data-index="${index}">
            <div class="post-details">
                <div class="post-title">${post.title}</div>
                <p>${post.content.substring(0, 100)}${post.content.length > 100 ? '…' : ''}</p>
                <small>by ${post.author}</small>
            </div>
        </div>`;
    });
}
//===============================================================
// ---------- Profile page logic ----------
//===============================================================
function loadMyPosts() {
    const container = document.getElementById('myPostsList');
    if (!container) return;

    const currentUser = getCurrentUser();
    const allPosts = JSON.parse(localStorage.getItem('travelPosts')) || [];

    const myPosts = allPosts.filter(p => p.author === currentUser);

    if (myPosts.length === 0) {
        container.innerHTML = '<p class="empty-posts">you haven\'t posted anything yet.</p>';
        return;
    }

    container.innerHTML = '';

    allPosts.forEach((post, index) => {
        if (post.author !== currentUser) return;

        container.innerHTML += `
        <div class="post-item">
            <div class="post-details">
                <div class="post-title">${post.title}</div>
                <p>
                    ${post.content.substring(0, 100)}
                    ${post.content.length > 100 ? '…' : ''}
                </p>
            </div>
            <button class="delete-btn" onclick="deletePost(${index})">Delete</button>
        </div>`;
    });
}

function deletePost(index) {
    let allPosts = JSON.parse(localStorage.getItem('travelPosts')) || [];

    if (index >= 0 && index < allPosts.length) {
        allPosts.splice(index, 1);
        localStorage.setItem('travelPosts', JSON.stringify(allPosts));

        loadMyPosts();
    }
}

function addNewPost() {
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const errorDiv = document.getElementById('formError');
    
    if (title === "") {
        errorDiv.textContent = "Title is required.";
        return false;
    }
    if (content === "") {
        errorDiv.textContent = "Please write some content.";
        return false;
    }
    if (content.length < 5) {
        errorDiv.textContent = "Content must be at least 5 characters.";
        return false;
    }
    errorDiv.textContent = "";

    if (!getCurrentUser()) {
        alert("Please login first.");
        window.location.href = "login.html";
        return false;
    }
    
    const newPost = {
        title: title,
        content: content,
        author: getCurrentUser(),
        createdAt: new Date().toISOString()
    };
    
    let allPosts = JSON.parse(localStorage.getItem('travelPosts')) || [];
    allPosts.push(newPost);
    localStorage.setItem('travelPosts', JSON.stringify(allPosts));
    
    document.getElementById('postTitle').value = '';
    document.getElementById('postContent').value = '';
    
    loadMyPosts();
    alert("Post published!");
    return true;
}
//===============================================================
//       ---------- Login & Register logic ----------
//===============================================================

function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const errorDiv = document.getElementById('loginError');
    
    if (!username || !password) {
        errorDiv.textContent = "Both fields are required.";
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        errorDiv.textContent = "Invalid username or password.";
        return;
    }
    
    setCurrentUser(username);
    window.location.href = "index.html";
}

function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const confirm = document.getElementById('regConfirmPassword').value.trim();
    const errorDiv = document.getElementById('regError');
    
    if (!username || !email || !password || !confirm) {
        errorDiv.textContent = "All fields are required.";
        return;
    }
    if (password !== confirm) {
        errorDiv.textContent = "Passwords do not match.";
        return;
    }
    if (password.length < 4) {
        errorDiv.textContent = "Password must be at least 4 characters.";
        return;
    }
    if (!email.includes('@')) {
        errorDiv.textContent = "Enter a valid email address.";
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find(u => u.username === username)) {
        errorDiv.textContent = "Username already exists.";
        return;
    }
    
    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    setCurrentUser(username);
    window.location.href = "index.html";
}

// ============================================================================================================================================================================================
// ---------- Destination Search Page Logic ----------
// ============================================================================================================================================================================================

const destinationsData = [
    {
        id: 1,
        name: "Pyramids of Giza",
        location: "Cairo, Egypt",
        country: "egypt",
        category: "historical",
        rating: 4.8,
        price: 120,
        images: ["images/pyrimds.jpeg", "images/pyrimds.jpeg", "images/pyrimds.jpeg"],
        video: true,
        description: "The Great Pyramid of Giza is the oldest and largest of the pyramids in the Giza pyramid complex. It is the oldest of the Seven Wonders of the Ancient World, and the only one to remain largely intact.",
        events: [
            { name: "Sound & Light Show", time: "19:00 - 20:30" },
            { name: "Sunrise Camel Ride", time: "05:30 - 07:00" },
            { name: "Museum Tour", time: "09:00 - 12:00" }
        ],
        weather: { temp: 32, condition: "Sunny" },
        comments: [
            { author: "Sarah M.", text: "Absolutely breathtaking experience!" },
            { author: "John D.", text: "A must-visit for history lovers." }
        ]
    },
    {
        id: 2,
        name: "Sharm El Sheikh",
        location: "South Sinai, Egypt",
        country: "egypt",
        category: "beach",
        rating: 4.6,
        price: 250,
        images: ["images/sharmElShek.jpeg", "images/sharmElShek.jpeg", "images/sharmElShek.jpeg"],
        video: true,
        description: "Sharm El Sheikh is an Egyptian resort town between the desert of the Sinai Peninsula and the Red Sea. It's known for its sheltered sandy beaches, clear waters and coral reefs.",
        events: [
            { name: "Snorkeling Trip", time: "08:00 - 14:00" },
            { name: "Desert Safari", time: "15:00 - 19:00" },
            { name: "Diving Lesson", time: "10:00 - 12:00" }
        ],
        weather: { temp: 30, condition: "Partly Cloudy" },
        comments: [
            { author: "Emma W.", text: "Best diving spot I've ever been to!" }
        ]
    },
    {
        id: 3,
        name: "Luxor Temple",
        location: "Luxor, Egypt",
        country: "egypt",
        category: "historical",
        rating: 4.9,
        price: 80,
        images: ["images/pyrimds.jpeg", "images/pyrimds.jpeg", "images/pyrimds.jpeg"],
        video: true,
        description: "Luxor Temple is a large Ancient Egyptian temple complex located on the east bank of the Nile River in the city today known as Luxor and was constructed approximately 1400 BCE.",
        events: [
            { name: "Night Illumination", time: "18:00 - 21:00" },
            { name: "Guided History Walk", time: "08:00 - 11:00" },
            { name: "Photography Tour", time: "16:00 - 18:00" }
        ],
        weather: { temp: 35, condition: "Sunny" },
        comments: [
            { author: "Michael R.", text: "The night lighting is magical." },
            { author: "Lisa K.", text: "So much history in one place!" }
        ]
    },
    {
        id: 4,
        name: "Paris, France",
        location: "Paris, France",
        country: "france",
        category: "city",
        rating: 4.7,
        price: 350,
        images: ["images/Paris.jpg", "images/Paris.jpg", "images/Paris.jpg"],
        video: true,
        description: "Paris, France's capital, is a major European city and a global center for art, fashion, gastronomy and culture. Its 19th-century cityscape is crisscrossed by wide boulevards and the River Seine.",
        events: [
            { name: "Eiffel Tower Visit", time: "09:00 - 23:00" },
            { name: "Seine River Cruise", time: "10:00 - 22:00" },
            { name: "Louvre Museum Tour", time: "09:00 - 18:00" }
        ],
        weather: { temp: 18, condition: "Cloudy" },
        comments: [
            { author: "Anna P.", text: "The city of love never disappoints." }
        ]
    },
    {
        id: 5,
        name: "Colosseum",
        location: "Rome, Italy",
        country: "italy",
        category: "historical",
        rating: 4.8,
        price: 150,
        images: ["images/Paris.jpg", "images/Paris.jpg", "images/Paris.jpg"],
        video: true,
        description: "The Colosseum is an oval amphitheatre in the centre of the city of Rome, Italy, just east of the Roman Forum. It is the largest ancient amphitheatre ever built.",
        events: [
            { name: "Underground Tour", time: "10:00 - 12:00" },
            { name: "Gladiator Museum", time: "09:00 - 17:00" },
            { name: "Night Tour", time: "20:00 - 22:00" }
        ],
        weather: { temp: 24, condition: "Sunny" },
        comments: [
            { author: "David S.", text: "Walking through history!" }
        ]
    },
    {
        id: 6,
        name: "Mount Fuji",
        location: "Honshu, Japan",
        country: "japan",
        category: "nature",
        rating: 4.9,
        price: 200,
        images: ["images/sharmElShek.jpeg", "images/sharmElShek.jpeg", "images/sharmElShek.jpeg"],
        video: true,
        description: "Mount Fuji is an active volcano about 100 kilometers southwest of Tokyo. Commonly called 'Fuji-san,' it's the country's tallest peak, considered one of the 3 sacred mountains.",
        events: [
            { name: "Sunrise Hike", time: "02:00 - 06:00" },
            { name: "Hot Spring Bath", time: "10:00 - 20:00" },
            { name: "Cherry Blossom View", time: "08:00 - 18:00" }
        ],
        weather: { temp: 12, condition: "Clear" },
        comments: [
            { author: "Yuki T.", text: "The sunrise from the summit is unforgettable." }
        ]
    }
];

let currentView = 'grid';
let currentDestinations = [...destinationsData];
let activeDestination = null;

function renderDestinations() {
    const container = document.getElementById('destinationsContainer');
    if (!container) return;

    container.className = `destinations-${currentView}`;
    container.innerHTML = '';

    if (currentDestinations.length === 0) {
        container.innerHTML = '<div class="empty-posts" style="grid-column: 1/-1; text-align: center; padding: 3rem;">No destinations match your filters.</div>';
        document.getElementById('resultsCount').textContent = '0 destinations found';
        return;
    }

    document.getElementById('resultsCount').textContent = `${currentDestinations.length} destination${currentDestinations.length !== 1 ? 's' : ''} found`;

    currentDestinations.forEach(dest => {
        if (currentView === 'grid') {
            container.innerHTML += `
                <div class="dest-card" onclick="openDetail(${dest.id})">
                    <img class="dest-card-img" src="${dest.images[0]}" alt="${dest.name}">
                    <div class="dest-card-content">
                        <div class="dest-card-title">${dest.name}</div>
                        <div class="dest-card-meta">
                            <span><i class="fas fa-map-marker-alt"></i> ${dest.location}</span>
                            <span class="dest-card-rating"><i class="fas fa-star"></i> ${dest.rating}</span>
                        </div>
                        <div class="dest-card-meta" style="margin-top: 0.5rem;">
                            <span class="dest-card-price">$${dest.price}</span>
                            <span style="text-transform: capitalize;">${dest.category}</span>
                        </div>
                    </div>
                </div>
            `;
        } else if (currentView === 'list') {
            container.innerHTML += `
                <div class="dest-card" onclick="openDetail(${dest.id})">
                    <img class="dest-card-img" src="${dest.images[0]}" alt="${dest.name}">
                    <div class="dest-card-content">
                        <div class="dest-card-title">${dest.name}</div>
                        <div class="dest-card-meta">
                            <span><i class="fas fa-map-marker-alt"></i> ${dest.location}</span>
                            <span class="dest-card-rating"><i class="fas fa-star"></i> ${dest.rating}</span>
                        </div>
                        <p style="margin-top: 0.5rem; color: #475569; font-size: 0.9rem;">${dest.description.substring(0, 120)}...</p>
                        <div class="dest-card-meta" style="margin-top: 0.5rem;">
                            <span class="dest-card-price">$${dest.price}</span>
                            <span style="text-transform: capitalize;">${dest.category}</span>
                        </div>
                    </div>
                </div>
            `;
        }
    });
}

function switchView(view) {
    currentView = view;
    //change the color of the active button
    // document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    // document.querySelector(`.view-btn[data-view="${view}"]`).classList.add('active');
    renderDestinations();
}

function applyFilters() {
    const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const minRating = parseFloat(document.getElementById('ratingFilter')?.value || 0);
    const location = document.getElementById('locationFilter')?.value || 'all';

    // Search by name or location, filter by rating and location
    currentDestinations = destinationsData.filter(dest => {
        const matchesSearch = dest.name.toLowerCase().includes(search) || 
                             dest.location.toLowerCase().includes(search);
        const matchesRating = dest.rating >= minRating;
        const matchesLocation = location === 'all' || dest.country === location;
        return matchesSearch && matchesRating && matchesLocation;
    });

    renderDestinations();
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('ratingFilter').value = '0';
    document.getElementById('locationFilter').value = 'all';
    applyFilters();
}

function openDetail(id) {
    activeDestination = destinationsData.find(d => d.id === id);
    if (!activeDestination) return;

    document.getElementById('modalMainImage').src = activeDestination.images[0];
    document.getElementById('modalMainImage').alt = activeDestination.name;
    
    const thumbs = document.getElementById('modalThumbnails');
    thumbs.innerHTML = '';

    for (let i = 0; i < activeDestination.images.length; i++) {
        const img = activeDestination.images[i];
        thumbs.innerHTML += `
            <img src="${img}" 
                class="${i === 0 ? 'active' : ''}" 
                onclick="setModalImage('${img}', this)" 
                alt="thumb">
        `;
    }

    document.getElementById('modalTitle').textContent = activeDestination.name;
    document.getElementById('modalRating').innerHTML = `<i class="fas fa-star"></i> ${activeDestination.rating}`;
    document.getElementById('modalLocation').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${activeDestination.location}`;
    document.getElementById('modalPrice').textContent = `$${activeDestination.price}`;
    document.getElementById('modalDescription').textContent = activeDestination.description;
    
    document.getElementById('modalWeather').innerHTML = `
        <span class="temp">${activeDestination.weather.temp}°C</span>
        <span class="condition"><i class="fas fa-sun"></i> ${activeDestination.weather.condition}</span>
    `;

    const eventsTable = document.getElementById('modalEvents');
    eventsTable.innerHTML = '<tr><th>Event</th><th>Time</th></tr>';
    for (let i = 0; i < activeDestination.events.length; i++) {
        const e = activeDestination.events[i];

        eventsTable.innerHTML += `
            <tr>
                <td>${e.name}</td>
                <td>${e.time}</td>
            </tr>
        `;
    }

    renderComments();
    document.getElementById('detailModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function setModalImage(src, thumb) {
    document.getElementById('modalMainImage').src = src;

    const container = document.getElementById('modalThumbnails');
    const thumbs = container.children;

    for (let i = 0; i < thumbs.length; i++) {
        thumbs[i].classList.remove('active');
    }

    thumb.classList.add('active');
}

function closeDetail() {
    document.getElementById('detailModal').classList.remove('active');
    document.body.style.overflow = '';
    activeDestination = null;
}

function renderComments() {
    const list = document.getElementById('modalComments');
    if (!activeDestination || !list) return;

    list.innerHTML = '';

    for (let i = 0; i < activeDestination.comments.length; i++) {
        const c = activeDestination.comments[i];

        list.innerHTML += `
            <div class="comment">
                <div class="comment-author">${c.author}</div>
                <div class="comment-text">${c.text}</div>
            </div>
        `;
    }
}

function addComment() {
    const input = document.getElementById('commentText');
    const text = input.value.trim();
    if (!text || !activeDestination) return;
    
    const author = getCurrentUser() || 'Guest';
    activeDestination.comments.push({ author, text });
    renderComments();
    input.value = '';
}

function submitBooking(e) {
    e.preventDefault();
    if (!getCurrentUser()) {
        alert('Please login first to book a trip.');
        return;
    }
    const date = document.getElementById('bookDate').value;
    const time = document.getElementById('bookTime').value;
    const guide = document.getElementById('bookGuide').checked;
    if (!date || !time) {
        alert('Please select date and time.');
        return;
    }
    alert(`Booking confirmed for ${activeDestination?.name} on ${date} at ${time}${guide ? ' with a tour guide' : ''}!`);
    document.getElementById('bookingForm').reset();
}

// ---------- Initialize page-specific logic ----------
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();

    // index page
    if (document.getElementById('postsContainer')) {
        loadPostsToHome();
    }

    // profile page
    if (document.getElementById('addPostBtn')) {
        if (!getCurrentUser()) {
            window.location.href = "login.html";
        }
        loadMyPosts();
        document.getElementById('addPostBtn').addEventListener('click', addNewPost);
    }

    // login page
    if (document.getElementById('loginForm')) {
        document.getElementById('loginForm').addEventListener('submit', handleLogin);
    }

    // register page
    if (document.getElementById('registerForm')) {
        document.getElementById('registerForm').addEventListener('submit', handleRegister);
    }

    // Search page
    if (document.getElementById('destinationsContainer')) {
        renderDestinations();

        // Search input
        document.getElementById('searchInput')?.addEventListener('input', applyFilters);

        // Rating & Location
        document.getElementById('ratingFilter')?.addEventListener('change', applyFilters);
        document.getElementById('locationFilter')?.addEventListener('change', applyFilters);

        // Close modal on outside click
        document.getElementById('detailModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'detailModal') closeDetail();
        });
    }
});

