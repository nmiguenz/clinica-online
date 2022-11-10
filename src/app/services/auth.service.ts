import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import { FirestoreDbService } from './firestore-db.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  usuarioLogueado: any = null;
  estaLogueado: boolean = true;
  local: string | any = '';

  constructor(private auth: AngularFireAuth, private db: FirestoreDbService) {
    this.local = localStorage.getItem('loggedUser');
    if (this.local && this.usuarioLogueado == null) {
      this.usuarioLogueado = JSON.parse(this.local);
    }
  }

  async login(email: string, password: string): Promise<any> {
    try {
      this.estaLogueado = true;
      return await this.auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      this.estaLogueado = false;
      console.log('Error en login de AuthService', error);
    }
  }

  //Da de alta email y contraseña
  async signUp(email: string, password: string): Promise<any> {
    try {
      return await this.auth.createUserWithEmailAndPassword(email, password);
    } catch (error) {
      console.log('Error en register de AuthService', error);
    }
  }

  // Obtiene el usuario logueado a partir del mail
  getUsuarioLogueado(usuario: any) {
    let usuarioSrv = this.db
      .getUser('usuarios', '==', 'mail', JSON.parse(usuario).mail)
      .subscribe((usuarios: any) => {
        if (usuarios[0] != null) {
          this.usuarioLogueado = usuarios[0].payload.doc.data();
          this.estaLogueado = true;
        }
        usuarioSrv.unsubscribe();
      });
  }

  //Cierra la sesión del usuario
  logOut(): Promise<void> {
    this.usuarioLogueado = null;
    this.estaLogueado = false;
    return this.auth.signOut();
  }
}
