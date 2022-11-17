import { MiPerfilComponent } from './pages/mi-perfil/mi-perfil.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AltaTurnoComponent } from './components/alta-turno/alta-turno.component';
import { MisTurnosComponent } from './pages/mis-turnos/mis-turnos.component';
import { SolicitarTurnoComponent } from './pages/solicitar-turno/solicitar-turno.component';
import { MisPacientesComponent } from './pages/mis-pacientes/mis-pacientes.component';
import { AuthGuard } from './guards/auth.guard';
import { ControlBienvenidaGuard } from './guards/control-bienvenida.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule),
    canActivate: [ControlBienvenidaGuard],
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
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'turnos',
    component: AltaTurnoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'misTurnos',
    component: MisTurnosComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'solicitarTurno',
    component: SolicitarTurnoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'perfil',
    component: MiPerfilComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'pacientes',
    component: MisPacientesComponent,
    canActivate: [AuthGuard],
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
