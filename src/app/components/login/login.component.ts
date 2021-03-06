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
  user : any = null;

  //Acceso R?pido
  email: string = '';
  password: string = '';
  public adminFotoUrl: string = '';
  public pacienteFotoUrl: string = '';
  public pacienteFotoUrl2: string = '';
  public pacienteFotoUrl3: string = '';
  public especialistaFotoUrl: string = '';
  public especialistaDosFotoUrl: string = '';

  constructor(private auth : AuthService, private fb : FormBuilder, private route: Router, private db: FirestoreDbService) {
    this.formGroup = this.fb.group({
      'mail' : ['', [Validators.required, Validators.email]],
      'password' : ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
    })
  }

  ngOnInit(): void {
    let admin = this.db.getUser('usuarios','==','mail','nmiguenz@gmail.com').subscribe((usuarios: any) => {
      if (usuarios[0] != null) {
        this.adminFotoUrl = usuarios[0].payload.doc.data().fotoUno;
      }
      admin.unsubscribe();
    });

    let paciente = this.db.getUser('usuarios','==','mail','relabuelo@gmail.com').subscribe((usuarios: any) => {
      if (usuarios[0] != null) {
        this.pacienteFotoUrl = usuarios[0].payload.doc.data().fotoUno;
      }
      paciente.unsubscribe();
    });

    let pacienteDos = this.db.getUser('usuarios','==','mail','nicolasmiguenz@hotmail.com').subscribe((usuarios: any) => {
      if (usuarios[0] != null) {
        this.pacienteFotoUrl2 = usuarios[0].payload.doc.data().fotoUno;
      }
      paciente.unsubscribe();
    });

    let pacienteTres = this.db.getUser('usuarios','==','mail','shibori.polonio@gmail.com').subscribe((usuarios: any) => {
      if (usuarios[0] != null) {
        this.pacienteFotoUrl3 = usuarios[0].payload.doc.data().fotoUno;
      }
      paciente.unsubscribe();
    });

    let especialista = this.db.getUser('usuarios','==','mail','roquesosa@gmail.com').subscribe((usuarios: any) => {
      if (usuarios[0] != null) {
        this.especialistaFotoUrl = usuarios[0].payload.doc.data().fotoUno;
      }
      especialista.unsubscribe();
    });

    let especialistaDos = this.db.getUser('usuarios','==','mail','jpalotes@gmail.com').subscribe((usuarios: any) => {
      if (usuarios[0] != null) {
        this.especialistaDosFotoUrl = usuarios[0].payload.doc.data().fotoUno;
      }
      especialistaDos.unsubscribe();
    });
  }

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

    this.db.getCollectionByField('usuarios','==','mail',this.formGroup.value.mail)
    .then((res: any) => {
      this.loading = true;
      let miSuscription = res.subscribe((arg:any) =>{
        this.user = arg['0'];

        if(this.user){
          //Chequeo si el EMAIL del PACIENTE!!! EST? VERIFICADO
          if(this.user.perfil == 'paciente'){
            this.auth.login(this.formGroup.value.mail, this.formGroup.value.password)
            .then((res:any)=>{

                if(res.user.emailVerified == true){

                  this.auth.setCurrentUser(this.user);
                  this.loading = false;
                  this.route.navigateByUrl('/misTurnos');
                }
                else{
                  console.log('No verific? el mail.');
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
            //Chequeo que est?n habilitados en la DB los ADMIN y los especialistas
            if(this.user.habilitado == true){
                this.auth.setCurrentUser(this.user);
                this.loading = false;
                if(this.user.perfil == 'especialista'){
                  this.route.navigateByUrl('/misTurnos');
                }
                else{
                  this.route.navigateByUrl('/backoffice');
                }
              }
              else{
                console.log('No verific? el mail.');
                this.loading = false;
                this.route.navigateByUrl('/home');
              }
          }

        }
        else{
          console.log('No existe usuario con ese email');
          this.loading = false;
        }
        miSuscription.unsubscribe();
      })})
    .catch((error:any)=> {
      console.log(error);
      this.loading = false;
    });
  }

  cargarAdmin() {
    this.formGroup.controls.mail.setValue("nmiguenz@gmail.com");
    this.formGroup.controls.password.setValue("123456");
  }

  cargarPaciente(pos : string) {
    if(pos == '1'){
    this.formGroup.controls.mail.setValue("relabuelo@gmail.com");
    this.formGroup.controls.password.setValue("123456");
    }
    if(pos == '2'){
      this.formGroup.controls.mail.setValue("nicolasmiguenz@hotmail.com");
      this.formGroup.controls.password.setValue("123456");
    }
    if(pos == '3'){
      this.formGroup.controls.mail.setValue("shibori.polonio@gmail.com");
      this.formGroup.controls.password.setValue("123456");
    }
  }

  cargarEspecialista(pos : string){
    if(pos == '1'){
      this.formGroup.controls.mail.setValue("roquesosa@gmail.com");
      this.formGroup.controls.password.setValue("123456");
    }
    else{
      this.formGroup.controls.mail.setValue("jpalotes@gmail.com");
      this.formGroup.controls.password.setValue("123456");
    }
  }


}
