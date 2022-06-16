import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccesoRoutingModule } from './acceso-routing.module';
import { AccesoComponent } from './acceso.component';
import { LoginComponent } from 'src/app/components/login/login.component';
import { RegisterComponent } from 'src/app/components/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingComponent } from 'src/app/components/loading/loading.component';


@NgModule({
  declarations: [
    AccesoComponent,
    LoginComponent,
    RegisterComponent,
    LoadingComponent
  ],
  imports: [
    CommonModule,
    AccesoRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class AccesoModule { }
