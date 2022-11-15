import { Component, OnInit } from '@angular/core';
import { Chart, registerables, ChartConfiguration, ChartItem } from 'chart.js';

@Component({
  selector: 'app-informes-admin',
  templateUrl: './informes-admin.component.html',
  styleUrls: ['./informes-admin.component.css'],
})
export class InformesAdminComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.createChart();
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
