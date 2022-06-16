import { Especialista } from 'src/app/classes/especialista';
import { FirestoreDbService } from 'src/app/services/firestore-db.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EspecialistaService {

  constructor(private db : FirestoreDbService) { }

  habilitarDeshabilitarEspecialista(especialista : Especialista) {
    let documentRef = this.db.getUser('usuarios','==','dni', especialista.dni.toString()).subscribe((especialistas: any) => {
      let especialistaId = especialistas[0].payload.doc.id;
      this.db.update('usuarios', especialistaId, especialista).then(res=>console.log(res)).catch(error=>console.log(error));
      documentRef.unsubscribe();
    });

  }
}
