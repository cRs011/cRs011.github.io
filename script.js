/**
 * cRs011 Portfolio — Multi-Theme Engine & High Performance Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeEngine();
  initTypewriter();
  initProjectFilters();
  initProjectMediaTouch();
  initCopyEmail();
  initMobileDrawer();
  initLightCanvas();
  initSmartMediaCulling();
  initAppleScrollAndMetrics();
  initCardSpotlights();
  initAppleTimelineScroll();
  initLiveTelemetry();
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
   1. Ultra-Lightweight Canvas (18 particles, auto-pauses during scroll for zero lag)
   ========================================================================= */
function initLightCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  let width, height;
  let particles = [];
  let isScrolling = false;
  let scrollTimeout;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  window.addEventListener('scroll', () => {
    isScrolling = true;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => { isScrolling = false; }, 120);
  }, { passive: true });

  let isTabVisible = !document.hidden;
  document.addEventListener('visibilitychange', () => {
    isTabVisible = !document.hidden;
  }, { passive: true });

  const count = window.innerWidth < 768 ? 8 : 18;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r: Math.random() * 1.2 + 0.8
    });
  }

  let lastTime = performance.now();

  function frame(currentTime) {
    if (!currentTime) currentTime = performance.now();
    const dt = Math.min((currentTime - lastTime) / 16.666, 2.0);
    lastTime = currentTime;

    if (!isScrolling && isTabVisible) {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(96, 165, 250, 0.25)';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          let p2 = particles[j];
          let dx = p.x - p2.x;
          let dy = p.y - p2.y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
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
    "Autonomous Agent Bridges.",
    "Python ETL & Cloud APIs.",
    "Unix Daemons & Atomic Locks.",
    "Tactical Combat & Enemy AI."
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
      let visibleCount = 0;
      projectEntries.forEach(entry => {
        if (filter === 'all' || entry.dataset.category === filter) {
          entry.style.display = 'flex';
          entry.classList.remove('revealed');
          setTimeout(() => {
            entry.classList.add('revealed');
          }, visibleCount * 60 + 20);
          visibleCount++;
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
  const label = document.getElementById('email-label');
  const email = "lacatuscristian8@gmail.com";

  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
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
    if (label) {
      const originalText = label.textContent;
      label.textContent = "✓ Copied to clipboard!";
      label.style.color = "#38bdf8";
      setTimeout(() => {
        label.textContent = originalText;
        label.style.color = "";
      }, 2200);
    }
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

  function closeDrawer() {
    drawer.classList.remove('open');
    toggle.classList.remove('open');
    document.body.style.overflow = '';
    toggle.setAttribute('aria-expanded', 'false');
  }

  function openDrawer() {
    drawer.classList.add('open');
    toggle.classList.add('open');
    document.body.style.overflow = 'hidden';
    toggle.setAttribute('aria-expanded', 'true');
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  links.forEach(l => {
    l.addEventListener('click', () => {
      closeDrawer();
    });
  });

  drawer.addEventListener('click', (e) => {
    if (!e.target.closest('.mobile-drawer-inner')) {
      closeDrawer();
    }
  });
}

/* =========================================================================
   5.1 Project Media Mobile Touch Toggle (16:9 <-> 1:1 Square)
   ========================================================================= */
function initProjectMediaTouch() {
  const projectCards = document.querySelectorAll('.project-entry');
  if (!projectCards.length) return;

  // 1. Explicit Tap Toggle on the entire card
  projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Allow outbound link clicks (e.g. GitHub/Overview icon) to open normally
      if (e.target.closest('a')) return;

      const media = card.querySelector('.project-media');
      if (!media) return;

      e.stopPropagation();
      const isCurrentlyExpanded = media.classList.contains('is-expanded');
      
      if (isCurrentlyExpanded) {
        // User explicitly collapses the card back to default 16:9
        media.classList.remove('is-expanded');
        media.dataset.userCollapsed = "true";
      } else {
        // User explicitly expands the card to 1:1 Square
        document.querySelectorAll('.project-media').forEach(m => {
          m.classList.remove('is-expanded');
        });
        media.classList.add('is-expanded');
        media.dataset.userCollapsed = "false";
      }
    });
  });

  // Tap anywhere outside collapses any open cards
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.project-entry')) {
      document.querySelectorAll('.project-media').forEach(m => {
        m.classList.remove('is-expanded');
      });
    }
  });

  // 2. Mobile Scroll Auto-Expansion (Respects manual user collapse)
  if ('IntersectionObserver' in window) {
    const scrollObserver = new IntersectionObserver((entries) => {
      if (window.innerWidth >= 860) return;
      entries.forEach(entry => {
        const media = entry.target.querySelector('.project-media');
        if (!media) return;
        
        if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
          // Only auto-expand if the user hasn't explicitly collapsed it while in view
          if (media.dataset.userCollapsed !== "true") {
            media.classList.add('is-expanded');
          }
        } else if (!entry.isIntersecting || entry.intersectionRatio < 0.20) {
          media.classList.remove('is-expanded');
          // Reset manual override once the card leaves the viewport completely
          media.dataset.userCollapsed = "false";
        }
      });
    }, {
      threshold: [0.20, 0.55, 0.85],
      rootMargin: '-10% 0px -10% 0px'
    });

    projectCards.forEach(card => {
      scrollObserver.observe(card);
    });
  }
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
   7. Apple-Inspired Card Spotlight Mouse-Tracking (RAF Throttled)
   ========================================================================= */
