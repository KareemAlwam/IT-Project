// ============================================================
// ---------- Flight Search Page ----------
// ============================================================
const flightsData = [
    { id: 1, airline: "EgyptAir",        flightNumber: "MS 123", from: "Cairo (CAI)",     to: "Paris (CDG)",    departureTime: "10:00", arrivalTime: "14:30", duration: "5h 30m",  stops: 0, price: 450,  aircraft: "Boeing 737",  baggage: "23kg included", class: "Economy",          date: "2024-05-15" },
    { id: 2, airline: "Air France",      flightNumber: "AF 456", from: "Paris (CDG)",     to: "Tokyo (NRT)",    departureTime: "18:45", arrivalTime: "14:20", duration: "12h 35m", stops: 1, price: 850,  aircraft: "Airbus A380", baggage: "23kg included", class: "Business",         date: "2024-05-16" },
    { id: 3, airline: "Emirates",        flightNumber: "EK 789", from: "Dubai (DXB)",     to: "New York (JFK)", departureTime: "02:30", arrivalTime: "08:45", duration: "14h 15m", stops: 0, price: 1200, aircraft: "Boeing 777",  baggage: "30kg included", class: "First",            date: "2024-05-17" },
    { id: 4, airline: "Lufthansa",       flightNumber: "LH 321", from: "Frankfurt (FRA)", to: "Cairo (CAI)",    departureTime: "22:15", arrivalTime: "02:40", duration: "4h 25m",  stops: 0, price: 320,  aircraft: "Airbus A320", baggage: "20kg included", class: "Economy",          date: "2024-05-18" },
    { id: 5, airline: "British Airways", flightNumber: "BA 654", from: "London (LHR)",    to: "Rome (FCO)",     departureTime: "09:30", arrivalTime: "12:45", duration: "2h 15m",  stops: 0, price: 180,  aircraft: "Boeing 787",  baggage: "23kg included", class: "Premium Economy",  date: "2024-05-19" },
    { id: 6, airline: "Qatar Airways",   flightNumber: "QR 987", from: "Doha (DOH)",      to: "Sydney (SYD)",   departureTime: "20:00", arrivalTime: "18:30", duration: "15h 30m", stops: 0, price: 1400, aircraft: "Boeing 787",  baggage: "30kg included", class: "Business",         date: "2024-05-20" }
];

let currentFlights = [...flightsData];

function flightCard(flight) {
    let stopsLabel = 'Direct';
    if (flight.stops === 1) stopsLabel = '1 stop';
    if (flight.stops > 1)   stopsLabel = flight.stops + ' stops';
    return `
        <div class="flight-card" onclick="openFlightDetail(${flight.id})">
            <div class="flight-header">
                <div class="airline-info">
                    <span class="airline-name">${flight.airline}</span>
                    <span class="flight-number">${flight.flightNumber}</span>
                    </div>
                    <div class="flight-price">${formatPrice(flight.price)}</div>
                    </div>
            <div class="flight-route">
                <div class="departure">
                    <div class="time">${flight.departureTime}</div>
                    <div class="city">${flight.from}</div>
                    </div>
                    <div class="flight-duration">
                    <div class="duration">${flight.duration}</div>
                    <div class="stops">${stopsLabel}</div>
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
            </div>`;
}

function renderFlights() {
    renderItems('flightsContainer', currentFlights, flightCard);
}

function searchFlights() {
    const from = document.getElementById('fromInput')?.value.toLowerCase() || '';
    const to = document.getElementById('toInput')?.value.toLowerCase() || '';
    const date = document.getElementById('dateInput')?.value || '';

    currentFlights = flightsData.filter(flight =>
        flight.from.toLowerCase().includes(from) &&
        flight.to.toLowerCase().includes(to) &&
        (!date || flight.date === date)
    );

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

        let matchesTime = true;
        if (departureTime !== 'all') {
            const hour = parseInt(flight.departureTime.split(':')[0]);
            if (departureTime === 'morning'   && !(hour >= 6  && hour < 12)) matchesTime = false;
            if (departureTime === 'afternoon' && !(hour >= 12 && hour < 18)) matchesTime = false;
            if (departureTime === 'evening'   && !(hour >= 18 && hour < 24)) matchesTime = false;
            if (departureTime === 'night'     && !(hour >= 0  && hour < 6))  matchesTime = false;
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
    refreshPriceRangeLabel();

    currentFlights = [...flightsData];
    renderFlights();
}

function updatePriceRange(value) {
    document.getElementById('priceRangeValue').textContent = formatPrice(parseInt(value));
    applyFlightFilters();
}

// Refreshes the slider's min/max labels in the active currency.
// Called on load and when the currency toggle flips.
function refreshPriceRangeLabel() {
    const slider = document.getElementById('priceRange');
    const minEl  = document.getElementById('priceRangeMin');
    const valEl  = document.getElementById('priceRangeValue');
    if (minEl) minEl.textContent = formatPrice(0);
    if (slider && valEl) {
        const v = parseInt(slider.value);
        valEl.textContent = (v >= parseInt(slider.max) ? formatPrice(v) + '+' : formatPrice(v));
    }
}

function openFlightDetail(id) {
    localStorage.setItem('selectedFlightId', id);
    window.location.href = 'Flight_Detail.html';
}

function currentFlight() {
    const id = parseInt(localStorage.getItem('selectedFlightId'));
    return flightsData.find(f => f.id === id);
}

// ============================================================
// ---------- Flight Detail page ----------
// ============================================================
function loadFlightDetail() {
    const flight = currentFlight();
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
    let stopsLabel = 'Direct';
    if (flight.stops === 1) stopsLabel = '1 stop';
    if (flight.stops > 1)   stopsLabel = flight.stops + ' stops';
    document.getElementById('detailStops').textContent = stopsLabel;
    document.getElementById('detailBaggage').textContent = flight.baggage;
    document.getElementById('detailAircraft').textContent = flight.aircraft;
    document.getElementById('detailAircraftType').textContent = flight.aircraft;
    document.getElementById('detailMeals').textContent = 'Complimentary meals included';
    document.getElementById('detailDepartureDate').textContent = flight.date;
    document.getElementById('detailArrivalDate').textContent = flight.date;

    updateFlightTotal();
}

function updateFlightTotal() {
    const flight = currentFlight();
    if (!flight) return;
    const adults = parseInt(document.getElementById('adultCount').value) || 0;
    const children = parseInt(document.getElementById('childCount').value) || 0;
    const total = flight.price * (adults + children);
    document.getElementById('totalPrice').textContent = formatPrice(total);
}

function bookFlight() {
    if (!requireLogin('Flight_Detail.html')) return;

    const adults = parseInt(document.getElementById('adultCount').value);
    const children = parseInt(document.getElementById('childCount').value);
    if (adults + children < 1) {
        showNotification('Please choose at least one passenger.', 'error');
        return;
    }

    const flight = currentFlight();
    showNotification(`Flight booked successfully for ${flight.airline} ${flight.flightNumber}!`, 'success');
    setTimeout(() => window.location.href = 'Flight_Search.html', 900);
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('flightsContainer')) {
        renderFlights();
        refreshPriceRangeLabel();
    }

    if (document.getElementById('detailAirlineName')) loadFlightDetail();
});
