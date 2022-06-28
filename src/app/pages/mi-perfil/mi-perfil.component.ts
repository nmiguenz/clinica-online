import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent implements OnInit {

  usuario : any;
  perfil = '';
  foto = '';
  listaEspecialidades : any[] = [];

  constructor(private auth : AuthService) { }

  ngOnInit(): void {
    this.usuario = this.auth.usuarioLogueado;
    this.listaEspecialidades = Object.values(this.usuario.especialidad);
    this.perfil = this.usuario.perfil;
    this.foto = this.usuario.fotoUno;
  }

  cambiarFoto(){
    if(this.foto == this.usuario.fotoUno){
      this.foto = this.usuario.fotoDos;
    }
    else{
      this.foto = this.usuario.fotoUno;
    }
  }

}
