import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-seccion-usuario',
  templateUrl: './seccion-usuario.component.html',
  styleUrls: ['./seccion-usuario.component.css']
})
export class SeccionUsuarioComponent implements OnInit {

  perfil : string = '';

  constructor() { }

  ngOnInit(): void {
  }

  cambiarTabla(perfil: string) {
    this.reset();
    this.perfil = perfil;
  }

  reset() {
    this.perfil = '';
  }

}
