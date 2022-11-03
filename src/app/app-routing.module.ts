import { MiPerfilComponent } from './pages/mi-perfil/mi-perfil.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AltaTurnoComponent } from './components/alta-turno/alta-turno.component';
import { MisTurnosComponent } from './pages/mis-turnos/mis-turnos.component';
import { SolicitarTurnoComponent } from './pages/solicitar-turno/solicitar-turno.component';
import { MisPacientesComponent } from './pages/mis-pacientes/mis-pacientes.component';

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
    component: AltaTurnoComponent,
  },
  {
    path: 'misTurnos',
    component: MisTurnosComponent,
  },
  {
    path: 'solicitarTurno',
    component: SolicitarTurnoComponent,
  },
  {
    path: 'perfil',
    component: MiPerfilComponent,
  },
  {
    path: 'pacientes',
    component: MisPacientesComponent,
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
