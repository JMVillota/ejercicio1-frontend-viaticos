import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormsModule, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { ViaticosService } from '../../service/viaticos.service';
import { Viatico } from '../../interfaces/viatico.interface';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'app-viaticos-table',
    standalone: true,
    imports: [
        TableModule,
        InputTextModule,
        ButtonModule,
        TagModule,
        ToastModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FileUploadModule,
        DialogModule,
        CalendarModule,
        TextareaModule,
        DividerModule,
        CardModule,
        TooltipModule,
        ProgressSpinnerModule
    ],
    providers: [MessageService],
    styleUrls: ['./viaticos-table.component.scss'],
    template: `
<div class="card">
    <p-toast position="top-right"></p-toast>

    <p-card>
        <ng-template pTemplate="header">
                <div class="header-container">
                    <div class="flex w-full">
                        <div class="flex align-items-center">
                            <div class="header-container">
                                <div class="header-title">
                                    <h2 class="text-2xl font-bold m-0 text-primary">Gestión de Viáticos</h2>
                                </div>
                                <div class="header-icon">
                                    <i class="pi pi-money-bill mr-2 text-primary"></i>
                                </div>
                            </div>

                        </div>
                        <button pButton 
                                class="p-button-rounded text-primary ml-auto" 
                                icon="pi pi-plus"
                                pTooltip="Nuevo Viático"
                                tooltipPosition="left"
                                (click)="showNuevoViaticoDialog()">
                        </button>
                    </div>
                </div>
        </ng-template>

        <div class="p-fluid">
    <p-table
        #dt
        [value]="viaticos"
        [rows]="20"                       
        [paginator]="true"
        [rowsPerPageOptions]="[20,30,50]"   
        [globalFilterFields]="['numeroIdentificacion','nombreEmpleado','motivoViaje','clienteProyecto','estado']"
        [tableStyle]="{'min-width': '75rem'}"
        [rowHover]="true"
        dataKey="id"
        [loading]="loading"
        [showCurrentPageReport]="true"
        styleClass="p-datatable-gridlines p-datatable-striped"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros">
                
                <ng-template pTemplate="caption">
                    <div class="search-container flex justify-content-end p-2">
                        <div class="search-wrapper">
                            <span class="search-icon">
                                <i class="pi pi-search"></i>
                            </span>
                            <input 
                                pInputText 
                                type="text" 
                                (input)="dt.filterGlobal($any($event.target).value, 'contains')" 
                                placeholder="Buscar en todos los campos..." 
                                class="p-inputtext-sm search-input"/>
                        </div>
                    </div>
                </ng-template>

                <ng-template pTemplate="header">
                    <tr>
                        <th class="text-center"><i class="pi pi-id-card mr-2"></i>ID</th>
                        <th class="text-center"><i class="pi pi-user mr-2"></i>Identificación</th>
                        <th class="text-center"><i class="pi pi-user mr-2"></i>Empleado</th>
                        <th class="text-center"><i class="pi pi-calendar mr-2"></i>Fecha Registro</th>
                        <th class="text-center"><i class="pi pi-info-circle mr-2"></i>Motivo</th>
                        <th class="text-center"><i class="pi pi-briefcase mr-2"></i>Cliente/Proyecto</th>
                        <th class="text-center"><i class="pi pi-flag mr-2"></i>Estado</th>
                        <th class="text-center"><i class="pi pi-cog mr-2"></i>Acciones</th>
                    </tr>
                </ng-template>

                <ng-template pTemplate="body" let-viatico>
                    <tr>
                        <td>{{viatico.id}}</td>
                        <td>{{viatico.numeroIdentificacion}}</td>
                        <td>{{viatico.nombreEmpleado}}</td>
                        <td class="text-center">{{viatico.fechaRegistro | date:'dd/MM/yyyy'}}</td>
                        <td>
                            <div class="text-overflow-ellipsis" 
                                 pTooltip="{{viatico.motivoViaje}}" 
                                 tooltipPosition="top">
                                {{viatico.motivoViaje}}
                            </div>
                        </td>
                        <td>{{viatico.clienteProyecto}}</td>
                        <td class="text-center">
                            <p-tag 
                                [value]="viatico.estado"
                                [severity]="getSeverity(viatico.estado)"
                                [rounded]="true">
                            </p-tag>
                        </td>
                        <td>
                            <div class="flex justify-content-center gap-2">
                                <button 
                                    pButton 
                                    icon="pi pi-file-import" 
                                    class="p-button-rounded p-button-info p-button-sm"
                                    pTooltip="Subir documentos"
                                    tooltipPosition="top"
                                    (click)="showUploadDialog(viatico)">
                                </button>
                                <button 
                                    pButton 
                                    icon="pi pi-eye" 
                                    class="p-button-rounded p-button-secondary p-button-sm"
                                    pTooltip="Ver detalles"
                                    tooltipPosition="top"
                                    (click)="verDetalles(viatico)">
                                </button>
                            </div>
                        </td>
                    </tr>
                </ng-template>

                <ng-template pTemplate="emptymessage">
                    <tr>
                        <td colspan="8" class="text-center p-4">
                            <div class="flex flex-column align-items-center">
                                <i class="pi pi-folder-open text-6xl text-gray-400 mb-2"></i>
                                <span>No se encontraron viáticos</span>
                            </div>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    </p-card>
</div>

<p-dialog 
    [(visible)]="displayNuevoViaticoDialog" 
    header="Nuevo Viático" 
    [modal]="true" 
    [style]="{ width: '90vw', maxWidth: '1200px' }"
    [draggable]="false" 
    [resizable]="false"
    styleClass="p-fluid viatico-dialog">
    
    <form [formGroup]="viaticoForm" class="flex gap-4">
    <!-- Columna 1: Información Personal -->
    <div class="flex-1">
        <div class="card surface-card border-1 border-round-lg p-4">
            <h3 class="text-lg font-medium pb-3 border-bottom-1 surface-border mb-4">
                <i class="pi pi-user mr-2"></i>
                Información Personal
            </h3>
            
            <div class="grid">
                <!-- Fila para Identificación -->
                <div class="col-12 mb-3">
                    <label class="block font-medium mb-2">Número de Identificación</label>
                    <div class="p-input-icon-left w-full">
                        <i class="pi pi-id-card"></i>
                        <input pInputText 
                               formControlName="numeroIdentificacion"
                               placeholder="Ingrese identificación" 
                               class="w-full"/>
                    </div>
                </div>

                <!-- Fila para Nombre -->
                <div class="col-12 mb-3">
                    <label class="block font-medium mb-2">Nombre del Empleado</label>
                    <div class="p-input-icon-left w-full">
                        <i class="pi pi-user"></i>
                        <input pInputText 
                               formControlName="nombreEmpleado"
                               placeholder="Nombre completo" 
                               class="w-full"/>
                    </div>
                </div>

                <!-- Fila para Correo -->
                <div class="col-12">
                    <label class="block font-medium mb-2">Correo del Aprobador</label>
                    <div class="p-input-icon-left w-full">
                        <i class="pi pi-envelope"></i>
                        <input pInputText 
                               formControlName="correoAprobador"
                               placeholder="correo@ejemplo.com" 
                               class="w-full"/>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Columna 2: Información del Viaje -->
    <div class="flex-1">
        <div class="card surface-card border-1 border-round-lg p-4">
            <h3 class="text-lg font-medium pb-3 border-bottom-1 surface-border mb-4">
                <i class="pi pi-calendar mr-2"></i>
                Información del Viaje
            </h3>

            <div class="grid">
                <!-- Fila para Fecha Registro -->
                <div class="col-12 mb-3">
                    <label class="block font-medium mb-2">Fecha de Registro</label>
                    <p-calendar 
                        formControlName="fechaRegistro" 
                        [showIcon]="true"
                        [maxDate]="today"
                        [minDate]="minDate"
                        dateFormat="dd/mm/yy"
                        [style]="{'width':'100%'}"
                        placeholder="Seleccione fecha"
                        [readonlyInput]="true">
                    </p-calendar>
                </div>

                <!-- Fila para Fecha Inicio -->
                <div class="col-12 mb-3">
                    <label class="block font-medium mb-2">Fecha Inicio Viaje</label>
                    <p-calendar 
                        formControlName="fechaInicioViaje" 
                        [showIcon]="true"
                        dateFormat="dd/mm/yy"
                        [style]="{'width':'100%'}"
                        placeholder="Fecha inicio"
                        [readonlyInput]="true">
                    </p-calendar>
                </div>

                <!-- Fila para Fecha Fin -->
                <div class="col-12">
                    <label class="block font-medium mb-2">Fecha Fin Viaje</label>
                    <p-calendar 
                        formControlName="fechaFinViaje" 
                        [showIcon]="true"
                        dateFormat="dd/mm/yy"
                        [style]="{'width':'100%'}"
                        placeholder="Fecha fin"
                        [readonlyInput]="true">
                    </p-calendar>
                </div>
            </div>
        </div>
    </div>

    <!-- Columna 3: Detalles Adicionales -->
    <div class="flex-1">
        <div class="card surface-card border-1 border-round-lg p-4">
            <h3 class="text-lg font-medium pb-3 border-bottom-1 surface-border mb-4">
                <i class="pi pi-info-circle mr-2"></i>
                Detalles Adicionales
            </h3>

            <div class="grid">
                <!-- Fila para Cliente/Proyecto -->
                <div class="col-12 mb-3">
                    <label class="block font-medium mb-2">Cliente/Proyecto</label>
                    <div class="p-input-icon-left w-full">
                        <i class="pi pi-briefcase"></i>
                        <input pInputText 
                               formControlName="clienteProyecto"
                               placeholder="Nombre del cliente o proyecto" 
                               class="w-full"/>
                    </div>
                </div>

                <!-- Fila para Motivo -->
                <div class="col-12">
                    <label class="block font-medium mb-2">Motivo del Viaje</label>
                    <textarea 
                        pInputTextarea 
                        formControlName="motivoViaje" 
                        rows="4"
                        class="w-full"
                        placeholder="Describa el motivo del viaje">
                    </textarea>
                </div>
            </div>
        </div>
        </div>
    </form>

    <ng-template pTemplate="footer">
        <div class="flex justify-content-end gap-2 pt-2 surface-border border-top-1">
            <button pButton 
                    label="Cancelar" 
                    icon="pi pi-times" 
                    class="p-button-text" 
                    (click)="hideNuevoViaticoDialog()">
            </button>
            <button pButton 
                    label="Guardar" 
                    icon="pi pi-save" 
                    class="text-primary" 
                    (click)="saveViatico()"
                    [loading]="loading">
            </button>
        </div>
    </ng-template>
</p-dialog>

<p-dialog 
    [(visible)]="displayUploadDialog" 
    header="Subir Documentos" 
    [modal]="true" 
    [style]="{ width: '40vw' }"
    [draggable]="false" 
    [resizable]="false"
    [dismissableMask]="true">
    
    <div class="upload-container">
        <p-fileUpload
            #fileUpload
            mode="basic"
            chooseLabel="Seleccionar ZIP"
            [auto]="false"
            accept=".zip"
            [maxFileSize]="10000000"
            (onSelect)="onFileSelect($event)"
            [customUpload]="true"
            styleClass="w-full"
            chooseIcon="pi pi-upload">
        </p-fileUpload>
        
        <small class="text-gray-500 mt-2 block">
            <i class="pi pi-info-circle mr-1"></i>
            Solo archivos ZIP hasta 10MB
        </small>

        <!-- Información del archivo seleccionado -->
        <div *ngIf="selectedFile" class="mt-4 p-4 surface-card border-round">
            <div class="flex align-items-center mb-3">
                <i class="pi pi-file-export text-primary mr-2"></i>
                <span class="font-medium">Archivo seleccionado: {{selectedFile.name}}</span>
            </div>
            
            <div class="flex align-items-center">
                <i class="pi pi-file-pdf text-primary mr-2"></i>
                <span>Archivos PDF encontrados: {{archivosPDF}}</span>
            </div>
        </div>
    </div>

    <ng-template pTemplate="footer">
        <div class="flex justify-content-end gap-2">
            <button pButton 
                    label="Cancelar" 
                    icon="pi pi-times" 
                    class="p-button-text" 
                    (click)="hideUploadDialog()">
            </button>
            <button pButton 
                    label="Subir" 
                    icon="pi pi-upload" 
                    class="p-button-primary" 
                    [disabled]="!selectedFile"
                    (click)="uploadDocumentos()">
            </button>
        </div>
    </ng-template>
</p-dialog>
    `
})
export class ViaticosTableComponent implements OnInit {
    viaticos: Viatico[] = [];
    loading: boolean = true;
    displayNuevoViaticoDialog: boolean = false;
    displayUploadDialog: boolean = false;
    viaticoForm: FormGroup;
    selectedViatico: Viatico | null = null;
    today: Date = new Date();
    minDate: Date;
    selectedFile: File | null = null;
    archivosPDF: number = 0;

