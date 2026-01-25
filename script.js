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
            const href = link.getAttribute('href');
            
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
    const categoryCards = document.querySelectorAll('.category-card');
    
    if (!categoryCards.length) return;
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            categoryCards.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked card
            this.classList.add('active');
            
            // Get the category data
            const category = this.getAttribute('data-category');
            
            // Here you can filter the collection gallery based on category
            // For now, we'll just log it
            console.log('Selected category:', category);
            
            // You can add functionality to filter gallery items here
            // filterGallery(category);
        });
    });
});
