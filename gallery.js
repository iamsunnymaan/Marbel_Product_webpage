// GALLERY FILTER FUNCTIONALITY
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (!filterBtns.length || !galleryItems.length) return;
    
    function filterGallery(category) {
        galleryItems.forEach(item => {
            const itemCategories = item.getAttribute('data-category').toLowerCase();
            
            if (category === 'all') {
                item.classList.remove('hidden');
                setTimeout(() => {
                    item.style.opacity = '1';
                }, 10);
            } else {
                if (itemCategories.includes(category.toLowerCase())) {
                    item.classList.remove('hidden');
                    setTimeout(() => {
                        item.style.opacity = '1';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 300);
                }
            }
        });
    }
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the filter category
            const category = this.getAttribute('data-filter');
            
            // Filter the gallery
            filterGallery(category);
        });
    });
});