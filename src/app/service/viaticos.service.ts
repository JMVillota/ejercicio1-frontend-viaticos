// src/app/services/viaticos.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
    Viatico, 
    CreateViaticoRequest, 
    DocumentoViatico, 
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

    getDashboardMetrics(): Observable<DashboardMetrics> {
        return this.http.get<DashboardMetrics>(`${this.apiUrl}/metricas`);
    }

    // Obtener todos los viáticos
    getAllViaticos(): Observable<Viatico[]> {
        return this.http.get<Viatico[]>(this.apiUrl);
    }

    // Obtener viáticos por número de identificación
    getViaticosByIdentificacion(numeroIdentificacion: string): Observable<Viatico[]> {
        return this.http.get<Viatico[]>(`${this.apiUrl}/consulta/${numeroIdentificacion}`);
    }

    // Obtener viático por ID
    getViaticoById(id: string): Observable<Viatico> {
        return this.http.get<Viatico>(`${this.apiUrl}/${id}`);
    }

    // Crear nuevo viático
    createViatico(viatico: CreateViaticoRequest): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(this.apiUrl, viatico);
    }

    // Subir documentos para un viático
    uploadDocumentos(viaticoId: string, file: File): Observable<ApiResponse> {
        const formData = new FormData();
        formData.append('file', file);
        
        return this.http.post<ApiResponse>(`${this.apiUrl}/${viaticoId}/documentos`, formData);
    }

    getGraficaMensual(año: number): Observable<GraficaData> {
        return this.http.get<GraficaData>(`${this.apiUrl}/grafica-mensual/${año}`);
    }

    // Método auxiliar para manejar errores (puedes expandirlo según necesites)
    private handleError(error: any): Observable<never> {
        console.error('An error occurred:', error);
        throw error;
    }

}