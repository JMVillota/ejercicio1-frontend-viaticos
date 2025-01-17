import { Routes } from '@angular/router';

import { ViaticosTableComponent } from './viaticos';


export default [
    { path: 'viaticos', data: { breadcrumb: 'Viaticos' }, component: ViaticosTableComponent },
] as Routes;
