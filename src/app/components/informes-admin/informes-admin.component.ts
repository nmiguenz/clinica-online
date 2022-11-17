import { Component, OnInit } from '@angular/core';
import { Chart, registerables, ChartConfiguration, ChartItem } from 'chart.js';
import { FirestoreDbService } from 'src/app/services/firestore-db.service';
import { Log } from 'src/app/classes/log';
//XLSX
import * as XLSX from 'xlsx';
import { Turno } from 'src/app/classes/turno';
import { cO } from 'chart.js/dist/chunks/helpers.core';

@Component({
  selector: 'app-informes-admin',
  templateUrl: './informes-admin.component.html',
  styleUrls: ['./informes-admin.component.css'],
})
export class InformesAdminComponent implements OnInit {
  listadoLogs: Log[] = [];
  listaTurnos: Turno[] = [];
  listaTurnosPorEspecialidad = [];

  constructor(private db: FirestoreDbService) {}

  ngOnInit(): void {
    this.turnosPorEspecialidad();
    this.turnosPorDia();
  }

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
    let listaTurnosPorEspecialidad: any[][] = [];

    this.db
      .getCollection('turnos')
      .then((res: any) => {
        let mySubscription = res.subscribe((ref: any) => {
          ref.map((element: any) => {
            let turno = element.payload.doc.data();
            this.listaTurnos.push(turno);
          });

          let group_to_values = this.listaTurnos.reduce(
            (obj: any, item: any) => {
              obj[item.especialidad] = obj[item.especialidad] || 0;
              obj[item.especialidad] += 1;

              return obj;
            },
            {}
          );

          for (const [key, value] of Object.entries(group_to_values)) {
            listaTurnosPorEspecialidad.push([key, value]);
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
            'my-chart'
          ) as ChartItem;
          new Chart(chartItem, config);

          mySubscription.unsubscribe();
        });
      })
      .catch((error) => console.log(error));
  }

  turnosPorDia() {
    let columnNames: string[] = [];
    let columnValues: any[] = [];
    let listaTurnosPorDia: any[][] = [];

    this.db
      .getCollection('turnos')
      .then((res: any) => {
        let mySubscription = res.subscribe((ref: any) => {
          ref.map((element: any) => {
            let turno = element.payload.doc.data();
            this.listaTurnos.push(turno);
          });

          let group_to_values = this.listaTurnos.reduce(
            (obj: any, item: any) => {
              obj[item.fecha.substr(0, 10)] =
                obj[item.fecha.substr(0, 10)] || 0;
              obj[item.fecha.substr(0, 10)] += 1;

              return obj;
            },
            {}
          );

          console.log(group_to_values);

          for (const [key, value] of Object.entries(group_to_values)) {
            listaTurnosPorDia.push([key, value]);
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
            'porDia'
          ) as ChartItem;
          new Chart(chartItem, config);

          mySubscription.unsubscribe();
        });
      })
      .catch((error) => console.log(error));
  }

  createChart(): void {
    Chart.register(...registerables);

    const data = {
      labels: ['January', 'February', 'March', 'April', 'May'],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: [10, 5, 2, 20, 30, 45],
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
      'my-chart'
    ) as ChartItem;
    new Chart(chartItem, config);
  }
}
