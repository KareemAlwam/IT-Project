// ============================================================
// ---------- Destination Search Page ----------
// ============================================================
const destinationsData = [
    {
        id: 1,
        name: "Pyramids of Giza",
        location: "Cairo, Egypt",
        country: "egypt",
        category: "historical",
        rating: 4.8,
        price: 120,
        images: ["images/pyramids.jpg", "images/pyramids.jpg", "images/pyramids.jpg"],
        video: "media/pyrimds.mp4",
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
        images: ["images/sharm.jpg", "images/sharm.jpg", "images/sharm.jpg"],
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
        images: ["images/luxor.jpg", "images/luxor.jpg", "images/luxor.jpg"],
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
        images: ["images/paris.jpg", "images/paris.jpg", "images/paris.jpg"],
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
        images: ["images/colosseum.jpg", "images/colosseum.jpg", "images/colosseum.jpg"],
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
        images: ["images/fuji.jpg", "images/fuji.jpg", "images/fuji.jpg"],
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

// Builds the HTML for a single destination card (grid or list view)
function destinationCard(d) {
    const desc = currentView === 'list'
        ? `<p style="margin-top: 0.5rem; color: #475569; font-size: 0.9rem;">${d.description.substring(0, 120)}...</p>`
        : '';
    return `
        <div class="dest-card" onclick="openDetail(${d.id})">
            <img class="dest-card-img" src="${d.images[0]}" alt="${d.name}">
            <div class="dest-card-content">
                <div class="dest-card-title">${d.name}</div>
                <div class="dest-card-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${d.location}</span>
                    <span class="dest-card-rating"><i class="fas fa-star"></i> ${d.rating}</span>
                </div>
                ${desc}
                <div class="dest-card-meta" style="margin-top: 0.5rem;">
                    <span class="dest-card-price">${formatPrice(d.price)}</span>
                    <span style="text-transform: capitalize;">${d.category}</span>
                </div>
            </div>
        </div>`;
}

function renderDestinations() {
    document.getElementById('destinationsContainer').className = `destinations-${currentView}`;
    renderItems('destinationsContainer', currentDestinations, destinationCard);
}

function applyFilters() {
    const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const minRating = parseFloat(document.getElementById('ratingFilter')?.value || 0);
    const location = document.getElementById('locationFilter')?.value || 'all';

    currentDestinations = destinationsData.filter(dest =>
        (dest.name.toLowerCase().includes(search) || dest.location.toLowerCase().includes(search)) &&
        dest.rating >= minRating &&
        (location === 'all' || dest.country === location)
    );

    renderDestinations();
}

function openDetail(id) {
    localStorage.setItem('selectedDestinationId', id);
    window.location.href = 'Dist_Detail.html';
}

// Look up the currently-selected destination from the in-memory array.
function currentDestination() {
    const id = parseInt(localStorage.getItem('selectedDestinationId'));
    return destinationsData.find(d => d.id === id);
}

// ============================================================
// ---------- Destination Detail page ----------
// ============================================================
function loadDestinationDetail() {
    const dest = currentDestination();
    if (!dest) {
        window.location.href = 'Dist_Search.html';
        return;
    }

    document.getElementById('detailDestName').textContent = dest.name;
    document.getElementById('detailDestLocation').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${dest.location}`;
    document.getElementById('detailDestPrice').textContent = formatPrice(dest.price);
    document.getElementById('detailDestRating').innerHTML = `<i class="fas fa-star"></i> ${dest.rating}`;
    document.getElementById('detailDestCategory').textContent = dest.category.charAt(0).toUpperCase() + dest.category.slice(1);
    document.getElementById('detailDestCountry').textContent = dest.country.charAt(0).toUpperCase() + dest.country.slice(1);
    document.getElementById('detailDestWeather').innerHTML = `<i class="fas fa-sun"></i> ${dest.weather.temp}°C - ${dest.weather.condition}`;
    document.getElementById('detailDestDescription').textContent = dest.description;

    document.getElementById('detailMainImage').src = dest.images[0];
    document.getElementById('detailMainImage').alt = dest.name;

    // Show the promo video only if this destination has a real video file.
    const videoSection = document.getElementById('destVideoSection');
    if (typeof dest.video === 'string') {
        document.getElementById('destVideoSource').src = dest.video;
        document.getElementById('destVideo').load();
        videoSection.style.display = '';
    } else {
        videoSection.style.display = 'none';
    }

    const thumbContainer = document.getElementById('detailThumbnailContainer');
    thumbContainer.innerHTML = '';
    dest.images.forEach((img, index) => {
        const thumb = document.createElement('div');
        thumb.className = 'thumbnail';
        thumb.innerHTML = `<img src="${img}" alt="Destination image ${index + 1}">`;
        thumb.onclick = () => { document.getElementById('detailMainImage').src = img; };
        thumbContainer.appendChild(thumb);
    });

    const eventsList = document.getElementById('detailEventsList');
    eventsList.innerHTML = '';
    dest.events.forEach((event, i) => {
        eventsList.innerHTML += `
        <tr>
            <td>${i + 1}</td>
            <td><i class="fas fa-calendar"></i> ${event.name}</td>
            <td><i class="far fa-clock"></i> ${event.time}</td>
        </tr>`;
    });

    // Keep the addon label's price in the active currency.
    const guideLabel = document.getElementById('guideAddonLabel');
    if (guideLabel) guideLabel.textContent = `Book a Tour Guide (+${formatPrice(50)})`;

    updateDestinationTotal();

    renderDetailComments(dest);
}

function updateDestinationTotal() {
    const dest = currentDestination();
    if (!dest) return;
    const guide = document.getElementById('bookGuide').checked;
    const total = dest.price + (guide ? 50 : 0);
    document.getElementById('totalPrice').textContent = formatPrice(total);
}

function bookDestination() {
    if (!requireLogin('Dist_Detail.html')) return;

    const date = document.getElementById('bookDate').value;
    const time = document.getElementById('bookTime').value;
    if (!date || !time) {
        showNotification('Please select date and time.', 'error');
        return;
    }

    const dest = currentDestination();
    showNotification(`Booking confirmed for ${dest.name}!`, 'success');
    setTimeout(() => window.location.href = 'Dist_Search.html', 900);
}

function addDestinationComment() {
    const dest = currentDestination();
    if (dest) addCommentTo(dest);
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('destinationsContainer')) {
        renderDestinations();
        document.getElementById('searchInput')?.addEventListener('input', applyFilters);
        document.getElementById('ratingFilter')?.addEventListener('change', applyFilters);
        document.getElementById('locationFilter')?.addEventListener('change', applyFilters);
    }

    if (document.getElementById('detailDestName')) loadDestinationDetail();
});
