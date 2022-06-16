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
        this.estaLoggeado = currentUser.isLogged;
        this.perfil = currentUser.perfil;
        this.usuarioLogueado = auth.setLoggedUserByTipe();
      }
    );
  }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scroll, true)
  }

  //Animación del Navbar
  scroll(){
    let navElement = document.getElementsByClassName('navbar');

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

  cerrarSesion(){
    this.auth.setCurrentUser({perfil: '', isLogged:false});
    this.auth.logOut();
    localStorage.clear();
    this.route.navigateByUrl('home');
  }

}
