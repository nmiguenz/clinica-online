import { Component, Input, OnInit } from '@angular/core';
import { Paciente } from 'src/app/classes/paciente';
import { Turno } from 'src/app/classes/turno';

@Component({
  selector: 'app-turnos-paciente',
  templateUrl: './turnos-paciente.component.html',
  styleUrls: ['./turnos-paciente.component.css']
})
export class TurnosPacienteComponent implements OnInit {

  @Input() usurioLogueadoInput : Paciente | any;
  turnoSeleccionado : Turno | any;

  constructor() { }

  ngOnInit(): void {
  }

  mostrar(turno : Turno){
    this.turnoSeleccionado = turno;
  }

}
