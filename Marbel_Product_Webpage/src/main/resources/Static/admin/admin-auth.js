// admin-auth.js — shared API helper for the admin panel (no authentication)

const API_BASE_URL = 'http://localhost:8080/api';

async function apiRequest(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    return fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
    });
}
