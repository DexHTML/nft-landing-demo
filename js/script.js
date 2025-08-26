// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// IntersectionObserver reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Count-up stats
function countUp(el, duration = 1200) {
  const target = +el.dataset.target || 0;
  const suffix = el.dataset.suffix || '';
  const start = 0;
  const startTime = performance.now();

  function step(now) {
    const p = Math.min((now - startTime) / duration, 1);
    const val = Math.floor(start + (target - start) * p);
    el.textContent = formatNumber(val) + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function formatNumber(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return '' + n;
}

// Trigger counters when hero enters
const heroStats = document.querySelectorAll('.stat-value');
let counted = false;
const heroIo = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!counted && entry.isIntersecting) {
      heroStats.forEach(el => countUp(el));
      counted = true;
      heroIo.disconnect();
    }
  });
}, { threshold: 0.4 });

document.getElementById('hero') && heroIo.observe(document.getElementById('hero'));
