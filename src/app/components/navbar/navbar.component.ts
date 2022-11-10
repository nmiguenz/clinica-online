import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Component, DoCheck, OnInit } from '@angular/core';
import { FirestoreDbService } from 'src/app/services/firestore-db.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, DoCheck {
  estaLoggeado: boolean = false;
  perfil: string = '';
  usuarioLogueado: any;
  userJson: string | any = '';

  constructor(
    private auth: AuthService,
    private route: Router,
    private db: FirestoreDbService
  ) {
    if (this.auth.usuarioLogueado != null)
      this.usuarioLogueado = this.auth.usuarioLogueado;
  }

  ngOnInit(): void {
    document.body.style.setProperty('--navbar-scroll-position', 'fixed');
    document.body.style.setProperty('--navbar-scroll-text', 'black');
    window.addEventListener('scroll', this.scroll, true);
  }

  ngDoCheck() {
    if (this.auth.usuarioLogueado != null) {
      this.perfil = this.auth.usuarioLogueado.perfil;
      this.estaLoggeado = this.auth.estaLogueado;
      this.usuarioLogueado = this.auth.usuarioLogueado;
    }

    if (this.estaLoggeado == true) {
      document.body.style.setProperty('--navbar-scroll-position', 'relative');
      document.body.style.setProperty('--navbar-scroll', '#0dbb9d');
      document.body.style.setProperty('--navbar-scroll-text', 'white');
      document.body.style.setProperty(
        '--navbar-scroll-shadow',
        '0px 6px 12px -5px #000000'
      );
    }
  }

  //Animación del Navbar
  scroll() {
    if (!this.estaLoggeado) {
      if (window.scrollY >= 700) {
        document.body.style.setProperty('--navbar-scroll', '#0a58cad1');
        // document.body.style.setProperty('--navbar-scroll-text', "black");
        document.body.style.setProperty(
          '--navbar-scroll-shadow',
          '0px 6px 12px -5px #000000'
        );
      } else if (window.scrollY < 700) {
        document.body.style.setProperty('--navbar-scroll-position', 'fixed');
        document.body.style.setProperty('--navbar-scroll', 'transparent');
        document.body.style.setProperty('--navbar-scroll-text', 'black');
        document.body.style.setProperty('--navbar-scroll-shadow', 'none');
      }
    }
  }

  cerrarSesion() {
    this.estaLoggeado = false;
    this.usuarioLogueado = null;
    this.auth
      .logOut()
      .then(() => {
        localStorage.removeItem('loggedUser');
        //Seteo el navbar style
        document.body.style.setProperty('--navbar-scroll-position', 'fixed');
        document.body.style.setProperty('--navbar-scroll', 'transparent');
        document.body.style.setProperty('--navbar-scroll-text', 'black');
        document.body.style.setProperty('--navbar-scroll-shadow', 'none');

        this.route.navigateByUrl('acceso/login');
      })
      .catch((error) => console.log(error));
  }
}
