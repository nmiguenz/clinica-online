import { Paciente } from './../../classes/paciente';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  estaLoggeado : boolean = false;
  perfil : string = '';
  usuarioLogueado : any;
  private authServiceSubscription: Subscription | undefined;

  constructor(private auth: AuthService, private route : Router) {
    this.authServiceSubscription = this.auth.currentUser.subscribe(
      currentUser => {
        if(currentUser){
          if(currentUser.perfil == 'admin'){
            this.estaLoggeado = false;
            this.perfil = currentUser.perfil;
          }
          else{
            this.estaLoggeado = false;
            this.perfil = currentUser.perfil;
          }
          this.usuarioLogueado = this.auth.usuarioLogueado;
        }
      }
    );
  }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scroll, true)
  }

  //Animación del Navbar
  scroll(){
    if(!this.estaLoggeado){
      if(window.scrollY >= 700){
        document.body.style.setProperty('--navbar-scroll', "#eff3f5");
        document.body.style.setProperty('--navbar-scroll-text', "black");
        document.body.style.setProperty('--navbar-scroll-shadow', "0px 6px 12px -5px #000000");
      }else if(window.scrollY < 700){
        document.body.style.setProperty('--navbar-scroll', "transparent");
        document.body.style.setProperty('--navbar-scroll-text', "white");
        document.body.style.setProperty('--navbar-scroll-shadow', "none");
      }
    }
  }

  cerrarSesion(){
    this.estaLoggeado = false
    this.auth.logOut().then(res => console.log(res));
    this.route.navigateByUrl('home');
  }

}
