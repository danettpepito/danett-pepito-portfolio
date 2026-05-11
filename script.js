// MENU VIEW
const nav = document.querySelector("nav");

window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    nav.classList.add("show");
  } else {
    nav.classList.remove("show");
  }
});

// CURSOR - "Open Project"
const cursor = document.querySelector(".cursor-label");
const cards = document.querySelectorAll(".case-study");

const colors = [
  "green", // rust
  "orange", // teal
  "blue"  // purple
];

cards.forEach((card, index) => {
  card.addEventListener("mouseenter", () => {
    cursor.textContent = "Open Project";
    cursor.style.opacity = 1;
    cursor.style.background = colors[index];
  });

  card.addEventListener("mouseleave", () => {
    cursor.style.opacity = 0;
  });

  card.addEventListener("mousemove", (e) => {
    cursor.style.transform = `translate(${e.clientX + 12}px, ${e.clientY + 12}px)`;
  });
});



/* ============================================================
   sorta.js — scripts for sorta.html
============================================================ */

// ── READING PROGRESS BAR ──
window.addEventListener("scroll", () => {
    const bar = document.getElementById("readingBar");
  
    if (!bar) return;
  
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
  
    const progress = (scrollTop / docHeight) * 100;
  
    bar.style.width = progress + "%";
  });
  
  
  // ── NAVIGATION ──
  const mainNav = document.getElementById("mainNav");
  
  if (mainNav) {
    mainNav.classList.add("show");
  }
  
  
  // ── FADE UP ON SCROLL ──
  const fadeItems = document.querySelectorAll(".fade-up");
  
  if (fadeItems.length) {
  
    const fadeObserver = new IntersectionObserver((entries) => {
  
      entries.forEach((entry) => {
  
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          fadeObserver.unobserve(entry.target);
        }
  
      });
  
    }, {
      threshold: 0.12
    });
  
    fadeItems.forEach((item) => {
      fadeObserver.observe(item);
    });
  
  }

  // ── IMAGE DROPDOWN ──
document.querySelectorAll(".dropdown-trigger").forEach(trigger => {
  trigger.addEventListener("click", () => {
    trigger.closest(".image-dropdown").classList.toggle("open");
  });
});