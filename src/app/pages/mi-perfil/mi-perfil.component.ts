import { Component, DoCheck, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css'],
})
export class MiPerfilComponent implements OnInit {
  usuario: any;
  perfil = '';
  foto = '';
  listaEspecialidades: any[] = [];

  constructor(private auth: AuthService) {
    this.usuario = this.auth.usuarioLogueado;
    this.foto = this.usuario.fotoUno;
  }

  ngOnInit(): void {
    if (this.usuario.perfil == 'especialista') {
      this.listaEspecialidades = Object.values(this.usuario.especialidad);
    }
  }

  cambiarFoto() {
    if (this.foto == this.usuario.fotoUno) {
      this.foto = this.usuario.fotoDos;
    } else {
      this.foto = this.usuario.fotoUno;
    }
  }
}
