import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { EstadoTurno, Turno } from '../classes/turno';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  turnos : any;

  constructor(private firestore: AngularFirestore) {
    // this.turnos = firestore.collection("turnos").snapshotChanges();
  }

  // getTurnos() {
  //   return this.firestore.collection("turnos").snapshotChanges();
  // }

  // getTurnosByPaciente(email: string) {
  //   return this.firestore.collection("turnos", ref => ref.where('pacienteMail', '==', email)).snapshotChanges();
  // }

  // getTurno(turno: Turno) {
  //   return this.firestore.collection("turnos", ref => ref.where('pacienteMail', '==', turno.pacienteMail).where('especialistaMail', '==', turno.especialistaMail).where('fecha', '==', turno.fecha)).snapshotChanges();
  // }

  // getTurnosFinalizados() {
  //   return this.firestore.collection("turnos", ref => ref.where('estado', '==', EstadoTurno.finalizado)).snapshotChanges();
  // }

  // getTurnosByEspecialista(email: string) {
  //   return this.firestore.collection("turnos", ref => ref.where('especialistaMail', '==', email)).snapshotChanges();
  // }

  // getTurnosFinalizadosByEspecialista(email: string) {
  //   return this.firestore.collection("turnos", ref => ref.where('especialistaMail', '==', email).where('estado', '==', EstadoTurno.finalizado)).snapshotChanges();
  // }

  // getTurnosFinalizadosByPaciente(email: string) {
  //   return this.firestore.collection("turnos", ref => ref.where('pacienteMail', '==', email).where('estado', '==', EstadoTurno.finalizado)).snapshotChanges();
  // }

  // guardarTurno(turno: Turno) {
  //   return this.firestore.collection("turnos").add({
  //     pacienteMail: turno.pacienteMail,
  //     pacienteNombre: turno.pacienteNombre,
  //     especialidad: turno.especialidad,
  //     especialistaMail: turno.especialistaMail,
  //     especialistaNombre: turno.especialistaNombre,
  //     fecha: turno.fecha,
  //     estado: turno.estado,
  //     calificacion: turno.calificacion,
  //     resenia: turno.resenia,
  //     encuesta: turno.encuesta,
  //   });
  // }

  // cambiarEstadoTurno(turno: Turno) {
  //   let doc = this.getTurno(turno).subscribe((turnos: any) => {
  //     const turnoId = turnos[0].payload.doc.id;
  //     var turnoForUpdate = this.firestore.collection("turnos").doc(turnoId);
  //     turnoForUpdate.update({
  //       estado: turno.estado,
  //       resenia: turno.resenia
  //     })
  //       .then(() => { })
  //       .catch(((error: any) => console.log(error)));
  //     doc.unsubscribe()
  //   })
  // }

  // calificar(turno: Turno) {
  //   let doc = this.getTurno(turno).subscribe((turnos: any) => {
  //     const turnoId = turnos[0].payload.doc.id;
  //     var turnoForUpdate = this.firestore.collection("turnos").doc(turnoId);
  //     turnoForUpdate.update({
  //       calificacion: turno.calificacion,
  //     })
  //       .then(() => { })
  //       .catch(((error: any) => console.log(error)));
  //     doc.unsubscribe()
  //   })
  // }
}
