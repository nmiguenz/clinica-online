import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadingComponent } from './components/loading/loading.component';
import { HomeComponent } from './modules/home/home.component';
import { HomeModule } from './modules/home/home.module';

const routes: Routes = [
  { path: 'home', loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule) },
  { path: 'acceso', loadChildren: () => import('./modules/acceso/acceso.module').then(m => m.AccesoModule) },
  { path: 'backoffice', loadChildren: () => import('./modules/back-office/back-office.module').then(m => m.BackOfficeModule) },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
