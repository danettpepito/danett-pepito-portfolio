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

// ── HERO CANVAS DOTS ──
const canvas = document.getElementById("heroCanvas");
if (canvas) {
  const ctx = canvas.getContext("2d");

  let mouse = { x: null, y: null };
  let dots = [];
  const DOT_COUNT = 80;
  const CONNECT_DIST = 140;
  const MOUSE_DIST = 160;

  const COLOURS = [
    "200,180",   // rust
    "100, 160, 100", // green
    "100, 130, 200", // blue
    "200, 160, 80",  // amber
    "180, 100, 180", // purple
  ];

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function spawnDots() {
    dots = [];
    for (let i = 0; i < DOT_COUNT; i++) {
      dots.push({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r:  Math.random() * 4 + 2.5,
        color: COLOURS[Math.floor(Math.random() * COLOURS.length)],
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dots.forEach(d => {
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0 || d.x > canvas.width)  d.vx *= -1;
      if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
    });

    dots.forEach((d, i) => {
      const nearMouse = mouse.x !== null &&
        Math.hypot(d.x - mouse.x, d.y - mouse.y) < MOUSE_DIST;

      // lines only when mouse is nearby
      if (mouse.x !== null) {

        // dot-to-dot lines only if both are near mouse
        for (let j = i + 1; j < dots.length; j++) {
          const d2 = dots[j];
          const nearMouse2 = Math.hypot(d2.x - mouse.x, d2.y - mouse.y) < MOUSE_DIST;

          if (nearMouse && nearMouse2) {
            const dist = Math.hypot(d.x - d2.x, d.y - d2.y);
            if (dist < CONNECT_DIST) {
              const alpha = (1 - dist / CONNECT_DIST) * 0.35;
              ctx.beginPath();
              ctx.strokeStyle = `rgba(${d.color}, ${alpha})`;
              ctx.lineWidth = 1;
              ctx.moveTo(d.x, d.y);
              ctx.lineTo(d2.x, d2.y);
              ctx.stroke();
            }
          }
        }

        // dot-to-mouse line
        if (nearMouse) {
          const distToMouse = Math.hypot(d.x - mouse.x, d.y - mouse.y);
          const alpha = (1 - distToMouse / MOUSE_DIST) * 0.5;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${d.color}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      // dots — colourful near mouse, grey otherwise
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = nearMouse
        ? `rgba(${d.color}, 0.75)`
        : `rgba(136, 136, 132, 0.18)`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener("resize", () => {
    resize();
    spawnDots();
  });

  resize();
  spawnDots();
  draw();
}

// ── DECODE SCRAMBLE ──
const decodeEl = document.getElementById("decode-word");

if (decodeEl) {
  const finalWord = "decode";
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const duration = 1.8;
  const fps = 30;
  const totalFrames = Math.round(duration * fps);

  let frame = 0;
  let interval;

  function scramble() {
    frame++;
    const progress = frame / totalFrames;

    // reveal letters left to right as progress increases
    const revealed = Math.floor(progress * finalWord.length);

    let display = "";
    for (let i = 0; i < finalWord.length; i++) {
      if (i < revealed) {
        display += finalWord[i];
      } else {
        display += chars[Math.floor(Math.random() * chars.length)];
      }
    }

    decodeEl.textContent = display;

    if (frame >= totalFrames) {
      clearInterval(interval);
      decodeEl.textContent = finalWord;
    }
  }

  // small delay so it fires after page paints
  setTimeout(() => {
    interval = setInterval(scramble, 1000 / fps);
  }, 400);
}

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

// ── TABLE OF CONTENTS ACTIVE STATE ──
const floatingNav = document.getElementById("floatingNav");
const stickyInfo = document.querySelector(".cs-left");

window.addEventListener("scroll", () => {
  const triggerPoint =
    stickyInfo.offsetTop + stickyInfo.offsetHeight;

  if (window.scrollY > triggerPoint - 200) {
    floatingNav.classList.add("show");
  } else {
    floatingNav.classList.remove("show");
  }
});