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

if (typeof lucide !== "undefined") {
  lucide.createIcons();
}

const seaMapElement = document.getElementById("sea-map");
const contactForm = document.getElementById("contact-form");

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

  const coverageBounds = [[vietnamHub.lat, vietnamHub.lng]];

  connectedPoints.forEach((point) => {
    L.marker([point.lat, point.lng]).addTo(seaMap).bindPopup(point.name);
    coverageBounds.push([point.lat, point.lng]);

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

  // Keep all country markers visible, including Malaysia and Indonesia.
  seaMap.fitBounds(coverageBounds, { padding: [24, 24] });
}

if (contactForm instanceof HTMLFormElement) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      return;
    }

    const formData = new FormData(contactForm);
    const name = (formData.get("name") || "").toString().trim();
    const company = (formData.get("company") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();
    const serviceSelect = contactForm.querySelector('select[name="service"]');
    const service =
      serviceSelect instanceof HTMLSelectElement
        ? serviceSelect.options[serviceSelect.selectedIndex].text
        : (formData.get("service") || "").toString().trim();
    const message = (formData.get("message") || "").toString().trim();

    const subject = `Website Inquiry - ${company || name || "New Contact"}`;
    const body = [
      `Name: ${name}`,
      `Company: ${company}`,
      `Email: ${email}`,
      `Service Needed: ${service}`,
      "",
      "Message:",
      message || "(No additional message provided.)"
    ].join("\n");

    window.location.href = `mailto:info@indochina-maritime.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
