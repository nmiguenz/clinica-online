import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getStorage, ref, getDownloadURL, uploadBytes } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FirestoreDbService {

  // Get a reference to the storage service, which is used to create references in your storage bucket
  storage = getStorage();

  constructor(private db:AngularFirestore) { }

  async uploadImage(ruta:string ,nombre:string, imgBase64:any){
    try {
      // console.log(ref(this.storage, ruta + "/"+ nombre));
      let storageRef = await ref(this.storage, ruta + "/"+ nombre);
      let urlRes = '';

      await uploadBytes(storageRef, imgBase64)
      .then()
      .catch(error => console.log(error));

      await getDownloadURL(storageRef).then((response : string) => {
        urlRes = response
      });
      return urlRes;
    } catch (error) {
      console.log(error);
      return error
    }
  }

  async alta(objeto : any, nombreColeccion:string){
    try {
      return await this.db.collection(nombreColeccion).add(objeto);
    } catch (error) {
      console.log('Error al realizar alta a Firebase: ', error);
      return error;
    }
  }

  async altaConId(id:string ,objeto : any, nombreColeccion:string) : Promise<any>{
    try {
      return await this.db.doc(`${nombreColeccion}/${id}`).set(objeto);
    } catch (error) {
      console.log('Error al realizar alta a Firebase: ', error);
      return error;
    }
  }

  async baja(id:string, nombreColeccion:string){
    try {
      return await this.db.collection(nombreColeccion).doc(id).delete();
    } catch (error) {
      console.log('Error al realizar baja a Firebase: ', error);
      return error;
    }
  }

  async getCollection(nombreColeccion:string){
    try {
      return await this.db.collection(nombreColeccion).snapshotChanges();
    } catch (error) {
      console.log('Error al obtener los objetos de Firebase: ', error);
      return error;
    }
  }

  async getCollectionByField(collectionName:string, operator: '<' | '>' | '==' | '<=' | '>=', field:string ,objectName:string){
    try {
      return await this.db.collection(collectionName, ref => ref.where(field, operator, objectName)).valueChanges();
    } catch (error) {
      return error
    }
  }

  async getDocById(collectionName:string, id:string) {
    try {
      return await this.db.collection(collectionName).doc(id).get();
    } catch (error) {
      console.log("Error al obtener el documento por el id: ", error);
      return error;
    }
  }

  async delete(collectionName:string , id:string) {
    try {
      return await this.db.collection(collectionName).doc(id).delete();
    } catch (error) {
      console.log("Error al realizar el delete: ", error)
    }
  }


  async update(collectionName:string, id:string, dato:any) {
    try {
      return await this.db.collection(collectionName).doc(id).set(dato);
    } catch (error) {
      console.log("Error al realizar el update: ", error)
    }
  }

  // //Crea el ID con que se va a grabar la colección.
  // async getId(){
  //   return await this.db.createId();
  // }

}
