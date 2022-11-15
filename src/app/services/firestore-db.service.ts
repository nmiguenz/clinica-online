import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytes,
} from '@angular/fire/storage';
import { EstadoTurno } from '../classes/turno';

@Injectable({
  providedIn: 'root',
})
export class FirestoreDbService {
  // Get a reference to the storage service, which is used to create references in your storage bucket
  storage = getStorage();

  constructor(private db: AngularFirestore) {}

  async uploadImage(ruta: string, nombre: string, imgBase64: any) {
    try {
      // console.log(ref(this.storage, ruta + "/"+ nombre));
      let storageRef = await ref(this.storage, ruta + '/' + nombre);
      let urlRes = '';

      await uploadBytes(storageRef, imgBase64)
        .then()
        .catch((error) => console.log(error));

      await getDownloadURL(storageRef).then((response: string) => {
        urlRes = response;
      });
      return urlRes;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async alta(objeto: any, nombreColeccion: string) {
    try {
      return await this.db.collection(nombreColeccion).add(objeto);
    } catch (error) {
      console.log('Error al realizar alta a Firebase: ', error);
      return error;
    }
  }

  async altaConId(
    id: string,
    objeto: any,
    nombreColeccion: string
  ): Promise<any> {
    try {
      return await this.db.doc(`${nombreColeccion}/${id}`).set(objeto);
    } catch (error) {
      console.log('Error al realizar alta a Firebase: ', error);
      return error;
    }
  }

  async baja(id: string, nombreColeccion: string) {
    try {
      return await this.db.collection(nombreColeccion).doc(id).delete();
    } catch (error) {
      console.log('Error al realizar baja a Firebase: ', error);
      return error;
    }
  }

  async getCollection(nombreColeccion: string) {
    try {
      return await this.db.collection(nombreColeccion).snapshotChanges();
    } catch (error) {
      console.log('Error al obtener los objetos de Firebase: ', error);
      return error;
    }
  }

  async getCollectionByField(
    collectionName: string,
    operator: '<' | '>' | '==' | '<=' | '>=',
    field: string,
    objectName: string
  ) {
    try {
      return await this.db
        .collection(collectionName, (ref) =>
          ref.where(field, operator, objectName)
        )
        .valueChanges();
    } catch (error) {
      return error;
    }
  }

  getUser(
    collectionName: string,
    operator: '<' | '>' | '==' | '<=' | '>=',
    field: string,
    objectName: string
  ) {
    return this.db
      .collection(collectionName, (ref) =>
        ref.where(field, operator, objectName)
      )
      .snapshotChanges();
  }

  async getDocById(collectionName: string, id: string) {
    try {
      return await this.db.collection(collectionName).doc(id).get();
    } catch (error) {
      console.log('Error al obtener el documento por el id: ', error);
      return error;
    }
  }

  async delete(collectionName: string, id: string) {
    try {
      return await this.db.collection(collectionName).doc(id).delete();
    } catch (error) {
      console.log('Error al realizar el delete: ', error);
    }
  }

  async update(collectionName: string, id: string, dato: any) {
    try {
      return await this.db.collection(collectionName).doc(id).set(dato);
    } catch (error) {
      console.log('Error al realizar el update: ', error);
    }
  }

  // Consultas ESPECIALES
  getDisponibilidadesByEspecialistaEspecialidad(
    dniEspecialista: string,
    especialidad: string
  ) {
    return this.db
      .collection('horarios_especialidad', (ref) =>
        ref
          .where('especialista.dni', '==', dniEspecialista)
          .where('especialidad', '==', especialidad)
      )
      .snapshotChanges();
  }

  getTurnosFinalizadosByEspecialista(dni: number) {
    return this.db
      .collection('turnos', (ref) =>
        ref
          .where('datosEspecialista.dni', '==', dni)
          .where('estado', '==', EstadoTurno.finalizado)
      )
      .snapshotChanges();
  }

  //list = array de elementos de algun tipo. Similar a WHERE DATO IN ()
  getByList(campoFiltro: string, list: any[]) {
    return this.db
      .collection('usuarios', (ref) => ref.where(campoFiltro, 'in', list))
      .snapshotChanges();
  }

  getHistoriasByEspecialistaPaciente(
    dniEspecialista: string,
    dniPaciente: string
  ) {
    return this.db
      .collection('historiaClinica', (ref) =>
        ref
          .where('especialista.dni', '==', dniEspecialista)
          .where('paciente.dni', '==', dniPaciente)
      )
      .snapshotChanges();
  }

  getHistoriasByEspecialistaPacienteOrderLimit(
    dniEspecialista: string,
    dniPaciente: string,
    orderCampo: string,
    tipoOrden: 'asc' | 'desc',
    limite: number
  ) {
    return this.db
      .collection('historiaClinica', (ref) =>
        ref
          .where('especialista.dni', '==', dniEspecialista)
          .where('paciente.dni', '==', dniPaciente)
          .orderBy(orderCampo, tipoOrden)
          .limit(limite)
      )
      .snapshotChanges();
  }
}
