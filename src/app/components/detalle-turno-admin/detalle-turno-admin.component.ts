import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstadoTurno, Turno } from 'src/app/classes/turno';
import { FirestoreDbService } from 'src/app/services/firestore-db.service';

@Component({
  selector: 'app-detalle-turno-admin',
  templateUrl: './detalle-turno-admin.component.html',
  styleUrls: ['./detalle-turno-admin.component.css']
})
export class DetalleTurnoAdminComponent implements OnInit {

  @Input() turnoSeleccionado: Turno | any = null;
  @Input() usuarioSeleccionado : any;

  //Mensajes
  mensajeBtnCancelar : string = "Cancelar turno";

  turnoCancelado: boolean = false;

  //Forms
  formCancelacionTurno : FormGroup | any;

  constructor(private fb : FormBuilder, private db : FirestoreDbService) {

    this.formCancelacionTurno = this.fb.group({
      comentario : ['', Validators.required]
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
    turno.comentario = this.formCancelacionTurno.value.comentario + ' //Cancelación realizada por el Administrador: ' + usuario.nombre + ' ' + usuario.apellido;

    this.db.update('turnos', this.turnoSeleccionado.id, turno)
    .then(res => {
      alert(res);
      this.formCancelacionTurno.reset();
    })
    .catch(error => alert(error))
  }

}