    constructor(
        private viaticosService: ViaticosService,
        private messageService: MessageService,
        private fb: FormBuilder
    ) {
        // Calcular fecha mínima (90 días atrás)
        this.minDate = new Date();
        this.minDate.setDate(this.minDate.getDate() - 90);

        this.viaticoForm = this.fb.group({
            numeroIdentificacion: ['', [Validators.required, Validators.minLength(5)]],
            nombreEmpleado: ['', [Validators.required, Validators.minLength(3)]],
            fechaRegistro: ['', [
                Validators.required,
                (control: AbstractControl): ValidationErrors | null => {
                    const fecha = new Date(control.value);
                    const hoy = new Date();
                    const minDate = new Date();
                    minDate.setDate(minDate.getDate() - 90);

                    if (fecha > hoy) {
                        return { futureDate: true };
                    }
                    if (fecha < minDate) {
                        return { tooOld: true };
                    }
                    return null;
                }
            ]],
            motivoViaje: ['', [Validators.required, Validators.minLength(10)]],
            clienteProyecto: ['', [Validators.required]],
            fechaInicioViaje: ['', [Validators.required]],
            fechaFinViaje: ['', [Validators.required]],
            correoAprobador: ['', [Validators.required, Validators.email]]
        }, {
            validators: this.fechaViajeValidator
        });
    }

