/* =========================================================
   THE GROOT OOTY — Gallery JS (Masonry, Category Filters, Lightbox)
   Integrated with centralized GrootStore & Local Asset Fallbacks
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initGalleryFilters();
  initLightbox();

  if (window.GrootStore) {
    window.GrootStore.subscribe(() => {
      initGalleryFilters();
    });
  }
});

let currentIndex = 0;
let currentList = [];

function getFallback(url) {
  if (!url) return '';
  const filename = url.split('/').pop().split('?')[0];
  if (url.startsWith('http')) {
    return `assets/images/${filename}`;
  } else {
    return `https://jritiortuorrpcfkoupf.supabase.co/storage/v1/object/public/gallery/${filename}`;
  }
}

function getGalleryDataset() {
  if (typeof window !== 'undefined' && window.GrootStore) {
    const items = window.GrootStore.getGallery(false);
    if (items && items.length > 0) {
      return items.map(item => ({
        src: item.url,
        alt: item.title,
        category: item.category || 'property',
        assignedRoom: item.assignedRoom || 'property',
        fallback: getFallback(item.url)
      }));
    }
  }

  return [
    { src: 'assets/images/1000032834_professional_4k.webp', fallback: 'https://jritiortuorrpcfkoupf.supabase.co/storage/v1/object/public/gallery/1000032834_professional_4k.webp', alt: 'Property exterior and garden path at The Groot Ooty', category: 'property' },
    { src: 'assets/images/1000032835_professional_4k.webp', fallback: 'https://jritiortuorrpcfkoupf.supabase.co/storage/v1/object/public/gallery/1000032835_professional_4k.webp', alt: 'Misty Nilgiri mountain landscape', category: 'nature' },
    { src: 'assets/images/1000032841_professional_4k.webp', fallback: 'https://jritiortuorrpcfkoupf.supabase.co/storage/v1/object/public/experience-images/1000032841_professional_4k.webp', alt: 'Property illuminated at night', category: 'campfire' },
    { src: 'assets/images/1000032838_professional_4k.webp', fallback: 'https://jritiortuorrpcfkoupf.supabase.co/storage/v1/object/public/room-images/1000032838_professional_4k.webp', alt: 'A-frame wooden cabin exterior and interior', category: 'rooms', assignedRoom: 'aframe' },
    { src: 'assets/images/1000032839_professional_4k.webp', fallback: 'https://jritiortuorrpcfkoupf.supabase.co/storage/v1/object/public/room-images/1000032839_professional_4k.webp', alt: 'Glass house panoramic forest view bedroom', category: 'rooms', assignedRoom: 'glasshouse' },
    { src: 'assets/images/1000032836_professional_4k.webp', fallback: 'https://jritiortuorrpcfkoupf.supabase.co/storage/v1/object/public/room-images/1000032836_professional_4k.webp', alt: 'Luxurious suit spacious bedroom interior', category: 'rooms', assignedRoom: 'suite' },
    { src: 'assets/images/1000032837_professional_4k.webp', fallback: 'https://jritiortuorrpcfkoupf.supabase.co/storage/v1/object/public/room-images/1000032837_professional_4k.webp', alt: 'Standard room cozy bedroom interior', category: 'rooms', assignedRoom: 'standard' },
    { src: 'assets/images/IMG-20260821-WA0036_4k.webp', fallback: 'https://jritiortuorrpcfkoupf.supabase.co/storage/v1/object/public/experience-images/IMG-20260821-WA0036_4k.webp', alt: 'Campfire evening under the Nilgiri stars', category: 'campfire' },
    { src: 'assets/images/IMG-20260821-WA0041_4k.webp', fallback: 'https://jritiortuorrpcfkoupf.supabase.co/storage/v1/object/public/experience-images/IMG-20260821-WA0041_4k.webp', alt: 'Authentic South Indian home-cooked meal spread', category: 'food' },
    { src: 'assets/images/1000032840_professional_4k.webp', fallback: 'https://jritiortuorrpcfkoupf.supabase.co/storage/v1/object/public/experience-images/1000032840_professional_4k.webp', alt: 'Lush Nilgiri tea foliage and greenery', category: 'nature' },
    { src: 'assets/images/IMG-20260821-WA0034_4k.webp', fallback: 'https://jritiortuorrpcfkoupf.supabase.co/storage/v1/object/public/gallery/IMG-20260821-WA0034_4k.webp', alt: 'Main stay entrance and courtyard', category: 'property' },
    { src: 'assets/images/IMG-20260821-WA0037_4k.webp', fallback: 'https://jritiortuorrpcfkoupf.supabase.co/storage/v1/object/public/gallery/IMG-20260821-WA0037_4k.webp', alt: 'A-frame Timber Architecture Detail', category: 'rooms', assignedRoom: 'aframe' },
    { src: 'assets/images/gallery-new-img-1_4k.webp', fallback: 'https://jritiortuorrpcfkoupf.supabase.co/storage/v1/object/public/room-images/gallery-new-img-1_4k.webp', alt: 'Boutique room detail and interior finish', category: 'rooms', assignedRoom: 'suite' },
    { src: 'assets/images/gallery-new-img-2_4k.webp', fallback: 'https://jritiortuorrpcfkoupf.supabase.co/storage/v1/object/public/room-images/gallery-new-img-2_4k.webp', alt: 'Glass house twilight forest view', category: 'rooms', assignedRoom: 'glasshouse' },
    { src: 'assets/images/gallery-new-img-3_4k.webp', fallback: 'https://jritiortuorrpcfkoupf.supabase.co/storage/v1/object/public/room-images/gallery-new-img-3_4k.webp', alt: 'Comfortable bedroom furnishings', category: 'rooms', assignedRoom: 'standard' },
    { src: 'assets/images/gallery-new-img-7_4k.webp', fallback: 'https://jritiortuorrpcfkoupf.supabase.co/storage/v1/object/public/experience-images/gallery-new-img-7_4k.webp', alt: 'Outdoor garden campfire setup', category: 'campfire' }
  ];
}

/* ---------------------------------------------------------
   FILTERS
   --------------------------------------------------------- */

