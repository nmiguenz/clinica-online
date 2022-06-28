import { Turno } from 'src/app/classes/turno';
import { Especialista } from 'src/app/classes/especialista';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-turnos-especialista',
  templateUrl: './turnos-especialista.component.html',
  styleUrls: ['./turnos-especialista.component.css']
})
export class TurnosEspecialistaComponent implements OnInit {

  @Input() especialistaLogueadoInput : Especialista | any;
  @Input() turnoSeleccionado : Turno | any;

  constructor() { }

  ngOnInit(): void {
  }

  mostrar(turno : Turno){
    this.turnoSeleccionado = turno;
  }

}
