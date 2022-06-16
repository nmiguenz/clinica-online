import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackOfficeRoutingModule } from './back-office-routing.module';
import { BackOfficeComponent } from './back-office.component';
import { SeccionUsuarioComponent } from 'src/app/components/seccion-usuario/seccion-usuario.component';
import { TablaUsuariosComponent } from 'src/app/components/tabla-usuarios/tabla-usuarios.component';


@NgModule({
  declarations: [
    BackOfficeComponent,
    SeccionUsuarioComponent,
    TablaUsuariosComponent
  ],
  imports: [
    CommonModule,
    BackOfficeRoutingModule
  ]
})
export class BackOfficeModule { }
