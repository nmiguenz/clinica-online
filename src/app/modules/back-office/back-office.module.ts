import { MiPerfilAdminComponent } from './../../components/mi-perfil-admin/mi-perfil-admin.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackOfficeRoutingModule } from './back-office-routing.module';
import { BackOfficeComponent } from './back-office.component';
import { SeccionUsuarioComponent } from 'src/app/components/seccion-usuario/seccion-usuario.component';
import { TablaUsuariosComponent } from 'src/app/components/tabla-usuarios/tabla-usuarios.component';
import { AdminRegisterComponent } from 'src/app/components/admin-register/admin-register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AltaTurnoAdminComponent } from 'src/app/components/alta-turno-admin/alta-turno-admin.component';
import { LoadingAdminComponent } from 'src/app/components/loading-admin/loading-admin.component';


@NgModule({
  declarations: [
    BackOfficeComponent,
    SeccionUsuarioComponent,
    TablaUsuariosComponent,
    AdminRegisterComponent,
    AltaTurnoAdminComponent,
    MiPerfilAdminComponent,
    LoadingAdminComponent
  ],
  imports: [
    CommonModule,
    BackOfficeRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class BackOfficeModule { }
