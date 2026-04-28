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
const coveragePointsList = document.getElementById("coverage-points-list");
const coverageToggleButtons = Array.from(document.querySelectorAll(".coverage-toggle-btn"));
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
  const coverageModes = {
    international: [
      { name: "Thailand", lat: 13.756331, lng: 100.501762 },
      { name: "Philippines", lat: 14.599512, lng: 120.984222 },
      { name: "Indonesia", lat: -6.208763, lng: 106.845599 },
      { name: "Singapore", lat: 1.29027, lng: 103.851959 },
      { name: "Brunei", lat: 4.903052, lng: 114.939821 },
      { name: "Malaysia", lat: 3.139003, lng: 101.686852 },
      { name: "Cambodia", lat: 11.556374, lng: 104.928209 },
      { name: "Myanmar", lat: 16.840939, lng: 96.173526 },
      { name: "China", lat: 22.319303, lng: 114.169361 },
      { name: "Taiwan", lat: 25.033964, lng: 121.564468 },
      { name: "Japan", lat: 35.676422, lng: 139.650027 },
      { name: "Korea", lat: 37.566536, lng: 126.977966 }
    ],
    domestic: [
      { name: "Ho Chi Minh City", lat: 10.776889, lng: 106.700806 },
      { name: "Hai Phong", lat: 20.844911, lng: 106.688084 },
      { name: "Da Nang", lat: 16.054407, lng: 108.202164 },
      { name: "Vung Tau", lat: 10.411379, lng: 107.136224 },
      { name: "Can Tho", lat: 10.045162, lng: 105.746857 }
    ]
  };

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

  const coverageLayer = L.layerGroup().addTo(seaMap);

  const setCoverageMode = (mode) => {
    const activeMode = mode in coverageModes ? mode : "international";
    const activePoints = coverageModes[activeMode];
    coverageLayer.clearLayers();

    if (coveragePointsList instanceof HTMLUListElement) {
      coveragePointsList.innerHTML = "";
      activePoints.forEach((point) => {
        const listItem = document.createElement("li");
        listItem.textContent = point.name;
        coveragePointsList.appendChild(listItem);
      });
    }

    const coverageBounds = [[vietnamHub.lat, vietnamHub.lng]];

    activePoints.forEach((point) => {
      L.marker([point.lat, point.lng]).addTo(coverageLayer).bindPopup(point.name);
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
      ).addTo(coverageLayer);
    });

    seaMap.fitBounds(coverageBounds, { padding: [24, 24] });

    coverageToggleButtons.forEach((button) => {
      const buttonMode = button.getAttribute("data-coverage-mode");
      const isActive = buttonMode === activeMode;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  };

  coverageToggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextMode = button.getAttribute("data-coverage-mode") || "international";
      setCoverageMode(nextMode);
    });
  });

  setCoverageMode("international");
}

if (contactForm instanceof HTMLFormElement) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      return;
    }

    const formData = new FormData(contactForm);
    const name = (formData.get("name") || "").toString().trim();
    const company = (formData.get("company") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();
    const selectedServices = formData.getAll("service").map((value) => value.toString().trim()).filter(Boolean);
    if (selectedServices.length === 0) {
      alert("Please select at least one service needed.");
      return;
    }
    const service = selectedServices.length > 0 ? selectedServices.join(", ") : "Unspecified service";
    const message = (formData.get("message") || "").toString().trim();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = true;
    }

    try {
      const response = await fetch("https://formsubmit.co/ajax/indochinamaritimeinquiries@gmail.com", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          Name: name,
          Company: company,
          Email: email,
          "Service Needed": service,
          Message: message || "(No additional message provided.)",
          _subject: `New Website Inquiry: ${service}`,
          _template: "table",
          _replyto: email,
          _cc: "info@indochina-maritime.com",
          _captcha: "false"
        })
      });

      if (!response.ok) {
        throw new Error("Unable to send inquiry");
      }

      window.location.href = "inquiry-confirmation.html";
    } catch (error) {
      alert("Sorry, your inquiry could not be sent right now. Please try again.");
    } finally {
      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = false;
      }
    }
  });
}

const servicePhotoPanels = Array.from(document.querySelectorAll(".service-photo-panel"));

