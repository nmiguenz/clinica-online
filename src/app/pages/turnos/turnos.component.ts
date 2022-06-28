import { Component, Input, OnInit } from '@angular/core';
import { Paciente } from 'src/app/classes/paciente';
import { Turno } from 'src/app/classes/turno';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})
export class TurnosComponent implements OnInit {

  @Input() usurioLogueadoInput : Paciente | any;
  turnoSeleccionado : Turno | any;

  constructor() { }

  ngOnInit(): void {
  }

  mostrar(turno : Turno){
    this.turnoSeleccionado = turno;
  }

}
