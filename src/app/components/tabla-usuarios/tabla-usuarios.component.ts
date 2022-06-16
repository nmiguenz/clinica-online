import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Console } from 'console';
import { Administrador } from 'src/app/classes/administrador';
import { Especialista } from 'src/app/classes/especialista';
import { Paciente } from 'src/app/classes/paciente';
import { AuthService } from 'src/app/services/auth.service';
import { EspecialistaService } from 'src/app/services/especialista.service';
import { FirestoreDbService } from 'src/app/services/firestore-db.service';

@Component({
  selector: 'app-tabla-usuarios',
  templateUrl: './tabla-usuarios.component.html',
  styleUrls: ['./tabla-usuarios.component.css']
})
export class TablaUsuariosComponent implements OnInit {

  @Input() inputUsuarioSeleccionado : string = '';
  @Output() seSeleccionoAdministrador: EventEmitter<any> = new EventEmitter<any>();
  @Output() seSeleccionoPaciente: EventEmitter<any> = new EventEmitter<any>();
  @Output() seSeleccionoEspecialista: EventEmitter<any> = new EventEmitter<any>();

  arrayAdministradores: Administrador[] = [];
  arrayPacientes: Paciente[] = [];
  arrayEspecialistas: Especialista[] = [];
  loguedUser : any;


  constructor(
    private db : FirestoreDbService,
    private auth: AuthService,
    private especSrv : EspecialistaService) {
    this.loguedUser = this.auth.setLoggedUserByTipe();
  }

  ngOnInit(): void {

    //Colección de pacientes
    this.db.getCollectionByField('usuarios','==','perfil','paciente')
    .then((ref:any) => ref.subscribe((arg:any) => {
      arg.forEach((element:any) => {
          this.arrayPacientes.push(element)
        });
    })
    ).catch(error => console.log(error));

    //Colección de especialistas
    this.db.getCollectionByField('usuarios','==','perfil','especialista')
    .then((ref:any) => ref.subscribe((arg:any) => {
      arg.forEach((element:any) => {
          this.arrayEspecialistas.push(element)
        });
    })
    ).catch(error => console.log(error));

    //Colección de Administradores
    this.db.getCollectionByField('usuarios','==','perfil','admin')
    .then((ref:any) => ref.subscribe((arg:any) => {
      arg.forEach((element:any) => {
          this.arrayAdministradores.push(element)
        });
    })
    ).catch(error => console.log(error));
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
