import { FirestoreDbService } from './../../services/firestore-db.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EstadoTurno, Turno } from 'src/app/classes/turno';
import { AlertasService } from 'src/app/services/alertas.service';
import { safeGet } from '@firebase/util';

@Component({
  selector: 'app-detalle-turno',
  templateUrl: './detalle-turno.component.html',
  styleUrls: ['./detalle-turno.component.css'],
})
export class DetalleTurnoComponent implements OnInit {
  @Input() turnoSeleccionado: Turno | any = null;
  @Input() usuarioSeleccionado: any;

  //Mensajes
  mensajeBtnCancelar: string = 'Cancelar turno';
  mensajeBtnResenia: string = 'Ver reseña';
  mensajeCalificacion: string = 'Calificar atención';
  mensajerechazar: string = 'Rechazar turno';
  mensajefinalizar: string = 'Finalizar Atención';

  turnoCancelado: boolean = false;
  verResenia: boolean = false;
  calificar: boolean = false;
  rechazado: boolean = false;
  finalizado: boolean = false;

  //Forms
  formCancelacionTurno: FormGroup | any;
  formCalificacion: FormGroup | any;
  formFinalizar: FormGroup | any;

  constructor(
    private fb: FormBuilder,
    private db: FirestoreDbService,
    private sa: AlertasService
  ) {
    this.formCancelacionTurno = this.fb.group({
      comentario: ['', Validators.required],
    });

    this.formCalificacion = this.fb.group({
      comentario: ['', Validators.required],
      calificacion: [
        '',
        [Validators.required, Validators.min(1), Validators.max(10)],
      ],
    });

    this.formFinalizar = this.fb.group({
      resenia: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  mostrarOcultarCancelacion() {
    if (this.turnoCancelado == false) {
      this.turnoCancelado = true;
      this.mensajeBtnCancelar = 'Cerrar';
    } else {
      this.turnoCancelado = false;
      this.mensajeBtnCancelar = 'Cancelar turno';
    }
  }

  cancelarTurno(turno: Turno, usuario: any) {
    turno.estado = EstadoTurno.cancelado;
    if (usuario.perfil == 'paciente') {
      turno.comentario =
        this.formCancelacionTurno.value.comentario +
        ' // Cancelación realizada por el Paciente: ' +
        usuario.nombre +
        ' ' +
        usuario.apellido;
    } else {
      turno.comentario =
        this.formCancelacionTurno.value.comentario +
        ' // Cancelación realizada por el Especialista: ' +
        usuario.nombre +
        ' ' +
        usuario.apellido;
    }
    this.db
      .update('turnos', this.turnoSeleccionado.id, turno)
      .then((res: any) =>
        this.sa.confirmacionAlert('Cancelación de turno', res)
      )
      .catch((error) => this.sa.errorAlert('Error en cancelación', error));
  }

  mostrarResenia() {
    if (this.verResenia == false) {
      this.verResenia = true;
      this.mensajeBtnResenia = 'Ocultar reseña';
    } else {
      this.verResenia = false;
      this.mensajeBtnResenia = 'Ver reseña';
    }
  }

  mostrarCalificarAtencion() {
    if (this.calificar == false) {
      this.calificar = true;
      this.mensajeCalificacion = 'Ocultar calificación';
    } else {
      this.calificar = false;
      this.mensajeCalificacion = 'Calificar atención';
    }
  }

  calificarAtencion(turno: Turno) {
    turno.comentario = this.formCalificacion.value.comentario;
    turno.calificacion = this.formCalificacion.value.calificacion;
    this.db
      .update('turnos', this.turnoSeleccionado.id, turno)
      .then((res) => {
        this.formCalificacion.reset();
        this.calificar = false;
        this.sa.confirmacionAlert(
          'Calificación correcta',
          'Gracias por calificarnos.'
        );
      })
      .catch((error) =>
        this.sa.errorAlert(
          'Error',
          'La calificación no pudo ser resalizada por ' + error
        )
      );
  }

  mostrarRechazarTurno() {
    if (this.rechazado == false) {
      this.rechazado = true;
      this.mensajerechazar = 'Cerrar';
    } else {
      this.rechazado = false;
      this.mensajerechazar = 'Rechazar turno';
    }
  }

  rechazarTurno(turno: Turno, usuario: any) {
    turno.estado = EstadoTurno.rechazado;
    turno.comentario =
      this.formCancelacionTurno.value.comentario +
      ' // Rechazo realizado por el Especialista: ' +
      usuario.nombre +
      ' ' +
      usuario.apellido;

    this.db
      .update('turnos', this.turnoSeleccionado.id, turno)
      .then((res) =>
        this.sa.confirmacionAlert(
          'Rechazo correcto',
          'Gracias por notificar el rechazo'
        )
      )
      .catch((error) => this.sa.errorAlert('Error', error));
  }

  aceptarTurno(turno: Turno) {
    turno.estado = EstadoTurno.aceptado;
    this.db
      .update('turnos', this.turnoSeleccionado.id, turno)
      .then((res) =>
        this.sa.confirmacionAlert(
          'Turno aceptado',
          'Tu paciente será notificado sobre la confirmación del turno'
        )
      )
      .catch((error) =>
        this.sa.errorAlert(
          'Error',
          'No pudimos aceptar el turno porque ' + error
        )
      );
  }

  mostrarFinalizarAtencion() {
    if (this.finalizado == false) {
      this.finalizado = true;
      this.mensajefinalizar = 'Cerrar';
    } else {
      this.finalizado = false;
      this.mensajefinalizar = 'Finalizar Atención';
    }
  }

  finalizarTurno(turno: Turno, usuario: any) {
    turno.resenia = this.formFinalizar.value.resenia;
    if (turno.resenia != '') {
      this.db
        .update('turnos', this.turnoSeleccionado.id, turno)
        .then((res: any) => {
          turno.estado = EstadoTurno.finalizado;
          this.sa.confirmacionAlert(
            'Turno finalizado',
            'Gracias por tu atención'
          );
        })
        .catch((error) =>
          this.sa.errorAlert(
            'Error al finaliza',
            'Por favor vuelve a intentarlo'
          )
        );
    } else {
      this.sa.errorAlert(
        'Error al fnializar',
        'Debe dejar una reseñia antes. '
      );
    }
  }
}
