import { Component, OnInit } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ViaticosService } from '../../../service/viaticos.service';
import { DocumentoViaticoService } from '../../../service/documento-viatico.service';
import { Viatico } from '../../../interfaces/viatico.interface';
import { DocumentoViatico } from '../../../interfaces/viatico.interface';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    standalone: true,
    selector: 'app-recent-sales-widget',
    imports: [
        CommonModule, 
        TableModule, 
        ButtonModule, 
        RippleModule, 
        InputTextModule,
        FormsModule,
        ToastModule,
        DialogModule,
        ProgressSpinnerModule
    ],
    template: `
    <div class="card !mb-8">
        <div class="flex justify-between align-items-center mb-5">
            <div class="font-semibold text-xl">Búsqueda de Viáticos</div>
            <div class="search-container">
                <div class="search-box">
                    <i class="pi pi-search"></i>
                    <input 
                        type="text" 
                        [(ngModel)]="searchTerm"
                        (keyup.enter)="search()" 
                        placeholder="ID o documento"
                        class="search-input"/>
                </div>
            </div>
        </div>

        <p-table [value]="viaticos" [paginator]="true" [rows]="5" responsiveLayout="scroll"
                 [showCurrentPageReport]="true" currentPageReportTemplate="{first} a {last} de {totalRecords} registros">
            <ng-template pTemplate="header">
                <tr>
                    <th>ID</th>
                    <th>Empleado</th>
                    <th>Motivo</th>
                    <th>Estado</th>
                    <th>View</th>
                </tr>
            </ng-template>
            <ng-template pTemplate="body" let-viatico>
                <tr>
                    <td style="width: 15%">{{ viatico.id }}</td>
                    <td style="width: 30%">
                        <div>{{ viatico.nombreEmpleado }}</div>
                        <div class="text-sm text-gray-500">{{ viatico.numeroIdentificacion }}</div>
                    </td>
                    <td style="width: 30%">
                        <div>{{ viatico.motivoViaje }}</div>
                        <div class="text-sm text-gray-500">{{ viatico.clienteProyecto }}</div>
                    </td>
                    <td style="width: 15%">
                        <span [class]="'status-badge status-' + viatico.estado.toLowerCase()">
                            {{ viatico.estado }}
                        </span>
                    </td>
                    <td style="width: 10%">
                        <button pButton pRipple type="button" 
                                icon="pi pi-eye" 
                                (click)="showDocuments(viatico.id)"
                                class="p-button p-component p-button-text p-button-icon-only">
                        </button>
                    </td>
                </tr>
            </ng-template>

        </p-table>
    </div>

    <p-dialog 
        [(visible)]="displayDocumentDialog" 
        [header]="'Documentos del Viático ' + selectedViaticoId"
        [modal]="true"
        [style]="{width: '450px'}"
        [draggable]="false"
        [resizable]="false">
        
        <div class="document-content p-3">
            <div *ngIf="loading" class="flex justify-content-center py-3">
                <p-progressSpinner strokeWidth="4"></p-progressSpinner>
            </div>
            <div *ngIf="!loading && documentos && documentos.length > 0">
                <div *ngFor="let doc of documentos" class="mb-2">
                    <div class="text-600 text-sm mb-2">
                        ID: {{doc.id}} | {{doc.fechaCarga | date:'dd/MM/yyyy HH:mm'}}
                    </div>
                    <div class="flex align-items-start gap-2">
                        <i class="pi pi-file-pdf text-xl text-600 mt-1"></i>
                        <div class="flex-grow-1">
                            <div class="font-medium">{{doc.nombreZip}}</div>
                            <div class="text-sm text-500">{{doc.numeroArchivosPdf}} archivos adjuntos</div>
                            <div class="text-sm text-500">{{doc.rutaArchivo}}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div *ngIf="!loading && (!documentos || documentos.length === 0)" 
                class="flex flex-column align-items-center py-3">
                <i class="pi pi-file text-xl text-500 mb-2"></i>
                <span class="text-600">Sin documentos adjuntos</span>
            </div>
        </div>

        <ng-template pTemplate="footer">
            <button pButton pRipple type="button" 
                    label="Cerrar"
                    (click)="displayDocumentDialog = false"
                    class="p-button-text p-button-secondary"
                    style="color: #9C27B0;">
            </button>
        </ng-template>
    </p-dialog>

    <p-toast></p-toast>`,
    styles: [`
        .search-container {
            position: relative;
            height: 40px;
            display: flex;
            align-items: center;
        }
        
        .search-box {
            position: relative;
            width: 40px;
            height: 40px;
            border-radius: 20px;
            background: #f8f9fa;
            transition: all 0.3s ease;
            overflow: hidden;
        }
        
        .search-box:hover {
            width: 200px;
            background: #fff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .search-box .pi-search {
            position: absolute;
            top: 50%;
            left: 12px;
            transform: translateY(-50%);
            font-size: 16px;
            color: #6c757d;
            z-index: 1;
        }
        
        .search-input {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: transparent;
            padding: 0 15px 0 40px;
            font-size: 14px;
            border: 1px solid #ced4da;
            border-radius: 20px;
            outline: none;
        }

        .search-input:focus {
            border-color: var(--primary-color);
        }

        .status-badge {
            padding: 0.3rem 0.8rem;
            border-radius: 12px;
            font-size: 0.875rem;
            font-weight: 500;
        }

        .status-pendiente {
            background-color: #fff7e6;
            color: #b86d29;
        }

        .status-aprobado {
            background-color: #e6ffe6;
            color: #2d8a2d;
        }

        .status-rechazado {
            background-color: #ffe6e6;
            color: #cc3300;
        }

        .document-dialog-content {
            min-height: 300px;
            max-height: 60vh;
            overflow-y: auto;
        }

        :host ::ng-deep {
            .p-dialog {
                .p-dialog-header {
                    padding: 1rem 1.5rem;
                    border-bottom: 1px solid var(--surface-200);
                }
                
                .p-dialog-content {
                    padding: 0;
                }
                
                .p-dialog-footer {
                    padding: 0.75rem 1.25rem;
                    border-top: 1px solid var(--surface-200);
                }
            }
        }

        .document-content {
            min-height: 100px;
            max-height: 60vh;
            overflow-y: auto;
        }
        .surface-hover {
            transition: background-color 0.2s;
            border: 1px solid #dee2e6;
        }

        .surface-hover:hover {
            background-color: var(--surface-100);
        }
    `],
    providers: [MessageService]
})
export class RecentSalesWidget implements OnInit {
    searchTerm: string = '';
    viaticos: Viatico[] = [];
    displayDocumentDialog: boolean = false;
    selectedViaticoId: string = '';
    documentos: DocumentoViatico[] = [];
    loading: boolean = false;
    error: string | null = null;
 
