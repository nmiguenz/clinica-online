import { updateProfile } from 'firebase/auth';
import { Especialista } from './../classes/especialista';
import { Paciente } from 'src/app/classes/paciente';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserPerfil } from '../interface/user-perfil';
import { Administrador } from '../classes/administrador';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userObject : any;
  pacienteLogueado : Paciente | any;
  especialistaLogueado : Especialista | any;
  adminLogueado : Administrador | any;

  private currentUserSubject: BehaviorSubject<UserPerfil> = new BehaviorSubject({} as UserPerfil);
  public readonly currentUser: Observable<UserPerfil> = this.currentUserSubject.asObservable();

  constructor(private auth : AngularFireAuth) { }

  setCurrentUser(currentUser: UserPerfil): void {
    this.currentUserSubject.next(currentUser);
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


  setLoggedUserByTipe(){
    let user = localStorage.getItem('usuarioLogueado');
    if (user != null){
      this.userObject = JSON.parse(user)
    }

    if(this.userObject['perfil'] == 'paciente'){
      this.pacienteLogueado = new Paciente(
        this.userObject['nombre'],
        this.userObject['apellido'],
        this.userObject['edad'],
        this.userObject['dni'],
        this.userObject['obraSocial'],
        this.userObject['mail'],
        this.userObject['password'],
        this.userObject['fotoUno'],
        this.userObject['fotoDos'],
        this.userObject['perfil']);
        return this.pacienteLogueado;
    }
    else if (this.userObject['perfil'] == 'especialista'){
      this.especialistaLogueado = new Especialista(
        this.userObject['nombre'],
        this.userObject['apellido'],
        this.userObject['edad'],
        this.userObject['dni'],
        this.userObject['especialidad'],
        this.userObject['mail'],
        this.userObject['password'],
        this.userObject['fotoUno'],
        this.userObject['perfil'],
        this.userObject['habilitado'])
        return this.especialistaLogueado;
    }else{
      this.adminLogueado = new Administrador(
        this.userObject['nombre'],
        this.userObject['apellido'],
        this.userObject['edad'],
        this.userObject['dni'],
        this.userObject['mail'],
        this.userObject['password'],
        this.userObject['fotoUno'],
        this.userObject['perfil'],
        this.userObject['habilitado'])
        return this.adminLogueado;
    }
  }

  //Devuelve un observable con el estado.
  isLoggedIn() {
    return this.auth.authState;
  }
}
