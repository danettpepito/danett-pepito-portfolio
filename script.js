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
  "green",
  "orange",
  "#FF69B4"
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
  const PADDING = 24;

  const COLOURS = [
    "255, 105, 170",  // richer pink
    "255, 200, 90",   // warmer yellow
    "90, 170, 255",   // stronger sky blue
    "90, 210, 140",   // richer mint green
    "170, 110, 255",  // stronger lavender
  ];

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
      if (d.x < 0 || d.x > canvas.width)  d.vx *= -1;
      if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
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
        : `rgba(136, 136, 132, 0.05)`;
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

// ── READING PROGRESS BAR ──
window.addEventListener("scroll", () => {
  const bar = document.getElementById("readingBar");
  if (!bar) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.width = (scrollTop / docHeight) * 100 + "%";
});

// ── NAVIGATION (case study pages) ──
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
  }, { threshold: 0.12 });
  fadeItems.forEach((item) => fadeObserver.observe(item));
}

// ── IMAGE DROPDOWN ──
document.querySelectorAll(".dropdown-trigger").forEach(trigger => {
  trigger.addEventListener("click", () => {
    trigger.closest(".image-dropdown").classList.toggle("open");
  });
});

// ── FLOATING NAV (case study pages only) ──
const floatingNav = document.getElementById("floatingNav");
const stickyInfo = document.querySelector(".cs-left");

if (floatingNav && stickyInfo) {
  window.addEventListener("scroll", () => {
    const triggerPoint = stickyInfo.offsetTop + stickyInfo.offsetHeight;
    if (window.scrollY > triggerPoint - 200) {
      floatingNav.classList.add("show");
    } else {
      floatingNav.classList.remove("show");
    }
  });
}

// ── HERO SEQUENCE ──
const decodeEl  = document.getElementById("decode-word");
const digitalEl = document.getElementById("digital-spaces");

function runDecode() {
  if (!decodeEl) { runDigitalSpaces(); return; }
  const finalWord = "decode";
  const chars = "abdefklmnopqrstuvwxchijyz";
  const totalFrames = 50;
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
      setTimeout(runDigitalSpaces, 1000);
    }
  }, 1000 / 36);
}

function runDigitalSpaces() {
  if (!digitalEl) return;
  gsap.fromTo(digitalEl,
    { backgroundPosition: "0% 50%" },
    {
      backgroundPosition: "-150% 50%",
      duration: 8,
      ease: "power1.inOut",
    }
  );
}

// kick off after short delay
setTimeout(runDecode, 600);



