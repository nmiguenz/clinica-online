import { FirestoreDbService } from './../../services/firestore-db.service';
import { AuthService } from 'src/app/services/auth.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertasService } from 'src/app/services/alertas.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  eyeToggle: string = '';
  loading: boolean = false;
  formGroup: FormGroup | any;
  user: any = null;

  //Alerta ERROR
  @ViewChild('formComentario_msg') alert: ElementRef | any;
  msgError: string = '';

  //Acceso Rápido
  email: string = '';
  password: string = '';
  public adminFotoUrl: string = '';
  public pacienteFotoUrl: string = '';
  public pacienteFotoUrl2: string = '';
  public pacienteFotoUrl3: string = '';
  public especialistaFotoUrl: string = '';
  public especialistaDosFotoUrl: string = '';

  users: any[] = [];
  usersAccesoRapido: any[] = [];

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private route: Router,
    private db: FirestoreDbService,
    private sa: AlertasService
  ) {
    this.formGroup = this.fb.group({
      mail: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ],
      ],
    });
  }

  ngOnInit(): void {
    let admin = this.db
      .getUser('usuarios', '==', 'mail', 'nmiguenz@gmail.com')
      .subscribe((usuarios: any) => {
        if (usuarios[0] != null) {
          this.adminFotoUrl = usuarios[0].payload.doc.data().fotoUno;
        }
        admin.unsubscribe();
      });

    let paciente = this.db
      .getUser('usuarios', '==', 'mail', 'relabuelo@gmail.com')
      .subscribe((usuarios: any) => {
        if (usuarios[0] != null) {
          this.pacienteFotoUrl = usuarios[0].payload.doc.data().fotoUno;
        }
        paciente.unsubscribe();
      });

    let pacienteDos = this.db
      .getUser('usuarios', '==', 'mail', 'nicolasmiguenz@hotmail.com')
      .subscribe((usuarios: any) => {
        if (usuarios[0] != null) {
          this.pacienteFotoUrl2 = usuarios[0].payload.doc.data().fotoUno;
        }
        paciente.unsubscribe();
      });

    let pacienteTres = this.db
      .getUser('usuarios', '==', 'mail', 'shibori.polonio@gmail.com')
      .subscribe((usuarios: any) => {
        if (usuarios[0] != null) {
          this.pacienteFotoUrl3 = usuarios[0].payload.doc.data().fotoUno;
        }
        paciente.unsubscribe();
      });

    let especialista = this.db
      .getUser('usuarios', '==', 'mail', 'efhzfoucmphrlatyuu@tmmcv.net')
      .subscribe((usuarios: any) => {
        if (usuarios[0] != null) {
          this.especialistaFotoUrl = usuarios[0].payload.doc.data().fotoUno;
        }
        especialista.unsubscribe();
      });

    let especialistaDos = this.db
      .getUser('usuarios', '==', 'mail', 'jpalotes@gmail.com')
      .subscribe((usuarios: any) => {
        if (usuarios[0] != null) {
          this.especialistaDosFotoUrl = usuarios[0].payload.doc.data().fotoUno;
        }
        especialistaDos.unsubscribe();
      });
  }

  async getUsuarios() {
    await this.db
      .getCollection('usuarios')
      .then((res: any) =>
        res.subscribe((element: any) => {
          element.forEach((usuarioRef: any) => {
            this.users.push(usuarioRef.payload.doc.data());
          });
        })
      )
      .catch((error) => console.log(error));
  }

  mostrarPassword() {
    var input = <HTMLInputElement>document.getElementById('pass');
    var eye = <HTMLElement>document.getElementById('eye');
    if (input.type == 'password') {
      input.type = 'text';
      this.eyeToggle = input.type;
    } else {
      input.type = 'password';
      this.eyeToggle = input.type;
    }
  }

  async ingreso() {
    this.db
      .getCollectionByField('usuarios', '==', 'mail', this.formGroup.value.mail)
      .then((res: any) => {
        this.loading = true;
        let miSuscription = res.subscribe((arg: any) => {
          this.user = arg['0'];
          //Si el usuario existe se guarda en el localStorage
          if (this.user) {
            localStorage.setItem('loggedUser', JSON.stringify(this.user));
          }

          if (this.user) {
            this.auth
              .login(this.formGroup.value.mail, this.formGroup.value.password)
              .then((res: any) => {
                //Chequeo si el email está verificado.
                if (res.user.emailVerified == true) {
                  if (this.user.perfil == 'especialista') {
                    //Chequeo que estén habilitados en la DB los especialistas
                    if (this.user.habilitado == true) {
                      this.loading = false;
                      this.auth.usuarioLogueado = this.user;
                      this.route.navigateByUrl('/misTurnos');
                    } else {
                      this.loading = false;
                      this.alertaError('No está habilitado por administrador.');
                      localStorage.removeItem('loggedUser');
                      this.route.navigateByUrl('/home');
                    }
                  } else {
                    this.loading = false;
                    if (this.user.perfil == 'paciente') {
                      this.auth.usuarioLogueado = this.user;
                      this.route.navigateByUrl('/misTurnos');
                    } else {
                      this.auth.usuarioLogueado = this.user;
                      this.route.navigateByUrl('/backoffice');
                    }
                  }
                } else {
                  this.loading = false;
                  this.alertaError('No verificó el mail.');
                  localStorage.removeItem('loggedUser');
                }
              })
              .catch((error: any) => {
                console.log(error);
                this.loading = false;
              });
          } else {
            this.loading = false;
            this.alertaError('No existe usuario con ese email');
            localStorage.removeItem('loggedUser');
          }
          miSuscription.unsubscribe();
        });
      })
      .catch((error: any) => {
        console.log(error);
        this.loading = false;
      });
  }

  //Muestra un mensaje en caso de Error
  alertaError(msg: string) {
    this.msgError = msg;
    this.alert.nativeElement.classList.add('formComentario-msg-active');
    setTimeout(() => {
      this.alert.nativeElement.classList.remove('formComentario-msg-active');
      this.formGroup.reset();
      this.msgError = '';
    }, 3000);
  }

  cargarAdmin() {
    this.formGroup.controls.mail.setValue('nmiguenz@gmail.com');
    this.formGroup.controls.password.setValue('123456');
  }

  cargarPaciente(pos: string) {
    if (pos == '1') {
      this.formGroup.controls.mail.setValue('relabuelo@gmail.com');
      this.formGroup.controls.password.setValue('123456');
    }
    if (pos == '2') {
      this.formGroup.controls.mail.setValue('nicolasmiguenz@hotmail.com');
      this.formGroup.controls.password.setValue('123456');
    }
    if (pos == '3') {
      this.formGroup.controls.mail.setValue('shibori.polonio@gmail.com');
      this.formGroup.controls.password.setValue('123456');
    }
  }

  cargarEspecialista(pos: string) {
    if (pos == '1') {
      this.formGroup.controls.mail.setValue('efhzfoucmphrlatyuu@tmmcv.net');
      this.formGroup.controls.password.setValue('123456');
    } else {
      this.formGroup.controls.mail.setValue('jpalotes@gmail.com');
      this.formGroup.controls.password.setValue('123456');
    }
  }
}
