import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccesoRoutingModule } from './acceso-routing.module';
import { AccesoComponent } from './acceso.component';
import { LoginComponent } from 'src/app/components/login/login.component';
import { RegisterComponent } from 'src/app/components/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { GeneralesModule } from '../generales/generales.module';

@NgModule({
  declarations: [
    AccesoComponent,
    LoginComponent,
    RegisterComponent,
    LoadingComponent,
  ],
  imports: [
    CommonModule,
    NgMultiSelectDropDownModule.forRoot(),
    AccesoRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxCaptchaModule,
    GeneralesModule,
  ],
})
export class AccesoModule {}
