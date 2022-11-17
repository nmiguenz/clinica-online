import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaptchaComponent } from 'src/app/components/captcha/captcha.component';
import { DetallaHistoriaClinicaComponent } from 'src/app/components/detalla-historia-clinica/detalla-historia-clinica.component';
import { FormsModule } from '@angular/forms';
import { FiltroTurnosPipe } from 'src/app/pipes/filtro-turnos.pipe';
import { FiltrarEspecialidadPipe } from 'src/app/pipes/filtrar-especialidad.pipe';
import { VerEspecialidadDirective } from 'src/app/directives/ver-especialidad.directive';
import { FiltrarPacienteHistoriaPipe } from 'src/app/pipes/filtrar-paciente-historia.pipe';

@NgModule({
  declarations: [
    CaptchaComponent,
    DetallaHistoriaClinicaComponent,
    FiltroTurnosPipe,
    FiltrarEspecialidadPipe,
    VerEspecialidadDirective,
    FiltrarPacienteHistoriaPipe,
  ],
  imports: [CommonModule, FormsModule],
  exports: [
    CaptchaComponent,
    DetallaHistoriaClinicaComponent,
    FiltroTurnosPipe,
    FiltrarEspecialidadPipe,
    VerEspecialidadDirective,
    FiltrarPacienteHistoriaPipe,
  ],
})
export class GeneralesModule {}
