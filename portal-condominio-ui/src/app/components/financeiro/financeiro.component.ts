import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-financeiro',
  templateUrl: './financeiro.component.html',
  styleUrls: ['./financeiro.component.css']
})
export class FinanceiroComponent implements OnInit {

  chart: any[];
  receitas: any[];
  despesas: any[];
  consolidado: any[];
  months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

  constructor() { }

  ngOnInit() {
    this.despesas = [
      { desc:'àgua', data: new Date(2019, 3, 17), valor: 1410.23 },
      { desc:'obras', data: new Date(2019, 3, 17), valor: 1500.00 },
      { desc:'pintura', data: new Date(2019, 3, 10), valor: 500.00 },
      { desc:'àgua', data: new Date(2019, 2, 17), valor: 3000.00 },
      { desc:'pintura', data: new Date(2019, 2, 10), valor: 130.53 },      
      { desc:'obras', data: new Date(2019, 1, 17), valor: 3520.62 },
      { desc:'àgua', data: new Date(2018, 12, 17), valor: 3200.23 }
    ];

    this.receitas = [
      { desc:'condomínio', data: new Date(2019,  3, 17), valor: 3278.14 },
      { desc:'condomínio', data: new Date(2019,  2, 17), valor: 3100.23 },
      { desc:'condomínio', data: new Date(2019,  1, 17), valor: 3470.71 },
      { desc:'condomínio', data: new Date(2018, 12, 17), valor: 3290.92 }
    ];


    this.consolidado = [
      { data: new Date(2019, 3, 17), valorDespesa: 3410.23, valorReceita: 3278.14 },
      { data: new Date(2019, 2, 17), valorDespesa: 3130.53, valorReceita: 3100.23 },
      { data: new Date(2019, 1, 17), valorDespesa: 3520.62, valorReceita: 3470.71 },
      { data: new Date(2018, 12, 17), valorDespesa: 3200.23, valorReceita: 3290.92 }
    ];

    setTimeout(() => {
      this.initializeChart();
    }, 500);
  }

  private initializeChart() {

    let sortedList = this.consolidado.sort((a, b) => {
      let valueA = Date.parse(a.data.toString()),
        valueB = Date.parse(b.data.toString());
      return valueA - valueB;
    });

    let periodos = sortedList.map(x => {
      let dtAtual = new Date(x.data)
      let idxMonth = dtAtual.getMonth();
      return this.months[idxMonth] + '-' + dtAtual.getFullYear().toString().substr(2, 2)
    });

    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: periodos,
        datasets: [
          {
            label: 'Receitas',
            data: sortedList.map(x => x.valorReceita),
            borderColor: "#3cba9f",
            fill: false
          },
          {
            label: 'Despesas',
            data: sortedList.map(x => x.valorDespesa),
            borderColor: "#e83b2c",
            fill: false
          }
        ]
      },
      options: {
        legend: {
          display: true
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }],
        }
      }
    });

  }

}
