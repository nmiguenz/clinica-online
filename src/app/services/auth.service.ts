import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserPerfil } from '../interface/user-perfil';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  usuarioLogueado : any;

  private currentUserSubject: BehaviorSubject<UserPerfil> = new BehaviorSubject({} as UserPerfil);
  public readonly currentUser: Observable<UserPerfil> = this.currentUserSubject.asObservable();

  constructor(private auth : AngularFireAuth) {
   }

  setCurrentUser(currentUser: UserPerfil) {
    this.currentUserSubject.next(currentUser); //método next(), del BehaviorSubject, le decimos a este, que guarde el currentUser que le entregaremos, nada más.
    this.usuarioLogueado = currentUser;
  }

  //
  async login(email:string, password:string) : Promise<any> {
    try {
      return await this.auth.signInWithEmailAndPassword(email,password);
    } catch (error) {
      console.log('Error en login de AuthService' ,error);
    }
  }

  //Da de alta email y contraseña
  async signUp(email:string, password:string) : Promise<any>{
    try {
      return await this.auth.createUserWithEmailAndPassword(email,password);
    } catch (error) {
      console.log('Error en register de AuthService' ,error);
    }
  }

  //Cierra la sesión del usuario
  logOut() : Promise<void> {
    return this.auth.signOut();
  }

  //Devuelve un observable con el estado.
  isLoggedIn() {
    return this.auth.authState;
  }

}
