const destinationDropdown = document.getElementById("destination");
const locationText = document.getElementById("location");
const weatherText = document.getElementById("weather");
const map = document.getElementById("map");

const destinations = {
  goa: { lat: 15.2993, lon: 74.1240, name: "Goa" },
  karnataka: { lat: 15.3173, lon: 75.7139, name: "Karnataka" },
  kerala: { lat: 10.8505, lon: 76.2711, name: "Kerala" },
  odisha: { lat: 20.9517, lon: 85.0985, name: "Odisha" }
};

let userCoords = null;

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = x => x * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function updateCards(destination) {
  const dist = calculateDistance(userCoords.lat, userCoords.lon, destination.lat, destination.lon).toFixed(2);

  document.getElementById("car-distance").textContent = `Distance: ${dist} km (~${Math.round(dist / 60)} hrs)`;
  document.getElementById("bus-distance").textContent = `Distance: ${dist} km (~${Math.round(dist / 40)} hrs)`;
  document.getElementById("train-distance").textContent = `Distance: ${dist} km (~${Math.round(dist / 80)} hrs)`;

  document.getElementById("car-cost").textContent = `Cost: ₹${Math.round(dist * 6)}`;
  document.getElementById("bus-cost").textContent = `Cost: ₹${Math.round(dist * 2.5)}`;
  document.getElementById("train-cost").textContent = `Cost: ₹${Math.round(dist * 1.8)}`;
}

function updateWeather(destName) {
  weatherText.textContent = `Weather in ${destName}: Check local news or apps.`;
}

function updateMap(destName) {
  const q = encodeURIComponent(destName);
  map.src = `https://maps.google.com/maps?q=${q}&output=embed`;
}

function updateAll() {
  const selected = destinationDropdown.value;
  const destination = destinations[selected];
  updateCards(destination);
  updateWeather(destination.name);
  updateMap(destination.name);
}

navigator.geolocation.getCurrentPosition(async (position) => {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  userCoords = { lat, lon };

  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
  const data = await res.json();
  const place = data.address.city || data.address.town || data.address.state || "your area";
  locationText.textContent = `You are in: ${place}`;

  updateAll();
}, () => {
  locationText.textContent = "Unable to get your location.";
});

// Dropdown change
destinationDropdown.addEventListener("change", updateAll);

// Network Info
if ('connection' in navigator) {
  const conn = navigator.connection;
  document.getElementById("network-status").textContent =
    `Network: ${conn.effectiveType.toUpperCase()}, Speed: ${conn.downlink} Mbps`;
}

// Animate cards
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});
document.querySelectorAll(".observer").forEach(el => observer.observe(el));
