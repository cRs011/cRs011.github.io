/**
 * CRISTIAN LĂCĂTUȘ — PERSONAL WEBSITE & PORTFOLIO
 * Minimal, lightweight client script: 1-click clipboard copy & smooth video playback.
 */

document.addEventListener('DOMContentLoaded', () => {
  initCopyEmail();
  initVideoPlayback();
});

/* =========================================================================
   1. One-Click Copy Email
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
      label.textContent = "✓ Copied!";
      label.style.color = "#34d399";
      setTimeout(() => {
        label.textContent = originalText;
        label.style.color = "";
      }, 2000);
    }
  }
}

/* =========================================================================
   2. Video Autoplay & Visibility Handling
   ========================================================================= */
function initVideoPlayback() {
  const videos = document.querySelectorAll('.project-media-wrap video');
  if (!videos.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
          if (video.paused) video.play().catch(() => {});
        } else {
          if (!video.paused) video.pause();
        }
      });
    }, { threshold: 0.1 });

    videos.forEach(v => observer.observe(v));
  }

  document.addEventListener('visibilitychange', () => {
    videos.forEach(v => {
      if (document.hidden) {
        v.pause();
      } else {
        v.play().catch(() => {});
      }
    });
  });
}
