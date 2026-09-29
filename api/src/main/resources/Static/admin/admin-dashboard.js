// admin-dashboard.js

async function loadDashboard() {
    try {
        const response = await apiRequest('/products/admin/stats');
        const stats = await response.json();

        document.getElementById('total-products').textContent = stats.totalProducts;
        document.getElementById('available-products').textContent = stats.availableProducts;
        document.getElementById('out-of-stock').textContent = 
            stats.totalProducts - stats.availableProducts;

        // Load recent products
        loadRecentProducts();

    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

async function loadRecentProducts() {
    try {
        const response = await apiRequest('/products?page=0&size=5');
        const data = await response.json();
        const products = data.content || [];

        const tbody = document.getElementById('recent-products-list');
        tbody.innerHTML = '';

        products.forEach(product => {
            const row = `
                <tr>
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td>$${product.price}</td>
                    <td>${product.stockQuantity}</td>
                    <td>${product.isAvailable ? '<span class="badge-available">Available</span>' : '<span class="badge-unavailable">Unavailable</span>'}</td>
                    <td>
                        <button class="btn btn-sm btn-edit" onclick="editProduct(${product.id})">Edit</button>
                        <button class="btn btn-sm btn-delete" onclick="deleteProduct(${product.id})">Delete</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });

    } catch (error) {
        console.error('Error loading recent products:', error);
    }
}

// Navigation between pages
function navigateTo(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Show selected page
    document.getElementById(page).classList.add('active');
    
    // Update page title
    const titles = {
        'dashboard': 'Dashboard',
        'products': 'Product Management',
        'add-product': 'Add New Product'
    };
    document.getElementById('page-title').textContent = titles[page] || 'Page';

    // Reset form if adding product
    if (page === 'add-product') {
        document.getElementById('product-form').reset();
        document.getElementById('form-title').textContent = 'Add New Product';
        document.getElementById('submit-btn').textContent = 'Add Product';
        document.getElementById('submit-btn').dataset.mode = 'add';
    }

    // Load products if viewing products page
    if (page === 'products') {
        loadProducts(0);
    }

    // Load dashboard if viewing dashboard
    if (page === 'dashboard') {
        loadDashboard();
    }

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-page="${page}"]`)?.classList.add('active');
}

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
    navigateTo('dashboard');
});
