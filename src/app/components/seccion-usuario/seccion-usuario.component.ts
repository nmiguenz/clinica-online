import { Component, OnInit } from '@angular/core';
import { Administrador } from 'src/app/classes/administrador';
import { Especialista } from 'src/app/classes/especialista';
import { Paciente } from 'src/app/classes/paciente';

@Component({
  selector: 'app-seccion-usuario',
  templateUrl: './seccion-usuario.component.html',
  styleUrls: ['./seccion-usuario.component.css']
})
export class SeccionUsuarioComponent implements OnInit {

  administrador: Administrador | any;
  paciente: Paciente | any;
  especialista: Especialista | any;
  tipoUsuarios : string = '';

  constructor() { }

  ngOnInit(): void {
  }

  cambiarTabla(tipoUsuarios: string) {
    this.reset();
    this.tipoUsuarios = tipoUsuarios;
    console.log(tipoUsuarios);
  }

  reset() {
    if (this.administrador != null) {
      this.administrador = null;
    }
    else if (this.especialista != null) {
      this.especialista = null;
    }
    else{
      this.paciente = null;
    }
  }

}
