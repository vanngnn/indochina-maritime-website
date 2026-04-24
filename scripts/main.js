const menuToggle = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");
const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const seaMapElement = document.getElementById("sea-map");

if (seaMapElement && typeof L !== "undefined") {
  const seaMap = L.map("sea-map", {
    scrollWheelZoom: false
  }).setView([10.5, 112], 4);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(seaMap);

  const vietnamHub = { name: "Vietnam (Hub)", lat: 10.823099, lng: 106.629662 };
  const connectedPoints = [
    { name: "Singapore", lat: 1.29027, lng: 103.851959 },
    { name: "Thailand", lat: 13.756331, lng: 100.501762 },
    { name: "Philippines", lat: 14.599512, lng: 120.984222 },
    { name: "Malaysia", lat: 3.139003, lng: 101.686852 },
    { name: "Indonesia", lat: -6.208763, lng: 106.845599 }
  ];

  const vietnamHubIcon = L.icon({
    iconUrl: "assets/logo.svg",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });

  // Use company logo to represent Vietnam as the hub pin.
  L.marker([vietnamHub.lat, vietnamHub.lng], { icon: vietnamHubIcon })
    .addTo(seaMap)
    .bindPopup(vietnamHub.name);

  connectedPoints.forEach((point) => {
    L.marker([point.lat, point.lng]).addTo(seaMap).bindPopup(point.name);

    L.polyline(
      [
        [vietnamHub.lat, vietnamHub.lng],
        [point.lat, point.lng]
      ],
      {
        color: "#1f4d8f",
        weight: 2,
        opacity: 0.75,
        dashArray: "6, 5"
      }
    ).addTo(seaMap);
  });
}
