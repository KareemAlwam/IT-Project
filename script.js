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
    // Remove existing notifications
    const existing = document.querySelector('.custom-notification');
    if (existing) existing.remove();

    const icons = {
        success: 'check-circle',
        error: 'times-circle',
        info: 'info-circle'
    };

    const notification = document.createElement('div');
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

    // Auto remove after 4 seconds
    setTimeout(() => {
        if (notification.parentElement) notification.remove();
    }, 4000);
}

function redirectWithNotification(message, type = 'success', url, delay = 900) {
    showNotification(message, type);
    if (url) {
        setTimeout(() => {
            window.location.href = url;
        }, delay);
    }
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
        showNotification("Please login first.", "error");
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
    showNotification("Post published!", "success");
    return true;
}
//===============================================================
//       ---------- Login & Register logic ----------
//===============================================================

function handleLogin(e) {
    e.preventDefault();// stop form from submitting and refreshing the page
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
    
    // Check if user was trying to book something before login
    const redirectPage = localStorage.getItem('redirectAfterLogin');
    localStorage.removeItem('redirectAfterLogin');
    
    if (redirectPage) {
        window.location.href = redirectPage;
    } else {
        window.location.href = "index.html";
    }
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



// ============================================================================================================================================================================================
// ---------- Destination Detail Page Functions (NEW) ----------
// ============================================================================================================================================================================================

function openDetail(id) {
    const destination = destinationsData.find(d => d.id === id);
    if (!destination) return;

    // Store destination data in localStorage for the detail page
    localStorage.setItem('selectedDestination', JSON.stringify(destination));
    window.location.href = 'Dist_Detail.html';
}

function loadDestinationDetail() {
    const dest = JSON.parse(localStorage.getItem('selectedDestination'));
    if (!dest) {
        window.location.href = 'Dist_Search.html';
        return;
    }

    document.getElementById('detailDestName').textContent = dest.name;
    document.getElementById('detailDestLocation').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${dest.location}`;
    document.getElementById('detailDestPrice').textContent = `$${dest.price}`;
    document.getElementById('detailDestRating').innerHTML = `<i class="fas fa-star"></i> ${dest.rating}`;
    document.getElementById('detailDestCategory').textContent = dest.category.charAt(0).toUpperCase() + dest.category.slice(1);
    document.getElementById('detailDestCountry').textContent = dest.country.charAt(0).toUpperCase() + dest.country.slice(1);
    document.getElementById('detailDestWeather').innerHTML = `<i class="fas fa-sun"></i> ${dest.weather.temp}°C - ${dest.weather.condition}`;
    document.getElementById('detailDestDescription').textContent = dest.description;

    // Set main image
    document.getElementById('detailMainImage').src = dest.images[0];
    document.getElementById('detailMainImage').alt = dest.name;

    // Add thumbnails
    const thumbContainer = document.getElementById('detailThumbnailContainer');
    thumbContainer.innerHTML = '';
    dest.images.forEach((img, index) => {
        const thumb = document.createElement('div');
        thumb.className = 'thumbnail';
        thumb.innerHTML = `<img src="${img}" alt="Destination image ${index + 1}">`;
        thumb.onclick = () => {
            document.getElementById('detailMainImage').src = img;
        };
        thumbContainer.appendChild(thumb);
    });

    // Events
    const eventsList = document.getElementById('detailEventsList');
    eventsList.innerHTML = '';
    dest.events.forEach(event => {
        eventsList.innerHTML += `
            <div class="event-item">
                <span class="event-name"><i class="fas fa-calendar"></i> ${event.name}</span>
                <span class="event-time">${event.time}</span>
            </div>
        `;
    });

    // Set total price
    document.getElementById('totalPrice').textContent = `$${dest.price}`;
    localStorage.setItem('selectedDestinationPrice', dest.price);

    // Load comments
    loadDestinationDetailComments(dest);
}

function loadDestinationDetailComments(dest) {
    const commentsList = document.getElementById('detailComments');
    commentsList.innerHTML = '';

    if (!dest.comments || dest.comments.length === 0) {
        commentsList.innerHTML = '<p style="color: #94a3b8;">No reviews yet. Be the first to leave one!</p>';
        return;
    }

    dest.comments.forEach(comment => {
        const commentEl = document.createElement('div');
        commentEl.className = 'comment';
        commentEl.innerHTML = `
            <div class="comment-author"><i class="fas fa-user-circle"></i> ${comment.author}</div>
            <div class="comment-text">${comment.text}</div>
        `;
        commentsList.appendChild(commentEl);
    });
}

function bookDestination() {
    if (!getCurrentUser()) {
        localStorage.setItem('redirectAfterLogin', 'Dist_Detail.html');
        window.location.href = 'login.html';
        return;
    }

    const date = document.getElementById('bookDate').value;
    const time = document.getElementById('bookTime').value;
    const guide = document.getElementById('bookGuide').checked;

if (!date || !time) {
        showNotification('Please select date and time.', 'error');
        return;
    }

    const dest = JSON.parse(localStorage.getItem('selectedDestination'));
    let total = dest.price;
    if (guide) total += 50;

    redirectWithNotification(`✅ Booking confirmed for ${dest.name}!`, 'success', 'Dist_Search.html');
}

function addDestinationComment() {
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

    const dest = JSON.parse(localStorage.getItem('selectedDestination'));
    const author = getCurrentUser();
    
    if (!dest.comments) {
        dest.comments = [];
    }
    
    dest.comments.push({ author, text });
    loadDestinationDetailComments(dest);
    input.value = '';
}

function showLoginOverlay() {
    document.getElementById('loginOverlay').classList.add('active');
}

function closeLoginOverlay() {
    document.getElementById('loginOverlay').classList.remove('active');
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





// ============================================================================================================================================================================================
// ---------- Hotel Search Page Logic ----------
// ============================================================================================================================================================================================

const hotelsData = [
    {
        id: 1,
        name: "Sunrise Desert Resort",
        location: "Sharm El Sheikh, Egypt",
        country: "egypt",
        hotelClass: "5",
        rating: 4.8,
        pricePerNight: 320,
        images: ["images/hotel1.jpg", "images/hotel1.jpg", "images/hotel1.jpg"],
        amenities: ["Pool", "Spa", "Gym", "Free WiFi", "Restaurant"],
        description: "A breathtaking luxury resort overlooking the desert dunes and the Red Sea, featuring an expansive outdoor pool, world-class spa, and sunset dining. The perfect escape for relaxation and adventure.",
        checkIn: "3:00 PM",
        checkOut: "12:00 PM",
        weather: { temp: 32, condition: "Sunny" },
        comments: [
            { author: "Sarah M.", text: "The pool at sunset is absolutely magical!" },
            { author: "John D.", text: "Best resort experience I've ever had in Egypt." }
        ]
    },
    {
        id: 2,
        name: "Tokyo Neon Stay",
        location: "Shinjuku, Japan",
        country: "japan",
        hotelClass: "4",
        rating: 4.6,
        pricePerNight: 210,
        images: ["images/hotel2.jpg", "images/hotel2.jpg", "images/hotel2.jpg"],
        amenities: ["Free WiFi", "Restaurant", "Gym", "Bar"],
        description: "Nestled in the vibrant streets of Shinjuku, this boutique hotel puts you at the heart of Tokyo's electric nightlife and culture. Modern rooms with Japanese minimalist design and panoramic city views.",
        checkIn: "3:00 PM",
        checkOut: "11:00 AM",
        weather: { temp: 22, condition: "Clear" },
        comments: [
            { author: "Yuki T.", text: "Location is perfect — everything is walking distance!" },
            { author: "Emma W.", text: "Great vibes, super clean rooms, and amazing staff." }
        ]
    },
    {
        id: 3,
        name: "Ocean Cliff Retreat",
        location: "Bali, Indonesia",
        country: "italy",
        hotelClass: "5",
        rating: 4.9,
        pricePerNight: 480,
        images: ["images/hotel3.jpg", "images/hotel3.jpg", "images/hotel3.jpg"],
        amenities: ["Pool", "Spa", "Free WiFi", "Restaurant", "Bar"],
        description: "Perched dramatically on Bali's southern cliffs, this luxury retreat features an infinity pool that appears to merge with the Indian Ocean. A sanctuary of calm with world-class dining and breathtaking views.",
        checkIn: "2:00 PM",
        checkOut: "12:00 PM",
        weather: { temp: 28, condition: "Partly Cloudy" },
        comments: [
            { author: "Anna P.", text: "The infinity pool view is worth every penny." },
            { author: "Michael R.", text: "Absolute paradise. I never wanted to leave." }
        ]
    },
    {
        id: 4,
        name: "Beachside Lodge",
        location: "South Sinai, Egypt",
        country: "egypt",
        hotelClass: "4",
        rating: 4.5,
        pricePerNight: 175,
        images: ["images/hotel4.jpg", "images/hotel4.jpg", "images/hotel4.jpg"],
        amenities: ["Pool", "Free WiFi", "Restaurant", "Parking"],
        description: "A charming wooden lodge right on the Red Sea coast, offering a warm, rustic atmosphere with modern comforts. Wake up to the sound of waves and enjoy sunset dinners on the waterfront deck.",
        checkIn: "3:00 PM",
        checkOut: "11:00 AM",
        weather: { temp: 30, condition: "Sunny" },
        comments: [
            { author: "David S.", text: "Such a cozy and unique place, very different from typical hotels." },
            { author: "Lisa K.", text: "The beachfront location is unbeatable. Loved it!" }
        ]
    },
    {
        id: 5,
        name: "Grand Palm Tower",
        location: "Cairo, Egypt",
        country: "egypt",
        hotelClass: "5",
        rating: 4.7,
        pricePerNight: 290,
        images: ["images/hotel5.jpg", "images/hotel5.jpg", "images/hotel5.jpg"],
        amenities: ["Pool", "Spa", "Gym", "Free WiFi", "Restaurant", "Parking"],
        description: "An iconic luxury tower hotel rising above Cairo's lush gardens, offering sweeping views of the Nile and the city skyline. Featuring a stunning outdoor pool, top-floor restaurant, and impeccable Egyptian hospitality.",
        checkIn: "3:00 PM",
        checkOut: "12:00 PM",
        weather: { temp: 33, condition: "Sunny" },
        comments: [
            { author: "Claire D.", text: "The Nile view from the rooftop restaurant is stunning." },
            { author: "James T.", text: "Luxury at its finest — everything was perfect." }
        ]
    },
    {
        id: 6,
        name: "Jungle Villa Ubud",
        location: "Ubud, Indonesia",
        country: "italy",
        hotelClass: "4",
        rating: 4.8,
        pricePerNight: 220,
        images: ["images/hotel6.jpg", "images/hotel6.jpg", "images/hotel6.jpg"],
        amenities: ["Spa", "Free WiFi", "Restaurant"],
        description: "Hidden in the lush tropical forests of Ubud, this intimate villa hotel offers rooms crafted from natural wood and stone, with private garden views. A peaceful retreat to reconnect with nature and Balinese culture.",
        checkIn: "2:00 PM",
        checkOut: "11:00 AM",
        weather: { temp: 26, condition: "Partly Cloudy" },
        comments: [
            { author: "Sophie L.", text: "Waking up to jungle sounds is an experience like no other." },
            { author: "Hassan A.", text: "Incredibly peaceful and beautifully designed." }
        ]
    }
];

let currentHotelView = 'grid';
let currentHotels = [...hotelsData];
let activeHotel = null;

function renderHotels() {
    const container = document.getElementById('hotelsContainer');
    if (!container) return;

    container.className = `destinations-${currentHotelView}`;
    container.innerHTML = '';

    if (currentHotels.length === 0) {
        container.innerHTML = '<div class="empty-posts" style="grid-column: 1/-1; text-align: center; padding: 3rem;">No hotels match your filters.</div>';
        document.getElementById('resultsCount').textContent = '0 hotels found';
        return;
    }

    document.getElementById('resultsCount').textContent = `${currentHotels.length} hotel${currentHotels.length !== 1 ? 's' : ''} found`;

    currentHotels.forEach(hotel => {
        if (currentHotelView === 'grid') {
            container.innerHTML += `
                <div class="dest-card" onclick="openHotelDetail(${hotel.id})">
                    <img class="dest-card-img" src="${hotel.images[0]}" alt="${hotel.name}">
                    <div class="dest-card-content">
                        <div class="dest-card-title">${hotel.name}</div>
                        <div class="dest-card-meta">
                            <span><i class="fas fa-map-marker-alt"></i> ${hotel.location}</span>
                            <span class="dest-card-rating"><i class="fas fa-star"></i> ${hotel.rating}</span>
                        </div>
                        <div class="dest-card-meta" style="margin-top: 0.5rem;">
                            <span class="dest-card-price">$${hotel.pricePerNight}/night</span>
                            <span>${hotel.hotelClass}★ Hotel</span>
                        </div>
                    </div>
                </div>
            `;
        } else if (currentHotelView === 'list') {
            container.innerHTML += `
                <div class="dest-card" onclick="openHotelDetail(${hotel.id})">
                    <img class="dest-card-img" src="${hotel.images[0]}" alt="${hotel.name}">
                    <div class="dest-card-content">
                        <div class="dest-card-title">${hotel.name}</div>
                        <div class="dest-card-meta">
                            <span><i class="fas fa-map-marker-alt"></i> ${hotel.location}</span>
                            <span class="dest-card-rating"><i class="fas fa-star"></i> ${hotel.rating}</span>
                        </div>
                        <p style="margin-top: 0.5rem; color: #475569; font-size: 0.9rem;">${hotel.description.substring(0, 120)}...</p>
                        <div class="dest-card-meta" style="margin-top: 0.5rem;">
                            <span class="dest-card-price">$${hotel.pricePerNight}/night</span>
                            <span>${hotel.hotelClass}★ Hotel</span>
                        </div>
                    </div>
                </div>
            `;
        }
    });
}

function switchView(view) {
    if (document.getElementById('hotelsContainer')) {
        currentHotelView = view;
        renderHotels();
    } else {
        currentView = view;
        renderDestinations();
    }
}

function applyHotelFilters() {
    const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const minRating = parseFloat(document.getElementById('ratingFilter')?.value || 0);
    const location = document.getElementById('locationFilter')?.value || 'all';
    const hotelClass = document.getElementById('classFilter')?.value || 'all';

    const checkedAmenities = Array.from(
        document.querySelectorAll('.amenity-checkboxes input:checked')
    ).map(el => el.value.toLowerCase());

    currentHotels = hotelsData.filter(hotel => {
        const matchesSearch = hotel.name.toLowerCase().includes(search) ||
                              hotel.location.toLowerCase().includes(search);
        const matchesRating = hotel.rating >= minRating;
        const matchesLocation = location === 'all' || hotel.country === location;
        const matchesClass = hotelClass === 'all' || hotel.hotelClass === hotelClass;
        const matchesAmenities = checkedAmenities.every(a =>
            hotel.amenities.map(x => x.toLowerCase()).includes(a)
        );
        return matchesSearch && matchesRating && matchesLocation && matchesClass && matchesAmenities;
    });

    renderHotels();
}

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

function openHotelDetail(id) {
    const hotel = hotelsData.find(h => h.id === id);
    if (!hotel) return;
    
    // Store hotel data in localStorage for the detail page
    localStorage.setItem('selectedHotel', JSON.stringify(hotel));
    window.location.href = 'Hotel_Detail.html';
}

// ============================================================================================================================================================================================
// ---------- Hotel Detail Page Logic ----------
// ============================================================================================================================================================================================

function loadHotelDetail() {
    const hotel = JSON.parse(localStorage.getItem('selectedHotel'));
    if (!hotel) {
        window.location.href = 'Hotel_Search.html';
        return;
    }

    document.getElementById('detailHotelName').textContent = hotel.name;
    document.getElementById('detailHotelClass').textContent = `${hotel.hotelClass}★ Hotel`;
    document.getElementById('detailHotelPrice').textContent = `$${hotel.pricePerNight}`;
    document.getElementById('detailHotelLocation').textContent = hotel.location;
    document.getElementById('detailHotelRating').innerHTML = `<i class="fas fa-star"></i> ${hotel.rating}`;
    document.getElementById('detailCheckIn').textContent = hotel.checkIn;
    document.getElementById('detailCheckOut').textContent = hotel.checkOut;
    document.getElementById('detailHotelDescription').textContent = hotel.description;

    // Set main image
    document.getElementById('detailMainImage').src = hotel.images[0];
    document.getElementById('detailMainImage').alt = hotel.name;

    // Add thumbnails
    const thumbContainer = document.getElementById('detailThumbnailContainer');
    thumbContainer.innerHTML = '';
    hotel.images.forEach((img, index) => {
        const thumb = document.createElement('div');
        thumb.className = 'thumbnail';
        thumb.innerHTML = `<img src="${img}" alt="Hotel image ${index + 1}">`;
        thumb.onclick = () => {
            document.getElementById('detailMainImage').src = img;
        };
        thumbContainer.appendChild(thumb);
    });

    // Amenities
    document.getElementById('detailAmenitiesList').innerHTML = hotel.amenities.map(a =>
        `<span class="amenity-tag"><i class="fas fa-check"></i> ${a}</span>`
    ).join('');

    // Weather
    document.getElementById('detailWeather').innerHTML = `
        <div><span style="font-size: 1.5rem; font-weight: bold; color: #1e6f5c;">${hotel.weather.temp}°C</span></div>
        <div><i class="fas fa-sun" style="color: #f59e0b; font-size: 1.5rem;"></i> ${hotel.weather.condition}</div>
    `;

    // Set total price
    document.getElementById('totalPrice').textContent = `$${hotel.pricePerNight}`;
    localStorage.setItem('selectedHotelPrice', hotel.pricePerNight);

    // Load comments
    loadHotelDetailComments(hotel);
}

function loadHotelDetailComments(hotel) {
    const commentsList = document.getElementById('detailComments');
    commentsList.innerHTML = '';

    if (!hotel.comments || hotel.comments.length === 0) {
        commentsList.innerHTML = '<p style="color: #94a3b8;">No reviews yet. Be the first to leave one!</p>';
        return;
    }

    hotel.comments.forEach(comment => {
        const commentEl = document.createElement('div');
        commentEl.className = 'comment';
        commentEl.innerHTML = `
            <div class="comment-author"><i class="fas fa-user-circle"></i> ${comment.author}</div>
            <div class="comment-text">${comment.text}</div>
        `;
        commentsList.appendChild(commentEl);
    });
}

function bookHotel() {
    if (!getCurrentUser()) {
        localStorage.setItem('redirectAfterLogin', 'Hotel_Detail.html');
        window.location.href = 'login.html';
        return;
    }

    const checkIn = document.getElementById('checkInDate').value;
    const checkOut = document.getElementById('checkOutDate').value;
    const guests = document.getElementById('guestCount').value;
    const roomType = document.getElementById('roomType').value;
    const breakfast = document.getElementById('breakfast').checked;
    const transfer = document.getElementById('transfer').checked;

    if (!checkIn || !checkOut) {
showNotification('Please select check-in and check-out dates.', 'error');
        return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
        showNotification('Check-out date must be after check-in date.', 'error');
        return;
    }

    const hotel = JSON.parse(localStorage.getItem('selectedHotel'));
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    let total = hotel.pricePerNight * nights;
    if (breakfast) total += 20 * nights;
    if (transfer) total += 30;

    redirectWithNotification(`✅ Booking confirmed for ${hotel.name}!`, 'success', 'Hotel_Search.html');
}

function addHotelComment() {
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

    const hotel = JSON.parse(localStorage.getItem('selectedHotel'));
    const author = getCurrentUser();
    
    if (!hotel.comments) {
        hotel.comments = [];
    }
    
    hotel.comments.push({ author, text });
    loadHotelDetailComments(hotel);
    input.value = '';
}

function showLoginOverlay() {
    document.getElementById('loginOverlay').classList.add('active');
}

function closeLoginOverlay() {
    document.getElementById('loginOverlay').classList.remove('active');
}

function renderHotelComments() {
    const list = document.getElementById('modalComments');
    if (!activeHotel || !list) return;

    list.innerHTML = '';
    for (let i = 0; i < activeHotel.comments.length; i++) {
        const c = activeHotel.comments[i];
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

    if (document.getElementById('hotelsContainer')) {
        if (!text || !activeHotel) return;
        const author = getCurrentUser() || 'Guest';
        activeHotel.comments.push({ author, text });
        renderHotelComments();
    } else {
        if (!text || !activeDestination) return;
        const author = getCurrentUser() || 'Guest';
        activeDestination.comments.push({ author, text });
        renderComments();
    }
    input.value = '';
}

function submitBooking(e) {
    e.preventDefault();
    if (!getCurrentUser()) {
        showNotification('Please login first to make a booking.', 'error');
        return;
    }

    if (document.getElementById('hotelsContainer')) {
        const checkIn = document.getElementById('checkInDate').value;
        const checkOut = document.getElementById('checkOutDate').value;
        const guests = document.getElementById('guestsCount').value;
        const roomType = document.getElementById('roomType').value;
        const transfer = document.getElementById('airportTransfer').checked;
        const breakfast = document.getElementById('breakfastIncluded').checked;

        if (!checkIn || !checkOut) {
            showNotification('Please select check-in and check-out dates.', 'error');
            return;
        }
        if (new Date(checkOut) <= new Date(checkIn)) {
            showNotification('Check-out date must be after check-in.', 'error');
            return;
        }

        const nights = Math.round((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
        let total = activeHotel.pricePerNight * nights;
        if (transfer) total += 30;
        if (breakfast) total += 20 * nights;

        showNotification(`✅ Booking confirmed for ${activeHotel?.name}!`, 'success');
        document.getElementById('bookingForm').reset();
    } else {
        const date = document.getElementById('bookDate').value;
        const time = document.getElementById('bookTime').value;
        const guide = document.getElementById('bookGuide').checked;
        if (!date || !time) {
            showNotification('Please select date and time.', 'error');
            return;
        }
        showNotification(`✅ Booking confirmed for ${activeDestination?.name}!`, 'success');
        document.getElementById('bookingForm').reset();
    }
}

function closeDetail() {
    document.getElementById('detailModal').classList.remove('active');
    document.body.style.overflow = '';
    activeHotel = null;
    activeDestination = null;
}

// ============================================================================================================================================================================================
// ---------- Flight Search Page Logic ----------
// ============================================================================================================================================================================================

const flightsData = [
    {
        id: 1,
        airline: "EgyptAir",
        flightNumber: "MS 123",
        from: "Cairo (CAI)",
        to: "Paris (CDG)",
        departureTime: "10:00",
        arrivalTime: "14:30",
        duration: "5h 30m",
        stops: 0,
        price: 450,
        aircraft: "Boeing 737",
        baggage: "23kg included",
        class: "Economy",
        date: "2024-05-15"
    },
    {
        id: 2,
        airline: "Air France",
        flightNumber: "AF 456",
        from: "Paris (CDG)",
        to: "Tokyo (NRT)",
        departureTime: "18:45",
        arrivalTime: "14:20",
        duration: "12h 35m",
        stops: 1,
        price: 850,
        aircraft: "Airbus A380",
        baggage: "23kg included",
        class: "Business",
        date: "2024-05-16"
    },
    {
        id: 3,
        airline: "Emirates",
        flightNumber: "EK 789",
        from: "Dubai (DXB)",
        to: "New York (JFK)",
        departureTime: "02:30",
        arrivalTime: "08:45",
        duration: "14h 15m",
        stops: 0,
        price: 1200,
        aircraft: "Boeing 777",
        baggage: "30kg included",
        class: "First",
        date: "2024-05-17"
    },
    {
        id: 4,
        airline: "Lufthansa",
        flightNumber: "LH 321",
        from: "Frankfurt (FRA)",
        to: "Cairo (CAI)",
        departureTime: "22:15",
        arrivalTime: "02:40",
        duration: "4h 25m",
        stops: 0,
        price: 320,
        aircraft: "Airbus A320",
        baggage: "20kg included",
        class: "Economy",
        date: "2024-05-18"
    },
    {
        id: 5,
        airline: "British Airways",
        flightNumber: "BA 654",
        from: "London (LHR)",
        to: "Rome (FCO)",
        departureTime: "09:30",
        arrivalTime: "12:45",
        duration: "2h 15m",
        stops: 0,
        price: 180,
        aircraft: "Boeing 787",
        baggage: "23kg included",
        class: "Premium Economy",
        date: "2024-05-19"
    },
    {
        id: 6,
        airline: "Qatar Airways",
        flightNumber: "QR 987",
        from: "Doha (DOH)",
        to: "Sydney (SYD)",
        departureTime: "20:00",
        arrivalTime: "18:30",
        duration: "15h 30m",
        stops: 0,
        price: 1400,
        aircraft: "Boeing 787",
        baggage: "30kg included",
        class: "Business",
        date: "2024-05-20"
    }
];

let currentFlights = [...flightsData];

function renderFlights() {
    const container = document.getElementById('flightsContainer');
    if (!container) return;

    container.innerHTML = '';

    if (currentFlights.length === 0) {
        container.innerHTML = '<div class="empty-posts" style="text-align: center; padding: 3rem;">No flights match your search.</div>';
        document.getElementById('resultsCount').textContent = '0 flights found';
        return;
    }

    document.getElementById('resultsCount').textContent = `${currentFlights.length} flight${currentFlights.length !== 1 ? 's' : ''} found`;

    currentFlights.forEach(flight => {
        container.innerHTML += `
            <div class="flight-card" onclick="openFlightDetail(${flight.id})">
                <div class="flight-header">
                    <div class="airline-info">
                        <span class="airline-name">${flight.airline}</span>
                        <span class="flight-number">${flight.flightNumber}</span>
                    </div>
                    <div class="flight-price">$${flight.price}</div>
                </div>
                <div class="flight-route">
                    <div class="departure">
                        <div class="time">${flight.departureTime}</div>
                        <div class="city">${flight.from}</div>
                    </div>
                    <div class="flight-duration">
                        <div class="duration">${flight.duration}</div>
                        <div class="stops">${flight.stops === 0 ? 'Direct' : flight.stops + ' stop' + (flight.stops > 1 ? 's' : '')}</div>
                    </div>
                    <div class="arrival">
                        <div class="time">${flight.arrivalTime}</div>
                        <div class="city">${flight.to}</div>
                    </div>
                </div>
                <div class="flight-details">
                    <span class="aircraft">${flight.aircraft}</span>
                    <span class="class">${flight.class}</span>
                    <span class="baggage">${flight.baggage}</span>
                </div>
            </div>
        `;
    });
}

function searchFlights() {
    const from = document.getElementById('fromInput')?.value.toLowerCase() || '';
    const to = document.getElementById('toInput')?.value.toLowerCase() || '';
    const date = document.getElementById('dateInput')?.value || '';

    currentFlights = flightsData.filter(flight => {
        const matchesFrom = flight.from.toLowerCase().includes(from);
        const matchesTo = flight.to.toLowerCase().includes(to);
        const matchesDate = !date || flight.date === date;
        return matchesFrom && matchesTo && matchesDate;
    });

    renderFlights();
}

function applyFlightFilters() {
    const airline = document.getElementById('airlineFilter')?.value || 'all';
    const stops = document.getElementById('stopsFilter')?.value || 'all';
    const departureTime = document.getElementById('departureTimeFilter')?.value || 'all';
    const flightClass = document.getElementById('classFilter')?.value || 'all';
    const maxPrice = parseInt(document.getElementById('priceRange')?.value || 1000);

    currentFlights = flightsData.filter(flight => {
        const matchesAirline = airline === 'all' || flight.airline === airline;
        const matchesStops = stops === 'all' || flight.stops.toString() === stops;
        const matchesClass = flightClass === 'all' || flight.class.toLowerCase().replace(' ', '') === flightClass;
        const matchesPrice = flight.price <= maxPrice;

        // Departure time filter (simplified)
        let matchesTime = true;
        if (departureTime !== 'all') {
            const hour = parseInt(flight.departureTime.split(':')[0]);
            if (departureTime === 'morning' && !(hour >= 6 && hour < 12)) matchesTime = false;
            if (departureTime === 'afternoon' && !(hour >= 12 && hour < 18)) matchesTime = false;
            if (departureTime === 'evening' && !(hour >= 18 && hour < 24)) matchesTime = false;
            if (departureTime === 'night' && !(hour >= 0 && hour < 6)) matchesTime = false;
        }

        return matchesAirline && matchesStops && matchesClass && matchesPrice && matchesTime;
    });

    renderFlights();
}

function clearFlightFilters() {
    document.getElementById('airlineFilter').value = 'all';
    document.getElementById('stopsFilter').value = 'all';
    document.getElementById('departureTimeFilter').value = 'all';
    document.getElementById('classFilter').value = 'all';
    document.getElementById('priceRange').value = '1000';
    document.getElementById('priceRangeValue').textContent = '$1000+';

    currentFlights = [...flightsData];
    renderFlights();
}

function updatePriceRange(value) {
    document.getElementById('priceRangeValue').textContent = `$${value}`;
    applyFlightFilters();
}

function openFlightDetail(id) {
    const flight = flightsData.find(f => f.id === id);
    if (!flight) return;

    // Store flight data in localStorage for the detail page
    localStorage.setItem('selectedFlight', JSON.stringify(flight));
    window.location.href = 'Flight_Detail.html';
}

// ============================================================================================================================================================================================
// ---------- Flight Detail Page Logic ----------
// ============================================================================================================================================================================================

function loadFlightDetail() {
    const flight = JSON.parse(localStorage.getItem('selectedFlight'));
    if (!flight) {
        window.location.href = 'Flight_Search.html';
        return;
    }

    document.getElementById('detailAirlineName').textContent = flight.airline;
    document.getElementById('detailFlightNumber').textContent = flight.flightNumber;
    document.getElementById('detailDepartureCity').textContent = flight.from;
    document.getElementById('detailArrivalCity').textContent = flight.to;
    document.getElementById('detailDepartureTime').textContent = flight.departureTime;
    document.getElementById('detailArrivalTime').textContent = flight.arrivalTime;
    document.getElementById('detailDuration').textContent = flight.duration;
    document.getElementById('detailTotalDuration').textContent = flight.duration;
    document.getElementById('detailStops').textContent = flight.stops === 0 ? 'Direct' : flight.stops + ' stop' + (flight.stops > 1 ? 's' : '');
    document.getElementById('detailBaggage').textContent = flight.baggage;
    document.getElementById('detailAircraft').textContent = flight.aircraft;
    document.getElementById('detailAircraftType').textContent = flight.aircraft;
    document.getElementById('detailMeals').textContent = 'Complimentary meals included';
    document.getElementById('detailDepartureDate').textContent = flight.date;
    document.getElementById('detailArrivalDate').textContent = flight.date;
    
    // Set total price and store flight for booking
    document.getElementById('totalPrice').textContent = `$${flight.price}`;
    localStorage.setItem('selectedFlightPrice', flight.price);
}

function bookFlight() {
    if (!getCurrentUser()) {
        localStorage.setItem('redirectAfterLogin', 'Flight_Detail.html');
        window.location.href = 'login.html';
        return;
    }
    
    const adults = document.getElementById('adultCount').value;
    const children = document.getElementById('childCount').value;
    const totalPassengers = parseInt(adults) + parseInt(children);
    if (totalPassengers < 1) {
        showNotification('Please choose at least one passenger.', 'error');
        return;
    }

    const flight = JSON.parse(localStorage.getItem('selectedFlight'));
    const totalPrice = flight.price * totalPassengers;
    
    redirectWithNotification(`Flight booked successfully for ${flight.airline} ${flight.flightNumber}!`, 'success', 'Flight_Search.html');
}

function showLoginOverlay() {
    document.getElementById('loginOverlay').classList.add('active');
}

function closeLoginOverlay() {
    document.getElementById('loginOverlay').classList.remove('active');
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

    // Destination Search page
    if (document.getElementById('destinationsContainer')) {
        renderDestinations();

        document.getElementById('searchInput')?.addEventListener('input', applyFilters);
        document.getElementById('ratingFilter')?.addEventListener('change', applyFilters);
        document.getElementById('locationFilter')?.addEventListener('change', applyFilters);

        document.getElementById('detailModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'detailModal') closeDetail();
        });
    }

    // Hotel Search page
    if (document.getElementById('hotelsContainer')) {
        renderHotels();

        document.getElementById('searchInput')?.addEventListener('input', applyHotelFilters);
        document.getElementById('ratingFilter')?.addEventListener('change', applyHotelFilters);
        document.getElementById('locationFilter')?.addEventListener('change', applyHotelFilters);
        document.getElementById('classFilter')?.addEventListener('change', applyHotelFilters);
        document.querySelectorAll('.amenity-checkboxes input').forEach(el =>
            el.addEventListener('change', applyHotelFilters)
        );
    }

    // Flight Search page
    if (document.getElementById('flightsContainer')) {
        renderFlights();
    }

    // Flight Detail page
    if (document.getElementById('detailAirlineName')) {
        loadFlightDetail();
    }

// Hotel Detail page
    if (document.getElementById('detailHotelName')) {
        loadHotelDetail();
    }

    // Destination Detail page
    if (document.getElementById('detailDestName')) {
        loadDestinationDetail();
    }
});

