const packagesGrid = document.getElementById('packages-grid');
const yearSpan = document.getElementById('year');
const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');

yearSpan.textContent = new Date().getFullYear();

// Mobile nav toggle
document.querySelector('.menu-toggle').addEventListener('click', () => {
  const links = document.querySelector('.nav-links');
  const visible = getComputedStyle(links).display !== 'none';
  links.style.display = visible ? 'none' : 'flex';
  links.style.flexDirection = 'column';
  links.style.gap = '0.5rem';
});

async function fetchPackages() {
  const res = await fetch('/api/packages');
  const data = await res.json();
  return data.packages || [];
}

function createPackageCard(pkg) {
  const card = document.createElement('div');
  card.className = 'package-card';

  card.innerHTML = `
    <div class="package-media">
      <img src="${pkg.image}" alt="${pkg.title}" />
    </div>
    <div class="package-content">
      <div class="package-title">${pkg.title}</div>
      <div class="package-meta">${pkg.description}</div>
      <div class="package-meta">Duration: ${pkg.duration}</div>
      <div class="package-actions">
        <div class="price">${pkg.currency || 'USD'} $${pkg.price}</div>
        <button class="btn btn-primary" data-package-id="${pkg.id}" data-amount="${pkg.price}">Book</button>
      </div>
    </div>
  `;

  const bookBtn = card.querySelector('button');
  bookBtn.addEventListener('click', () => {
    window.startCheckout({
      packageId: pkg.id,
      amount: pkg.price,
      title: pkg.title
    });
  });

  return card;
}

async function renderPackages() {
  const packages = await fetchPackages();
  packagesGrid.innerHTML = '';
  packages.forEach((p) => packagesGrid.appendChild(createPackageCard(p)));
}

renderPackages();

// Contact form submission
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  contactStatus.textContent = 'Sending...';
  const formData = new FormData(contactForm);
  const payload = Object.fromEntries(formData.entries());
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      contactStatus.textContent = 'Thanks! We will get back to you shortly.';
      contactForm.reset();
    } else {
      contactStatus.textContent = data.error || 'Failed to send message.';
    }
  } catch (err) {
    contactStatus.textContent = 'Network error. Please try again later.';
  }
});

