import { Router } from '@angular/router';
import { Especialista } from './../../classes/especialista';
import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Paciente } from 'src/app/classes/paciente';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreDbService } from 'src/app/services/firestore-db.service';
import { RecaptchaService } from 'src/app/services/recaptcha.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  perfil: string = '';
  pantalla: string = '';
  loading: boolean = false;
  formGroup: FormGroup | any;
  imagenes: any[] = [];
  archivoImg: any;
  archivoImgDos: any;
  resCaptcha = false;

  //Select multiple
  dropdownSettings: IDropdownSettings = {};

  //Variables captcha;
  key: string = '';
  espanol: string = '';

  // Variables especilidades
  especialidades: any[] = [];
  crearEspecialidad: boolean = false;
  nuevaEspecialidad: string = '';

  constructor(
    private fb: FormBuilder,
    private db: FirestoreDbService,
    private auth: AuthService,
    private route: Router,
    private captcha: RecaptchaService
  ) {
    this.formGroup = this.fb.group({
      nombre: [
        '',
        [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÝÉÝÓÚs]+')],
      ],
      apellido: [
        '',
        [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÝÉÝÓÚs]+')],
      ],
      edad: [
        '',
        [
          Validators.required,
          Validators.pattern('[0-9]+'),
          Validators.min(1),
          Validators.max(120),
        ],
      ],
      dni: [
        '',
        [
          Validators.required,
          Validators.pattern('[0-9]+'),
          Validators.min(1),
          Validators.max(99999999),
        ],
      ],
      mail: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ],
      ],
      especialidad: [[], Validators.required],
      obraSocial: ['', Validators.required],
      fotoUno: ['', Validators.required],
      fotoDos: ['', Validators.required],
      recaptcha: ['', Validators.required],
    });

    console.log(this.formGroup.value);

    this.key = this.captcha.siteKey;
    this.espanol = this.captcha.lang;
  }

  ngOnInit(): void {
    this.db.getCollection('especialidad').then((ref: any) =>
      ref.subscribe((listadoRef: any) => {
        this.especialidades = listadoRef.map((especialidad: any) => {
          return especialidad.payload.doc.data();
        });
        this.dropdownSettings = {
          idField: 'nombre',
          textField: 'nombre',
        };
      })
    );
  }

  // Método que devuleve el perfil del usuario,
  // hardcodea controllers que no son requeridos para el perfil
  // trae las especialidades en caso de ser perfil ESPECIALISTA
  perfilUsuario(perfilSeleccionado: string) {
    this.pantalla = 'registro';
    this.perfil = perfilSeleccionado;
    if (this.perfil == 'paciente') {
      this.formGroup.controls['especialidad'].setValue('ninguna'); //Se setea un valor para pasar la validación del form
    } else {
      this.formGroup.controls['obraSocial'].setValue('ninguna'); //Se setea un valor para pasar la validación del form
      this.formGroup.controls['fotoDos'].setValue('ninguna.jpg'); //Se setea un valor para pasar la validación del form
    }
  }

  async alta() {
    // Alta de paciente
    if (this.perfil == 'paciente') {
      const paciente = new Paciente(
        this.formGroup.value.nombre,
        this.formGroup.value.apellido,
        this.formGroup.value.edad,
        this.formGroup.value.dni,
        this.formGroup.value.obraSocial,
        this.formGroup.value.mail,
        this.formGroup.value.password,
        this.formGroup.value.fotoUno,
        this.formGroup.value.fotoDos,
        'paciente'
      );

      try {
        const newUserCredentials = await this.auth.signUp(
          paciente.mail,
          paciente.password
        );

        if (newUserCredentials.user.uid != '') {
          this.loading = true;
          //Envío la verificación de mail
          await newUserCredentials.user.sendEmailVerification();

          //Agrego las fotos
          await this.db
            .uploadImage(
              'paciente',
              newUserCredentials.user.uid + '1',
              this.archivoImg
            )
            .then((res: string | any) => {
              paciente.fotoUno = res;
            })
            .catch((error) => console.log(error));

          await this.db
            .uploadImage(
              'paciente',
              newUserCredentials.user.uid + '2',
              this.archivoImgDos
            )
            .then((res: string | any) => {
              paciente.fotoDos = res;
            })
            .catch((error) => console.log(error));
        }

        // //Parseo el objeto porque Firebase no acepta los objetos CUSTOM
        await this.db
          .altaConId(
            newUserCredentials.user.uid,
            JSON.parse(JSON.stringify(paciente)),
            'usuarios'
          )
          .then(() => {
            this.formGroup.reset();
            this.loading = false;
            this.route.navigateByUrl('/acceso/login');
          })
          .catch((error) => console.log(error));
      } catch (error) {
        console.log('Error en alta paciente: ', error);
      }
    }

    // Alta Especialista
    else {
      console.log('registro captcha: ', this.resCaptcha);
      console.log('Form login', this.formGroup.value);
      const especialista = new Especialista(
        this.formGroup.value.nombre,
        this.formGroup.value.apellido,
        this.formGroup.value.edad,
        this.formGroup.value.dni,
        this.formGroup.value.especialidad,
        this.formGroup.value.mail,
        this.formGroup.value.password,
        this.formGroup.value.fotoUno,
        'especialista',
        false
      );

      try {
        const newUserCredentials = await this.auth.signUp(
          especialista.mail,
          especialista.password
        );

        if (newUserCredentials.user.uid != '') {
          //Cargo el spinner custom
          this.loading = true;
          //Envío la verificación de mail
          await newUserCredentials.user.sendEmailVerification();

          //Agrego las fotos
          await this.db
            .uploadImage(
              'especialista',
              newUserCredentials.user.uid + '1',
              this.archivoImg
            )
            .then((res: string | any) => {
              especialista.fotoUno = res;
            })
            .catch((error) => console.log(error));

          // //Parseo el objeto porque Firebase no acepta los objetos CUSTOM
          // let res= await this.db.alta(JSON.parse(JSON.stringify(paciente)), 'paciente');
          await this.db
            .altaConId(
              newUserCredentials.user.uid,
              JSON.parse(JSON.stringify(especialista)),
              'usuarios'
            )
            .then(() => {
              this.formGroup.reset();
              this.loading = false;
              this.route.navigateByUrl('/acceso/login');
            })
            .catch((error) => console.log(error));
        }
      } catch (error) {
        console.log('Error en alta especialista: ', error);
      }
    }
  }

  //Obtengo la foto en la codificación aceptada por Storage
  obtenerImg(event: any, num: number) {
    if (num == 1) {
      this.archivoImg = event.target.files[0];
      console.log('imagen,', this.archivoImg);
    } else {
      this.archivoImgDos = event.target.files[0];
    }
  }

  agregarEspecialidad(especialidad: string) {
    this.especialidades = []; //limpio el array
    this.db
      .alta({ nombre: especialidad }, 'especialidad')
      .catch((error) => console.log(error));
  }

  getResCaptcha(valor: any) {
    this.resCaptcha = valor;
    this.formGroup.controls['recaptcha'].setValue(this.resCaptcha);
  }
}
