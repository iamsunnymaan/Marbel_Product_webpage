// Product Details Page JavaScript
let products = [];

// Load products from JSON file
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        const data = await response.json();
        products = data.products;
        return products;
    } catch (error) {
        console.error('Error loading products:', error);
        return [];
    }
}

// Get product ID from URL
function getProductIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Get product by ID
function getProductById(id) {
    return products.find(p => p.id === parseInt(id));
}

// Format category name for display
function formatCategoryName(category) {
    const categoryNames = {
        'le-luxe': 'Le Luxe',
        'surface': 'Surface',
        'temple': 'Temple',
        'sculptures': 'Sculptures'
    };
    return categoryNames[category] || category;
}

// Format collection name for display
function formatCollectionName(collection) {
    return collection
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Display product details
function displayProductDetails(product) {
    if (!product) {
        document.querySelector('.product-details-container').innerHTML = 
            '<div style="text-align: center; padding: 100px 20px;"><h2>Product not found</h2><a href="index.html" class="connect-btn">Back to Gallery</a></div>';
        return;
    }

    // Update page title
    document.title = `${product.name} | LITHOS`;

    // Set fixed background image
    const backgroundOverlay = document.getElementById('product-background-overlay');
    backgroundOverlay.style.backgroundImage = `url('${product.img}')`;
    setTimeout(() => {
        backgroundOverlay.classList.add('active');
    }, 100);

    // Update breadcrumb
    document.getElementById('product-category').textContent = formatCategoryName(product.category);
    document.getElementById('product-name-breadcrumb').textContent = product.name;

    // Update main product info
    document.getElementById('product-title').textContent = product.name;
    document.getElementById('product-price').textContent = `$${product.price.toLocaleString()}`;
    document.getElementById('product-category-value').textContent = formatCategoryName(product.category);
    document.getElementById('product-material').textContent = product.material || 'Natural Stone';
    document.getElementById('product-collection').textContent = formatCollectionName(product.collection);
    
    // Update specifications
    document.getElementById('spec-product-id').textContent = `#${product.id.toString().padStart(4, '0')}`;

    // Update main image
    const mainImage = document.getElementById('main-product-image');
    mainImage.src = product.img;
    mainImage.alt = product.name;

    // Create thumbnails (using same image for now, can be extended with multiple images)
    const thumbnailGallery = document.getElementById('thumbnail-gallery');
    thumbnailGallery.innerHTML = '';
    
    // Create 4 thumbnails (can be updated when multiple images are available)
    for (let i = 0; i < 4; i++) {
        const thumb = document.createElement('div');
        thumb.className = `thumbnail ${i === 0 ? 'active' : ''}`;
        thumb.innerHTML = `<img src="${product.img}" alt="${product.name} view ${i + 1}">`;
        thumb.addEventListener('click', () => {
            mainImage.src = product.img;
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
        thumbnailGallery.appendChild(thumb);
    }

    // Setup action buttons
    document.getElementById('enquire-btn').addEventListener('click', () => {
        enquireProduct(product.name);
    });

    document.getElementById('whatsapp-btn').addEventListener('click', () => {
        const message = `Hello LITHOS, I'm interested in ${product.name} (Price: $${product.price.toLocaleString()})`;
        window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, '_blank');
    });

    // Setup image zoom
    const zoomBtn = document.getElementById('zoom-btn');
    const zoomModal = document.getElementById('image-zoom-modal');
    const zoomedImage = document.getElementById('zoomed-image');
    const zoomCloseBtn = document.getElementById('zoom-close-btn');

    zoomBtn.addEventListener('click', () => {
        zoomedImage.src = product.img;
        zoomModal.classList.add('active');
    });

    zoomCloseBtn.addEventListener('click', () => {
        zoomModal.classList.remove('active');
    });

    document.querySelector('.zoom-modal-overlay').addEventListener('click', () => {
        zoomModal.classList.remove('active');
    });

    // Load related products
    displayRelatedProducts(product);
}

// Display related products
function displayRelatedProducts(currentProduct) {
    const relatedContainer = document.getElementById('related-products');
    
    // Get products from same category
    const relatedProducts = products
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 4);

    if (relatedProducts.length === 0) {
        relatedContainer.innerHTML = '<p style="text-align: center; color: #666;">No related products available</p>';
        return;
    }

    relatedContainer.innerHTML = relatedProducts.map(p => `
        <div class="related-product-card" onclick="navigateToProduct(${p.id})">
            <img src="${p.img}" alt="${p.name}">
            <div class="related-product-info">
                <h4>${p.name}</h4>
                <p>$${p.price.toLocaleString()}</p>
            </div>
        </div>
    `).join('');
}

// Navigate to product
function navigateToProduct(productId) {
    window.location.href = `product-details.html?id=${productId}`;
}

// Enquire about product
function enquireProduct(productName) {
    const subject = `Enquiry about ${productName}`;
    const body = `Hello LITHOS,\n\nI would like to enquire about ${productName}.\n\nPlease provide more information regarding:\n- Availability\n- Customization options\n- Delivery timeline\n- Installation services\n\nThank you.`;
    
    window.location.href = `mailto:hello@lithos.example?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Initialize page
async function initProductDetailsPage() {
    await loadProducts();
    
    const productId = getProductIdFromURL();
    if (!productId) {
        window.location.href = 'index.html';
        return;
    }

    const product = getProductById(productId);
    displayProductDetails(product);

    // Initialize connect button in header
    const connectBtns = document.querySelectorAll('.connect-btn:not(#enquire-btn):not(#whatsapp-btn)');
    connectBtns.forEach(btn => {
        if (!btn.id) {
            btn.addEventListener('click', () => {
                window.location.href = 'index.html#location';
            });
        }
    });
}

// Load when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductDetailsPage);
} else {
    initProductDetailsPage();
}
