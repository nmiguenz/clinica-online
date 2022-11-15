import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaptchaComponent } from 'src/app/components/captcha/captcha.component';
import { DetallaHistoriaClinicaComponent } from 'src/app/components/detalla-historia-clinica/detalla-historia-clinica.component';
import { FormsModule } from '@angular/forms';
import { FiltroTurnosPipe } from 'src/app/pipes/filtro-turnos.pipe';

@NgModule({
  declarations: [
    CaptchaComponent,
    DetallaHistoriaClinicaComponent,
    FiltroTurnosPipe,
  ],
  imports: [CommonModule, FormsModule],
  exports: [
    CaptchaComponent,
    DetallaHistoriaClinicaComponent,
    FiltroTurnosPipe,
  ],
})
export class GeneralesModule {}
