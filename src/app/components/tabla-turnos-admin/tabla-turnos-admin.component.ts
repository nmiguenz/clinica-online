import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EstadoTurno, Turno } from 'src/app/classes/turno';
import { FirestoreDbService } from 'src/app/services/firestore-db.service';

@Component({
  selector: 'app-tabla-turnos-admin',
  templateUrl: './tabla-turnos-admin.component.html',
  styleUrls: ['./tabla-turnos-admin.component.css']
})
export class TablaTurnosAdminComponent implements OnInit {

  @Output() seSeleccionoTurno: EventEmitter<any> = new EventEmitter<any>();
  @Input() usuarioMostrar : any;

  listadoTurnos: Turno[] = [];
  filter: string = '';


  constructor(private db : FirestoreDbService) { }

  ngOnInit(): void {
    this.getTurnos();
  }

  getTurnos(){
    this.db.getCollection('turnos')
    .then((res:any)=>{
      this.listadoTurnos = [];
      res.subscribe((ref:any)=>{
        ref.map((element:any) => {
          let turno = element.payload.doc.data();
          turno['id'] = element.payload.doc.id;
          this.listadoTurnos.push(turno);
        });
      })
    })
    .catch((error: any)=>console.log(error));
  }

  SeleccionarTurno(turno: Turno) {
    this.seSeleccionoTurno.emit(turno);

  }

  styleObject(turno: Turno): Object {
    if (turno.estado == EstadoTurno.cancelado) {
      return { 'background-color': "red", 'color': "white", 'font-weight' : '300', 'padding': "4px 8px", 'text-align': "center", 'border-radius': "20px"}
    }
    else if (turno.estado == EstadoTurno.aceptado) {
      return { 'background-color': "blue", 'color': "white", 'font-weight' : '300', 'padding': "4px 8px", 'text-align': "center", 'border-radius': "20px"}
    }
    else if (turno.estado == EstadoTurno.rechazado) {
      return { 'background-color': "red", 'color': "white", 'font-weight' : '300', 'padding': "4px 8px", 'text-align': "center", 'border-radius': "20px"}
    }
    else if (turno.estado == EstadoTurno.finalizado) {
      return { 'background-color': "green", 'color': "white", 'font-weight' : '300', 'padding': "4px 8px", 'text-align': "center", 'border-radius': "20px"}
    }
    else{
      return  {'background-color': "yellow", 'color': "black", 'font-weight' : '300', 'padding': "4px 8px", 'text-align': "center", 'border-radius': "20px"}
    }
  }

}
