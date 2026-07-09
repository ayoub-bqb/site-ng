/**
 * ========================================================================
 * NEYSSA GOURMET - INTERACTIVE ENGINE
 * Vanilla JavaScript for premium user experience and dynamic features.
 * ========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Global Navigation & Scroll Progress Indicator ---
    const scrollProgress = document.getElementById('scroll-progress');
    const navbar = document.getElementById('navbar');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section');

    const updateScrollEffects = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Update Scroll Progress Bar
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = `${scrollPercent}%`;

        // Sticky Navbar Transition
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Nav Item on Scroll
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${currentSectionId}`) {
                    item.classList.add('active');
                }
            });
        }
    };

    window.addEventListener('scroll', updateScrollEffects);
    updateScrollEffects(); // Run once on startup


    // --- 2. Mobile Hamburger Navigation Menu ---
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    const toggleMobileMenu = () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('overflow-hidden'); // Disable background scrolling when open
    };

    const closeMobileMenu = () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('overflow-hidden');
    };

    navToggle.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking navigation links
    navItems.forEach(item => {
        item.addEventListener('click', closeMobileMenu);
    });

    // Close menu when clicking outside the menu area
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });


    // --- 3. Hero Carousel Slider Engine ---
    const heroSlides = document.querySelectorAll('.carousel-slide');
    const heroIndicators = document.querySelectorAll('.indicator');
    const heroPrevBtn = document.getElementById('hero-prev');
    const heroNextBtn = document.getElementById('hero-next');
    
    let currentHeroIndex = 0;
    let heroIntervalId = null;
    const autoPlayDelay = 6000; // 6 seconds slide auto-swap

    const showHeroSlide = (index) => {
        // Reset active classes
        heroSlides.forEach(slide => slide.classList.remove('active'));
        heroIndicators.forEach(ind => ind.classList.remove('active'));

        // Handle loop bounds
        if (index >= heroSlides.length) currentHeroIndex = 0;
        else if (index < 0) currentHeroIndex = heroSlides.length - 1;
        else currentHeroIndex = index;

        // Apply active classes
        heroSlides[currentHeroIndex].classList.add('active');
        heroIndicators[currentHeroIndex].classList.add('active');
    };

    const nextHeroSlide = () => {
        showHeroSlide(currentHeroIndex + 1);
    };

    const prevHeroSlide = () => {
        showHeroSlide(currentHeroIndex - 1);
    };

    const startHeroAutoPlay = () => {
        stopHeroAutoPlay();
        heroIntervalId = setInterval(nextHeroSlide, autoPlayDelay);
    };

    const stopHeroAutoPlay = () => {
        if (heroIntervalId) {
            clearInterval(heroIntervalId);
        }
    };

    // Controls listeners
    heroNextBtn.addEventListener('click', () => {
        nextHeroSlide();
        startHeroAutoPlay(); // Restart timer
    });

    heroPrevBtn.addEventListener('click', () => {
        prevHeroSlide();
        startHeroAutoPlay(); // Restart timer
    });

    // Indicators click listeners
    heroIndicators.forEach((indicator, idx) => {
        indicator.addEventListener('click', () => {
            showHeroSlide(idx);
            startHeroAutoPlay(); // Restart timer
        });
    });

    // Start auto-slide
    startHeroAutoPlay();


    // --- 4. Full Lightbox Photo Gallery Viewer ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    let currentGalleryIndex = 0;
    const gallerySourceList = [];

    // Build lists of images and captions to browse inside Lightbox
    galleryItems.forEach((item, index) => {
        const src = item.getAttribute('data-src');
        const caption = item.getAttribute('data-caption');
        gallerySourceList.push({ src, caption });

        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    const openLightbox = (index) => {
        currentGalleryIndex = index;
        lightboxImg.src = gallerySourceList[currentGalleryIndex].src;
        lightboxCaption.textContent = gallerySourceList[currentGalleryIndex].caption;
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Disable page scrolling
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restore page scrolling
        lightboxImg.src = '';
    };

    const nextLightboxImg = () => {
        let index = currentGalleryIndex + 1;
        if (index >= gallerySourceList.length) index = 0;
        openLightbox(index);
    };

    const prevLightboxImg = () => {
        let index = currentGalleryIndex - 1;
        if (index < 0) index = gallerySourceList.length - 1;
        openLightbox(index);
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', nextLightboxImg);
    lightboxPrev.addEventListener('click', prevLightboxImg);

    // Close when clicking outside on the background mask
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard support for Lightbox
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        else if (e.key === 'ArrowRight') nextLightboxImg();
        else if (e.key === 'ArrowLeft') prevLightboxImg();
    });


    // --- 7. Intersection Observer for Premium Scroll Reveals ---
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Once revealed, no need to monitor it again
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Element becomes visible when 10% is in viewport
        rootMargin: '0px 0px -50px 0px' // Offset bottom bounds slightly for smoother reveal
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });


    // --- 8. Gallery Image Carousel ---
    const galleryInner = document.querySelector('.gallery-carousel-inner');
    const galleryTrackEl = document.getElementById('gallery-track');
    const galleryCarouselItems = galleryTrackEl.querySelectorAll('.gallery-carousel-item');
    const galleryDotsContainer = document.getElementById('gallery-dots');
    const galleryPrevBtn = document.getElementById('gallery-prev');
    const galleryNextBtn = document.getElementById('gallery-next');

    let galleryCurrentIndex = 0;
    const totalGalleryItems = galleryCarouselItems.length;

    const getGalleryVisibleCount = () => 1;

    const getGalleryMaxIndex = () => Math.max(0, totalGalleryItems - getGalleryVisibleCount());

    const buildGalleryDots = () => {
        const maxIndex = getGalleryMaxIndex();
        galleryDotsContainer.innerHTML = '';
        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement('span');
            dot.classList.add('gallery-dot');
            if (i === galleryCurrentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => goToGallerySlide(i));
            galleryDotsContainer.appendChild(dot);
        }
    };

    const goToGallerySlide = (index) => {
        const maxIndex = getGalleryMaxIndex();
        galleryCurrentIndex = Math.max(0, Math.min(index, maxIndex));

        const visibleCount = getGalleryVisibleCount();
        const gap = 24; // matches 1.5rem at 16px root
        const containerWidth = galleryInner.offsetWidth;
        const itemWidth = (containerWidth - gap * (visibleCount - 1)) / visibleCount;
        galleryTrackEl.style.transform = `translateX(${-galleryCurrentIndex * (itemWidth + gap)}px)`;

        galleryDotsContainer.querySelectorAll('.gallery-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === galleryCurrentIndex);
        });

        galleryPrevBtn.disabled = galleryCurrentIndex === 0;
        galleryNextBtn.disabled = galleryCurrentIndex === maxIndex;
    };

    galleryPrevBtn.addEventListener('click', () => goToGallerySlide(galleryCurrentIndex - 1));
    galleryNextBtn.addEventListener('click', () => goToGallerySlide(galleryCurrentIndex + 1));

    // Touch / swipe support
    let galleryTouchStartX = 0;
    galleryInner.addEventListener('touchstart', (e) => {
        galleryTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    galleryInner.addEventListener('touchend', (e) => {
        const delta = galleryTouchStartX - e.changedTouches[0].screenX;
        if (Math.abs(delta) > 50) goToGallerySlide(galleryCurrentIndex + (delta > 0 ? 1 : -1));
    }, { passive: true });

    // Recalculate on resize
    let galleryResizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(galleryResizeTimer);
        galleryResizeTimer = setTimeout(() => {
            buildGalleryDots();
            goToGallerySlide(Math.min(galleryCurrentIndex, getGalleryMaxIndex()));
        }, 150);
    });

    buildGalleryDots();
    goToGallerySlide(0);


    // --- 10. Contact Form Handling ---
    const bookingForm = document.getElementById('booking-form');
    const successMsg = document.getElementById('form-success-msg');

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulating email dispatch
        const name = document.getElementById('form-name').value;
        const email = document.getElementById('form-email').value;
        const phone = document.getElementById('form-phone').value;
        const date = document.getElementById('form-date').value;
        const summary = formSummaryTextarea.value;
        const customMsg = document.getElementById('form-message').value;

        // Custom validation or logging
        console.log('Sending premium quote request:', { name, email, phone, date, summary, customMsg });

        // Show elegant success block
        successMsg.style.display = 'block';
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Clear forms after a brief display delay
        setTimeout(() => {
            bookingForm.reset();
            successMsg.style.display = 'none';
        }, 5000);
    });
});
