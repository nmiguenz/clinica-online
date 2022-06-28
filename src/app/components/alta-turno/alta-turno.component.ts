import { AuthService } from './../../services/auth.service';
import { Component, EventEmitter, OnInit, Output, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Especialista } from 'src/app/classes/especialista';
import { Paciente } from 'src/app/classes/paciente';
import { EstadoTurno, Turno } from 'src/app/classes/turno';
import { FirestoreDbService } from 'src/app/services/firestore-db.service';
import { Console } from 'console';
import { Time } from '@angular/common';

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
  listadoTurnosDisponibles: Date[] = [];

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
    // this.getEspecialidades();
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

   //Filtro las especialidades seg�n las que tiene el especialista
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

    this.formGroup.controls.especialista.setValue(especialista.nombre + ' ' + especialista.apellido);
    this.especialistaSeleccionado = especialista;

    //Filtro de especialidad
    // this.listaEspecialidadFiltrada = this.filtroUnicoEspecialidad(especialista.especialidad);
    //fin filtro de especialidad
    this.listaEspecialidad= this.especialistaSeleccionado.especialidad;
    console.log(this.listaEspecialidad);
  }

  seleccionarEspecialidad(espe : string){
    this.tipoUsuario = 'peciente';
    this.filter = '';
    this.formGroup.controls.especialidad.setValue(espe);
    this.getDisponibilidadAtencion(espe);
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

  getDisponibilidadAtencion( especialidad : string) {
    let diasSemanales = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
    this.db.getDisponibilidadesByEspecialistaEspecialidad(this.especialistaSeleccionado.dni, especialidad)
    .subscribe((ref:any)=>{
      let horarios = ref[0].payload.doc.data();
      horarios['id'] = ref[0].payload.doc.id;
      let diasHorariosAtencion = horarios;

      //Cada una de los días de atención semanal
      diasHorariosAtencion.diaHorario.forEach((datosDiaAtencion:any) => {
        let primerDia = new Date();
        let ultimoDia = new Date();
        let desde = this.extractTime(datosDiaAtencion.desde);
        let hasta = this.extractTime(datosDiaAtencion.hasta);

        //Seteo el horario de la primera atención
        primerDia.setHours(desde.hours);
        primerDia.setMinutes(desde.minutes);
        primerDia.setSeconds(0);
        primerDia.setMilliseconds(0);

        //Seteo la última atención
        ultimoDia.setDate(primerDia.getDate() + 15);

        //Setea el dia de las atenciones
        let primerDiaTurno = new Date();
        let segundoDiaTurno = new Date();
        let tercerDiaTurno = new Date();
        let ultimoTurno = new Date(); //Variable para definir el último del día


        let i = 0;

        while (primerDia <= ultimoDia){
          if (diasSemanales[primerDia.getDay()] == datosDiaAtencion.dia){
            i++;
            if(i == 1){
              primerDiaTurno = primerDia;
              this.listadoTurnosDisponibles.push(primerDiaTurno);

              ultimoTurno.setDate(primerDiaTurno.getDate());
              ultimoTurno.setHours(hasta.hours);
              ultimoTurno.setMinutes(hasta.minutes);
              ultimoTurno.setSeconds(0);
              ultimoTurno.setMilliseconds(0);

              console.log('primero',primerDia)

              while (primerDiaTurno < ultimoTurno){
                primerDiaTurno.setMinutes(primerDiaTurno.getMinutes() + diasHorariosAtencion.duracion);
                console.log(primerDiaTurno);
                this.listadoTurnosDisponibles.push(primerDiaTurno);
              }
            }
            else if(i == 2){
              segundoDiaTurno = primerDia;
              segundoDiaTurno.setHours(desde.hours);
              this.listadoTurnosDisponibles.push(segundoDiaTurno);

              let ultimoTurnoDos = new Date(); //Variable para definir el último del día
              ultimoTurnoDos.setDate(segundoDiaTurno.getDate());;
              ultimoTurnoDos.setHours(hasta.hours);
              ultimoTurnoDos.setMinutes(hasta.minutes);
              ultimoTurnoDos.setSeconds(0);
              ultimoTurnoDos.setMilliseconds(0);
              console.log('primero',segundoDiaTurno)
              console.log('primero',ultimoTurnoDos)

              while (segundoDiaTurno < ultimoTurnoDos){
                console.log('entro');
                segundoDiaTurno.setMinutes(segundoDiaTurno.getMinutes() + diasHorariosAtencion.duracion);
                console.log(segundoDiaTurno);
                this.listadoTurnosDisponibles.push(segundoDiaTurno);
              }
            }
            else{
              tercerDiaTurno = primerDia;
              ultimoTurno = tercerDiaTurno;

              let ultimoTurnoTres = new Date(); //Variable para definir el último del día
              // ultimoTurno.setDate(tercerDiaTurno.getDate());
              ultimoTurno.setHours(hasta.hours);
              ultimoTurno.setMinutes(hasta.minutes);
              ultimoTurno.setSeconds(0);
              ultimoTurno.setMilliseconds(0);

              // while (tercerDiaTurno < ultimoTurno){
              //   tercerDiaTurno.setMinutes(tercerDiaTurno.getMinutes() + diasHorariosAtencion.duracion);
              //   console.log(tercerDiaTurno);
              //   this.listadoTurnosDisponibles.push(tercerDiaTurno);
              // }
            }
          }
          primerDia.setDate(primerDia.getDate() + 1);
        }
      });
      // Fin de las atenciones semanales
    });
    this.listadoTurnosDisponibles.forEach((element:any)=>console.log(element));
  }

  extractTime(time: string): Time {
    const [h, m] = time.split(':');
    return { hours: +h, minutes: +m };
  }

}
