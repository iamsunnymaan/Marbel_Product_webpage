// Product Details Page JavaScript - API Integrated

let currentProduct = null;


// Get product ID from URL
function getProductIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Format category name for display
function formatCategoryName(category) {
    if(!category) return 'Natural Stone';
    const categoryNames = {
        'le-luxe': 'Le Luxe',
        'surface': 'Surface',
        'temple': 'Temple',
        'sculptures': 'Sculptures'
    };
    return categoryNames[category.toLowerCase()] || category;
}

// Display product details
function displayProductDetails(product) {
    if (!product) {
        const container = document.querySelector('.product-details-container');
        if(container) {
            container.innerHTML = '<div style="text-align: center; padding: 100px 20px;"><h2>Product not found</h2><a href="../Gallery/gallery.html" class="connect-btn">Back to Gallery</a></div>';
        }
        return;
    }

    currentProduct = product;

    // Update page title
    document.title = `${product.name} | MARBEL`;

    // Set fixed background image
    const backgroundOverlay = document.getElementById('product-background-overlay');
    if (backgroundOverlay) {
        backgroundOverlay.style.backgroundImage = `url('${product.imageUrl || '../../assets/images/placeholder.jpg'}')`;
        setTimeout(() => {
            backgroundOverlay.classList.add('active');
        }, 100);
    }

    // Update breadcrumb
    const bcCat = document.getElementById('product-category');
    if(bcCat) bcCat.textContent = formatCategoryName(product.category);
    
    const bcName = document.getElementById('product-name-breadcrumb');
    if(bcName) bcName.textContent = product.name;

    // Update main product info
    const pTitle = document.getElementById('product-title');
    if(pTitle) pTitle.textContent = product.name;
    
    const pPrice = document.getElementById('product-price');
    if(pPrice) pPrice.textContent = `$${(product.price || 0).toLocaleString()}`;
    
    const pCatVal = document.getElementById('product-category-value');
    if(pCatVal) pCatVal.textContent = formatCategoryName(product.category);
    
    const pMat = document.getElementById('product-material');
    if(pMat) pMat.textContent = product.material || 'Natural Stone';
    
    const pCol = document.getElementById('product-collection');
    if(pCol) pCol.textContent = product.category || 'Premium';
    
    // Update specifications
    const pId = document.getElementById('spec-product-id');
    if(pId) pId.textContent = `#${(product.id || 0).toString().padStart(4, '0')}`;

    // Update main image
    const mainImage = document.getElementById('main-product-image');
    if(mainImage) {
        mainImage.src = product.imageUrl || '../../assets/images/placeholder.jpg';
        mainImage.alt = product.name;
    }

    // Create thumbnails (using same image for now)
    const thumbnailGallery = document.getElementById('thumbnail-gallery');
    if(thumbnailGallery) {
        thumbnailGallery.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            const thumb = document.createElement('div');
            thumb.className = `thumbnail ${i === 0 ? 'active' : ''}`;
            thumb.innerHTML = `<img src="${product.imageUrl || '../../assets/images/placeholder.jpg'}" alt="${product.name} view ${i + 1}">`;
            thumb.addEventListener('click', () => {
                if(mainImage) mainImage.src = product.imageUrl || '../../assets/images/placeholder.jpg';
                document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
            thumbnailGallery.appendChild(thumb);
        }
    }

    // Setup action buttons
    const enquireBtn = document.getElementById('enquire-btn');
    if(enquireBtn) {
        // remove old listeners by cloning
        const newEnquireBtn = enquireBtn.cloneNode(true);
        enquireBtn.parentNode.replaceChild(newEnquireBtn, enquireBtn);
        newEnquireBtn.addEventListener('click', () => enquireProduct(product.name));
    }

    const whatsappBtn = document.getElementById('whatsapp-btn');
    if(whatsappBtn) {
        const newWhatsappBtn = whatsappBtn.cloneNode(true);
        whatsappBtn.parentNode.replaceChild(newWhatsappBtn, whatsappBtn);
        newWhatsappBtn.addEventListener('click', () => {
            const message = `Hello MARBEL, I'm interested in ${product.name} (Price: $${(product.price || 0).toLocaleString()})`;
            window.open(`https://wa.me/910000000000?text=${encodeURIComponent(message)}`, '_blank');
        });
    }

    // Setup image zoom
    const zoomBtn = document.getElementById('zoom-btn');
    const zoomModal = document.getElementById('image-zoom-modal');
    const zoomedImage = document.getElementById('zoomed-image');
    const zoomCloseBtn = document.getElementById('zoom-close-btn');

    if(zoomBtn && zoomModal && zoomedImage && zoomCloseBtn) {
        zoomBtn.addEventListener('click', () => {
            zoomedImage.src = product.imageUrl || '../../assets/images/placeholder.jpg';
            zoomModal.classList.add('active');
        });

        zoomCloseBtn.addEventListener('click', () => {
            zoomModal.classList.remove('active');
        });

        const overlay = document.querySelector('.zoom-modal-overlay');
        if(overlay) {
            overlay.addEventListener('click', () => {
                zoomModal.classList.remove('active');
            });
        }
    }

    // Load related products
    loadRelatedProducts(product);
}

// Display related products
async function loadRelatedProducts(currentProduct) {
    const relatedContainer = document.getElementById('related-products');
    if(!relatedContainer) return;

    try {
        // Fetch products by category
        const response = await apiClient.get(`/products?size=5&category=${currentProduct.category}`);
        let relatedProducts = response.content || [];
        
        // Filter out current product
        relatedProducts = relatedProducts.filter(p => p.id !== currentProduct.id).slice(0, 4);

        if (relatedProducts.length === 0) {
            relatedContainer.innerHTML = '<p style="text-align: center; color: #666;">No related products available</p>';
            return;
        }

        relatedContainer.innerHTML = relatedProducts.map(p => `
            <div class="related-product-card" onclick="navigateToProduct(${p.id})">
                <img src="${p.imageUrl || '../../assets/images/placeholder.jpg'}" alt="${p.name}">
                <div class="related-product-info">
                    <h4>${p.name}</h4>
                    <p>$${(p.price || 0).toLocaleString()}</p>
                </div>
            </div>
        `).join('');

    } catch(err) {
        console.error("Failed to load related products", err);
        relatedContainer.innerHTML = '<p style="text-align: center; color: #666;">Failed to load related products</p>';
    }
}

// Navigate to product
window.navigateToProduct = function(productId) {
    window.location.href = `product-details.html?id=${productId}`;
};

// Enquire about product
function enquireProduct(productName) {
    const subject = `Enquiry about ${productName}`;
    const body = `Hello MARBEL,\n\nI would like to enquire about ${productName}.\n\nPlease provide more information regarding:\n- Availability\n- Customization options\n- Delivery timeline\n- Installation services\n\nThank you.`;
    
    window.location.href = `mailto:hello@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Initialize page
async function initProductDetailsPage() {
    const productId = getProductIdFromURL();
    if (!productId) {
        // Try fallback with name if any, but since we rely on DB, best to go to gallery
        const params = new URLSearchParams(window.location.search);
        const name = params.get('name');
        if(name) {
             // For fallback, we don't have full info, so we just display the name
             displayProductDetails({ name: name, price: 0, category: 'Unknown' });
             return;
        }
        window.location.href = 'product.html';
        return;
    }

    try {
        const product = await apiClient.get(`/products/${productId}`);
        displayProductDetails(product);
    } catch(err) {
        console.error("Failed to fetch product", err);
        displayProductDetails(null);
    }

    // Initialize connect button in header
    const connectBtns = document.querySelectorAll('.connect-btn:not(#enquire-btn):not(#whatsapp-btn)');
    connectBtns.forEach(btn => {
        if (!btn.id) {
            btn.addEventListener('click', () => {
                window.location.href = '../Home/index.html#address';
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
