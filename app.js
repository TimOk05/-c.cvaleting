document.documentElement.classList.add('js');

const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu(returnFocus = false) {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  mobileNav.hidden = true;
  document.body.classList.remove('menu-open');
  if (returnFocus) menuToggle.focus();
}
menuToggle.addEventListener('click', () => {
  const opening = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(opening));
  menuToggle.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
  mobileNav.hidden = !opening;
  document.body.classList.toggle('menu-open', opening);
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileNav.hidden) closeMenu(true);
});
document.addEventListener('click', event => {
  if (!mobileNav.hidden && !event.target.closest('.site-header')) closeMenu();
});
window.matchMedia('(min-width: 801px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

if ('IntersectionObserver' in window) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('pending');
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(element => {
      element.classList.add('pending');
      revealObserver.observe(element);
    });
  }
  const mobileBooking = document.querySelector('.mobile-booking');
  let heroVisible = true;
  let contactVisible = false;
  const bookingObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.target.id === 'home') heroVisible = entry.isIntersecting;
      if (entry.target.id === 'enquire') contactVisible = entry.isIntersecting;
    });
    mobileBooking.hidden = heroVisible || contactVisible;
  });
  bookingObserver.observe(document.querySelector('#home'));
  bookingObserver.observe(document.querySelector('#enquire'));
}

const detailContent = {
  exterior: { image: 'assets/exterior.webp', alt: 'Close-up of alloy wheel cleaning — concept image', label: '01 / THE EXTERIOR', description: 'Road grime, rainy days, everyday miles. Give the outside a fresh start.' },
  interior: { image: 'assets/interior.webp', alt: 'Fresh black leather interior — concept image', label: '02 / THE INTERIOR', description: 'The school run. The daily commute. Make every journey feel a little fresher.' }
};
document.querySelectorAll('[data-detail]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-detail]').forEach(tab => {
    const selected = tab === button;
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-pressed', String(selected));
  });
  const detail = detailContent[button.dataset.detail];
  const image = document.querySelector('#detail-image');
  image.src = detail.image;
  image.alt = detail.alt;
  document.querySelector('#detail-image-label').textContent = detail.label;
  document.querySelector('#detail-description').textContent = detail.description;
}));

const form = document.querySelector('#enquiry-form');
form.hidden = false;
const result = document.querySelector('#enquiry-result');
const serviceSelect = document.querySelector('#service');
const preview = document.querySelector('#message-preview');
const copyStatus = document.querySelector('#copy-status');
function editEnquiry() {
  result.hidden = true;
  form.hidden = false;
}
document.querySelectorAll('[data-service]').forEach(button => button.addEventListener('click', () => {
  editEnquiry();
  serviceSelect.value = button.dataset.service;
  document.querySelector('#enquire').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  serviceSelect.focus({ preventScroll: true });
}));
for (const input of [form.elements.vehicle, form.elements.postcode]) {
  input.addEventListener('input', () => input.setCustomValidity(''));
}
form.addEventListener('submit', event => {
  event.preventDefault();
  for (const input of [form.elements.vehicle, form.elements.postcode]) {
    input.setCustomValidity(input.value.trim() ? '' : 'Please enter a few details.');
  }
  if (!form.reportValidity()) return;
  const vehicle = form.elements.vehicle.value.trim();
  const postcode = form.elements.postcode.value.trim().toUpperCase();
  const notes = form.elements.notes.value.trim();
  preview.value = `Hi Kade! I’d like to enquire about car cleaning.\n\nService: ${serviceSelect.value}\nCar: ${vehicle}\nLocation: ${postcode}${notes ? `\n\nA little more detail: ${notes}` : ''}\n\nCould you let me know what’s included, the price and your availability? Thanks!`;
  form.hidden = true;
  result.hidden = false;
  copyStatus.textContent = 'Nothing has been sent. Paste your message into a DM to @c.cvaleting.';
  result.focus({ preventScroll: true });
});
document.querySelector('#copy-message').addEventListener('click', async () => {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(preview.value);
    copyStatus.textContent = 'Copied! Open Instagram and paste your message into a DM to @c.cvaleting.';
  } catch {
    preview.focus();
    preview.select();
    preview.setSelectionRange(0, preview.value.length);
    copyStatus.textContent = 'Select and copy the message above, then paste it into your Instagram DM.';
  }
});
document.querySelector('#edit-enquiry').addEventListener('click', () => {
  editEnquiry();
  serviceSelect.focus();
});

const privacyDialog = document.querySelector('#privacy-dialog');
document.querySelector('[data-privacy]').addEventListener('click', () => privacyDialog.showModal());
privacyDialog.querySelector('.dialog-close').addEventListener('click', () => privacyDialog.close());
privacyDialog.addEventListener('click', event => {
  if (event.target !== privacyDialog) return;
  const bounds = privacyDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) privacyDialog.close();
});
