import { Component, Input, OnInit } from '@angular/core';
import { Administrador } from 'src/app/classes/administrador';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-mi-perfil-admin',
  templateUrl: './mi-perfil-admin.component.html',
  styleUrls: ['./mi-perfil-admin.component.css']
})
export class MiPerfilAdminComponent implements OnInit {

  @Input() usuario : Administrador | any;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    // this.usuario = this.auth.usuarioLogueado;
  }

}
