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
  "green", // green
  "orange", // orange
  "#FF69B4"  // pink
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
  const PADDING = 24; // clearance around text

  const COLOURS = [
    "156, 59, 26",
    "100, 160, 100",
    "100, 130, 200",
    "200, 160, 80",
    "180, 100, 180",
  ];

  // get bounding boxes of all text elements inside hero
  function getTextRects() {
    const hero = canvas.closest(".hero");
    if (!hero) return [];
    const els = hero.querySelectorAll("h1, span, a, p");
    const canvasRect = canvas.getBoundingClientRect();
    const rects = [];
    els.forEach(el => {
      const r = el.getBoundingClientRect();
      rects.push({
        left:   r.left   - canvasRect.left - PADDING,
        right:  r.right  - canvasRect.left + PADDING,
        top:    r.top    - canvasRect.top  - PADDING,
        bottom: r.bottom - canvasRect.top  + PADDING,
      });
    });
    return rects;
  }

  function insideAnyRect(x, y, rects) {
    return rects.some(r => x > r.left && x < r.right && y > r.top && y < r.bottom);
  }

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function spawnDots() {
    const rects = getTextRects();
    dots = [];
    let attempts = 0;
    while (dots.length < DOT_COUNT && attempts < DOT_COUNT * 20) {
      attempts++;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      if (!insideAnyRect(x, y, rects)) {
        dots.push({
          x, y,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r:  Math.random() * 4 + 2.5,
          color: COLOURS[Math.floor(Math.random() * COLOURS.length)],
        });
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const rects = getTextRects();

    dots.forEach(d => {
      d.x += d.vx;
      d.y += d.vy;

      // bounce off canvas edges
      if (d.x < 0 || d.x > canvas.width)  d.vx *= -1;
      if (d.y < 0 || d.y > canvas.height) d.vy *= -1;

      // if dot drifts into text area, reverse and nudge out
      if (insideAnyRect(d.x, d.y, rects)) {
        d.vx *= -1;
        d.vy *= -1;
        d.x += d.vx * 4;
        d.y += d.vy * 4;
      }
    });

    dots.forEach((d, i) => {
      const nearMouse = mouse.x !== null &&
        Math.hypot(d.x - mouse.x, d.y - mouse.y) < MOUSE_DIST;

      if (mouse.x !== null) {
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


// ── HERO SEQUENCE ──
const typedEl   = document.getElementById("typed-text");
const cursorEl  = document.querySelector(".typed-cursor");
const heroUsp   = document.getElementById("hero-usp");
const decodeEl  = document.getElementById("decode-word");
const digitalEl = document.getElementById("digital-spaces");

if (typedEl) {
  const phrase = "Hey, I'm Danett";
  let i = 0;

  function typeIn() {
    if (i < phrase.length) {
      typedEl.textContent += phrase[i];
      i++;
      setTimeout(typeIn, 55 + Math.random() * 40);
    } else {
      setTimeout(() => {
        cursorEl.style.display = "none";
        runDecode();
      }, 500);
    }
  }

  function runDecode() {
    if (!decodeEl) { runDigitalSpaces(); return; }
    const finalWord = "decode";
    const chars = "abcdefghijklmnopqrstuvwxyz";
    const totalFrames = 54;
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      const revealed = Math.floor((frame / totalFrames) * finalWord.length);
      let display = "";
      for (let c = 0; c < finalWord.length; c++) {
        display += c < revealed
          ? finalWord[c]
          : chars[Math.floor(Math.random() * chars.length)];
      }
      decodeEl.textContent = display;
      if (frame >= totalFrames) {
        clearInterval(interval);
        decodeEl.textContent = finalWord;
        setTimeout(runDigitalSpaces, 200);
      }
    }, 1000 / 30);
  }

  function runDigitalSpaces() {
    if (!digitalEl) return;
    const letters = digitalEl.querySelectorAll(".ds-letter");
    const colours = ["#9c3b1a","#4ade80","#60a5fa","#f97316","#c084fc","#facc15","#f472b6"];
    gsap.timeline()
      .to(letters, {
        color: (i) => colours[i % colours.length],
        scale: () => 1 + Math.random() * 0.6,
        rotation: () => (Math.random() - 0.5) * 25,
        y: () => (Math.random() - 0.5) * 14,
        duration: 0.5, stagger: 0.06, ease: "back.out(2)",
      })
      .to(letters, {
        scale: () => 1 + Math.random() * 0.3,
        rotation: () => (Math.random() - 0.5) * 12,
        color: (i) => colours[(i + 3) % colours.length],
        duration: 0.2, stagger: 0.02, ease: "sine.inOut",
      })
      .to(letters, {
        color: "#222220", scale: 1, rotation: 0, y: 0,
        duration: 0.3, stagger: 0.01, ease: "power3.out",
      });
  }

  setTimeout(typeIn, 300);
}