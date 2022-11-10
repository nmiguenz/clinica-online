import { FirestoreDbService } from 'src/app/services/firestore-db.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EstadoTurno, Turno } from 'src/app/classes/turno';
import { Paciente } from 'src/app/classes/paciente';

@Component({
  selector: 'app-tabla-turnos',
  templateUrl: './tabla-turnos.component.html',
  styleUrls: ['./tabla-turnos.component.css'],
})
export class TablaTurnosComponent implements OnInit {
  @Output() seSeleccionoTurno: EventEmitter<any> = new EventEmitter<any>();
  @Input() tipoUsuario: string = '';
  @Input() usuarioMostrar: Paciente | any;

  listadoTurnosEspecialista: Turno[] = [];
  listadoTurnosPaciente: Turno[] = [];
  filter: string = '';

  constructor(private db: FirestoreDbService) {}

  ngOnInit(): void {
    //Listado Turnos
    if (this.usuarioMostrar.perfil == 'paciente')
      this.getTurnosPaciente(this.usuarioMostrar.dni);
    else this.getTurnosEspecialista(this.usuarioMostrar.dni);
  }

  async getTurnosPaciente(dni: number) {
    await this.db
      .getCollection('turnos')
      .then((res: any) => {
        res.subscribe((ref: any) => {
          this.listadoTurnosPaciente = [];
          ref.map((element: any) => {
            let turno = element.payload.doc.data();
            turno['id'] = element.payload.doc.id;
            if (dni == turno.datosPaciente.dni) {
              this.listadoTurnosPaciente.push(turno);
            }
          });
        });
      })
      .catch((error) => console.log(error));
  }

  async getTurnosEspecialista(dni: number) {
    await this.db
      .getCollection('turnos')
      .then((res: any) => {
        res.subscribe((ref: any) => {
          this.listadoTurnosEspecialista = [];
          ref.map((element: any) => {
            let turno = element.payload.doc.data();
            turno['id'] = element.payload.doc.id;
            if (dni == turno.datosEspecialista.dni) {
              this.listadoTurnosEspecialista.push(turno);
            }
          });
        });
      })
      .catch((error) => console.log(error));
  }

  SeleccionarTurno(turno: Turno) {
    this.seSeleccionoTurno.emit(turno);
  }

  styleObject(turno: Turno): Object {
    if (turno.estado == EstadoTurno.cancelado) {
      return {
        'background-color': 'red',
        color: 'white',
        'font-weight': '700',
        padding: '4px 8px',
        'text-align': 'center',
        'border-radius': '20px',
      };
    } else if (turno.estado == EstadoTurno.aceptado) {
      return {
        'background-color': 'blue',
        color: 'white',
        'font-weight': '700',
        padding: '4px 8px',
        'text-align': 'center',
        'border-radius': '20px',
      };
    } else if (turno.estado == EstadoTurno.rechazado) {
      return {
        'background-color': 'red',
        color: 'white',
        'font-weight': '700',
        padding: '4px 8px',
        'text-align': 'center',
        'border-radius': '20px',
      };
    } else if (turno.estado == EstadoTurno.finalizado) {
      return {
        'background-color': 'green',
        color: 'black',
        'font-weight': '700',
        padding: '4px 8px',
        'text-align': 'center',
        'border-radius': '20px',
      };
    } else {
      return {
        'background-color': 'yellow',
        color: 'black',
        'font-weight': '700',
        padding: '4px 8px',
        'text-align': 'center',
        'border-radius': '20px',
      };
    }
  }
}
