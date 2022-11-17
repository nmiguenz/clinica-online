import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appVerEspecialidad]',
})
export class VerEspecialidadDirective {
  constructor(public el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.especialidadHighlight('#0dbb9d', '#fff');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.especialidadHighlight('', '');
  }

  private especialidadHighlight(color: string, colorText: string) {
    this.el.nativeElement.style.backgroundColor = color;
    this.el.nativeElement.style.color = colorText;
  }
}
