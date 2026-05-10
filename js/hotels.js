// ============================================================
// ---------- Hotel Search Page ----------
// ============================================================
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
            { author: "Sarah M.", text: "Pool was nice and the staff were helpful. Would stay again." }
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
            { author: "Yuki T.", text: "Rooms are small but the location is good." }
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
            { author: "Anna P.", text: "Expensive but the view is hard to beat." }
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
            { author: "David S.", text: "Quiet spot right by the beach. Good for a few nights away." }
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
            { author: "Claire D.", text: "Comfortable rooms and the breakfast was decent." }
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
            { author: "Sophie L.", text: "Really quiet and relaxing. WiFi was a bit slow though." }
        ]
    }
];

let currentHotelView = 'grid';
let currentHotels = [...hotelsData];

function hotelCard(h) {
    let desc = '';
    let amenitiesHtml = '';
    if (currentHotelView === 'list') {
        desc = `<p style="margin-top: 0.5rem; color: #475569; font-size: 0.9rem;">${h.description.substring(0, 120)}...</p>`;
    } else if (currentHotelView === 'details') {
        desc = `<p style="margin-top: 0.5rem; color: #475569; font-size: 0.9rem;">${h.description}</p>`;
        let tags = '';
        for (let i = 0; i < h.amenities.length; i++) {
            tags += `<span class="amenity-tag">${h.amenities[i]}</span>`;
        }
        amenitiesHtml = `<div class="amenities-list" style="margin-top: 0.8rem;">${tags}</div>`;
    }
    return `
        <div class="dest-card" onclick="openHotelDetail(${h.id})">
            <img class="dest-card-img" src="${h.images[0]}" alt="${h.name}">
            <div class="dest-card-content">
                <div class="dest-card-title">${h.name}</div>
                <div class="dest-card-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${h.location}</span>
                    <span class="dest-card-rating"><i class="fas fa-star"></i> ${h.rating}</span>
                </div>
                ${desc}
                ${amenitiesHtml}
                <div class="dest-card-meta" style="margin-top: 0.5rem;">
                    <span class="dest-card-price">${formatPrice(h.pricePerNight)}/night</span>
                    <span>${h.hotelClass}★ Hotel</span>
                </div>
            </div>
        </div>`;
}

function renderHotels() {
    document.getElementById('hotelsContainer').className = `destinations-${currentHotelView}`;
    renderItems('hotelsContainer', currentHotels, hotelCard);
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
        const matchesSearch = hotel.name.toLowerCase().includes(search) || hotel.location.toLowerCase().includes(search);
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

function openHotelDetail(id) {
    localStorage.setItem('selectedHotelId', id);
    window.location.href = 'Hotel_Detail.html';
}

// Look up the currently-selected hotel from the in-memory array.
function currentHotel() {
    const id = parseInt(localStorage.getItem('selectedHotelId'));
    return hotelsData.find(h => h.id === id);
}

// ============================================================
// ---------- Hotel Detail page ----------
// ============================================================
function loadHotelDetail() {
    const hotel = currentHotel();
    if (!hotel) {
        window.location.href = 'Hotel_Search.html';
        return;
    }

    document.getElementById('detailHotelName').textContent = hotel.name;
    document.getElementById('detailHotelClass').textContent = `${hotel.hotelClass}★ Hotel`;
    document.getElementById('detailHotelPrice').textContent = formatPrice(hotel.pricePerNight);
    document.getElementById('detailHotelLocation').textContent = hotel.location;
    document.getElementById('detailHotelRating').innerHTML = `<i class="fas fa-star"></i> ${hotel.rating}`;
    document.getElementById('detailCheckIn').textContent = hotel.checkIn;
    document.getElementById('detailCheckOut').textContent = hotel.checkOut;
    document.getElementById('detailHotelDescription').textContent = hotel.description;

    document.getElementById('detailMainImage').src = hotel.images[0];
    document.getElementById('detailMainImage').alt = hotel.name;

    const thumbContainer = document.getElementById('detailThumbnailContainer');
    thumbContainer.innerHTML = '';
    hotel.images.forEach((img, index) => {
        const thumb = document.createElement('div');
        thumb.className = 'thumbnail';
        thumb.innerHTML = `<img src="${img}" alt="Hotel image ${index + 1}">`;
        thumb.onclick = () => { document.getElementById('detailMainImage').src = img; };
        thumbContainer.appendChild(thumb);
    });

    const amenitiesList = document.getElementById('detailAmenitiesList');
    amenitiesList.innerHTML = '';
    hotel.amenities.forEach(a => {
        amenitiesList.innerHTML += `<span class="amenity-tag"><i class="fas fa-check"></i> ${a}</span>`;
    });

    document.getElementById('detailWeather').innerHTML = `
        <div><span style="font-size: 1.5rem; font-weight: bold; color: #1e6f5c;">${hotel.weather.temp}°C</span></div>
        <div><i class="fas fa-sun" style="color: #f59e0b; font-size: 1.5rem;"></i> ${hotel.weather.condition}</div>
    `;

    // Keep the addon labels' prices in the active currency.
    const breakfastLabel = document.getElementById('breakfastAddonLabel');
    if (breakfastLabel) breakfastLabel.textContent = `Breakfast Included (+${formatPrice(20)}/night)`;
    const transferLabel = document.getElementById('transferAddonLabel');
    if (transferLabel) transferLabel.textContent = `Airport Transfer (+${formatPrice(30)})`;

    updateHotelTotal();

    renderDetailComments(hotel);
}

function updateHotelTotal() {
    const hotel = currentHotel();
    if (!hotel) return;

    const checkIn = document.getElementById('checkInDate').value;
    const checkOut = document.getElementById('checkOutDate').value;
    let nights = 1;
    if (checkIn && checkOut) {
        const days = Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000);
        if (days > 0) nights = days;
    }

    let total = hotel.pricePerNight * nights;
    if (document.getElementById('breakfast').checked) total += 20 * nights;
    if (document.getElementById('transfer').checked)  total += 30;
    document.getElementById('totalPrice').textContent = formatPrice(total);
}

function bookHotel() {
    if (!requireLogin('Hotel_Detail.html')) return;

    const checkIn = document.getElementById('checkInDate').value;
    const checkOut = document.getElementById('checkOutDate').value;

    if (!checkIn || !checkOut) {
        showNotification('Please select check-in and check-out dates.', 'error');
        return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
        showNotification('Check-out date must be after check-in date.', 'error');
        return;
    }

    const hotel = currentHotel();
    showNotification(`Booking confirmed for ${hotel.name}!`, 'success');
    setTimeout(() => window.location.href = 'Hotel_Search.html', 900);
}

function addHotelComment() {
    const hotel = currentHotel();
    if (hotel) addCommentTo(hotel);
}

document.addEventListener('DOMContentLoaded', () => {
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

    if (document.getElementById('detailHotelName')) loadHotelDetail();
});
