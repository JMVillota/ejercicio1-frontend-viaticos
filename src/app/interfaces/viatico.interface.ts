export interface ApiResponse {
    message: string;
    id?: string;
    numeroArchivos?: number;
    error?: string;
}

export interface CreateViaticoRequest {
    numeroIdentificacion: string;
    nombreEmpleado: string;
    fechaRegistro: string;
    motivoViaje: string;
    clienteProyecto: string;
    fechaInicioViaje: string;
    fechaFinViaje: string;
    correoAprobador: string;
}

export interface DocumentoViatico {
    id: string;
    nombreZip: string;
    rutaArchivo: string;
    numeroArchivosPdf: number;
    fechaCarga: string;
}

export interface Viatico {
    id: string;
    numeroIdentificacion: string;
    nombreEmpleado: string;
    fechaRegistro: string;
    motivoViaje: string;
    clienteProyecto: string;
    fechaInicioViaje: string;
    fechaFinViaje: string;
    correoAprobador: string;
    estado: string;
}

export interface DashboardMetrics {
    totalViaticos: number;
    viaticosPendientes: number;
    documentosTotales: number;
    viaticosDelMes: number;
}

export interface GraficaData {
    status: string;
    data: {
        X: string[];
        Y: number[];
    };
}