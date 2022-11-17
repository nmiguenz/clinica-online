import { EstadoTurno, Turno } from './../../classes/turno';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Paciente } from 'src/app/classes/paciente';
import { Especialista } from 'src/app/classes/especialista';
import { FirestoreDbService } from 'src/app/services/firestore-db.service';
import { Time } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-alta-turno-admin',
  templateUrl: './alta-turno-admin.component.html',
  styleUrls: ['./alta-turno-admin.component.css'],
})
export class AltaTurnoAdminComponent implements OnInit {
  formGroup: FormGroup | any;
  filter = '';
  tipoUsuario = '';
  turnoSeleccionado: any;

  //Spinner
  @Output() eventoSpinner: EventEmitter<any> = new EventEmitter<any>();

  //Listados
  listaEspecialistas: Especialista[] = [];
  listaEspecialistasFiltrada: Especialista[] = [];
  listaEspecialidad: any[] = [];
  // listaEspecialidadFiltrada : any[] = [];
  listaPacientes: Paciente[] = [];
  listadoTurnosDisponibles: Date[] = [];

  //Usuarios del turno
  especialistaSeleccionado: Especialista | any;
  especialidadSeleccionada = '';
  pacienteSeleccionado: Paciente | any;

  constructor(
    private db: FirestoreDbService,
    private fb: FormBuilder,
    private datepipe: DatePipe
  ) {
    this.formGroup = this.fb.group({
      especialista: ['', [Validators.required]],
      especialidad: ['', [Validators.required]],
      paciente: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
    });

    //Get de usuarios
    this.getEspecialidades();
    this.getEspecialistas();
    this.getPacientes();
  }

  ngOnInit(): void {}

  //GETTERS
  async getEspecialistas() {
    let especialista = await this.db
      .getUser('usuarios', '==', 'perfil', 'especialista')
      .subscribe((usuarios: any) => {
        if (usuarios != null) {
          usuarios.forEach((element: any) => {
            this.listaEspecialistas.push(element.payload.doc.data());
          });
        }
        especialista.unsubscribe();
      });
  }

  async getEspecialidades() {
    await this.db
      .getCollection('especialidad')
      .then((res: any) =>
        res.subscribe((element: any) => {
          element.forEach((especialidadRef: any) => {
            this.listaEspecialidad.push(especialidadRef.payload.doc.data());
          });
        })
      )
      .catch((error) => console.log(error));
  }

  async getPacientes() {
    let paciente = await this.db
      .getUser('usuarios', '==', 'perfil', 'paciente')
      .subscribe((usuarios: any) => {
        if (usuarios != null) {
          usuarios.forEach((element: any) => {
            this.listaPacientes.push(element.payload.doc.data());
          });
        }
        paciente.unsubscribe();
      });
  }

  //Filtro las especialidades según las que tiene el especialista
  // Devuelve un array con las especialidades
  filtroUnicoEspecialidad(speciality: string) {
    const lista = this.listaEspecialidad.filter((especialidad) => {
      return especialidad.nombre == speciality;
    });

    const listaFiltrada = lista.filter(function (ele, pos) {
      return lista.indexOf(ele) == pos;
    });
    return listaFiltrada;
  }

  //Crea un Array de los especialistas que tienen la especialidad seleccionada
  filtroEspecialistaByEspecialidad(especialidad: string) {
    this.listaEspecialistas.forEach((especialista: any) => {
      especialista.especialidad.forEach((especiality: any) => {
        if (especiality.nombre == especialidad) {
          this.listaEspecialistasFiltrada.push(especialista);
        }
      });
    });
  }

  seleccionarEspecialidad(espe: string) {
    this.tipoUsuario = 'especialista';
    this.filter = '';
    this.especialidadSeleccionada = espe;
    this.formGroup.controls.especialidad.setValue(espe);
    this.listadoTurnosDisponibles = [];

    this.filtroEspecialistaByEspecialidad(espe);
  }

  seleccionarEspecialista(especialista: Especialista) {
    this.tipoUsuario = 'paciente';
    this.filter = '';

    this.formGroup.controls.especialista.setValue(
      especialista.nombre + ' ' + especialista.apellido
    );
    this.especialistaSeleccionado = especialista;

    // this.listaEspecialidad = this.especialistaSeleccionado.especialidad;
    this.getDisponibilidadAtencion(
      this.especialistaSeleccionado.dni,
      this.especialidadSeleccionada
    );
  }

  seleccionarPaciente(paciente: Paciente) {
    this.tipoUsuario = 'default';
    this.filter = '';
    this.formGroup.controls.paciente.setValue(
      paciente.nombre + ' ' + paciente.apellido
    );
    this.pacienteSeleccionado = paciente;
  }

  lanzarSpinner(loading: boolean) {
    this.eventoSpinner.emit(loading);
  }

  async altaTurno() {
    const turno = new Turno(
      this.especialistaSeleccionado,
      this.formGroup.value.especialidad,
      this.pacienteSeleccionado,
      this.formGroup.value.fecha,
      EstadoTurno.pendiente,
      '',
      '',
      '',
      '',
      ''
    );

    try {
      if (turno != null) {
        // this.loading = true;
        this.lanzarSpinner(true);
        // //Parseo el objeto porque Firebase no acepta los objetos CUSTOM
        // let res= await this.db.alta(JSON.parse(JSON.stringify(paciente)), 'paciente');
        await this.db
          .alta(JSON.parse(JSON.stringify(turno)), 'turnos')
          .then(() => {
            this.resetParametros();
            // this.loading = false;
            this.lanzarSpinner(false);
          })
          .catch((error) => console.log(error));
      }
    } catch (error) {
      console.log('Error en alta paciente: ', error);
    }
  }

