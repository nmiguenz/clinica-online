import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaptchaComponent } from 'src/app/components/captcha/captcha.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CaptchaComponent],
  imports: [CommonModule, FormsModule],
  exports: [CaptchaComponent],
})
export class GeneralesModule {}
