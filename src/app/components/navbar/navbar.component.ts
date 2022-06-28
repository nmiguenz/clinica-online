import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Component, DoCheck, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, DoCheck{

  estaLoggeado : boolean = false;
  perfil : string = '';
  usuarioLogueado : any;
  private authServiceSubscription: Subscription | undefined;

  constructor(private auth: AuthService, private route : Router) {
    this.authServiceSubscription = this.auth.currentUser.subscribe(
      currentUser => {
        if(currentUser.perfil != undefined){
          //Usuario
          this.usuarioLogueado = currentUser;
        }
      }
    );
  }


  ngOnInit(): void {
    document.body.style.setProperty('--navbar-scroll-position', "fixed");
    document.body.style.setProperty('--navbar-scroll-text', "black");
    window.addEventListener('scroll', this.scroll, true);
  }

  ngDoCheck() {
    if(this.auth.usuarioLogueado != undefined){
      this.perfil = this.auth.usuarioLogueado.perfil;
      this.estaLoggeado = this.auth.estaLogueado;

      if(this.estaLoggeado == true){
        document.body.style.setProperty('--navbar-scroll-position', "relative");
        document.body.style.setProperty('--navbar-scroll', "#0a58cad1");
        document.body.style.setProperty('--navbar-scroll-text', "white");
        document.body.style.setProperty('--navbar-scroll-shadow', "0px 6px 12px -5px #000000");
      }
    }
  }

  //Animación del Navbar
  scroll(){
    if(!this.estaLoggeado){
      if(window.scrollY >= 700){
        document.body.style.setProperty('--navbar-scroll', "#0a58cad1");
        // document.body.style.setProperty('--navbar-scroll-text', "black");
        document.body.style.setProperty('--navbar-scroll-shadow', "0px 6px 12px -5px #000000");
      }else if(window.scrollY < 700){
        document.body.style.setProperty('--navbar-scroll-position', "fixed");
        document.body.style.setProperty('--navbar-scroll', "transparent");
        document.body.style.setProperty('--navbar-scroll-text', "black");
        document.body.style.setProperty('--navbar-scroll-shadow', "none");
      }
    }
  }

  cerrarSesion(){
    this.auth.logOut().then(()=>{
      this.authServiceSubscription?.unsubscribe();
      this.estaLoggeado = false;
      this.perfil = '';

      //Seteo el navbar style
      document.body.style.setProperty('--navbar-scroll-position', "fixed");
      document.body.style.setProperty('--navbar-scroll', "transparent");
      document.body.style.setProperty('--navbar-scroll-text', "black");
      document.body.style.setProperty('--navbar-scroll-shadow', "none");

      this.route.navigateByUrl('home');
    })
    .catch(error=>console.log(error));
  }

}
