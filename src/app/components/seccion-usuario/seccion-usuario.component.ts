import { Component, Input, OnInit } from '@angular/core';
import { Paciente } from 'src/app/classes/paciente';

@Component({
  selector: 'app-seccion-usuario',
  templateUrl: './seccion-usuario.component.html',
  styleUrls: ['./seccion-usuario.component.css'],
})
export class SeccionUsuarioComponent implements OnInit {
  perfil: string = '';
  mostrar: boolean = false;
  pacienteSeleccionado: Paciente | any;

  constructor() {}

  ngOnInit(): void {}

  cambiarTabla(perfil: string) {
    this.reset();
    this.perfil = perfil;
  }

  reset() {
    this.perfil = '';
  }

  pacienteElegido(event: any) {
    this.pacienteSeleccionado = event;
    this.mostrar = true;
  }

  accionVentanaUsuarios(event: any) {
    this.mostrar = event;
  }
}
