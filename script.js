// MENU VIEW
const nav = document.querySelector("nav");

window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    nav.classList.add("show");
  } else {
    nav.classList.remove("show");
  }
});

// CASE STUDY Cursor View
const cursor = document.querySelector(".cursor-label");
const cards = document.querySelectorAll(".case-study");

cards.forEach(card => {
  card.addEventListener("mouseenter", () => {
    cursor.style.opacity = 1;
  });

  card.addEventListener("mouseleave", () => {
    cursor.style.opacity = 0;
  });

  card.addEventListener("mousemove", (e) => {
    const offsetX = 20; // distance from cursor (right)
    const offsetY = 10; // slight vertical lift

    cursor.style.left = (e.clientX + offsetX) + "px";
    cursor.style.top = (e.clientY + offsetY) + "px";
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