import { Component, Input, OnInit } from '@angular/core';
import { Administrador } from 'src/app/classes/administrador';
import { Especialista } from 'src/app/classes/especialista';
import { Paciente } from 'src/app/classes/paciente';

@Component({
  selector: 'app-seccion-usuario',
  templateUrl: './seccion-usuario.component.html',
  styleUrls: ['./seccion-usuario.component.css']
})
export class SeccionUsuarioComponent implements OnInit {

  // administrador: Administrador | any;
  // paciente: Paciente | any;
  // especialista: Especialista | any;
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