    constructor(
        private viaticosService: ViaticosService,
        private documentoService: DocumentoViaticoService,
        private messageService: MessageService
    ) {}
 
    ngOnInit() {
        this.viaticos = [];
    }

    showDocuments(viaticoId: string) {
        this.selectedViaticoId = viaticoId;
        this.displayDocumentDialog = true;
        this.loading = true;
        this.error = null;
        this.documentos = [];

        this.documentoService.getDocumentosByViaticoId(viaticoId).subscribe({
            next: (docs) => {
                this.documentos = docs;
                this.loading = false;
            },
            error: (err) => {
                this.error = 'No se pudieron cargar los documentos. Por favor, intente nuevamente.';
                this.loading = false;
                console.error('Error loading documents:', err);
            }
        });
    }
 
    search() {
        if (!this.searchTerm.trim()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Atención',
                detail: 'Ingrese un ID o número de identificación'
            });
            return;
        }
 
        if (this.searchTerm.match(/^v-\d+$/)) {
            this.viaticosService.getViaticoById(this.searchTerm).subscribe({
                next: (response) => {
                    if (response) {
                        this.viaticos = [response];
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: 'Viático encontrado'
                        });
                    } else {
                        this.viaticos = [];
                        this.messageService.add({
                            severity: 'info',
                            summary: 'Información',
                            detail: 'No se encontró el viático'
                        });
                    }
                },
                error: (error) => {
                    console.error('Error al buscar viático:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al buscar el viático'
                    });
                    this.viaticos = [];
                }
            });
        } else {
            this.viaticosService.getViaticosByIdentificacion(this.searchTerm).subscribe({
                next: (response) => {
                    if (response && response.length > 0) {
                        this.viaticos = response;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: `Se encontraron ${response.length} viáticos`
                        });
                    } else {
                        this.viaticos = [];
                        this.messageService.add({
                            severity: 'info',
                            summary: 'Información',
                            detail: 'No se encontraron viáticos para esta identificación'});
                        }
                    },
                    error: (error) => {
                        console.error('Error al buscar viáticos:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Error al buscar viáticos'
                        });
                        this.viaticos = [];
                    }
                });
            }
        }
        
        clearSearch() {
            this.searchTerm = '';
            this.viaticos = [];
        }
     
        getStatusClass(estado: string): string {
            return 'status-' + estado.toLowerCase();
        }
    }
