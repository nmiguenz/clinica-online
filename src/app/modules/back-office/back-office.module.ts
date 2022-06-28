import { FiltroTurnosPipe } from './../../pipes/filtro-turnos.pipe';
import { DetalleTurnoAdminComponent } from './../../components/detalle-turno-admin/detalle-turno-admin.component';
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
import { NgxCaptchaModule } from 'ngx-captcha';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TurnosComponent } from 'src/app/pages/turnos/turnos.component';
import { TablaTurnosAdminComponent } from 'src/app/components/tabla-turnos-admin/tabla-turnos-admin.component';


@NgModule({
  declarations: [
    BackOfficeComponent,
    SeccionUsuarioComponent,
    TablaUsuariosComponent,
    AdminRegisterComponent,
    AltaTurnoAdminComponent,
    MiPerfilAdminComponent,
    LoadingAdminComponent,
    TurnosComponent,
    TablaTurnosAdminComponent,
    DetalleTurnoAdminComponent,
    FiltroTurnosPipe
  ],
  imports: [
    CommonModule,
    BackOfficeRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxCaptchaModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class BackOfficeModule { }
