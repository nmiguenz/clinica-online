import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appReposicionamiento]',
})
export class ReposicionamientoDirective {
  constructor(public elRef: ElementRef) {}

  @HostListener('click', ['$event']) onClick($event: Event) {
    this.repositions('745px', '-500px', '400px');
  }

  private repositions(right: string, top: string, altoAncho: string) {
    this.elRef.nativeElement.style.position = 'absolute';
    this.elRef.nativeElement.style.right = right;
    this.elRef.nativeElement.style.top = top;
    this.elRef.nativeElement.firstChild.style.width = altoAncho;
    this.elRef.nativeElement.firstChild.style.height = altoAncho;
  }
}
