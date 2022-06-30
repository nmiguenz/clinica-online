import { UserPerfil } from './../../interface/user-perfil';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Administrador } from './../../classes/administrador';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-back-office',
  templateUrl: './back-office.component.html',
  styleUrls: ['./back-office.component.css']
})
export class BackOfficeComponent implements OnInit{

  pantallaSeleccionada :  string = 'seccionUsuario';
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
    this.auth.logOut().then(() => {
      this.auth.usuarioLogueado.perfil = '';
      this.route.navigateByUrl('home');
    });
  }
}
