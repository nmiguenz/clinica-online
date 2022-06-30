import { Especialista } from './../../classes/especialista';
import { Paciente } from './../../classes/paciente';
import { FirestoreDbService } from 'src/app/services/firestore-db.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { HistoriaClinica } from 'src/app/classes/historia-clinica';

@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.css']
})
export class HistoriaClinicaComponent implements OnInit {

  formGroup : FormGroup | any;

  @Input() pacienteInput : Paciente | any;
  @Input() especialistaInput : Especialista | any;

  constructor( private db : FirestoreDbService, private fb: FormBuilder) {

    this.formGroup = fb.group({
      paciente: ["", Validators.required],
      altura: ["", Validators.required],
      peso: ["", Validators.required],
      temperatura: ["", Validators.required],
      presion: ["", Validators.required],
      clave1: [""],
      valor1: [""],
      clave2: [""],
      valor2: [""],
      clave3: [""],
      valor3: [""]
    })
  }

  ngOnInit(): void {
    console.log(this.pacienteInput);
    console.log(this.especialistaInput);
  }

  altaHistoria() {

    let paciente = this.pacienteInput;
    let especialista = this.especialistaInput;
    let fechaAtencion = new Date();
    let historiaClinica = new HistoriaClinica(
      fechaAtencion,
      paciente,
      especialista,
      this.formGroup.value.altura,
      this.formGroup.value.peso,
      this.formGroup.value.temperatura,
      this.formGroup.value.presion,
      this.formGroup.value.clave1,
      this.formGroup.value.valor1,
      this.formGroup.value.clave2,
      this.formGroup.value.valor2,
      this.formGroup.value.clave3,
      this.formGroup.value.valor3
    );

    this.db.alta(JSON.parse(JSON.stringify(historiaClinica)),'historiaClinica')
    .then(()=> this.formGroup.reset())
    .catch(error=>console.log(error));

  }

}
