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
  "blue",
  "#FF69B4",
  "green",
  "orange",
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

// ── HERO CANVAS STARS ──
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
    "255, 99, 132",   // hot pink
    "255, 140, 66",   // orange
    "255, 189, 89",   // warm gold
    "255, 218, 121",  // pale yellow
    "195, 119, 255",  // violet
  ];

  const WORDS = [
    "human-centred", "curious", "insight-driven", "empathetic",
    "strategic thinking"
  ];

  const wordLabels = WORDS.map((word, i) => ({
    word,
    opacity: 1,
    targetOpacity: 1,
    x: 0,
    y: 0,
    lastSeen: 0,
    color: COLOURS[i % COLOURS.length],
  }));

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
          wordIndex: Math.random() < 0.2 // Trigger label
            ? Math.floor(Math.random() * wordLabels.length)
            : null,
        });
      }
    }
  }

  function drawStar(x, y, size, color, alpha) {
    const s = size;
    const t = 0.18;
    ctx.beginPath();
    ctx.moveTo(x, y - s);
    ctx.bezierCurveTo(x + s * t, y - s * t, x + s * t, y - s * t, x + s, y);
    ctx.bezierCurveTo(x + s * t, y + s * t, x + s * t, y + s * t, x, y + s);
    ctx.bezierCurveTo(x - s * t, y + s * t, x - s * t, y + s * t, x - s, y);
    ctx.bezierCurveTo(x - s * t, y - s * t, x - s * t, y - s * t, x, y - s);
    ctx.closePath();
    ctx.fillStyle = `rgba(${color}, ${alpha})`;
    ctx.fill();
  }

  let frameCount = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const rects = getTextRects();
    frameCount++;

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

    wordLabels.forEach(w => { w.targetOpacity = 0; });

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
              const alpha = (1 - dist / CONNECT_DIST) * 0.45;
              ctx.beginPath();
              ctx.strokeStyle = `rgba(${d.color}, ${alpha})`;
              ctx.lineWidth = 1;
              ctx.moveTo(d.x, d.y);
              ctx.lineTo(d2.x, d2.y);
              ctx.stroke();

              const wordDot = d.wordIndex !== null ? d : (d2.wordIndex !== null ? d2 : null);
              if (wordDot) {
                const label = wordLabels[wordDot.wordIndex];
                label.x = (d.x + d2.x) / 2;
                label.y = (d.y + d2.y) / 2 - 12;
                label.targetOpacity = Math.min(alpha * 4, 1);
                label.color = wordDot.color;
              }
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

      function drawStar(x, y, size, color1, color2, alpha) {
        const s = size;
        const t = 0.18;
    
        ctx.beginPath();
        ctx.moveTo(x, y - s);
        ctx.bezierCurveTo(x + s * t, y - s * t, x + s * t, y - s * t, x + s, y);
        ctx.bezierCurveTo(x + s * t, y + s * t, x + s * t, y + s * t, x, y + s);
        ctx.bezierCurveTo(x - s * t, y + s * t, x - s * t, y + s * t, x - s, y);
        ctx.bezierCurveTo(x - s * t, y - s * t, x - s * t, y - s * t, x, y - s);
        ctx.closePath();
    
        const grad = ctx.createLinearGradient(x - s, y - s, x + s, y + s);
        grad.addColorStop(0, `rgba(${color1}, ${alpha})`);
        grad.addColorStop(1, `rgba(${color2}, ${alpha})`);
        ctx.fillStyle = grad;
        ctx.fill();
      }
      
      // pick a second colour that's different from the first
      const color2 = COLOURS[(COLOURS.indexOf(d.color) + 2) % COLOURS.length];

      drawStar(
        d.x, d.y,
        d.r * 1.8,
        nearMouse ? d.color : "136, 136, 132",
        nearMouse ? color2  : "180, 175, 168",
        nearMouse ? 0.75 : 0.1
      );
    });

    wordLabels.forEach(label => {
      label.opacity += (label.targetOpacity - label.opacity) * 0.08;

      if (label.opacity > 0.01) {
        ctx.save();
        ctx.globalAlpha = Math.min(label.opacity, 0.85);
        ctx.font = "600 11px 'LineSeed', sans-serif";
        ctx.fillStyle = `rgb(${label.color})`;
        ctx.letterSpacing = "0.08em";
        ctx.textAlign = "center";
        ctx.fillText(label.word.toUpperCase(), label.x, label.y);
        ctx.restore();
      }
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
const popWords  = document.querySelectorAll(".pop-word");
const typedEl   = document.getElementById("typed-text");
const cursorEl  = document.querySelector(".typed-cursor");

function typeIn() {
  if (!typedEl) { runDecode(); return; }
  const phrase = "Hey, I'm Danett";
  let i = 0;

  function tick() {
    if (i < phrase.length) {
      typedEl.textContent += phrase[i];
      i++;

      // start decode halfway through typing
      if (i === Math.floor(phrase.length / 8)) {
        setTimeout(runDecode, 100);
      }

      setTimeout(tick, 80 + Math.random() * 40);
    } else {
      setTimeout(() => {
        if (cursorEl) cursorEl.style.display = "none";
      }, 1000);
    }
  }
  tick();
}

function runDecode() {
  if (!decodeEl) { runPopWords(); return; }
  const finalWord = "user behaviours";
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
      setTimeout(runPopWords, 500);
    }
  }, 1000 / 36);
}

