// admin-auth.js

const API_BASE_URL = 'http://localhost:8080/api';
let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

// Check if user is logged in
function checkAuth() {
    if (!authToken) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Login function
async function login(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('Invalid credentials');
        }

        const data = await response.json();
        
        // Store token and user info
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('currentUser', JSON.stringify({
            id: data.userId,
            email: data.email,
            fullName: data.fullName,
            role: data.role
        }));

        authToken = data.token;
        currentUser = JSON.parse(localStorage.getItem('currentUser'));

        return true;
    } catch (error) {
        console.error('Login failed:', error);
        return false;
    }
}

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    authToken = null;
    currentUser = {};
    window.location.href = 'login.html';
}

// API request with JWT token
async function apiRequest(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
    });

    if (response.status === 401) {
        logout();
        throw new Error('Unauthorized');
    }

    return response;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    if (currentUser.fullName) {
        document.getElementById('admin-name').textContent = `Welcome, ${currentUser.fullName}`;
    }

    // Logout button listeners
    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });

    document.getElementById('logoutBtn2')?.addEventListener('click', logout);
});
