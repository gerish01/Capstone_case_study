import { Cookies } from 'react-cookie';

const API_BASE_URL = 'http://127.0.0.1:8000'; // Ensure this URL is correct

const cookies = new Cookies();

export class API {
    static async fetchFromApi(endpoint, options) {
        try {
            // Construct the full URL by joining the base URL with the endpoint
            const url = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
            const response = await fetch(url, options);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Something went wrong');
            }
            return response.json();
        } catch (error) {
            console.error('API fetch error:', error);
            throw error;
        }
    }

    // Authentication methods
    static async loginUser(body) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        };
        return this.fetchFromApi('/auth/', options);
    }

    static async registerUser(body) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        };
        return this.fetchFromApi('/register/', options);
    }

    static async logout() {
        const token = cookies.get('mr-token'); // Get the token from cookies
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`, // Include token for logout if required
            },
        };
        return this.fetchFromApi('/logout/', options);
    }

    // User management methods
    static async getUsers() {
        const token = cookies.get('mr-token'); // Get the token from cookies
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`, // Include token for authorized requests
            },
        };
        return this.fetchFromApi('/api/users/', options); // Corrected URL
    }

    static async getUser(userId) {
        const token = cookies.get('mr-token'); // Get the token from cookies
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`, // Include token for authorized requests
            },
        };
        return this.fetchFromApi(`/api/users/${userId}/`, options); // Corrected URL
    }

    // Task management methods
    static async updateTaskStatus(taskId, newStatus) {
        const token = cookies.get('mr-token');
        const options = {
            method: 'PUT',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
        };
        const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/update_status/`, options);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    }

    static async getUserTasks() {
        const token = cookies.get('mr-token'); // Get the token from cookies
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            },
        };
        const response = await fetch(`${API_BASE_URL}/api/tasks/`, options);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error fetching tasks');
        }
        return response.json();
    }
}
