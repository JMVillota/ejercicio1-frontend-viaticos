import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const username = environment.basicAuth.username;
    const password = environment.basicAuth.password;

    if (!username || !password) {
        console.error('Variables de entorno no encontradas:', {
            hasUsername: !!username,
            hasPassword: !!password
        });
        return next(req);
    }

    try {
        const credentials = btoa(`${username}:${password}`);
        const authReq = req.clone({
            headers: req.headers.set('Authorization', `Basic ${credentials}`)
        });
        return next(authReq);
    } catch (error) {
        console.error('Error en el interceptor:', error);
        return next(req);
    }
};