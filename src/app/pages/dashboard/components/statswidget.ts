import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViaticosService } from '../../../service/viaticos.service';
import { DashboardMetrics } from '../../../interfaces/viatico.interface';

@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule],
    template: `
        <div class="col-span-12 lg:col-span-6 xl:col-span-3 transform transition-all duration-300 hover:scale-105">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Total Viáticos</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{metrics?.totalViaticos || 0}}</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-file text-blue-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">Total </span>
                <span class="text-muted-color">registrados</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3 transform transition-all duration-300 hover:scale-105">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Pendientes</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{metrics?.viaticosPendientes || 0}}</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-clock text-orange-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">En espera </span>
                <span class="text-muted-color">de aprobación</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3 transform transition-all duration-300 hover:scale-105">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Documentos</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{metrics?.documentosTotales || 0}}</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-folder text-cyan-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">PDFs </span>
                <span class="text-muted-color">registrados</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3 transform transition-all duration-300 hover:scale-105">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Este Mes</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{metrics?.viaticosDelMes || 0}}</div>
                    </div>
                    <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-calendar text-purple-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">Registrados </span>
                <span class="text-muted-color">este mes</span>
            </div>
        </div>`,
})
export class StatsWidget implements OnInit {
    metrics: DashboardMetrics | null = null;

    constructor(private viaticosService: ViaticosService) {}

    ngOnInit() {
        this.loadMetrics();
    }

    loadMetrics() {
        this.viaticosService.getDashboardMetrics().subscribe({
            next: (data) => {
                this.metrics = data;
            },
            error: (error) => {
                console.error('Error cargando métricas:', error);
            }
        });
    }
}