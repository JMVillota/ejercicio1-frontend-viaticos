import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';
import { LayoutService } from '../../../layout/service/layout.service';
import { ViaticosService } from '../../../service/viaticos.service';

@Component({
    standalone: true,
    selector: 'app-revenue-stream-widget',
    imports: [ChartModule, CalendarModule, FormsModule],
    template: `
    <div class="card !mb-8">
        <div class="flex justify-between items-center mb-6 px-2">
            <div class="font-semibold text-xl">Viáticos por Mes</div>
            <div class="flex items-center gap-3 ml-auto">
                <span class="text-gray-600 whitespace-nowrap">Seleccionar año:</span>
                <p-calendar 
                    [(ngModel)]="selectedYear" 
                    view="year" 
                    dateFormat="yy" 
                    [showIcon]="true"
                    (onSelect)="onYearChange()"
                    styleClass="year-calendar"
                    [inputStyle]="{
                        'width': '100px',
                        'font-size': '1.1rem',
                        'padding': '0.5rem',
                        'text-align': 'center'
                    }"
                    [style]="{'min-width': '140px'}"
                    [readonlyInput]="true"
                ></p-calendar>
            </div>
        </div>
        <p-chart 
            type="bar" 
            [data]="chartData" 
            [options]="chartOptions" 
            class="h-96" 
        />
    </div>
    `,
    styles: [`
        :host ::ng-deep .year-calendar .p-calendar {
            width: 140px;
        }
        :host ::ng-deep .p-inputtext {
            width: 100px !important;
        }
    `]
})
export class RevenueStreamWidget {
    chartData: any;
    chartOptions: any;
    subscription!: Subscription;
    selectedYear: Date = new Date(2024, 0, 1); // Inicializa en 2024

    constructor(
        public layoutService: LayoutService,
        private viaticosService: ViaticosService
    ) {
        this.subscription = this.layoutService.configUpdate$.pipe(debounceTime(25)).subscribe(() => {
            this.initChart();
        });
    }

    ngOnInit() {
        this.loadChartData();
    }

    onYearChange() {
        this.loadChartData();
    }

    loadChartData() {
        const year = this.selectedYear.getFullYear();
        this.viaticosService.getGraficaMensual(year).subscribe({
            next: (response) => {
                if (response.status === 'success') {
                    this.updateChartData(response.data.X, response.data.Y);
                }
            },
            error: (error) => {
                console.error('Error al cargar datos de la gráfica:', error);
            }
        });
    }

    updateChartData(labels: string[], values: number[]) {
        const documentStyle = getComputedStyle(document.documentElement);

        this.chartData = {
            labels: labels,
            datasets: [
                {
                    type: 'bar',
                    label: 'Cantidad de Viáticos',
                    backgroundColor: documentStyle.getPropertyValue('--p-primary-400'),
                    hoverBackgroundColor: documentStyle.getPropertyValue('--p-primary-600'),
                    data: values,
                    barThickness: 40,
                    borderRadius: {
                        topLeft: 10,
                        topRight: 10,
                        bottomLeft: 0,
                        bottomRight: 0
                    },
                    borderSkipped: false
                }
            ]
        };

        this.initChartOptions();
    }

    initChart() {
        this.initChartOptions();
        this.loadChartData();
    }

    initChartOptions() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const borderColor = documentStyle.getPropertyValue('--surface-border');
        const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

        this.chartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    backgroundColor: documentStyle.getPropertyValue('--surface-card'),
                    titleColor: textColor,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    bodyColor: textColor,
                    borderColor: borderColor,
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context: any) {
                            return `Cantidad: ${context.raw} viático${context.raw !== 1 ? 's' : ''}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textMutedColor,
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'transparent',
                        borderColor: borderColor
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textMutedColor,
                        font: {
                            size: 12
                        },
                        stepSize: 1
                    },
                    grid: {
                        color: borderColor,
                        borderColor: borderColor,
                        drawTicks: false
                    }
                }
            },
            animation: {
                duration: 750,
                easing: 'easeInOutQuart'
            },
            responsive: true,
            hover: {
                mode: 'index',
                intersect: false
            }
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}