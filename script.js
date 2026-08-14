/**
 * cRs011 Portfolio — High Performance Lightweight Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initProjectFilters();
  initCopyEmail();
  initMobileDrawer();
  initLightCanvas();
});

/* =========================================================================
   1. Ultra-Lightweight Canvas (30 particles max, locked 60/120fps)
   ========================================================================= */
function initLightCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const count = window.innerWidth < 768 ? 15 : 28;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.2 + 0.8
    });
  }

  function frame() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(96, 165, 250, 0.3)';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        let p2 = particles[j];
        let dx = p.x - p2.x;
        let dy = p.y - p2.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${0.12 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* =========================================================================
   2. Dynamic Typewriter
   ========================================================================= */
function initTypewriter() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const words = [
    "Automation & Multi-Agent Bridges.",
    "Python ETL Pipelines & Cloud APIs.",
    "Unix Daemons & Atomic File Locks.",
    "2D Tactical Game Engines & AI Systems."
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 65;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      el.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 30;
    } else {
      el.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 65;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typingSpeed = 1600;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 350;
    }

    setTimeout(type, typingSpeed);
  }
  type();
}

/* =========================================================================
   3. Project Filters
   ========================================================================= */
function initProjectFilters() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectEntries = document.querySelectorAll('.project-entry');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      projectEntries.forEach(entry => {
        if (filter === 'all' || entry.dataset.category === filter) {
          entry.style.display = 'flex';
        } else {
          entry.style.display = 'none';
        }
      });
    });
  });
}

/* =========================================================================
   4. One-Click Copy Email
   ========================================================================= */
function initCopyEmail() {
  const btn = document.getElementById('copy-email-btn');
  const tooltip = document.getElementById('email-tooltip');
  const email = "lacatuscristian8@gmail.com";

  if (!btn || !tooltip) return;

  btn.addEventListener('click', () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(email).then(showCopied, fallback);
    } else {
      fallback();
    }
  });

  function fallback() {
    const ta = document.createElement("textarea");
    ta.value = email;
    ta.style.position = "fixed";
    ta.style.left = "-999999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showCopied();
    } catch (e) {}
    document.body.removeChild(ta);
  }

  function showCopied() {
    tooltip.textContent = "Copiat!";
    tooltip.style.background = "#2563eb";
    setTimeout(() => {
      tooltip.textContent = "Copy Email";
      tooltip.style.background = "#0f172a";
    }, 2000);
  }
}

/* =========================================================================
   5. Mobile Drawer
   ========================================================================= */
function initMobileDrawer() {
  const toggle = document.getElementById('menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const links = document.querySelectorAll('.mobile-item');

  if (!toggle || !drawer) return;

  toggle.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.remove('open');
      document.body.style.overflow = '';
      toggle.setAttribute('aria-expanded', 'false');
    } else {
      drawer.classList.add('open');
      document.body.style.overflow = 'hidden';
      toggle.setAttribute('aria-expanded', 'true');
    }
  });

  links.forEach(l => {
    l.addEventListener('click', () => {
      drawer.classList.remove('open');
      document.body.style.overflow = '';
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}
