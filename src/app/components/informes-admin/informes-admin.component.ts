import { Component, OnInit } from '@angular/core';
import { Chart, registerables, ChartConfiguration, ChartItem } from 'chart.js';
import { FirestoreDbService } from 'src/app/services/firestore-db.service';
import { Log } from 'src/app/classes/log';

//XLSX
import * as XLSX from 'xlsx';
import { Turno } from 'src/app/classes/turno';

//PDF
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-informes-admin',
  templateUrl: './informes-admin.component.html',
  styleUrls: ['./informes-admin.component.css'],
})
export class InformesAdminComponent implements OnInit {
  listadoLogs: Log[] = [];
  listaTurnos: Turno[] = [];
  listaTurnosPorEspecialidad = [];

  //Listados finales
  listaTurnosPorEspecialidades: any[][] = [];
  listaTurnosPorDia: any[][] = [];
  listaTurnosPorDiaEspecialista: any[][] = [];
  listaTurnosPorDiaEspecialistaFinalizados: any[][] = [];

  fechaInicio!: Date;
  fechaFin!: Date;
  fechaInit!: Date;
  fechaEnd!: Date;
  pantallaEspecialista: boolean = false;
  pantallaFinalizadoEspecialista: boolean = false;

  constructor(private db: FirestoreDbService) {
    db.getCollection('turnos')
      .then((res: any) => {
        let mySubscription = res.subscribe((ref: any) => {
          ref.map((element: any) => {
            let turno = element.payload.doc.data();
            this.listaTurnos.push(turno);
          });
          this.turnosPorEspecialidad();
          this.turnosPorDia();
          mySubscription.unsubscribe();
        });
      })
      .catch((error) => console.log(error));
  }

  ngOnInit(): void {}

