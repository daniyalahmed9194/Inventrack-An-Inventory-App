import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductcardsComponent } from './productcards/productcards.component';
import { SuppliersComponent } from './suppliers/suppliers.component';

export const routes: Routes = [
    {
        path: '',
        component: LoginComponent,
    },
    {
        path: 'login',
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path: 'productcard', 
        component: ProductcardsComponent
    },
    {
        path: 'suppliers',
        component: SuppliersComponent
    }
];
