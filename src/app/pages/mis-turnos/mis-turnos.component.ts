import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Paciente } from 'src/app/classes/paciente';

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.css']
})
export class MisTurnosComponent implements OnInit {

   usuarioLogueado : any;
   perfil : string = '';

  constructor(private auth : AuthService) { }

  ngOnInit(): void {
    this.usuarioLogueado = this.auth.usuarioLogueado;
    this.perfil = this.usuarioLogueado.perfil;
  }

}
