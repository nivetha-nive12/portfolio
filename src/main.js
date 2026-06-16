const menuToggle = document.querySelector("#menuToggle");
const navMenu = document.querySelector("#navMenu");
const navLinks = [...document.querySelectorAll(".nav-menu a[href^='#']")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

menuToggle?.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const setActiveNav = () => {
  const marker = window.scrollY + 120;
  let current = sections[0];

  sections.forEach((section) => {
    if (section.offsetTop <= marker) {
      current = section;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current?.id}`);
  });
};

setActiveNav();
window.addEventListener("load", setActiveNav);
window.addEventListener("scroll", setActiveNav, { passive: true });

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    projectCards.forEach((card) => {
      const show = filter === "all" || card.dataset.category === filter;
      card.style.display = show ? "" : "none";
      if (show) {
        card.classList.remove("visible");
        window.requestAnimationFrame(() => card.classList.add("visible"));
      }
    });
  });
});

const revealCards = document.querySelectorAll(".reveal-card");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.18 }
);

revealCards.forEach((card, index) => {
  card.style.transitionDelay = `${index * 70}ms`;
  revealObserver.observe(card);
});

document.querySelector("#copyEmail")?.addEventListener("click", async () => {
  const status = document.querySelector("#copyStatus");
  try {
    await navigator.clipboard.writeText("nive30410@gmail.com");
    status.textContent = "Email copied.";
  } catch {
    status.textContent = "Email: nive30410@gmail.com";
  }
});

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mjgdlndo";

document.querySelector("#contactForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const submitBtn = form.querySelector(".contact-submit");
  const status = document.querySelector("#formStatus");
  const originalText = submitBtn.textContent;

  try {
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    if (status) {
      status.textContent = "Sending your message...";
      status.dataset.state = "pending";
    }

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();

    data.set("_subject", name ? `Portfolio message from ${name}` : "Portfolio contact form message");
    if (email) {
      data.set("_replyto", email);
    }

    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      body: data,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Form submission failed with status ${response.status}`);
    }

    submitBtn.textContent = "Message Sent!";
    submitBtn.style.backgroundColor = "#10b981";
    if (status) {
      status.textContent = "Thanks! Your message was sent successfully.";
      status.dataset.state = "success";
    }
    form.reset();

    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      submitBtn.style.backgroundColor = "";
      if (status) {
        status.textContent = "";
        delete status.dataset.state;
      }
    }, 3000);
  } catch (error) {
    console.error("Form submission failed:", error);
    submitBtn.textContent = "Failed - Try Again";
    submitBtn.style.backgroundColor = "#ef4444";
    if (status) {
      status.textContent = "Something went wrong. Please try again in a moment.";
      status.dataset.state = "error";
    }

    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      submitBtn.style.backgroundColor = "";
      if (status) {
        delete status.dataset.state;
      }
    }, 3000);
  }
});

const cursorAura = document.querySelector("#cursorAura");
const cursorSpark = document.querySelector("#cursorSpark");
const cursorTrail = document.querySelector("#cursorTrail");

const initCustomCursor = () => {
  if (!cursorAura || !cursorSpark || !cursorTrail) {
    return;
  }

  const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!supportsFinePointer) {
    return;
  }

  document.body.classList.add("custom-cursor-enabled");

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let auraX = targetX;
  let auraY = targetY;
  let lastParticleTime = 0;

  const setVisible = (visible) => {
    cursorAura.classList.toggle("is-visible", visible);
    cursorSpark.classList.toggle("is-visible", visible);
  };

  const setHoverState = (hovering) => {
    cursorAura.classList.toggle("is-hovering", hovering);
    cursorSpark.classList.toggle("is-hovering", hovering);
  };

  const setPressedState = (pressed) => {
    cursorAura.classList.toggle("is-pressed", pressed);
    cursorSpark.classList.toggle("is-pressed", pressed);
  };

  const interactiveSelector = "a, button, input, textarea, select, label, [role='button']";

  const spawnParticle = (x, y, hovering) => {
    const particle = document.createElement("span");
    particle.className = "cursor-particle";
    const size = hovering ? 12 : 8 + Math.random() * 4;
    const driftX = (Math.random() - 0.5) * 40;
    const driftY = (Math.random() - 0.5) * 40;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.setProperty("--particle-x", `${x}px`);
    particle.style.setProperty("--particle-y", `${y}px`);
    particle.style.setProperty("--particle-dx", `${driftX}px`);
    particle.style.setProperty("--particle-dy", `${driftY}px`);
    cursorTrail.appendChild(particle);

    window.setTimeout(() => {
      particle.remove();
    }, 650);
  };

  const renderCursor = () => {
    auraX += (targetX - auraX) * 0.18;
    auraY += (targetY - auraY) * 0.18;

    cursorAura.style.setProperty("--cursor-x", `${auraX}px`);
    cursorAura.style.setProperty("--cursor-y", `${auraY}px`);
    cursorSpark.style.setProperty("--cursor-x", `${targetX}px`);
    cursorSpark.style.setProperty("--cursor-y", `${targetY}px`);

    window.requestAnimationFrame(renderCursor);
  };

  window.addEventListener("mousemove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    setVisible(true);
    const hovering = event.target instanceof Element && Boolean(event.target.closest(interactiveSelector));
    setHoverState(hovering);

    if (!prefersReducedMotion && event.timeStamp - lastParticleTime > 22) {
      spawnParticle(targetX, targetY, hovering);
      lastParticleTime = event.timeStamp;
    }
  });

  window.addEventListener("mouseout", (event) => {
    if (!event.relatedTarget) {
      setVisible(false);
      setPressedState(false);
      cursorTrail.replaceChildren();
    }
  });

  window.addEventListener("mousedown", () => setPressedState(true));
  window.addEventListener("mouseup", () => setPressedState(false));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      setVisible(false);
      setPressedState(false);
      cursorTrail.replaceChildren();
    }
  });

  renderCursor();
};

const certificateModal = document.querySelector("#certificateModal");
const certificateModalImage = document.querySelector("#certificateModalImage");
const certificateModalTitle = document.querySelector("#certificateModalTitle");
const certificateClose = document.querySelector("#certificateClose");

const closeCertificateModal = () => {
  certificateModal?.classList.remove("open");
  certificateModal?.setAttribute("aria-hidden", "true");
  if (certificateModalImage) {
    certificateModalImage.src = "";
  }
};

document.querySelectorAll(".certificate-view-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const src = button.dataset.certificate;
    const title = button.dataset.title || "Certificate Preview";

    certificateModalImage.src = src;
    certificateModalImage.alt = title;
    certificateModalTitle.textContent = title;
    certificateModal.classList.add("open");
    certificateModal.setAttribute("aria-hidden", "false");
  });
});

certificateClose?.addEventListener("click", closeCertificateModal);

certificateModal?.addEventListener("click", (event) => {
  if (event.target === certificateModal) {
    closeCertificateModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && certificateModal?.classList.contains("open")) {
    closeCertificateModal();
  }
});

initCustomCursor();
document.querySelector("#year").textContent = new Date().getFullYear();
