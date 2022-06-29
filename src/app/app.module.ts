import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

//Modulos AngularFire
import { AngularFireModule } from '@angular/fire/compat';
// import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { MisTurnosComponent } from './pages/mis-turnos/mis-turnos.component';
import { SolicitarTurnoComponent } from './pages/solicitar-turno/solicitar-turno.component';
import { MiPerfilComponent } from './pages/mi-perfil/mi-perfil.component';
import { TurnosPacienteComponent } from './components/turnos-paciente/turnos-paciente.component';
import { TurnosEspecialistaComponent } from './components/turnos-especialista/turnos-especialista.component';
import { TablaTurnosComponent } from './components/tabla-turnos/tabla-turnos.component';
import { DetalleTurnoComponent } from './components/detalle-turno/detalle-turno.component';
import { AltaTurnoComponent } from './components/alta-turno/alta-turno.component';
import { LoadingGeneralComponent } from './components/loading-general/loading-general.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { FiltroMisturnosPacientePipe } from './pipes/filtro-misturnos-paciente.pipe';
import { FiltroMisturnosEspecialistaPipe } from './pipes/filtro-misturnos-especialista.pipe';
import { MisHorariosComponent } from './components/mis-horarios/mis-horarios.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MisTurnosComponent,
    SolicitarTurnoComponent,
    MiPerfilComponent,
    TurnosPacienteComponent,
    TurnosEspecialistaComponent,
    TablaTurnosComponent,
    DetalleTurnoComponent,
    AltaTurnoComponent,
    LoadingGeneralComponent,
    FiltroMisturnosPacientePipe,
    FiltroMisturnosEspecialistaPipe,
    MisHorariosComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    NgxCaptchaModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
