import { FirestoreDbService } from './../../services/firestore-db.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Paciente } from 'src/app/classes/paciente';
import { Especialista } from 'src/app/classes/especialista';
import { Administrador } from 'src/app/classes/administrador';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-admin-register',
  templateUrl: './admin-register.component.html',
  styleUrls: ['./admin-register.component.css'],
})
export class AdminRegisterComponent implements OnInit {
  formGroup: FormGroup | any;
  perfil: string = '';
  loading: boolean = false;
  resCaptcha = false;

  //Select multiple
  dropdownSettings: IDropdownSettings = {};

  //Sección imágenes
  imagenes: any[] = [];
  archivoImg: any;
  archivoImgDos: any;

  //Sección especialidades
  especialidades: any[] = [];

  constructor(
    private fb: FormBuilder,
    private db: FirestoreDbService,
    private auth: AuthService,
    private route: Router
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
    });
  }

  ngOnInit(): void {}

  // Método que devuleve el perfil del usuario,
  // hardcodea controllers que no son requeridos para el perfil
  // trae las especialidades en caso de ser perfil ESPECIALISTA
  perfilUsuario(perfilSeleccionado: string) {
    this.formGroup.controls['especialidad'].setValue(null);
    this.formGroup.controls['obraSocial'].setValue(null);
    this.formGroup.controls['fotoDos'].setValue(null);

    this.perfil = perfilSeleccionado;
    if (this.perfil == 'paciente') {
      this.formGroup.controls['especialidad'].setValue('ninguna'); //Se setea un valor para pasar la validación del form
    } else if (this.perfil == 'especialista') {
      this.loading = true;
      //Cargo la lista de ESPECIALIDADES vigentes desde Firebase
      this.db.getCollection('especialidad').then((ref: any) =>
        ref.subscribe((listadoRef: any) => {
          this.especialidades = listadoRef.map((especialidad: any) => {
            return especialidad.payload.doc.data();
          });
          this.dropdownSettings = {
            idField: 'nombre',
            textField: 'nombre',
          };
          this.loading = false;
        })
      );
      this.formGroup.controls['obraSocial'].setValue('ninguna'); //Se setea un valor para pasar la validación del form
      this.formGroup.controls['fotoDos'].setValue('ninguna.jpg'); //Se setea un valor para pasar la validación del form
    } else {
      this.formGroup.controls['especialidad'].setValue('ninguna');
      this.formGroup.controls['obraSocial'].setValue('ninguna'); //Se setea un valor para pasar la validación del form
      this.formGroup.controls['fotoDos'].setValue('ninguna.jpg'); //Se setea un valor para pasar la validación del for
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
          })
          .catch((error) => console.log(error));
      } catch (error) {
        console.log('Error en alta paciente: ', error);
      }
    }

    // Alta Especialista
    else if (this.perfil == 'especialista') {
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
          await this.db
            .altaConId(
              newUserCredentials.user.uid,
              JSON.parse(JSON.stringify(especialista)),
              'usuarios'
            )
            .then(() => {
              this.formGroup.reset();
              this.loading = false;
            })
            .catch((error) => console.log(error));
        }
      } catch (error) {
        console.log('Error en alta especialista: ', error);
      }
    }
    // Alta administrado
    else {
      const administrador = new Administrador(
        this.formGroup.value.nombre,
        this.formGroup.value.apellido,
        this.formGroup.value.edad,
        this.formGroup.value.dni,
        this.formGroup.value.mail,
        this.formGroup.value.password,
        this.formGroup.value.fotoUno,
        'admin',
        true
      );

      try {
        const newUserCredentials = await this.auth.signUp(
          administrador.mail,
          administrador.password
        );

        if (newUserCredentials.user.uid != '') {
          //Cargo el spinner custom
          this.loading = true;
          //Envío la verificación de mail
          await newUserCredentials.user.sendEmailVerification();

          //Agrego las fotos
          await this.db
            .uploadImage(
              'administrador',
              newUserCredentials.user.uid + '1',
              this.archivoImg
            )
            .then((res: string | any) => {
              administrador.fotoUno = res;
            })
            .catch((error) => console.log(error));

          // //Parseo el objeto porque Firebase no acepta los objetos CUSTOM
          await this.db
            .altaConId(
              newUserCredentials.user.uid,
              JSON.parse(JSON.stringify(administrador)),
              'usuarios'
            )
            .then(() => {
              this.formGroup.reset();
              this.loading = false;
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
    } else {
      this.archivoImgDos = event.target.files[0];
    }
  }

  volver() {
    this.perfil = '';
  }

  getResCaptcha(valor: any) {
    this.resCaptcha = valor;
    this.formGroup.controls['recaptcha'].setValue(this.resCaptcha);
  }
}
