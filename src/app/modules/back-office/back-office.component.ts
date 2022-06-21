import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Administrador } from './../../classes/administrador';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-back-office',
  templateUrl: './back-office.component.html',
  styleUrls: ['./back-office.component.css']
})
export class BackOfficeComponent implements OnInit {

  pantallaSeleccionada :  string = '';
  adminUser : Administrador | any;
  loading : boolean = false;

  constructor(private auth: AuthService, private route : Router) {
    this.adminUser = this.auth.usuarioLogueado;
  }

  ngOnInit(): void {
  }

  selectPageAdmin(nombre:string){
    this.pantallaSeleccionada = nombre;
  }

  obtenerEstadoSpinner(estado : boolean){
    this.loading = estado;
  }

  cerrarSesionAdmin(){
    this.auth.logOut().then(res => console.log(res));
    this.route.navigateByUrl('/home');
  }

}
