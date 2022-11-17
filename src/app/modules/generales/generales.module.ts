import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaptchaComponent } from 'src/app/components/captcha/captcha.component';
import { DetallaHistoriaClinicaComponent } from 'src/app/components/detalla-historia-clinica/detalla-historia-clinica.component';
import { FormsModule } from '@angular/forms';
import { FiltroTurnosPipe } from 'src/app/pipes/filtro-turnos.pipe';
import { FiltrarEspecialidadPipe } from 'src/app/pipes/filtrar-especialidad.pipe';

@NgModule({
  declarations: [
    CaptchaComponent,
    DetallaHistoriaClinicaComponent,
    FiltroTurnosPipe,
    FiltrarEspecialidadPipe,
  ],
  imports: [CommonModule, FormsModule],
  exports: [
    CaptchaComponent,
    DetallaHistoriaClinicaComponent,
    FiltroTurnosPipe,
    FiltrarEspecialidadPipe,
  ],
})
export class GeneralesModule {}
