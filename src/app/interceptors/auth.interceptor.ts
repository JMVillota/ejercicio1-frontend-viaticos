// src/app/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // Get the auth credentials from environment
    const credentials = btoa(`${environment.basicAuth.username}:${environment.basicAuth.password}`);

    // Clone the request and add the authorization header
    const authReq = req.clone({
        headers: req.headers.set('Authorization', `Basic ${credentials}`)
    });

    // Pass on the cloned request instead of the original request
    return next(authReq);
};