if (servicePhotoPanels.length > 0) {
  const lightbox = document.createElement("div");
  lightbox.className = "gallery-lightbox";
  lightbox.setAttribute("aria-hidden", "true");
  lightbox.innerHTML = `
    <div class="gallery-lightbox-content" role="dialog" aria-modal="true" aria-label="Image gallery viewer">
      <button type="button" class="gallery-lightbox-close" aria-label="Close gallery">✕</button>
      <button type="button" class="gallery-lightbox-prev" aria-label="Previous image">‹</button>
      <img class="gallery-lightbox-image" alt="">
      <button type="button" class="gallery-lightbox-next" aria-label="Next image">›</button>
      <p class="gallery-lightbox-caption"></p>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector(".gallery-lightbox-image");
  const lightboxCaption = lightbox.querySelector(".gallery-lightbox-caption");
  const closeButton = lightbox.querySelector(".gallery-lightbox-close");
  const prevButton = lightbox.querySelector(".gallery-lightbox-prev");
  const nextButton = lightbox.querySelector(".gallery-lightbox-next");

  let currentSlides = [];
  let currentLightboxIndex = 0;

  const renderLightbox = () => {
    const active = currentSlides[currentLightboxIndex];
    if (!(active instanceof HTMLImageElement) || !(lightboxImage instanceof HTMLImageElement) || !(lightboxCaption instanceof HTMLParagraphElement)) {
      return;
    }
    lightboxImage.src = active.src;
    lightboxImage.alt = active.alt;
    lightboxCaption.textContent = active.alt || "";
  };

  const openLightbox = (slides, index) => {
    if (!(closeButton instanceof HTMLButtonElement)) {
      return;
    }
    currentSlides = slides;
    currentLightboxIndex = index;
    renderLightbox();
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeButton.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  const shiftLightbox = (delta) => {
    if (currentSlides.length === 0) {
      return;
    }
    currentLightboxIndex = (currentLightboxIndex + delta + currentSlides.length) % currentSlides.length;
    renderLightbox();
  };

  if (closeButton instanceof HTMLButtonElement) {
    closeButton.addEventListener("click", closeLightbox);
  }
  if (prevButton instanceof HTMLButtonElement) {
    prevButton.addEventListener("click", () => shiftLightbox(-1));
  }
  if (nextButton instanceof HTMLButtonElement) {
    nextButton.addEventListener("click", () => shiftLightbox(1));
  }
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("open")) {
      return;
    }
    if (event.key === "Escape") {
      closeLightbox();
    } else if (event.key === "ArrowRight") {
      shiftLightbox(1);
    } else if (event.key === "ArrowLeft") {
      shiftLightbox(-1);
    }
  });

  servicePhotoPanels.forEach((panel) => {
    const track = panel.querySelector(".service-photo-track");
    const dotsHost = panel.querySelector(".service-photo-dots");
    if (!(track instanceof HTMLDivElement) || !(dotsHost instanceof HTMLDivElement)) {
      return;
    }

    const slides = Array.from(track.querySelectorAll(".service-photo-slide"));
    const images = slides
      .map((slide) => slide.querySelector("img"))
      .filter((image) => image instanceof HTMLImageElement);

    if (slides.length === 0) {
      return;
    }

    let activeIndex = 0;
    let intervalId;
    const autoInterval = Number(panel.getAttribute("data-auto-interval")) || 5000;
    const dots = slides.map((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "service-photo-dot";
      dot.setAttribute("aria-label", `Show image ${index + 1}`);
      dotsHost.appendChild(dot);
      return dot;
    });

    const setActiveSlide = (index) => {
      activeIndex = index;
      track.style.transform = `translateX(-${activeIndex * 100}%)`;
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === activeIndex);
      });
    };

    const shiftSlide = () => {
      const nextIndex = (activeIndex + 1) % slides.length;
      setActiveSlide(nextIndex);
    };

    const startAutoSlide = () => {
      if (slides.length < 2) {
        return;
      }
      intervalId = window.setInterval(shiftSlide, autoInterval);
    };

    const stopAutoSlide = () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        setActiveSlide(index);
      });
    });

    slides.forEach((slide, index) => {
      slide.addEventListener("click", () => {
        openLightbox(images, index);
      });
    });

    panel.addEventListener("mouseenter", stopAutoSlide);
    panel.addEventListener("mouseleave", startAutoSlide);

    setActiveSlide(0);
    startAutoSlide();
  });
}
