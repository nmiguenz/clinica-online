import { Especialista } from './../../classes/especialista';
import { Paciente } from './../../classes/paciente';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HistoriaClinica } from 'src/app/classes/historia-clinica';
import { FirestoreDbService } from 'src/app/services/firestore-db.service';
import { Turno } from 'src/app/classes/turno';

//PDF
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

//XLSX
import * as XLSX from 'xlsx';

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
  @Output() cerrarEvent: EventEmitter<any> = new EventEmitter<any>();
  especialidadSeleccionada: string = '';

  listaHistoriasPaciente: HistoriaClinica[] = [];
  listaTurnosPaciente: Turno[] = [];
  hoy: Date = new Date();

  constructor(private db: FirestoreDbService) {}

  ngOnInit(): void {}

  ngOnChanges() {
    if (this.pacienteElegido != undefined) {
      if (this.pantalla == 'usuarios') {
        this.getDatosCollection(
          'turnos',
          '==',
          'datosPaciente.dni',
          this.pacienteElegido.dni
        );
      }

      if (this.pantalla == 'perfil') {
        this.getDatosCollection(
          'historiaClinica',
          '==',
          'paciente.dni',
          this.pacienteElegido.dni
        );
      }
    }
  }

  public openPDF(): void {
    let user = '';
    if (this.pantalla == 'usuarios') {
      user = this.historiaClinicaInput.historia.paciente.apellido;
    } else {
      user = this.pacienteElegido.apellido;
    }
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

  exportExcel(): void {
    let user = this.pacienteElegido.apellido;

    let element = document.getElementById('excelTable');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'turnosPaciente');

    XLSX.writeFile(wb, 'turnos_' + user + '.xlsx');
  }

  cerrarVentana(dato: boolean) {
    this.cerrarEvent.emit(dato);
  }

  async getDatosCollection(
    coleccion: string,
    operador: string,
    campoComparar: string,
    datoComparar: string
  ) {
    await this.db
      .getCollectionByField(coleccion, '==', campoComparar, datoComparar)
      .then((ref: any) =>
        ref.subscribe((arg: any) => {
          if (this.pantalla == 'usuarios') {
            this.listaTurnosPaciente = arg.map((element: any) => {
              return element;
            });
          } else {
            this.listaHistoriasPaciente = arg.map((element: any) => {
              return element;
            });
            console.log(this.listaHistoriasPaciente);
          }
        })
      )
      .catch((error) => console.log(error));
  }

  seleccionarEspecialidad(especialidad: string) {
    this.especialidadSeleccionada = especialidad;
    this.listaHistoriasPaciente = this.listaHistoriasPaciente.filter(
      (element) => element.especialidad == especialidad
    );
  }

  resetParams() {
    this.getDatosCollection(
      'historiaClinica',
      '==',
      'paciente.dni',
      this.pacienteElegido.dni
    );
    this.especialidadSeleccionada = '';
  }
}