function initGalleryFilters() {
  const masonry = document.getElementById('gallery-masonry');
  if (!masonry) return;

  const dataset = getGalleryDataset();
  const activeBtn = document.querySelector('.gallery-filter-btn.active');
  const activeCategory = activeBtn ? activeBtn.dataset.category : 'all';

  currentList = activeCategory === 'all'
    ? [...dataset]
    : dataset.filter(item => item.category === activeCategory || item.assignedRoom === activeCategory);

  renderGallery(currentList);

  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  filterBtns.forEach(btn => {
    btn.onclick = () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.category;
      const allImages = getGalleryDataset();
      currentList = cat === 'all'
        ? [...allImages]
        : allImages.filter(item => item.category === cat || item.assignedRoom === cat);

      renderGallery(currentList);
    };
  });
}

function renderGallery(images) {
  const masonry = document.getElementById('gallery-masonry');
  if (!masonry) return;

  masonry.innerHTML = '';

  if (!images || images.length === 0) {
    masonry.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">No photos available in this category.</p>';
    return;
  }

  images.forEach((img, i) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', `View photo: ${img.alt}`);

    const imgTag = document.createElement('img');
    
    // Attach onerror handler BEFORE setting src
    if (img.fallback && img.fallback !== img.src) {
      imgTag.onerror = function() {
        this.onerror = null;
        this.src = img.fallback;
      };
    } else {
      imgTag.onerror = function() {
        const filename = (img.src || '').split('/').pop().split('?')[0];
        if (filename && !this.src.includes('assets/images/')) {
          this.onerror = null;
          this.src = `assets/images/${filename}`;
        }
      };
    }

    imgTag.onload = function() {
      this.classList.add('loaded');
    };

    imgTag.src = img.src;
    imgTag.alt = img.alt || 'The Groot Ooty Photo';
    imgTag.loading = 'eager';
    imgTag.decoding = 'async';
    if (imgTag.complete) {
      imgTag.classList.add('loaded');
    }

    const overlay = document.createElement('div');
    overlay.className = 'gallery-item-overlay';
    overlay.innerHTML = `<span class="gallery-item-title">${img.alt || 'View Photo'}</span>`;

    item.appendChild(imgTag);
    item.appendChild(overlay);

    item.addEventListener('click', () => openLightbox(i));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(i);
      }
    });

    masonry.appendChild(item);
  });
}

/* ---------------------------------------------------------
   LIGHTBOX
   --------------------------------------------------------- */

function initLightbox() {
  let lightbox = document.getElementById('gallery-lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'gallery-lightbox';
    lightbox.className = 'lightbox-modal';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Photo preview lightbox');
    lightbox.innerHTML = `
      <div class="lightbox-overlay"></div>
      <div class="lightbox-content">
        <button class="lightbox-close" id="lightbox-close-btn" aria-label="Close lightbox">&times;</button>
        <button class="lightbox-nav prev" id="lightbox-prev-btn" aria-label="Previous image">&larr;</button>
        <div class="lightbox-img-wrap">
          <img id="lightbox-main-img" src="" alt="" />
          <div class="lightbox-caption" id="lightbox-caption"></div>
        </div>
        <button class="lightbox-nav next" id="lightbox-next-btn" aria-label="Next image">&rarr;</button>
      </div>
    `;
    document.body.appendChild(lightbox);

    document.getElementById('lightbox-close-btn').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);
    document.getElementById('lightbox-prev-btn').addEventListener('click', prevLightboxImage);
    document.getElementById('lightbox-next-btn').addEventListener('click', nextLightboxImage);

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevLightboxImage();
      if (e.key === 'ArrowRight') nextLightboxImage();
    });

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
      }
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      if (e.changedTouches && e.changedTouches.length > 0) {
        touchEndX = e.changedTouches[0].clientX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 40) {
          if (diff < 0) {
            nextLightboxImage();
          } else {
            prevLightboxImage();
          }
        }
      }
    }, { passive: true });
  }
}

function openLightbox(index) {
  currentIndex = index;
  const lightbox = document.getElementById('gallery-lightbox');
  const imgEl = document.getElementById('lightbox-main-img');
  const capEl = document.getElementById('lightbox-caption');

  if (!lightbox || !imgEl || !currentList[index]) return;

  const item = currentList[index];
  
  if (item.fallback && item.fallback !== item.src) {
    imgEl.onerror = function() {
      this.onerror = null;
      this.src = item.fallback;
    };
  } else {
    imgEl.onerror = function() {
      const filename = (item.src || '').split('/').pop().split('?')[0];
      if (filename && !this.src.includes('assets/images/')) {
        this.onerror = null;
        this.src = `assets/images/${filename}`;
      }
    };
  }

  imgEl.src = item.src;
  imgEl.alt = item.alt;
  capEl.textContent = item.alt;

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('gallery-lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function nextLightboxImage() {
  if (currentList.length === 0) return;
  currentIndex = (currentIndex + 1) % currentList.length;
  openLightbox(currentIndex);
}

function prevLightboxImage() {
  if (currentList.length === 0) return;
  currentIndex = (currentIndex - 1 + currentList.length) % currentList.length;
  openLightbox(currentIndex);
}

