import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AltaTurnoComponent } from './components/alta-turno/alta-turno.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'acceso',
    loadChildren: () =>
      import('./modules/acceso/acceso.module').then((m) => m.AccesoModule),
  },
  {
    path: 'backoffice',
    loadChildren: () =>
      import('./modules/back-office/back-office.module').then(
        (m) => m.BackOfficeModule
      ),
  },
  {
    path: 'turnos',
    component: AltaTurnoComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
