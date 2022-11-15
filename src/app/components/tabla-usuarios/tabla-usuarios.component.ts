import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Administrador } from 'src/app/classes/administrador';
import { Especialista } from 'src/app/classes/especialista';
import { Paciente } from 'src/app/classes/paciente';
import { AuthService } from 'src/app/services/auth.service';
import { EspecialistaService } from 'src/app/services/especialista.service';
import { FirestoreDbService } from 'src/app/services/firestore-db.service';

@Component({
  selector: 'app-tabla-usuarios',
  templateUrl: './tabla-usuarios.component.html',
  styleUrls: ['./tabla-usuarios.component.css'],
})
export class TablaUsuariosComponent implements OnInit {
  @Input() inputUsuarioSeleccionado: string = 'paciente';
  @Output() seSeleccionoAdministrador: EventEmitter<any> =
    new EventEmitter<any>();
  @Output() seSeleccionoPaciente: EventEmitter<any> = new EventEmitter<any>();
  @Output() seSeleccionoEspecialista: EventEmitter<any> =
    new EventEmitter<any>();

  arrayAdministradores: Administrador[] = [];
  arrayPacientes: Paciente[] = [];
  arrayEspecialistas: Especialista[] = [];

  constructor(
    private db: FirestoreDbService,
    private especSrv: EspecialistaService
  ) {}

  ngOnInit(): void {
    //Coleccin de pacientes
    this.db
      .getCollectionByField('usuarios', '==', 'perfil', 'paciente')
      .then((ref: any) =>
        ref.subscribe((arg: any) => {
          this.arrayPacientes = arg.map((element: any) => {
            return element;
          });
        })
      )
      .catch((error) => console.log(error));

    //Colecci�n de especialistas
    this.db
      .getCollectionByField('usuarios', '==', 'perfil', 'especialista')
      .then((ref: any) =>
        ref.subscribe((arg: any) => {
          this.arrayEspecialistas = arg.map((element: any) => {
            return element;
          });
        })
      )
      .catch((error) => console.log(error));

    //Colecci�n de Administradores
    this.db
      .getCollectionByField(
        'usuarios',
        '==',
        'perfil',
        'admin' || 'administrador'
      )
      .then((ref: any) =>
        ref.subscribe((arg: any) => {
          this.arrayAdministradores = arg.map((element: any) => {
            return element;
          });
        })
      )
      .catch((error) => console.log(error));
  }

  administradorSeleccionado(administrador: Administrador) {
    this.seSeleccionoAdministrador.emit(administrador);
  }

  pacienteSeleccionado(paciente: Paciente) {
    this.seSeleccionoPaciente.emit(paciente);
  }

  especialistaSeleccionado(especialista: Especialista) {
    this.seSeleccionoEspecialista.emit(especialista);
  }

  habilitarEspecialista(especialista: Especialista, habilitado: any) {
    especialista.habilitado = habilitado.target.checked;
    this.especSrv.habilitarDeshabilitarEspecialista(especialista);
  }
}
