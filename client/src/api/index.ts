import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (credentials: { email: string; password: string }) =>
        api.post('/auth/login', credentials),
    getProfile: () => api.get('/auth/profile'),
    updatePassword: (data: { currentPassword: string; newPassword: string }) =>
        api.put('/auth/password', data),
};

// Testimonials API
export const testimonialsAPI = {
    getAll: () => api.get('/testimonials'),
    getById: (id: string) => api.get(`/testimonials/${id}`),
    getStats: () => api.get('/testimonials/stats'),
    create: (formData: FormData) =>
        api.post('/testimonials', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    update: (id: string, formData: FormData) =>
        api.put(`/testimonials/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    delete: (id: string) => api.delete(`/testimonials/${id}`),
};

// Contacts API
export const contactsAPI = {
    getAll: () => api.get('/contact'),
    getById: (id: string) => api.get(`/contact/${id}`),
    getStats: () => api.get('/contact/stats'),
    toggleRead: (id: string) => api.patch(`/contact/${id}/read`),
    updateNotes: (id: string, notes: string) =>
        api.patch(`/contact/${id}/notes`, { notes }),
    delete: (id: string) => api.delete(`/contact/${id}`),
};

// Projects API
export const projectsAPI = {
    getAll: (params?: { featured?: boolean; category?: string }) =>
        api.get('/projects', { params }),
    getById: (id: string) => api.get(`/projects/${id}`),
    getStats: () => api.get('/projects/stats'),
    create: (formData: FormData) =>
        api.post('/projects', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    update: (id: string, formData: FormData) =>
        api.put(`/projects/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    delete: (id: string) => api.delete(`/projects/${id}`),
};

// Services API
export const servicesAPI = {
    getAll: () => api.get('/services'),
    getById: (id: string) => api.get(`/services/${id}`),
    getStats: () => api.get('/services/stats'),
    create: (formData: FormData) =>
        api.post('/services', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    update: (id: string, formData: FormData) =>
        api.put(`/services/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    delete: (id: string) => api.delete(`/services/${id}`),
};

// Team API
export const teamAPI = {
    getAll: (params?: { department?: string }) =>
        api.get('/team', { params }),
    getById: (id: string) => api.get(`/team/${id}`),
    getStats: () => api.get('/team/stats'),
    create: (formData: FormData) =>
        api.post('/team', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    update: (id: string, formData: FormData) =>
        api.put(`/team/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    delete: (id: string) => api.delete(`/team/${id}`),
};

// Clients API
export const clientsAPI = {
    getAll: (params?: { featured?: boolean }) =>
        api.get('/clients', { params }),
    getById: (id: string) => api.get(`/clients/${id}`),
    getStats: () => api.get('/clients/stats'),
    create: (formData: FormData) =>
        api.post('/clients', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    update: (id: string, formData: FormData) =>
        api.put(`/clients/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    delete: (id: string) => api.delete(`/clients/${id}`),
};

// Careers API
export const careersAPI = {
    getAll: (params?: { department?: string; type?: string }) =>
        api.get('/careers', { params }),
    getById: (id: string) => api.get(`/careers/${id}`),
    getStats: () => api.get('/careers/stats'),
    create: (data: object) => api.post('/careers', data),
    update: (id: string, data: object) => api.put(`/careers/${id}`, data),
    delete: (id: string) => api.delete(`/careers/${id}`),
};

// Blogs API
export const blogsAPI = {
    getAll: (params?: { category?: string; featured?: boolean; published?: string }) =>
        api.get('/blogs', { params }),
    getBySlug: (identifier: string) => api.get(`/blogs/${identifier}`),
    getStats: () => api.get('/blogs/stats'),
    create: (formData: FormData) =>
        api.post('/blogs', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    update: (id: string, formData: FormData) =>
        api.put(`/blogs/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    uploadImage: (formData: FormData) =>
        api.post('/blogs/upload-image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    delete: (id: string) => api.delete(`/blogs/${id}`),
};

// Applications API
export const applicationsAPI = {
    getAll: (params?: { status?: string; career?: string }) =>
        api.get('/applications', { params }),
    getById: (id: string) => api.get(`/applications/${id}`),
    getStats: () => api.get('/applications/stats'),
    update: (id: string, data: { status?: string; adminNotes?: string; interviewDate?: string | null }) =>
        api.put(`/applications/${id}`, data),
    delete: (id: string) => api.delete(`/applications/${id}`),
};

// Settings API
export const settingsAPI = {
    get: () => api.get('/settings'),
    update: (data: Record<string, unknown>) => api.put('/settings', data),
};

export default api;


