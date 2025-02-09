# Sistema de Registro de Viáticos - Frontend

## 🌐 Demo en Vivo
Puedes ver la aplicación funcionando en: https://ejercicio-viatico.vercel.app/

## 📋 Descripción
Frontend desarrollado en Angular 19 para la gestión de viáticos empresariales. Este sistema permite el registro y consulta de solicitudes de viáticos, incluyendo la carga de documentos y visualización de información.

## ✨ Características
- Registro de solicitudes de viáticos
- Carga de documentos en formato ZIP
- Consulta de solicitudes por identificación
- Visualización en grid con detalles
- Validaciones de fechas y documentos

## 🛠️ Tecnologías
- Angular 19
- PrimeNG
- TypeScript
- SCSS
- RxJS

## 📦 Requisitos Previos
- Node.js 20.x+
- npm 10.x+
- Angular CLI 19.x

## 🚀 Instalación

### 1. Clonar el Repositorio
```bash
git clone https://github.com/JMVillota/ejercicio1-frontend-viaticos.git
cd ejercicio1-frontend-viaticos
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Iniciar Servidor de Desarrollo
```bash
ng serve
```
Navegar a `http://localhost:4200/`

### 4. Compilar para Producción
```bash
ng build
```

## 💻 Funcionalidades

### Registro de Viáticos
- Formulario de ingreso con validaciones
- Datos generales: fecha de registro, nombre, identificación, motivo del viaje
- Carga y validación de archivos ZIP
- Validación de fechas (no mayor a hoy y no menor a 90 días)

### Consulta de Viáticos
- Búsqueda por identificación
- Grid con información detallada
- Dialog con número de archivos cargados
- Dashboard de Información de viaticos

## 🔗 Enlaces Relacionados
- [Backend Repository](https://github.com/JMVillota/BackEnd--Gesti-n_de_Vi-ticos)
- [Live Demo](https://ejercicio-viatico.vercel.app/)

## 👤 Autor
Jefferson Villota - [GitHub](https://github.com/JMVillota)

## 📝 Notas
Ejercicio de prueba técnica que implementa el frontend de un sistema de gestión de viáticos.