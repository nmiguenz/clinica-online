import { TurnosService } from './../../services/turnos.service';
import { AuthService } from 'src/app/services/auth.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EstadoTurno, Turno } from 'src/app/classes/turno';

@Component({
  selector: 'app-tabla-turnos',
  templateUrl: './tabla-turnos.component.html',
  styleUrls: ['./tabla-turnos.component.css']
})
export class TablaTurnosComponent implements OnInit {

  @Output() seSeleccionoTurno: EventEmitter<any> = new EventEmitter<any>();
  @Input() tipoUsuario: string = '';

  arrayTurnosAdministrador: Turno[] = [];
  arrayTurnosPaciente: Turno[] = [];
  arrayTurnosEspecialista: Turno[] = [];
  filter: string = '';
  mensajeFiltro: string = '';



  constructor(
    public turnosService: TurnosService,
    // public especialistaService: EspecialistaService,
    // public pacienteService: PacienteService
    private auth : AuthService
  ) { }

  ngOnInit(): void {
    // let loggedUser = this.auth.usuarioLogueado;
    // if (this.tipoUsuario == 'especialista') {
    //   this.turnosService.getTurnosByEspecialista(loggedUser.mail).subscribe((turnos: any) => {
    //     let listaTurnosEspecialista: Turno[] = [];
    //     for (let index = 0; index < turnos.length; index++) {
    //       const turno = turnos[index];
    //       listaTurnosEspecialista.push(turno.payload.doc.data());
    //     }
    //     this.arrayTurnosEspecialista = listaTurnosEspecialista;
    //   })
    //   this.mensajeFiltro = 'Buscar por especialidad o paciente';
    // }
    // else if (this.tipoUsuario == 'paciente') {
    //   this.turnosService.getTurnosByPaciente(loggedUser.mail).subscribe((turnos: any) => {
    //     let listaTurnosPaciente: Turno[] = [];
    //     for (let index = 0; index < turnos.length; index++) {
    //       let turno: Turno = turnos[index].payload.doc.data()
    //       listaTurnosPaciente.push(turno);
    //     }
    //     this.arrayTurnosPaciente = listaTurnosPaciente;
    //   })
    //   this.mensajeFiltro = 'Buscar por especialidad o especialista';
    // }
    // else if (this.tipoUsuario == 'administrador') {
    //   this.turnosService.getTurnos().subscribe((turnos: any) => {
    //     let listaTurnosAdministrador: Turno[] = [];
    //     for (let index = 0; index < turnos.length; index++) {
    //       const turno = turnos[index];
    //       listaTurnosAdministrador.push(turno.payload.doc.data());
    //     }
    //     this.arrayTurnosAdministrador = listaTurnosAdministrador;
    //   })
    //   this.mensajeFiltro = 'Buscar por especialidad o especialista';
    // }
  }

  SeleccionarTurno(turno: Turno) {
    this.seSeleccionoTurno.emit(turno);

  }

  styleObject(turno: Turno): Object {
    if (turno.estado == EstadoTurno.cancelado) {
      return { color: "red", 'font-weight': "bold" }
    }
    else if (turno.estado == EstadoTurno.aceptado) {
      return { color: "green", 'font-weight': "bold" }

    } else if (turno.estado == EstadoTurno.rechazado) {
      return { color: "red", 'font-weight': "bold" }

    } else if (turno.estado == EstadoTurno.finalizado) {
      return { color: "blue", 'font-weight': "bold" }

    }
    return {}
  }

}
