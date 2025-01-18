import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
    Viatico, 
    CreateViaticoRequest,  
    ApiResponse,
    DashboardMetrics,
    GraficaData
} from '../interfaces/viatico.interface';

@Injectable({
    providedIn: 'root'
})
export class ViaticosService {
    private apiUrl = `${environment.apiUrl}/viaticos`;

    constructor(private http: HttpClient) { }

    private getAuthHeaders(): HttpHeaders {
        const credentials = btoa(`${environment.basicAuth.username}:${environment.basicAuth.password}`);
        return new HttpHeaders()
            .set('Authorization', `Basic ${credentials}`);
    }

    getDashboardMetrics(): Observable<DashboardMetrics> {
        return this.http.get<DashboardMetrics>(
            `${this.apiUrl}/metricas`,
            { headers: this.getAuthHeaders() }
        );
    }

    getAllViaticos(): Observable<Viatico[]> {
        return this.http.get<Viatico[]>(
            this.apiUrl,
            { headers: this.getAuthHeaders() }
        );
    }

    getViaticosByIdentificacion(numeroIdentificacion: string): Observable<Viatico[]> {
        return this.http.get<Viatico[]>(
            `${this.apiUrl}/consulta/${numeroIdentificacion}`,
            { headers: this.getAuthHeaders() }
        );
    }

    getViaticoById(id: string): Observable<Viatico> {
        return this.http.get<Viatico>(
            `${this.apiUrl}/${id}`,
            { headers: this.getAuthHeaders() }
        );
    }

    createViatico(viatico: CreateViaticoRequest): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(
            this.apiUrl,
            viatico,
            { headers: this.getAuthHeaders() }
        );
    }

    uploadDocumentos(viaticoId: string, file: File): Observable<ApiResponse> {
        const formData = new FormData();
        formData.append('file', file);
        
        return this.http.post<ApiResponse>(
            `${this.apiUrl}/${viaticoId}/documentos`,
            formData,
            { headers: this.getAuthHeaders() }
        );
    }

    getGraficaMensual(año: number): Observable<GraficaData> {
        return this.http.get<GraficaData>(
            `${this.apiUrl}/grafica-mensual/${año}`,
            { headers: this.getAuthHeaders() }
        );
    }
}