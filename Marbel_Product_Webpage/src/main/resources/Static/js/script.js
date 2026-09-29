// MAGNETIC SLIDING BACKGROUND EFFECT
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-item');
    const magneticBg = document.querySelector('.nav-magnetic-bg');
    const navBox = document.querySelector('.nav-box');
    
    if (!magneticBg || !navBox) return;
    
    // Set initial position for the current page
    function setActiveLink() {
        const currentPath = window.location.pathname;
        navLinks.forEach(item => {
            const link = item.querySelector('.nav-link');
            const href = link.getAttribute('href').split('/').pop();
            
            if (currentPath.includes(href) || (currentPath === '/' && href === 'index.html')) {
                item.classList.add('has-bg');
                updateBackgroundPosition(item);
            }
        });
    }
    
    function updateBackgroundPosition(item) {
        const linkRect = item.getBoundingClientRect();
        const navBoxRect = navBox.getBoundingClientRect();
        
        const left = linkRect.left - navBoxRect.left;
        const width = linkRect.width;
        const height = linkRect.height;
        const top = linkRect.top - navBoxRect.top;
        
        magneticBg.style.width = `${width}px`;
        magneticBg.style.height = `${height}px`;
        magneticBg.style.left = `${left}px`;
        magneticBg.style.top = `${top}px`;
        magneticBg.classList.add('active');
    }
    
    navLinks.forEach(item => {
        item.addEventListener('mouseenter', function() {
            // Remove has-bg class from all items
            navLinks.forEach(link => link.classList.remove('has-bg'));
            // Add has-bg class to hovered item
            this.classList.add('has-bg');
            // Update background position
            updateBackgroundPosition(this);
        });
    });
    
    navBox.addEventListener('mouseleave', function() {
        // Reset to active page
        navLinks.forEach(link => link.classList.remove('has-bg'));
        setActiveLink();
    });
    
    // Initialize on load
    setActiveLink();
});

// HERO SLIDER
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const bulletNav = document.getElementById('bullet-nav');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (!slides.length || !bulletNav) return;
    
    let currentSlide = 0;
    let autoSlideInterval;
    
    // Create bullet navigation
    slides.forEach((_, index) => {
        const bullet = document.createElement('div');
        bullet.classList.add('bullet');
        if (index === 0) bullet.classList.add('active');
        bullet.addEventListener('click', () => goToSlide(index));
        bulletNav.appendChild(bullet);
    });
    
    const bullets = document.querySelectorAll('.bullet');
    
    function goToSlide(n) {
        slides[currentSlide].classList.remove('active');
        bullets[currentSlide].classList.remove('active');
        
        currentSlide = (n + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        bullets[currentSlide].classList.add('active');
    }
    
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    // Auto slide
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoSlide();
        startAutoSlide();
    });
    
    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoSlide();
        startAutoSlide();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        }
    });
    
    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    const slider = document.querySelector('.slider');
    if (slider) {
        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        }
        if (touchEndX > touchStartX + 50) {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        }
    }
    
    // Start auto slide
    startAutoSlide();
});

// COLLECTION CATEGORY TABS
document.addEventListener('DOMContentLoaded', function() {
    const tabs = Array.from(document.querySelectorAll('.mc-tab'));
    const panels = document.querySelectorAll('.mc-panel');

    if (!tabs.length) return;

    function select(tab) {
        tabs.forEach(t => {
            const on = t === tab;
            t.classList.toggle('active', on);
            t.setAttribute('aria-selected', on);
            t.tabIndex = on ? 0 : -1;
        });
        panels.forEach(p => p.classList.toggle('active', p.dataset.category === tab.dataset.category));
    }

    tabs.forEach((tab, i) => {
        tab.addEventListener('click', () => select(tab));
        tab.addEventListener('keydown', e => {
            const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
            if (!step) return;
            e.preventDefault();
            const next = tabs[(i + step + tabs.length) % tabs.length];
            next.focus();
            select(next);
        });
    });

    select(tabs.find(t => t.classList.contains('active')) || tabs[0]);
});

// CONTACT MODAL FUNCTIONALITY
document.addEventListener('DOMContentLoaded', function() {
    const contactBtns = document.querySelectorAll('.connect-btn');
    const contactModal = document.getElementById('contactModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('closeModal');
    const contactForm = document.getElementById('contactForm');

    if (!contactModal) return;

    contactBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal();
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && contactModal.classList.contains('active')) {
            closeModal();
        }
    });

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            if (!name || !email || !subject || !message) {
                alert('Please fill in all required fields');
                return;
            }

            const emailBody = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}\nMessage: ${message}`;
            window.location.href = `mailto:hello@example.com?subject=${encodeURIComponent('MARBEL Connection - ' + subject)}&body=${encodeURIComponent(emailBody)}`;
            alert('Thank you for connecting! We will get back to you soon.');
            contactForm.reset();
            closeModal();
        });
    }

    function openModal() {
        contactModal.classList.add('active');
        if (modalOverlay) modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        contactModal.classList.remove('active');
        if (modalOverlay) modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});