function runPopWords() {
  if (!popWords.length) { runDigitalSpaces(); return; }
  popWords.forEach((word, i) => {
    setTimeout(() => {
      word.classList.add("visible");
      if (i === popWords.length - 1) {
        setTimeout(runDigitalSpaces, 400);
      }
    }, i * 150);
  });
}

function runDigitalSpaces() {
  if (!digitalEl) return;

  // grab the text before we destroy it
  const text = digitalEl.textContent;
  const colours = [
    "#f97316","#facc15","#4ade80","#60a5fa",
    "#c084fc","#f472b6","#f97316","#facc15",
    "#4ade80","#60a5fa","#c084fc","#f472b6"
  ];

  // set min dimensions before clearing to prevent layout shift
  digitalEl.style.cssText = `
    display: inline;
    opacity: 1;
    min-width: ${digitalEl.offsetWidth}px;
  `;

  digitalEl.innerHTML = "";

  const spans = [];
  [...text].forEach(char => {
    const span = document.createElement("span");
    span.textContent = char;
    span.style.color = "rgba(34,34,32,0)";
    span.style.transition = "color 0.25s ease";
    // preserve spaces so they don't collapse
    if (char === " ") span.style.whiteSpace = "pre";
    digitalEl.appendChild(span);
    spans.push(span);
  });

  let current = 0;
  const delay = 55;

  function revealNext() {
    if (current >= spans.length) {
      setTimeout(() => {
        if (spans[spans.length - 1]) {
          spans[spans.length - 1].style.color = "#222220";
        }
      }, delay);
      return;
    }
    spans[current].style.color = colours[current % colours.length];
    if (current > 0) spans[current - 1].style.color = "#222220";
    current++;
    setTimeout(revealNext, delay);
  }

  setTimeout(revealNext, 200);
  // inside runDigitalSpaces(), after setTimeout(revealNext, 200):
setTimeout(() => {
  const cta = document.getElementById("heroScrollCta");
  if (cta) cta.classList.add("visible");
}, 200 + spans.length * 55 + 600); // waits for the letter-by-letter reveal to finish

setTimeout(() => {
  const cta = document.getElementById("heroScrollCta");
  if (cta) cta.classList.add("visible");
  const arrow = document.querySelector(".scroll-arrow-hero");
  if (arrow) arrow.classList.add("visible");
}, 200 + spans.length * 55 + 600);

}

setTimeout(typeIn, 600);



// kick off after short delay
setTimeout(runDecode, 600);

function togglePersona() {
  const dropdown = document.querySelector(".persona-dropdown");
  dropdown.classList.toggle("open");
}

// ── FLOATING NAV — active section highlight ──
const csNavLinks = document.querySelectorAll(".cs-floating-nav a");

if (csNavLinks.length) {
  const sections = document.querySelectorAll(
    "#discover, #define, #clarify, #conceptualise, #outcome"
  );
  
  window.addEventListener("scroll", () => {
    let current = "";
  
    sections.forEach(section => {
      const top = section.offsetTop - 200;
  
      if (window.scrollY >= top) {
        current = section.id;
      }
    });
  
    document
      .querySelectorAll(".cs-floating-nav a")
      .forEach(link => {
        link.classList.remove("active");
  
        if (link.getAttribute("href") === `#${current}`) {
          link.classList.add("active");
        }
      });
  });

  sections.forEach(section => sectionObserver.observe(section));
}

