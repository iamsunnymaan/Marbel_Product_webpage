// js/api-client.js

class APIClient {
    constructor(baseURL = 'http://localhost:8080/api') {
        this.baseURL = baseURL;
        this.token = localStorage.getItem('authToken');
    }

    /**
     * Generic fetch wrapper
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            if (response.status === 401) {
                this.handleUnauthorized();
                throw new Error('Unauthorized');
            }

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || `HTTP ${response.status}`);
            }

            return response;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    /**
     * GET request
     */
    async get(endpoint) {
        const response = await this.request(endpoint, { method: 'GET' });
        return response.json();
    }

    /**
     * POST request
     */
    async post(endpoint, data, isFormData = false) {
        const options = {
            method: 'POST',
            headers: {}
        };

        if (isFormData) {
            // Remove Content-Type to let browser set it with boundary
            delete options.headers['Content-Type'];
            options.body = data;
        } else {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(data);
        }

        const response = await this.request(endpoint, options);
        return response.json();
    }

    /**
     * PUT request
     */
    async put(endpoint, data, isFormData = false) {
        const options = {
            method: 'PUT',
            headers: {}
        };

        if (isFormData) {
            delete options.headers['Content-Type'];
            options.body = data;
        } else {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(data);
        }

        const response = await this.request(endpoint, options);
        return response.json();
    }

    /**
     * DELETE request
     */
    async delete(endpoint) {
        const response = await this.request(endpoint, { method: 'DELETE' });
        return response.json();
    }

    /**
     * Handle 401 Unauthorized
     */
    handleUnauthorized() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        // Determine redirect path based on current location depth
        const isInAdmin = window.location.pathname.includes('/admin/');
        window.location.href = isInAdmin ? 'login.html' : '/admin/login.html';
    }

    /**
     * Set token (after login)
     */
    setToken(token) {
        this.token = token;
        localStorage.setItem('authToken', token);
    }

    /**
     * Clear token (on logout)
     */
    clearToken() {
        this.token = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
    }
}

// Create global instance
const apiClient = new APIClient();
