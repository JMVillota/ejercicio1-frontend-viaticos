import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DocumentoViatico } from '../../app/interfaces/viatico.interface';
import { ApiResponse } from '../interfaces/viatico.interface';

@Injectable({
    providedIn: 'root'
})
export class DocumentoViaticoService {
    private apiUrl = `${environment.apiUrl}/documentos-viatico`;

    constructor(private http: HttpClient) { }

    private getAuthHeaders(): HttpHeaders {
        const credentials = btoa(`${environment.basicAuth.username}:${environment.basicAuth.password}`);
        return new HttpHeaders()
            .set('Authorization', `Basic ${credentials}`);
    }

    getDocumentosByViaticoId(viaticoId: string): Observable<DocumentoViatico[]> {
        return this.http.get<DocumentoViatico[]>(
            `${this.apiUrl}/viatico/${viaticoId}`,
            { headers: this.getAuthHeaders() }
        );
    }

}