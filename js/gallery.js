/**
 * RSSDI-JHCON 2027 — DESTINATION GALLERY & LIGHTBOX
 * Completely data-driven gallery implementation with full accessibility,
 * touch swipe gesture support, and dynamic Google Maps navigation.
 */

(function () {
  'use strict';

  const galleryItems = [
    {
      id: 1,
      title: 'Jubilee Amusement Park',
      badge: 'Amusement Park',
      description: 'Located inside Jubilee Park, offering family-friendly rides, vibrant landscaped gardens, and entertainment.',
      thumbnail: 'assets/img/1.jpg',
      lightboxImages: [
        'assets/img/1.2.png'
      ],
      mapLink: 'https://maps.app.goo.gl/aSGaEvP7h2XXv9tr8'
    },
    {
      id: 2,
      title: 'Tata Steel',
      badge: 'City of Steel',
      description: 'The historic steel manufacturing plant founded by Jamsetji Tata in 1907, the industrial heartbeat of Jamshedpur.',
      thumbnail: 'assets/img/2.png',
      lightboxImages: [
        'assets/img/2.2.png'
      ],
      mapLink: 'https://maps.app.goo.gl/R8NgdG5PJA9r3G2h8'
    },
    {
      id: 3,
      title: 'Turtle Adventure Park',
      badge: 'Zoological Park',
      description: 'Turtle Adventure Park offers a vibrant, family-friendly experience featuring a giant turtle attraction, lush greenery, colorful surroundings, and a playful atmosphere perfect for memorable outdoor adventures.',
      thumbnail: 'assets/img/3.png',
      lightboxImages: [
        'assets/img/3.2.jpg'
      ],
      mapLink: 'https://maps.app.goo.gl/qa5kUwosXxcwSDjr6'
    },
    {
      id: 4,
      title: 'Tata Steel Zoological Park',
      badge: 'Nature & Safari',
      description: 'Expansive nature trails and peaceful watersides adjoining the zoo, ideal for nature lovers and birdwatching.',
      thumbnail: 'assets/img/4.jpeg',
      lightboxImages: [
        'assets/img/4.2.png'
      ],
      mapLink: 'https://maps.app.goo.gl/qa5kUwosXxcwSDjr6'
    },
    {
      id: 5,
      title: 'Sai Temple',
      badge: 'Spiritual Heritage',
      description: 'A peaceful and revered temple dedicated to Sri Shirdi Sai Baba, situated in the tranquil Circuit House area.',
      thumbnail: 'assets/img/5.png',
      lightboxImages: [
        'assets/img/5.3.png'
      ],
      mapLink: 'https://maps.app.goo.gl/dPn2z1KXyaVctwNy8'
    },
    {
      id: 6,
      title: 'Nicco Jubilee park and Splash Zone',
      badge: 'Water & Splash Zone',
      description: 'A popular recreational attraction with wave pools, thrilling water slides, and fun entertainment for families.',
      thumbnail: 'assets/img/6.png',
      lightboxImages: [
        'assets/img/6.2.png'
      ],
      mapLink: 'https://maps.app.goo.gl/qNn4zh35DVXHd71J8'
    },
    {
      id: 7,
      title: 'Russi Mody Center for Excellence',
      badge: 'Heritage & Culture',
      description: 'An architectural landmark preserving the archives, legacy, and industrial art collections of Tata Steel and Jamshedpur.',
      thumbnail: 'assets/img/7.png',
      lightboxImages: [
        'assets/img/7.2.png'
      ],
      mapLink: 'https://maps.app.goo.gl/auV3z9JoaENkjpjk9'
    },
    {
      id: 8,
      title: 'Dalma Wildlife Sanctuary',
      badge: 'Wildlife Sanctuary',
      description: 'Sprawling deciduous forest across the Dalma hills, famous for its native elephant habitat and breathtaking viewpoints.',
      thumbnail: 'assets/img/8.png',
      lightboxImages: [
        'assets/img/8.2.png'
      ],
      mapLink: 'https://maps.app.goo.gl/WPiT8BsQTvco4zFk9'
    }
  ];

  let currentIndex = 0;
  let lastActiveTrigger = null;

  const modal = document.getElementById('lightbox-modal');
  const imgEl = document.getElementById('lightbox-img');
  const titleEl = document.getElementById('lightbox-title');
  const descEl = document.getElementById('lightbox-desc');
  const counterEl = document.getElementById('lightbox-counter');
  const prevBtn = document.getElementById('lightbox-prev-btn');
  const nextBtn = document.getElementById('lightbox-next-btn');
  const closeBtn = document.getElementById('lightbox-close-btn');

  function renderGallery() {
    const grid = document.querySelector('.gallery-grid');
    if (!grid) return;

    grid.innerHTML = galleryItems.map((item, idx) => `
      <article class="gallery-card" tabindex="0" role="button" aria-label="${item.title}" data-index="${idx}">
        <div class="gallery-media-wrap">
          <img src="${item.thumbnail}" alt="${item.title}" width="260" height="162" loading="lazy" decoding="async" style="width: 100%; height: 100%; object-fit: cover;">
          <span class="gallery-badge">${item.badge}</span>
        </div>
        <div class="gallery-info">
          <h3 class="gallery-title">${item.title}</h3>
          <p class="gallery-desc">${item.description}</p>
        </div>
      </article>
    `).join('');

    const cards = grid.querySelectorAll('.gallery-card');
    cards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        openLightbox(idx, card);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(idx, card);
        }
      });
    });
  }

  function openLightbox(index, triggerElement = null) {
    if (!modal || index < 0 || index >= galleryItems.length) return;
    currentIndex = index;
    lastActiveTrigger = triggerElement;
    updateLightboxContent();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    modal.setAttribute('aria-hidden', 'false');
    closeBtn?.focus();
  }

  function closeLightbox() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    modal.setAttribute('aria-hidden', 'true');
    if (lastActiveTrigger && typeof lastActiveTrigger.focus === 'function') {
      lastActiveTrigger.focus();
    }
  }

  function updateLightboxContent() {
    const item = galleryItems[currentIndex];
    if (!item || !imgEl) return;

    // Use high-resolution lightbox image if available, otherwise thumbnail
    const lightboxSrc = (item.lightboxImages && item.lightboxImages.length > 0)
      ? item.lightboxImages[0]
      : item.thumbnail;

    imgEl.src = lightboxSrc;
    imgEl.alt = item.title;
    if (titleEl) titleEl.textContent = item.title;
    if (descEl) descEl.textContent = item.description;
    if (counterEl) counterEl.textContent = `${currentIndex + 1} / ${galleryItems.length}`;

    // Update or insert the "View on Google Maps" button
    const mapBtn = document.getElementById('lightbox-map-btn');
    if (mapBtn) {
      mapBtn.href = item.mapLink;
      mapBtn.setAttribute('aria-label', `View ${item.title} on Google Maps`);
    }
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    updateLightboxContent();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    updateLightboxContent();
  }

  // Touch Swipe Gesture Support for Mobile Devices
  let touchStartX = 0;
  let touchEndX = 0;

  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
  }

  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
  }

  function handleSwipeGesture() {
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) > 45) {
      if (swipeDistance < 0) {
        showNext(); // Swipe Left -> Next
      } else {
        showPrev(); // Swipe Right -> Prev
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderGallery();

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('lightbox-window')) {
          closeLightbox();
        }
      });

      // Attach touch gestures
      modal.addEventListener('touchstart', handleTouchStart, { passive: true });
      modal.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!modal || !modal.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    });
  });

  window.RSSDI_Gallery = {
    items: galleryItems,
    open: openLightbox,
    close: closeLightbox
  };
})();