  descargarLogs() {
    this.listadoLogs = [];
    this.db
      .getCollection('logs')
      .then((res: any) => {
        let mySubscription = res.subscribe((ref: any) => {
          ref.map((element: any) => {
            let log = element.payload.doc.data();
            log.fechaDeIngreso = this.timeFormatter(
              log.fechaDeIngreso.toDate(),
              'fechaHora'
            );

            this.listadoLogs.push(log);
          });
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.listadoLogs);

          /* generate workbook and add the worksheet */
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

          /* save to file */
          XLSX.writeFile(wb, 'Informe_logs.xlsx');
          mySubscription.unsubscribe();
        });
      })
      .catch((error) => console.log('No se pudieron obtener los logs', error));
  }

  timeFormatter(date: Date, tipo: 'fecha' | 'fechaHora') {
    let dateTime: any;

    if (tipo == 'fecha') {
      dateTime = new Intl.DateTimeFormat('en-US').format(date);
    } else {
      dateTime = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      }).format(date);
    }

    return dateTime;
  }

  turnosPorEspecialidad() {
    let columnNames: string[] = [];
    let columnValues: any[] = [];

    let group_to_values = this.listaTurnos.reduce((obj: any, item: any) => {
      obj[item.especialidad] = obj[item.especialidad] || 0;
      obj[item.especialidad] += 1;

      return obj;
    }, {});

    for (const [key, value] of Object.entries(group_to_values)) {
      this.listaTurnosPorEspecialidades.push([key, value]);
      columnNames.push(key);
      columnValues.push(value);
    }

    Chart.register(...registerables);

    const data = {
      labels: columnNames,
      datasets: [
        {
          label: 'Especialidades',
          backgroundColor: 'rgb(13, 187, 157)',
          borderColor: 'rgb(255, 255, 255)',
          data: columnValues,
        },
      ],
    };

    const options = {
      scales: {
        y: {
          beginAtZero: true,
          display: false,
        },
      },
    };

    const config: ChartConfiguration = {
      type: 'bar',
      data: data,
      options: options,
    };

    const chartItem: ChartItem = document.getElementById(
      'turnosPorEspecialidad'
    ) as ChartItem;
    new Chart(chartItem, config);
  }

  turnosPorDia() {
    let columnNames: string[] = [];
    let columnValues: any[] = [];

    let group_to_values = this.listaTurnos.reduce((obj: any, item: any) => {
      obj[item.fecha.substr(0, 10)] = obj[item.fecha.substr(0, 10)] || 0;
      obj[item.fecha.substr(0, 10)] += 1;

      return obj;
    }, {});

    for (const [key, value] of Object.entries(group_to_values)) {
      this.listaTurnosPorDia.push([key, value]);
      columnNames.push(key);
      columnValues.push(value);
    }

    Chart.register(...registerables);

    const data = {
      labels: columnNames,
      datasets: [
        {
          label: 'Por día',
          backgroundColor: 'rgb(13, 187, 157)',
          borderColor: 'rgb(233 196 106)',
          data: columnValues,
        },
      ],
    };

    const options = {
      scales: {
        y: {
          beginAtZero: true,
          display: false,
        },
      },
    };

    const config: ChartConfiguration = {
      type: 'line',
      data: data,
      options: options,
    };

    const chartItem: ChartItem = document.getElementById(
      'turnosPorDia'
    ) as ChartItem;
    new Chart(chartItem, config);
  }

  elegirPeriodoEspecialista() {
    this.pantallaEspecialista = true;
    this.turnosPorFechaEspecialista();
  }

  turnosPorFechaEspecialista() {
    let columnNames: string[] = [];
    let columnValues: any[] = [];
    let listaFiltrada = [];

    listaFiltrada = this.listaTurnos.filter((turno: any) => {
      return (
        turno.fecha.substr(0, 10) >= this.fechaInicio.toString() &&
        turno.fecha.substr(0, 10) <= this.fechaFin.toString()
      );
    });

    let group_to_values = listaFiltrada.reduce((obj: any, item: any) => {
      obj[
        item.datosEspecialista.apellido + ' ' + item.datosEspecialista.nombre
      ] =
        obj[
          item.datosEspecialista.apellido + ' ' + item.datosEspecialista.nombre
        ] || 0;
      obj[
        item.datosEspecialista.apellido + ' ' + item.datosEspecialista.nombre
      ] += 1;

      return obj;
    }, {});

    for (const [key, value] of Object.entries(group_to_values)) {
      this.listaTurnosPorDiaEspecialista.push([key, value]);
      columnNames.push(key);
      columnValues.push(value);
    }

    Chart.register(...registerables);

    const data = {
      labels: columnNames,
      datasets: [
        {
          label: 'Cantidad turnos',
          backgroundColor: [
            'rgb(13, 187, 157)',
            'rgb(233 196 106)',
            'rgb(236, 8, 104)',
            'rgb(132, 71, 255)',
          ],
          borderColor: 'rgb(0 0 0)',
          data: columnValues,
        },
      ],
    };

    const options = {
      scales: {
        y: {
          beginAtZero: true,
          display: false,
        },
      },
    };

    const config: ChartConfiguration = {
      type: 'pie',
      data: data,
      options: options,
    };

    const chartItem: ChartItem = document.getElementById(
      'especialistaPeriodo'
    ) as ChartItem;
    new Chart(chartItem, config);
  }

  elegirPeriodoFinalizadoEspecialista() {
    this.pantallaFinalizadoEspecialista = true;
    this.turnosFinalizadoPorFechaEspecialista();
  }

  turnosFinalizadoPorFechaEspecialista() {
    let columnNames: string[] = [];
    let columnValues: any[] = [];
    let listaFiltrada = [];

    listaFiltrada = this.listaTurnos.filter((turno: any) => {
      return (
        turno.fecha.substr(0, 10) >= this.fechaInit.toString() &&
        turno.fecha.substr(0, 10) <= this.fechaEnd.toString()
      );
    });

    listaFiltrada = listaFiltrada.filter((turno: any) => {
      return turno.estado == 'finalizado';
    });

    let group_to_values = listaFiltrada.reduce((obj: any, item: any) => {
      obj[
        item.datosEspecialista.apellido + ' ' + item.datosEspecialista.nombre
      ] =
        obj[
          item.datosEspecialista.apellido + ' ' + item.datosEspecialista.nombre
        ] || 0;
      obj[
        item.datosEspecialista.apellido + ' ' + item.datosEspecialista.nombre
      ] += 1;

      return obj;
    }, {});

    console.log('por grupos: ', group_to_values);

    for (const [key, value] of Object.entries(group_to_values)) {
      this.listaTurnosPorDiaEspecialistaFinalizados.push([key, value]);
      columnNames.push(key);
      columnValues.push(value);
    }

    Chart.register(...registerables);

    const data = {
      labels: columnNames,
      datasets: [
        {
          label: 'Finalizados',
          backgroundColor: [
            'rgb(13, 187, 157)',
            'rgb(233 196 106)',
            'rgb(236, 8, 104)',
            'rgb(132, 71, 255)',
          ],
          borderColor: 'rgb(0 0 0)',
          data: columnValues,
        },
      ],
    };

    const options = {
      scales: {
        y: {
          beginAtZero: true,
          display: false,
        },
      },
    };

    const config: ChartConfiguration = {
      type: 'pie',
      data: data,
      options: options,
    };

    const chartItem: ChartItem = document.getElementById(
      'turnosFinalizados'
    ) as ChartItem;
    new Chart(chartItem, config);
  }

  public openPDF(nombreinforme: string): void {
    let fecha = this.timeFormatter(new Date(), 'fecha')
      .split('/')
      .reverse()
      .join('');

    let DATA: any = document.getElementById(nombreinforme);
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save(nombreinforme + '_' + fecha + '.pdf');
    });
  }

  exportExcel(nombreinforme: string, listado: any): void {
    let fecha = this.timeFormatter(new Date(), 'fecha')
      .split('/')
      .reverse()
      .join('');

    if (nombreinforme == 'turnosFinalizados') {
      let ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([
        ['Lapso: ' + this.fechaInit + ' al ' + this.fechaEnd],
        ['Especialista', 'Cantidad finalizados'],
      ]);
      XLSX.utils.sheet_add_json(ws, listado, { origin: -1, skipHeader: true });

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      /* save to file */
      XLSX.writeFile(wb, nombreinforme + '_' + fecha + '.xlsx');
    } else if (nombreinforme == 'especialistaPeriodo') {
      let ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([
        ['Lapso: ' + this.fechaInicio + ' al ' + this.fechaFin],
        ['Especialista', 'Cantidad turnos'],
      ]);
      XLSX.utils.sheet_add_json(ws, listado, { origin: -1, skipHeader: true });

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      /* save to file */
      XLSX.writeFile(wb, nombreinforme + '_' + fecha + '.xlsx');
    } else if (nombreinforme == 'turnosPorEspecialidad') {
      let ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([
        ['Especialidad', 'Cantidad turnos'],
      ]);
      XLSX.utils.sheet_add_json(ws, listado, { origin: -1, skipHeader: true });

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      /* save to file */
      XLSX.writeFile(wb, nombreinforme + '_' + fecha + '.xlsx');
    } else {
      let ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([
        ['Fecha', 'Cantidad turnos'],
      ]);
      XLSX.utils.sheet_add_json(ws, listado, { origin: -1, skipHeader: true });

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      /* save to file */
      XLSX.writeFile(wb, nombreinforme + '_' + fecha + '.xlsx');
    }
  }
}
