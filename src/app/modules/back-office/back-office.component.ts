import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Administrador } from './../../classes/administrador';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-back-office',
  templateUrl: './back-office.component.html',
  styleUrls: ['./back-office.component.css']
})
export class BackOfficeComponent implements OnInit {

  pantallaSeleccionada :  string = '';
  adminUser : Administrador | any;
  loading : boolean = false;
  private authServiceSubscription: Subscription | undefined;

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
    this.authServiceSubscription = this.auth.currentUser.subscribe(
      currentUser => {
          //Estado de logueo
          currentUser.isLogged = false;
          //perfil
          currentUser.perfil = '';
        })
    this.auth.logOut().then(() => {
      this.authServiceSubscription?.unsubscribe();
      this.route.navigateByUrl('home');
    });
  }

}