function initCardSpotlights() {
  const cards = document.querySelectorAll('.project-card, .metric-box, .skill-card, .bento-item, .contact-card, .about-card, .timeline-card');
  let ticking = false;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  });
}

/* =========================================================================
   8. Apple Timeline Interactive Laser Scroll Animation (RAF Throttled)
   ========================================================================= */
function initAppleTimelineScroll() {
  const tree = document.querySelector('.timeline-tree');
  const rows = document.querySelectorAll('.timeline-row');
  const stackCards = document.querySelectorAll('.stack-grid .box-card');

  if (!tree) return;

  let progressBar = tree.querySelector('.timeline-progress-line');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'timeline-progress-line';
    tree.appendChild(progressBar);
  }

  let scrollTicking = false;

  function updateTimeline() {
    const rect = tree.getBoundingClientRect();
    const windowH = window.innerHeight;
    const scrollPoint = windowH * 0.78;
    const progress = Math.min(Math.max((scrollPoint - rect.top) / rect.height, 0), 1);

    if (progressBar) {
      progressBar.style.height = `${progress * 100}%`;
    }

    rows.forEach((row) => {
      const rowRect = row.getBoundingClientRect();
      if (rowRect.top < windowH * 0.85) {
        row.classList.add('active');
      }
    });

    stackCards.forEach((card, idx) => {
      const cardRect = card.getBoundingClientRect();
      if (cardRect.top < windowH * 0.88) {
        setTimeout(() => {
          card.classList.add('active');
        }, idx * 80);
      }
    });

    scrollTicking = false;
  }

  function onScroll() {
    if (!scrollTicking) {
      requestAnimationFrame(updateTimeline);
      scrollTicking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  setTimeout(updateTimeline, 100);
}

/* =========================================================================
   8. Smart Media & Video Occlusion Culling (Auto-pause off-screen videos)
   ========================================================================= */
function initSmartMediaCulling() {
  const videos = document.querySelectorAll('.project-media video');
  if (!videos.length || !('IntersectionObserver' in window)) return;

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        if (video.paused) {
          video.play().catch(() => {});
        }
      } else {
        if (!video.paused) {
          video.pause();
        }
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '120px 0px 120px 0px'
  });

  videos.forEach(v => videoObserver.observe(v));

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      videos.forEach(v => v.pause());
    } else {
      videos.forEach(v => {
        const rect = v.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          v.play().catch(() => {});
        }
      });
    }
  }, { passive: true });
}

/* =========================================================================
   9. Live Activity & Telemetry Controller
   ========================================================================= */
async function initLiveTelemetry() {
  const bar = document.getElementById('live-activity-bar');
  const link = document.getElementById('live-activity-link');
  const repoEl = document.getElementById('live-repo-name');
  const timeEl = document.getElementById('live-time-ago');

  if (!bar || !link || !repoEl || !timeEl) return;

  try {
    const res = await fetch('data/activity.json?v=' + Date.now());
    if (!res.ok) return;

    const data = await res.json();
    if (!data || !data.latest_activity) return;

    const act = data.latest_activity;

    if (act.repo) repoEl.textContent = act.repo;
    if (act.time_ago) timeEl.textContent = act.time_ago;
    if (act.repo_url) link.href = act.repo_url;

    // Smooth reveal
    bar.style.display = 'inline-flex';
    requestAnimationFrame(() => {
      bar.classList.add('visible');
    });
  } catch (e) {
    // Graceful silent fallback
  }
}
