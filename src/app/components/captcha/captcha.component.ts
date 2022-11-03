import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.css'],
})
export class CaptchaComponent implements OnInit {
  alphaNums: string[] | any;
  emptyArr: [] | any;
  captchaText: string = '';
  respuesta: string = '';
  pantalla: string = 'ingreso';

  @ViewChild('inputCaptcha') inputCaptcha: ElementRef | any;
  @Output() captchaValido: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {
    this.alphaNums = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z',
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
    ];
    this.emptyArr = [];
  }

  ngOnInit(): void {
    this.generarRandomCaptcha();
  }

  generarRandomCaptcha() {
    for (let i = 1; i <= 7; i++) {
      this.emptyArr.push(
        this.alphaNums[Math.floor(Math.random() * this.alphaNums.length)]
      );
    }
    this.captchaText = this.emptyArr.join('');
  }

  verificarRespuesta() {
    if (this.respuesta == this.captchaText) {
      this.pantalla = 'exito';
      this.emitirRespuestaCaptcha(true);
    } else {
      this.refreshCaptcha();
    }
  }

  refreshCaptcha() {
    this.emptyArr = [];
    this.inputCaptcha.nativeElement.value = '';
    this.respuesta = '';
    this.generarRandomCaptcha();
  }

  emitirRespuestaCaptcha(valor: boolean) {
    this.captchaValido.emit(valor);
  }
}
