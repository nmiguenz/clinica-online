import { Especialista } from './../../classes/especialista';
import { Paciente } from './../../classes/paciente';
import { FirestoreDbService } from './../../services/firestore-db.service';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  eyeToggle : string = '';
  loading: boolean = false;
  formGroup : FormGroup | any;
  user : any;

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
    //Chequeo si el EMAIL ESTá VERIFICADO
    await this.auth.login(this.formGroup.value.mail, this.formGroup.value.password)
    .then((res:any)=>{

      if(res.user.emailVerified == true){
        this.loading = true;
        //Obtengo el usuario
        this.db.getDocById('usuarios', res.user.uid)
          .then((ref:any) => {
            ref.subscribe((docRef:any) => {
              this.user = docRef.data(); //datos del usuario loggeado

              localStorage.setItem('usuarioLogueado', JSON.stringify(this.user));

              this.auth.setCurrentUser({perfil: this.user.perfil, isLogged:true});
              this.loading = false;
              this.route.navigateByUrl('/backoffice');
            });
          })
          .catch(error=> console.log(error));
        }
        else{
          console.log('No verificó el mail.')
          this.route.navigateByUrl('/home');
        }
      })
    .catch(error => console.log(error));

  }


}
