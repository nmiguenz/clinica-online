import { Pipe, PipeTransform } from '@angular/core';
import { HistoriaClinica } from '../classes/historia-clinica';
import { Turno } from '../classes/turno';
import { FirestoreDbService } from '../services/firestore-db.service';

@Pipe({
  name: 'filtroTurnos',
})
export class FiltroTurnosPipe implements PipeTransform {
  historiasClinicas: any[] = [];

  constructor(public db: FirestoreDbService) {
    db.getCollection('historiaClinica')
      .then((ref: any) => {
        ref.subscribe((listadoRef: any) => {
          this.historiasClinicas = listadoRef.map((historia: any) => {
            return {
              historia: historia.payload.doc.data(),
              dni: historia.payload.doc.data().paciente.dni,
            };
          });
          console.log(this.historiasClinicas);
        });
      })
      .catch((error: any) => console.log(error));
  }

  transform(turnos: Turno[], filter: string): any {
    if (!turnos || !filter) {
      return turnos;
    }
    let historiasFiltradas = this.historiasClinicas.filter(
      (historia) =>
        historia.historia.altura.toString().indexOf(filter) !== -1 ||
        historia.historia.peso.toString().indexOf(filter) !== -1 ||
        historia.historia.clave1.toString().indexOf(filter) !== -1 ||
        historia.historia.clave2.toString().indexOf(filter) !== -1 ||
        historia.historia.clave3.toString().indexOf(filter) !== -1 ||
        historia.historia.fecha.toString().indexOf(filter) !== -1 ||
        historia.historia.presion.toString().indexOf(filter) !== -1 ||
        historia.historia.temperatura.toString().indexOf(filter) !== -1 ||
        historia.historia.valor1.toString().indexOf(filter) !== -1 ||
        historia.historia.valor2.toString().indexOf(filter) !== -1 ||
        historia.historia.valor3.toString().indexOf(filter) !== -1
    );

    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return turnos.filter(
      (turno) =>
        turno.datosPaciente.nombre.indexOf(filter) !== -1 ||
        turno.datosPaciente.apellido.indexOf(filter) !== -1 ||
        turno.datosPaciente.dni.toString().indexOf(filter) !== -1 ||
        turno.datosPaciente.edad.toString().indexOf(filter) !== -1 ||
        turno.datosPaciente.obraSocial.indexOf(filter) !== -1 ||
        turno.datosEspecialista.mail.indexOf(filter) !== -1 ||
        turno.datosEspecialista.nombre.indexOf(filter) !== -1 ||
        turno.datosEspecialista.apellido.indexOf(filter) !== -1 ||
        turno.especialidad.indexOf(filter) !== -1 ||
        turno.calificacion.indexOf(filter) !== -1 ||
        turno.comentario.indexOf(filter) !== -1 ||
        turno.encuesta.indexOf(filter) !== -1 ||
        turno.estado.indexOf(filter) !== -1 ||
        turno.fecha.toString().indexOf(filter) !== -1 ||
        turno.resenia.indexOf(filter) !== -1 ||
        historiasFiltradas.find((historia) => {
          return historia.dni.toString() == turno.datosPaciente.dni.toString();
        })
    );
  }
}