window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    nav.classList.add("show");
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("show");
    nav.classList.remove("scrolled");
  }
});

// BRUSH

function initRevealCanvas(el) {
  const canvas = document.createElement('canvas');
  canvas.classList.add('reveal-canvas');
  el.insertBefore(canvas, el.firstChild);
  const ctx = canvas.getContext('2d');

  let revealed = [];
  let animating = false;
  let lastX = 0, lastY = 0;
  let lastMoveTime = 0;
  let rafPending = false;

  // persistent offscreen mask — reuse instead of recreating
  const mask = document.createElement('canvas');
  const mctx = mask.getContext('2d');

  function resize() {
    canvas.width  = el.offsetWidth;
    canvas.height = el.offsetHeight;
    mask.width    = el.offsetWidth;
    mask.height   = el.offsetHeight;
    render();
  }

  function render() {
    rafPending = false;
    const w = canvas.width, h = canvas.height;

    mctx.clearRect(0, 0, w, h);
    revealed.forEach(p => {
      mctx.save();
      mctx.translate(p.x, p.y);
      mctx.rotate(p.angle || 0);
      mctx.scale(1 + p.stretch, 1);
      mctx.rotate(-(p.angle || 0));
      const grd = mctx.createRadialGradient(0, 0, 0, 0, 0, p.r);
      grd.addColorStop(0,    `rgba(0,0,0,${p.opacity * 0.55})`);
      grd.addColorStop(0.35, `rgba(0,0,0,${p.opacity * 0.3})`);
      grd.addColorStop(0.7,  `rgba(0,0,0,${p.opacity * 0.1})`);
      grd.addColorStop(1,    'rgba(0,0,0,0)');
      mctx.fillStyle = grd;
      mctx.beginPath();
      mctx.arc(0, 0, p.r, 0, Math.PI * 2);
      mctx.fill();
      mctx.restore();
    });

    ctx.clearRect(0, 0, w, h);
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0,   '#ffe6a7');
    grad.addColorStop(0.4, '#ffc8d8');
    grad.addColorStop(0.7, '#ffabc4');
    grad.addColorStop(1,   '#ffd89c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(mask, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
  }

  function scheduleRender() {
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(render);
    }
  }

  function fadeLoop() {
    if (!animating) return;
    revealed = revealed
      .map(p => ({ ...p, r: p.r * 1.012, opacity: p.opacity * 0.94, stretch: p.stretch * 0.95 }))
      .filter(p => p.opacity > 0.015);
    scheduleRender();
    if (revealed.length > 0) {
      requestAnimationFrame(fadeLoop);
    } else {
      animating = false;
    }
  }

  el.addEventListener('mousemove', e => {
    const now = Date.now();
    if (now - lastMoveTime < 16) return;
    lastMoveTime = now;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const velX = x - lastX;
    const velY = y - lastY;
    lastX = x; lastY = y;

    const speed  = Math.sqrt(velX * velX + velY * velY);
    const angle   = Math.atan2(velY, velX);
    const stretch = Math.min(speed * 0.08, 1);

    for (let i = 0; i < 3; i++) {
      revealed.push({
        x: x + (Math.random() - 0.5) * 30,
        y: y + (Math.random() - 0.5) * 30,
        r: 120 + Math.random() * 60,
        opacity: 0.7 + Math.random() * 0.3,
        angle,
        stretch,
      });
    }

    if (revealed.length > 80) revealed.splice(0, revealed.length - 80);
    animating = false;
    scheduleRender();
  });

  el.addEventListener('mouseleave', () => {
    animating = true;
    fadeLoop();
  });

  new ResizeObserver(resize).observe(el);
  resize();
}

document.querySelectorAll('nav, footer').forEach(initRevealCanvas);

// ── INSTINCT ROW COLOURS ──
document.querySelectorAll('.ab-instinct-row').forEach(row => {
  const color = row.dataset.color;
  row.addEventListener('mouseenter', () => {
    row.style.setProperty('--row-color', color);
  });
});