  resetParametros() {
    this.tipoUsuario = '';
    this.formGroup.reset();
    this.especialidadSeleccionada = '';
    this.especialistaSeleccionado = '';
    this.pacienteSeleccionado = null;
    // this.listaEspecialistas = [];
    this.listaEspecialistasFiltrada = [];
    // this.listaPacientes = [];
  }

  async getDisponibilidadAtencion(dni: string, especialidad: string) {
    let diasSemanales = [
      'domingo',
      'lunes',
      'martes',
      'miercoles',
      'jueves',
      'viernes',
      'sabado',
    ];
    await this.db
      .getDisponibilidadesByEspecialistaEspecialidad(dni, especialidad)
      .subscribe((ref: any) => {
        this.lanzarSpinner(true);
        let horarios = ref[0].payload.doc.data();
        horarios['id'] = ref[0].payload.doc.id;
        let diasHorariosAtencion = horarios;

        //Cada una de los días de atención semanal
        diasHorariosAtencion.diaHorario.forEach((datosDiaAtencion: any) => {
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

          while (primerDia <= ultimoDia) {
            if (diasSemanales[primerDia.getDay()] == datosDiaAtencion.dia) {
              i++;
              if (i == 1) {
                primerDiaTurno = new Date(primerDia);
                this.listadoTurnosDisponibles.push(primerDiaTurno);

                ultimoTurno = new Date(primerDiaTurno);
                ultimoTurno.setHours(hasta.hours);
                ultimoTurno.setMinutes(hasta.minutes);
                ultimoTurno.setSeconds(0);
                ultimoTurno.setMilliseconds(0);

                while (primerDiaTurno < ultimoTurno) {
                  primerDiaTurno.setMinutes(
                    primerDiaTurno.getMinutes() + diasHorariosAtencion.duracion
                  );
                  this.listadoTurnosDisponibles.push(new Date(primerDiaTurno));
                }
              } else if (i == 2) {
                segundoDiaTurno = new Date(primerDia);
                segundoDiaTurno.setHours(desde.hours);
                this.listadoTurnosDisponibles.push(segundoDiaTurno);

                let ultimoTurnoDos = new Date(segundoDiaTurno); //Variable para definir el último del día
                ultimoTurnoDos.setHours(hasta.hours);
                ultimoTurnoDos.setMinutes(hasta.minutes);
                ultimoTurnoDos.setSeconds(0);
                ultimoTurnoDos.setMilliseconds(0);

                while (segundoDiaTurno < ultimoTurnoDos) {
                  segundoDiaTurno.setMinutes(
                    segundoDiaTurno.getMinutes() + diasHorariosAtencion.duracion
                  );
                  this.listadoTurnosDisponibles.push(new Date(segundoDiaTurno));
                }
              } else {
                tercerDiaTurno = new Date(primerDia);
                tercerDiaTurno.setHours(desde.hours);
                this.listadoTurnosDisponibles.push(tercerDiaTurno);

                let ultimoTurnoTres = new Date(tercerDiaTurno); //Variable para definir el último del día
                ultimoTurnoTres.setHours(hasta.hours);
                ultimoTurnoTres.setMinutes(hasta.minutes);
                ultimoTurnoTres.setSeconds(0);
                ultimoTurnoTres.setMilliseconds(0);

                while (tercerDiaTurno < ultimoTurnoTres) {
                  tercerDiaTurno.setMinutes(
                    tercerDiaTurno.getMinutes() + diasHorariosAtencion.duracion
                  );
                  this.listadoTurnosDisponibles.push(new Date(tercerDiaTurno));
                }
              }
            }
            primerDia.setDate(primerDia.getDate() + 1);
          }
        });
        // Fin de las atenciones semanales
        this.borrarTurnosReservados();
        this.lanzarSpinner(false);
      });
  }

  extractTime(time: string): Time {
    const [h, m] = time.split(':');
    return { hours: +h, minutes: +m };
  }

  seleccionarTurno(turno: Date) {
    this.turnoSeleccionado = turno;
    this.formGroup.controls['fecha'].setValue(
      this.datepipe.transform(turno, 'yyyy-MM-dd HH:mm')
    );
  }

  borrarTurnosReservados() {
    this.db
      .getCollectionByField(
        'turnos',
        '==',
        'datosEspecialista.dni',
        this.especialistaSeleccionado.dni
      )
      .then((res: any) => {
        let miSuscription = res.subscribe((turnos: any) => {
          for (let index = 0; index < turnos.length; index++) {
            let turno: Turno = turnos[index];
            this.listadoTurnosDisponibles.splice(
              this.listadoTurnosDisponibles.findIndex(
                (item) =>
                  item.getTime() == new Date(turno.fecha).getTime() &&
                  (turno.estado == EstadoTurno.pendiente ||
                    turno.estado == EstadoTurno.aceptado ||
                    turno.estado == EstadoTurno.finalizado)
              ),
              1
            );
          }
          //Ordeno la lista por fecha!!!
          this.listadoTurnosDisponibles.sort((val1, val2) => {
            return val1.getTime() - val2.getTime();
          });
          miSuscription.unsubscribe();
        });
      })
      .catch((error) => console.log(error));
  }
}
