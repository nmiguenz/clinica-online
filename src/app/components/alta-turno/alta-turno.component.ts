import { AuthService } from './../../services/auth.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Especialista } from 'src/app/classes/especialista';
import { Paciente } from 'src/app/classes/paciente';
import { EstadoTurno, Turno } from 'src/app/classes/turno';
import { FirestoreDbService } from 'src/app/services/firestore-db.service';

@Component({
  selector: 'app-alta-turno',
  templateUrl: './alta-turno.component.html',
  styleUrls: ['./alta-turno.component.css']
})
export class AltaTurnoComponent implements OnInit {
  formGroup : FormGroup | any;
  filter = '';
  tipoUsuario = ''

  //Spinner
  loading : boolean = false;

  //Listados
  listaEspecialistas : Especialista[] = [];
  listaEspecialidad : any[] = [];
  listaEspecialidadFiltrada : any[] = [];
  pacienteLoggeado : Paciente | any;

  //Usuarios del turno
  especialistaSeleccionado : Especialista | any;
  especialidadSeleccionado : any;

  constructor(private db : FirestoreDbService, private auth : AuthService, private fb : FormBuilder) {

    this.pacienteLoggeado = this.auth.usuarioLogueado;
    console.log(this.pacienteLoggeado);

    this.formGroup = this.fb.group({
      'especialista' : ['', [Validators.required]],
      'especialidad' : ['', [Validators.required]],
      'paciente' : [this.pacienteLoggeado.nombre + ' ' + this.pacienteLoggeado.apellido, [Validators.required]],
      'fecha' : ['', [Validators.required]]
    })

    //Get de usuarios
    this.getEspecialistas();
    this.getEspecialidades();
  }

  ngOnInit(): void {
  }

  //GETTERS
  async getEspecialistas(){
    let especialista = await this.db.getUser('usuarios','==','perfil','especialista').subscribe((usuarios: any) => {
      if (usuarios != null) {
        usuarios.forEach((element: any) => {
          this.listaEspecialistas.push(element.payload.doc.data());
        });
      }
      especialista.unsubscribe();
    });
  }

  async getEspecialidades(){
    await this.db.getCollection('especialidad')
    .then((res:any)=> res.subscribe((element:any)=>{
        element.forEach((especialidadRef:any) => {
          this.listaEspecialidad.push(especialidadRef.payload.doc.data());
        })
    }))
    .catch(error=>console.log(error));
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

  seleccionarEspecialista(especialista : Especialista){
    this.tipoUsuario = 'especialidad';
    this.filter = '';

    //Filtro de especialidad
    this.listaEspecialidadFiltrada = this.filtroUnicoEspecialidad(especialista.especialidad);
    //fin filtro de especialidad

    this.formGroup.controls.especialista.setValue(especialista.nombre + ' ' + especialista.apellido);
    this.especialistaSeleccionado = especialista;
  }

  seleccionarEspecialidad(espe : string){
    this.tipoUsuario = 'peciente';
    this.filter = '';
    this.formGroup.controls.especialidad.setValue(espe);
  }

  async altaTurno(){

      const turno = new Turno(
        this.especialistaSeleccionado,
        this.formGroup.value.especialidad,
        this.pacienteLoggeado,
        this.formGroup.value.fecha,
        EstadoTurno.pendiente,
        "",
        "",
        ""
      );

      try {
        if (turno != null){
          // this.loading = true;
          this.loading = true;

          await this.db.alta(JSON.parse(JSON.stringify(turno)), 'turnos')
          .then(()=>{
            this.resetParametros();
            // this.loading = false;
            this.loading = false;
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
    this.formGroup.controls.paciente.setValue(this.pacienteLoggeado.nombre + ' ' + this.pacienteLoggeado.apellido);
  }
}
