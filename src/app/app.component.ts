import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { FirestoreDbService } from './services/firestore-db.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'clinicaOnline';
  estilo: any;
  local: any;

  constructor(private auth: AuthService) {
    this.local = localStorage.getItem('loggedUser');
    if (this.local) {
      this.auth.usuarioLogueado = JSON.parse(this.local);
    }
  }

  ngOnInit(): void {
    this.estilo = document.querySelectorAll('body');
  }
}
