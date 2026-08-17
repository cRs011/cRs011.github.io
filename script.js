/**
 * cRs011 — two small behaviours. Everything else is CSS and markup on purpose.
 */

document.addEventListener('DOMContentLoaded', () => {
  initCopyEmail();
  initLastCommit();
});

/* -------------------------------------------------------------------------
   Copy the email address to the clipboard, with a visible confirmation.
   ------------------------------------------------------------------------- */
function initCopyEmail() {
  const button = document.getElementById('copy-email');
  if (!button) return;

  const email = button.dataset.email;
  const original = button.textContent;
  let resetTimer = null;

  button.addEventListener('click', async () => {
    let copied = false;

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(email);
        copied = true;
      } catch (err) {
        copied = false;
      }
    }

    if (!copied) copied = copyViaTextarea(email);

    button.textContent = copied ? 'copied to clipboard' : email;
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => { button.textContent = original; }, 2000);
  });
}

function copyViaTextarea(text) {
  const field = document.createElement('textarea');
  field.value = text;
  field.setAttribute('readonly', '');
  field.style.position = 'fixed';
  field.style.left = '-9999px';
  document.body.appendChild(field);
  field.select();

  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch (err) {
    ok = false;
  }

  document.body.removeChild(field);
  return ok;
}

/* -------------------------------------------------------------------------
   Last public commit, from data/activity.json (refreshed nightly by Actions).

   The age is computed here rather than read from the file's `time_ago` field:
   that string is only true at the moment the sync writes it, so trusting it
   means the page claims "5 minutes ago" for a whole day.
   ------------------------------------------------------------------------- */
async function initLastCommit() {
  const bar = document.getElementById('last-commit');
  if (!bar) return;

  let data;
  try {
    const response = await fetch('data/activity.json', { cache: 'no-cache' });
    if (!response.ok) return;
    data = await response.json();
  } catch (err) {
    return;
  }

  const commit = data && data.latest_activity;
  if (!commit || !commit.repo) return;

  const age = formatAge(commit.timestamp);
  if (!age) return;

  setText('commit-repo', commit.repo);
  setText('commit-msg', commit.message || 'updated');
  setText('commit-age', age);

  if (typeof commit.repo_url === 'string' && commit.repo_url.startsWith('https://github.com/')) {
    bar.href = commit.repo_url;
  }

  bar.hidden = false;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function formatAge(isoTimestamp) {
  if (!isoTimestamp) return null;

  const then = new Date(isoTimestamp);
  if (isNaN(then)) return null;

  const seconds = Math.floor((Date.now() - then.getTime()) / 1000);
  if (seconds < 0) return null;
  if (seconds < 90) return 'just now';

  const units = [
    ['minute', 60],
    ['hour', 3600],
    ['day', 86400],
    ['month', 2592000],
    ['year', 31536000]
  ];

  let label = 'minute';
  let size = 60;
  for (const [unitLabel, unitSize] of units) {
    if (seconds < unitSize) break;
    label = unitLabel;
    size = unitSize;
  }

  const value = Math.floor(seconds / size);
  return `${value} ${label}${value === 1 ? '' : 's'} ago`;
}
