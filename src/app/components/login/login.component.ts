import { UserPerfil } from './../../interface/user-perfil';
import { Especialista } from './../../classes/especialista';
import { Paciente } from './../../classes/paciente';
import { FirestoreDbService } from './../../services/firestore-db.service';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SlowBuffer } from 'buffer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  eyeToggle : string = '';
  loading: boolean = false;
  formGroup : FormGroup | any;
  user : any = null;

  constructor(private auth : AuthService, private fb : FormBuilder, private route: Router, private db: FirestoreDbService) {
    this.formGroup = this.fb.group({
      'mail' : ['', [Validators.required, Validators.email]],
      'password' : ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
    })
  }

  ngOnInit(): void {}

  mostrarPassword(){
		var input = <HTMLInputElement>document.getElementById("pass");
    var eye = <HTMLElement>document.getElementById("eye");
		if(input.type == "password"){
			input.type = "text";
			this.eyeToggle = input.type;
		}
    else{
			input.type = "password";
      this.eyeToggle = input.type;
		}
	}

  async ingreso(){

    await this.db.getCollectionByField('usuarios','==','mail',this.formGroup.value.mail)
    .then((res: any) => {
      this.loading = true;
      res.subscribe((arg:any) =>{
        this.user = arg['0'];

        if(this.user){

          //Chequeo si el EMAIL del PACIENTE!!! ESTÁ VERIFICADO
          if(this.user.perfil == 'paciente'){
            this.auth.login(this.formGroup.value.mail, this.formGroup.value.password)
            .then((res:any)=>{

                if(res.user.emailVerified == true){
                  localStorage.setItem('usuarioLogueado', JSON.stringify(this.user));

                  this.auth.setCurrentUser({perfil: this.user.perfil, isLogged:true});
                  this.loading = false;
                  this.route.navigateByUrl('/backoffice');
                }
                else{
                  console.log('No verificó el mail.');
                  this.loading = false;
                  this.route.navigateByUrl('/home');
                }
            })
            .catch((error:any)=> {
              console.log(error);
              this.loading = false;
            });
          }
          else{
            //Chequeo que estén habilitados en la DB los ADMIN y los especialistas
            if(this.user.habilitado == true){

                localStorage.setItem('usuarioLogueado', JSON.stringify(this.user));

                this.auth.setCurrentUser({perfil: this.user.perfil, isLogged:true});
                this.loading = false;
                this.route.navigateByUrl('/backoffice');
              }
              else{
                console.log('No verificó el mail.');
                this.loading = false;
                this.route.navigateByUrl('/home');
              }
          }

        }
        else{
          console.log('No existe usuario con ese email');
          this.loading = false;
        }

      })})
    .catch((error:any)=> {
      console.log(error);
      this.loading = false;
    });


  }


}