    fechaViajeValidator(form: FormGroup) {
        const fechaInicio = form.get('fechaInicioViaje')?.value;
        const fechaFin = form.get('fechaFinViaje')?.value;

        if (fechaInicio && fechaFin && new Date(fechaFin) < new Date(fechaInicio)) {
            return { fechasInvalidas: true };
        }
        return null;
    }

    ngOnInit() {
        this.cargarViaticos();
    }

    cargarViaticos() {
        this.loading = true;
        this.viaticosService.getAllViaticos()
            .subscribe({
                next: (data) => {
                    this.viaticos = data;
                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error cargando viáticos:', error);
                    this.loading = false;
                    this.mostrarError('Error al cargar los viáticos');
                }
            });
    }

    mostrarError(mensaje: string) {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: mensaje,
            life: 5000
        });
    }

    mostrarExito(mensaje: string) {
        this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: mensaje,
            life: 3000
        });
    }

    showNuevoViaticoDialog() {
        this.viaticoForm.reset();
        this.displayNuevoViaticoDialog = true;
    }

    hideNuevoViaticoDialog() {
        this.displayNuevoViaticoDialog = false;
        this.viaticoForm.reset();
    }

    showUploadDialog(viatico: Viatico) {
        this.selectedViatico = viatico;
        this.displayUploadDialog = true;
    }

    hideUploadDialog() {
        this.displayUploadDialog = false;
        this.selectedViatico = null;
    }

    saveViatico() {
        if (this.viaticoForm.valid) {
            this.loading = true;
            const formData = this.viaticoForm.value;

            // Asegurar formato de fechas correcto
            formData.fechaRegistro = new Date(formData.fechaRegistro).toISOString().split('T')[0];
            formData.fechaInicioViaje = new Date(formData.fechaInicioViaje).toISOString().split('T')[0];
            formData.fechaFinViaje = new Date(formData.fechaFinViaje).toISOString().split('T')[0];

            this.viaticosService.createViatico(formData)
                .subscribe({
                    next: (response) => {
                        this.mostrarExito('Viático creado exitosamente');
                        this.hideNuevoViaticoDialog();
                        this.cargarViaticos();
                    },
                    error: (error) => {
                        this.mostrarError(error.error.message || 'Error al crear el viático');
                        this.loading = false;
                    }
                });
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validación',
                detail: 'Por favor complete todos los campos requeridos correctamente',
                life: 5000
            });
            Object.keys(this.viaticoForm.controls).forEach(key => {
                const control = this.viaticoForm.get(key);
                if (control?.invalid) {
                    control.markAsTouched();
                }
            });
        }
    }

    async onFileSelect(event: any) {
        const file = event.files[0];
        if (!file.name.toLowerCase().endsWith('.zip')) {
          this.mostrarError('Por favor seleccione un archivo ZIP');
          return false;
        }
        
        this.selectedFile = file;
        
        // Usar JSZip para leer el contenido del ZIP
        try {
          const JSZip = (await import('jszip')).default;
          const zip = new JSZip();
          const contents = await zip.loadAsync(file);
          
          // Contar archivos PDF
          this.archivosPDF = Object.keys(contents.files).filter(
            filename => filename.toLowerCase().endsWith('.pdf')
          ).length;
          
          return true;
        } catch (error) {
          this.mostrarError('Error al leer el archivo ZIP');
          return false;
        }
      }

      uploadDocumentos() {
        if (!this.selectedViatico || !this.selectedFile) return;
    
        this.viaticosService.uploadDocumentos(this.selectedViatico.id, this.selectedFile)
          .subscribe({
            next: (response) => {
              this.mostrarExito(`Documentos subidos correctamente. PDFs procesados: ${response.numeroArchivos}`);
              this.hideUploadDialog();
              this.selectedFile = null;
              this.archivosPDF = 0;
            },
            error: (error) => {
              this.mostrarError(error.error.message || 'Error al subir los documentos');
            }
          });
      }

    getSeverity(estado: string): 'success' | 'warn' | 'danger' | 'info' | 'secondary' | 'contrast' | undefined {
        switch (estado.toLowerCase()) {
            case 'aprobado':
                return 'success';
            case 'pendiente':
                return 'warn';
            case 'rechazado':
                return 'danger';
            default:
                return 'info';
        }
    }

    verDetalles(viatico: Viatico) {
        this.viaticosService.getViaticoById(viatico.id)
            .subscribe({
                next: (data) => {
                    // Implementar lógica para mostrar detalles
                    console.log('Detalles del viático:', data);
                },
                error: (error) => {
                    this.mostrarError('Error al cargar los detalles del viático');
                }
            });
    }
}