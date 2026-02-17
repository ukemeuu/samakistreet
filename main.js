
// Mobile Menu Toggle
const menuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });
}

// Close mobile menu on link click
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    mobileMenu.classList.remove('active');
  });
});

// Sticky Header
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Gallery Filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    galleryItems.forEach(item => {
      if (filter === 'all' || item.getAttribute('data-category') === filter) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// Lightbox
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = `
  <div class="lightbox-content">
    <button class="lightbox-close">&times;</button>
    <img src="" alt="Lightbox Image">
    <button class="lightbox-nav lightbox-prev">&#10094;</button>
    <button class="lightbox-nav lightbox-next">&#10095;</button>
  </div>
`;
document.body.appendChild(lightbox);

const lightboxImg = lightbox.querySelector('img');
const closeBtn = lightbox.querySelector('.lightbox-close');
const prevBtn = lightbox.querySelector('.lightbox-prev');
const nextBtn = lightbox.querySelector('.lightbox-next');

let currentIndex = 0;
// Helper to get currently visible items
const getVisibleItems = () => Array.from(galleryItems).filter(item => item.style.display !== 'none');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const visibleItems = getVisibleItems();
    currentIndex = visibleItems.indexOf(item);
    openLightbox(visibleItems);
  });
});

function openLightbox(visibleItems) {
  lightbox.classList.add('active');
  updateLightboxImage(visibleItems);
}

function updateLightboxImage(visibleItems) {
  const item = visibleItems[currentIndex];
  if (item) {
    const img = item.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
  }
}

closeBtn.addEventListener('click', () => {
  lightbox.classList.remove('active');
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) lightbox.classList.remove('active');
});

prevBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const visibleItems = getVisibleItems();
  currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
  updateLightboxImage(visibleItems);
});

nextBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const visibleItems = getVisibleItems();
  currentIndex = (currentIndex + 1) % visibleItems.length;
  updateLightboxImage(visibleItems);
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('active')) {
    lightbox.classList.remove('active');
  }
});
