import { EstadoTurno, Turno } from './../../classes/turno';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Paciente } from 'src/app/classes/paciente';
import { Especialista } from 'src/app/classes/especialista';
import { FirestoreDbService } from 'src/app/services/firestore-db.service';

@Component({
  selector: 'app-alta-turno-admin',
  templateUrl: './alta-turno-admin.component.html',
  styleUrls: ['./alta-turno-admin.component.css']
})
export class AltaTurnoAdminComponent implements OnInit {

  formGroup : FormGroup | any;
  filter = '';
  tipoUsuario = ''

  //Spinner
  @Output() eventoSpinner :  EventEmitter<any> = new EventEmitter<any>();
  // loading = false;

  //Listados
  listaEspecialistas : Especialista[] = [];
  listaEspecialidad : any[] = [];
  listaEspecialidadFiltrada : any[] = [];
  listaPacientes : Paciente[] = [];

  //Usuarios del turno
  especialistaSeleccionado : Especialista | any;
  especialidadSeleccionado : any;
  pacienteSeleccionado : Paciente | any;

  constructor(private db : FirestoreDbService, private fb : FormBuilder) {

    this.formGroup = this.fb.group({
      'especialista' : ['', [Validators.required]],
      'especialidad' : ['', [Validators.required]],
      'paciente' : ['', [Validators.required]],
      'fecha' : ['', [Validators.required]],

    })
    //Get de usuarios
    let especialista = this.db.getUser('usuarios','==','perfil','especialista').subscribe((usuarios: any) => {
      if (usuarios != null) {
        usuarios.forEach((element: any) => {
          this.listaEspecialistas.push(element.payload.doc.data());
        });
      }
      especialista.unsubscribe();
    });

    let paciente = this.db.getUser('usuarios','==','perfil','paciente').subscribe((usuarios: any) => {
      if (usuarios != null) {
        usuarios.forEach((element: any) => {
          this.listaPacientes.push(element.payload.doc.data());
        });
      }
      paciente.unsubscribe();
    });

    //Get Especialidad
    db.getCollection('especialidad')
    .then((res:any)=> res.subscribe((element:any)=>{
        element.forEach((especialidadRef:any) => {
          this.listaEspecialidad.push(especialidadRef.payload.doc.data());
        })
    }))
    .catch(error=>console.log(error));

  }

  ngOnInit(): void {
  }

  seleccionarEspecialista(especialista : Especialista){
    this.tipoUsuario = 'especialidad';
    this.filter = '';

    //Filtro de especialidad
    this.listaEspecialidadFiltrada = this.filtroUnicoEspecialidad(especialista.especialidad);
    //fin filtro de especialidad

    this.formGroup.controls.especialista.setValue(especialista.nombre + ' ' + especialista.apellido);
    this.especialistaSeleccionado = especialista;
  }

  //Filtro las especialidades según las que tiene el especialista
  // Devuelve un array con las especialidades
  filtroUnicoEspecialidad(speciality : string){
    const lista = this.listaEspecialidad.filter( especialidad => {
      return especialidad.nombre == speciality;
    });

    const listaFiltrada = lista.filter(function(ele , pos){
      return lista.indexOf(ele) == pos;
    });
    return listaFiltrada;
  }

  seleccionarEspecialidad(espe : string){
    this.tipoUsuario = 'peciente';
    this.filter = '';
    this.formGroup.controls.especialidad.setValue(espe);
  }

  seleccionarPaciente(paciente : Paciente){
    this.tipoUsuario = 'default';
    this.filter = '';
    this.formGroup.controls.paciente.setValue(paciente.nombre + ' ' + paciente.apellido);
    this.pacienteSeleccionado = paciente;
  }

  lanzarSpinner(loading : boolean){
    this.eventoSpinner.emit(loading);
  }

  async altaTurno(){

      const turno = new Turno(
        this.especialistaSeleccionado,
        this.formGroup.value.especialidad,
        this.pacienteSeleccionado,
        this.formGroup.value.fecha,
        EstadoTurno.pendiente,
        "",
        "",
        ""
      );

      try {
        if (turno != null){
          // this.loading = true;
          this.lanzarSpinner(true);
          // //Parseo el objeto porque Firebase no acepta los objetos CUSTOM
          // let res= await this.db.alta(JSON.parse(JSON.stringify(paciente)), 'paciente');
          await this.db.alta(JSON.parse(JSON.stringify(turno)), 'turnos')
          .then(()=>{
            this.resetParametros();
            // this.loading = false;
            this.lanzarSpinner(false);
          })
          .catch(error => console.log(error));
        }
      } catch (error) {
        console.log('Error en alta paciente: ',error);
      }
  }

  resetParametros(){
    this.tipoUsuario = '';
    this.formGroup.reset();

  }
}
