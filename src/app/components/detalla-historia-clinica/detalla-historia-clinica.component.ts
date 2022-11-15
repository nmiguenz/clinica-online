import { Especialista } from './../../classes/especialista';
import { Paciente } from './../../classes/paciente';
import { Component, Input, OnInit } from '@angular/core';
import { HistoriaClinica } from 'src/app/classes/historia-clinica';
import { FirestoreDbService } from 'src/app/services/firestore-db.service';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-detalla-historia-clinica',
  templateUrl: './detalla-historia-clinica.component.html',
  styleUrls: ['./detalla-historia-clinica.component.css'],
})
export class DetallaHistoriaClinicaComponent implements OnInit {
  @Input() pacienteElegido: Paciente | any;
  @Input() especialista: Especialista | any;
  @Input() historiaClinicaInput: HistoriaClinica | any = null;
  @Input() pantalla: string = '';

  listaHistoriasPaciente: HistoriaClinica[] = [];
  hoy: Date = new Date();

  constructor(private db: FirestoreDbService) {}

  ngOnInit(): void {
    console.log('detalle', this.historiaClinicaInput);
  }

  // ngOnChanges() {
  //   this.db
  //     .getHistoriasByEspecialistaPaciente(
  //       this.especialista.dni,
  //       this.pacienteElegido.dni
  //     )
  //     .subscribe((historias: any) => {
  //       this.listaHistoriasPaciente = historias.map((historia: any) => {
  //         return historia.payload.doc.data();
  //       });
  //     });
  // }

  public openPDF(): void {
    let user = this.historiaClinicaInput.historia.paciente.apellido;
    let DATA: any = document.getElementById('htmlData');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('historia_clinica_' + user + '.pdf');
    });
  }
}
