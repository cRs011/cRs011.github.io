/**
 * cRs011 Portfolio — Multi-Theme Engine & High Performance Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeEngine();
  initTypewriter();
  initProjectFilters();
  initBetterTanksGallery();
  initCopyEmail();
  initMobileDrawer();
  initLightCanvas();
  initAppleScrollAndMetrics();
  initCardSpotlights();
});

/* =========================================================================
   0. Dynamic Multi-Theme Engine (Executive / Minimalist / Bento)
   ========================================================================= */
function initThemeEngine() {
  const root = document.documentElement;
  const pills = document.querySelectorAll('.theme-pill');

  function setTheme(themeName) {
    root.setAttribute('data-theme', themeName);
    localStorage.setItem('crs_theme', themeName);

    // Update active pill state across desktop & mobile
    pills.forEach(p => {
      if (p.getAttribute('data-set-theme') === themeName) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    // Theme color meta tag update
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      if (themeName === 'minimalist') metaTheme.setAttribute('content', '#000000');
      else if (themeName === 'bento') metaTheme.setAttribute('content', '#07090e');
      else metaTheme.setAttribute('content', '#0a0d14');
    }
  }

  const savedTheme = localStorage.getItem('crs_theme') || 'executive';
  setTheme(savedTheme);

  pills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      const theme = pill.getAttribute('data-set-theme');
      if (theme) {
        setTheme(theme);
      }
    });
  });
}

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
   3.1 BetterTanks Interactive Gallery & Clip Reel
   ========================================================================= */
function initBetterTanksGallery() {
  const thumbs = document.querySelectorAll('.gallery-thumb');
  const mainImg = document.getElementById('bettertanks-main-img');
  const caption = document.getElementById('bettertanks-caption');
  const reelBtn = document.getElementById('bettertanks-reel-btn');
  const reelBar = document.getElementById('bettertanks-reel-bar');

  if (!mainImg || !thumbs.length) return;

  let currentIndex = 0;
  let isPlaying = true;
  let timer = null;

  function setSlide(index) {
    currentIndex = index % thumbs.length;
    thumbs.forEach((t, i) => {
      if (i === currentIndex) t.classList.add('active');
      else t.classList.remove('active');
    });

    const activeThumb = thumbs[currentIndex];
    const newSrc = activeThumb.getAttribute('data-src');
    const newCaption = activeThumb.getAttribute('data-caption');

    mainImg.style.opacity = '0.2';
    setTimeout(() => {
      mainImg.src = newSrc;
      if (caption && newCaption) caption.textContent = newCaption;
      mainImg.style.opacity = '1';
    }, 200);

    if (reelBar) {
      reelBar.style.transition = 'none';
      reelBar.style.width = '0%';
      setTimeout(() => {
        reelBar.style.transition = 'width 6.4s linear';
        reelBar.style.width = '100%';
      }, 50);
    }
  }

  function startReel() {
    isPlaying = true;
    if (reelBtn) reelBtn.classList.add('playing');
    setSlide(currentIndex);
    clearInterval(timer);
    timer = setInterval(() => {
      setSlide(currentIndex + 1);
    }, 6500);
  }

  function stopReel() {
    isPlaying = false;
    if (reelBtn) reelBtn.classList.remove('playing');
    clearInterval(timer);
    if (reelBar) {
      reelBar.style.transition = 'none';
      reelBar.style.width = '0%';
    }
  }

  // Start auto-play reel
  startReel();

  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', (e) => {
      e.preventDefault();
      stopReel();
      setSlide(i);
    });
  });

  if (reelBtn) {
    reelBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (isPlaying) stopReel();
      else startReel();
    });
  }
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

/* =========================================================================
   6. Apple-Inspired Scroll Reveal & Dynamic Metric Counters
   ========================================================================= */
function initAppleScrollAndMetrics() {
  const elementsToReveal = document.querySelectorAll(
    '.section-title-wrap, .project-entry, .project-card, .metric-box, .skill-card, .tree-node, .contact-card, .bento-item, .about-card'
  );

  elementsToReveal.forEach((el, index) => {
    el.classList.add('apple-reveal');
    const delayClass = `apple-delay-${(index % 4) + 1}`;
    el.classList.add(delayClass);
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.apple-reveal').forEach(el => observer.observe(el));

  // Dynamic Metric Number Counters
  const metricBoxes = document.querySelectorAll('.metric-box');
  let metricsAnimated = false;

  const metricsObserver = new IntersectionObserver((entries) => {
    if (entries.some(e => e.isIntersecting) && !metricsAnimated) {
      metricsAnimated = true;
      animateMetrics();
    }
  }, { threshold: 0.3 });

  const metricsStrip = document.querySelector('.metrics-strip');
  if (metricsStrip) metricsObserver.observe(metricsStrip);

  function animateMetrics() {
    const targets = [
      { id: 0, val: 87.4, decimals: 1, suffix: 'h' },
      { id: 1, val: 10, decimals: 0, suffix: '+' },
      { id: 2, val: 4, decimals: 0, suffix: '-State' },
      { id: 3, val: 2027, decimals: 0, suffix: '' }
    ];

    metricBoxes.forEach((box, i) => {
      const numEl = box.querySelector('.metric-num');
      if (!numEl || !targets[i]) return;
      const t = targets[i];
      const duration = 1400;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Apple ease-out curve
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = t.decimals > 0 
          ? (easeProgress * t.val).toFixed(t.decimals) 
          : Math.floor(easeProgress * t.val);

        numEl.innerHTML = `${currentVal}<span class="metric-sub">${t.suffix}</span>`;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          numEl.innerHTML = `${t.val}<span class="metric-sub">${t.suffix}</span>`;
        }
      }
      requestAnimationFrame(update);
    });
  }
}

/* =========================================================================
   7. Apple-Inspired Card Spotlight Mouse-Tracking
   ========================================================================= */
function initCardSpotlights() {
  const cards = document.querySelectorAll('.project-card, .metric-box, .skill-card, .bento-item, .contact-card, .about-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}
