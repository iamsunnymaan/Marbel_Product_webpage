// admin-products.js

let currentPage = 0;
const pageSize = 10;

async function loadProducts(page = 0) {
    try {
        const category = document.getElementById('filter-category')?.value || '';
        const search = document.getElementById('search-products')?.value || '';

        let url = `/products?page=${page}&size=${pageSize}`;
        if (category) url += `&category=${category}`;
        if (search) url += `&search=${search}`;

        const response = await apiRequest(url);
        const data = await response.json();

        displayProducts(data.content || []);
        displayPagination(data);

        currentPage = page;
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function displayProducts(products) {
    const tbody = document.getElementById('products-list');
    tbody.innerHTML = '';

    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No products found</td></tr>';
        return;
    }

    products.forEach(product => {
        const row = `
            <tr>
                <td><img src="${product.imageUrl}" alt="${product.altText}" style="max-width: 50px; max-height: 50px;"></td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>$${product.price}</td>
                <td>${product.stockQuantity}</td>
                <td>
                    ${product.isAvailable ? 
                        '<span style="color: green;">✓ Available</span>' : 
                        '<span style="color: red;">✗ Unavailable</span>'}
                </td>
                <td>
                    <button class="btn btn-sm btn-edit" onclick="editProduct(${product.id})">Edit</button>
                    <button class="btn btn-sm btn-delete" onclick="confirmDelete(${product.id})">Delete</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function displayPagination(data) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    if (data.totalPages <= 1) return;

    for (let i = 0; i < data.totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i + 1;
        button.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        button.onclick = () => loadProducts(i);
        pagination.appendChild(button);
    }
}

async function editProduct(id) {
    try {
        const response = await apiRequest(`/products/${id}`);
        const product = await response.json();

        // Populate form
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-sku').value = product.sku || '';
        document.getElementById('product-color').value = product.color || '';
        document.getElementById('product-size').value = product.size || '';
        document.getElementById('product-finish').value = product.finishType || '';
        document.getElementById('product-description').value = product.description || '';
        document.getElementById('product-stock').value = product.stockQuantity;
        document.getElementById('product-alt').value = product.altText || '';

        // Show image preview
        const preview = document.getElementById('image-preview');
        preview.innerHTML = `<img src="${product.imageUrl}" alt="${product.altText}" style="max-width: 200px;">`;

        // Update form for edit mode
        document.getElementById('form-title').textContent = 'Edit Product';
        document.getElementById('submit-btn').textContent = 'Update Product';
        document.getElementById('submit-btn').dataset.productId = id;
        document.getElementById('submit-btn').dataset.mode = 'edit';
        document.getElementById('product-image').required = false;

        navigateTo('add-product');

    } catch (error) {
        console.error('Error loading product:', error);
        alert('Failed to load product');
    }
}

async function deleteProduct(id) {
    try {
        const response = await apiRequest(`/products/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Product deleted successfully');
            loadProducts(currentPage);
        } else {
            alert('Failed to delete product');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}

function confirmDelete(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        deleteProduct(id);
    }
}

// File upload preview
document.getElementById('product-image')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            document.getElementById('image-preview').innerHTML = 
                `<img src="${event.target.result}" alt="preview" style="max-width: 200px;">`;
        };
        reader.readAsDataURL(file);
        document.getElementById('file-name').textContent = file.name;
    }
});

// Form submission
document.getElementById('product-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const mode = document.getElementById('submit-btn').dataset.mode;
    const productId = document.getElementById('submit-btn').dataset.productId;

    const formData = new FormData();

    const productRequest = {
        name: document.getElementById('product-name').value,
        description: document.getElementById('product-description').value,
        price: parseFloat(document.getElementById('product-price').value),
        category: document.getElementById('product-category').value,
        stockQuantity: parseInt(document.getElementById('product-stock').value),
        sku: document.getElementById('product-sku').value,
        color: document.getElementById('product-color').value,
        size: document.getElementById('product-size').value,
        finishType: document.getElementById('product-finish').value,
        altText: document.getElementById('product-alt').value
    };

    formData.append('product', new Blob([JSON.stringify(productRequest)], 
        { type: 'application/json' }));

    if (document.getElementById('product-image').files.length > 0) {
        formData.append('image', document.getElementById('product-image').files[0]);
    }

    try {
        const url = mode === 'add' ? '/products' : `/products/${productId}`;
        const method = mode === 'add' ? 'POST' : 'PUT';

        const response = await fetch(`${API_BASE_URL}${url}`, {
            method,
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to save product');
        }

        alert(mode === 'add' ? 'Product added successfully' : 'Product updated successfully');
        navigateTo('products');
        loadProducts(0);

    } catch (error) {
        console.error('Error saving product:', error);
        alert('Error saving product: ' + error.message);
    }
});

// Filter and search
document.getElementById('filter-category')?.addEventListener('change', () => loadProducts(0));
document.getElementById('search-products')?.addEventListener('input', () => loadProducts(0));

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    loadProducts(0);
});
