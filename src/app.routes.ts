import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { NotFound } from './app/pages/notfound/notfound';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'viaticos', loadChildren: () => import('./app/pages/viaticos/viaticos.routes') },
        ]
    },
    { path: 'notfound', component: NotFound },
    { path: '**', redirectTo: '/notfound' }
];
