import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {
  constructor(public el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight('#0dbb9d', 'white');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight('', '');
  }

  private highlight(color: string, color2: string) {
    this.el.nativeElement.style.backgroundColor = color;
    this.el.nativeElement.style.color = color2;
  }
}
