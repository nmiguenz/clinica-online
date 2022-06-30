import { FirestoreDbService } from './../../services/firestore-db.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EstadoTurno, Turno } from 'src/app/classes/turno';

@Component({
  selector: 'app-detalle-turno',
  templateUrl: './detalle-turno.component.html',
  styleUrls: ['./detalle-turno.component.css']
})
export class DetalleTurnoComponent implements OnInit {

  @Input() turnoSeleccionado: Turno | any = null;
  @Input() usuarioSeleccionado : any;

  //Mensajes
  mensajeBtnCancelar : string = "Cancelar turno";
  mensajeBtnResenia: string = "Ver reseña";
  mensajeCalificacion : string = "Calificar atención";
  mensajerechazar : string = "Rechazar turno";
  mensajefinalizar : string = "Finalizar Atención";

  turnoCancelado: boolean = false;
  verResenia: boolean = false;
  calificar : boolean = false;
  rechazado : boolean = false;
  finalizado : boolean = false;

  //Forms
  formCancelacionTurno : FormGroup | any;
  formCalificacion : FormGroup | any;
  formFinalizar : FormGroup | any;

  constructor(private fb : FormBuilder, private db : FirestoreDbService) {

    this.formCancelacionTurno = this.fb.group({
      comentario : ['', Validators.required]
    });

    this.formCalificacion = this.fb.group({
      comentario : ['', Validators.required],
      calificacion : ['', [Validators.required, Validators.min(1), Validators.max(10)]]
    });

    this.formFinalizar = this.fb.group({
      resenia : ['', Validators.required],
    });
   }

  ngOnInit(): void {
  }

  mostrarOcultarCancelacion(){
    if (this.turnoCancelado == false) {
      this.turnoCancelado = true;
      this.mensajeBtnCancelar = "Cerrar";
    }
    else {
      this.turnoCancelado = false;
      this.mensajeBtnCancelar = "Cancelar turno";
    }
  }

  cancelarTurno(turno : Turno, usuario : any){
    turno.estado = EstadoTurno.cancelado;
    if(usuario.perfil == 'paciente'){
      turno.comentario = this.formCancelacionTurno.value.comentario + ' // Cancelación realizada por el Paciente: ' + usuario.nombre + ' ' + usuario.apellido;
    }
    else{
      turno.comentario = this.formCancelacionTurno.value.comentario + ' // Cancelación realizada por el Especialista: ' + usuario.nombre + ' ' + usuario.apellido;
    }
    this.db.update('turnos', this.turnoSeleccionado.id, turno)
    .then(res => alert(res))
    .catch(error => alert(error))
  }

  mostrarResenia(){
    if (this.verResenia == false) {
      this.verResenia = true;
      this.mensajeBtnResenia = "Ocultar reseña";
    }
    else {
      this.verResenia = false;
      this.mensajeBtnResenia = "Ver reseña";
    }
  }

  mostrarCalificarAtencion(){
    if (this.calificar == false) {
      this.calificar = true;
      this.mensajeCalificacion = "Ocultar calificación";
    }
    else {
      this.calificar = false;
      this.mensajeCalificacion = "Calificar atención";
    }
  }

  calificarAtencion(turno : Turno){
    turno.comentario = this.formCalificacion.value.comentario;
    turno.calificacion = this.formCalificacion.value.calificacion;
    this.db.update('turnos', this.turnoSeleccionado.id, turno)
    .then(res => {
      this.formCalificacion.reset();
      this.calificar = false;
      alert('Gracias por calificarnos')
    })
    .catch(error => alert(error))
  }

  mostrarRechazarTurno(){
    if (this.rechazado == false) {
      this.rechazado = true;
      this.mensajerechazar = "Cerrar";
    }
    else {
      this.rechazado = false;
      this.mensajerechazar = "Rechazar turno";
    }
  }

  rechazarTurno(turno : Turno, usuario : any){
    turno.estado = EstadoTurno.rechazado;
    turno.comentario = this.formCancelacionTurno.value.comentario + ' // Rechazo realizado por el Especialista: ' + usuario.nombre + ' ' + usuario.apellido;

    this.db.update('turnos', this.turnoSeleccionado.id, turno)
    .then(res => alert(res))
    .catch(error => alert(error))
  }

  aceptarTurno(turno: Turno){
    turno.estado = EstadoTurno.aceptado;
    this.db.update('turnos', this.turnoSeleccionado.id, turno)
    .then(res => alert('Exito'))
    .catch(error => alert(error))
  }

  mostrarFinalizarAtencion(){
    if (this.finalizado == false) {
      this.finalizado = true;
      this.mensajefinalizar = "Cerrar";
    }
    else {
      this.finalizado = false;
      this.mensajefinalizar = "Finalizar Atención";
    }
  }

  finalizarTurno(turno : Turno, usuario : any){
    turno.estado = EstadoTurno.finalizado;
    turno.resenia = this.formFinalizar.value.resenia;
    this.db.update('turnos', this.turnoSeleccionado.id, turno)
    .then(res => alert('Exito'))
    .catch(error => alert(error))
  }

}
