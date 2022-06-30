import { Especialista } from './../../classes/especialista';
import { Paciente } from './../../classes/paciente';
import { Component, Input, OnInit } from '@angular/core';
import { HistoriaClinica } from 'src/app/classes/historia-clinica';
import { FirestoreDbService } from 'src/app/services/firestore-db.service';

@Component({
  selector: 'app-detalla-historia-clinica',
  templateUrl: './detalla-historia-clinica.component.html',
  styleUrls: ['./detalla-historia-clinica.component.css']
})
export class DetallaHistoriaClinicaComponent implements OnInit {

  @Input() pacienteElegido : Paciente | any;
  @Input() especialista : Especialista | any;
  listaHistoriasPaciente : HistoriaClinica[] = [];
  hoy : Date = new Date();

  constructor(private db  : FirestoreDbService) {}

  ngOnInit(): void {}

  ngOnChanges() {
    this.db.getHistoriasByEspecialistaPaciente(this.especialista.dni,this.pacienteElegido.dni).subscribe((historias: any) => {
      this.listaHistoriasPaciente = historias.map((historia : any)=>{
        return historia.payload.doc.data();
      });
    });
  }

  openPDF(){

  }

}
