export const environment = {
    production: true,
    apiUrl: 'https://charming-illumination-production.up.railway.app/api',
    basicAuth: {
        username: import.meta.env.VITE_AUTH_USERNAME || '',
        password: import.meta.env.VITE_AUTH_PASSWORD || ''
    }
};