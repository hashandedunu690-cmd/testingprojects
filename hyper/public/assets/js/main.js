document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
  }

  // Optional: ping API health and log to console
  fetch((window.HYPER_API_BASE || 'http://localhost:4000') + '/api/health')
    .then(r => r.json())
    .then(data => console.log('HYPER API:', data))
    .catch(() => console.warn('HYPER API not reachable yet'));
});