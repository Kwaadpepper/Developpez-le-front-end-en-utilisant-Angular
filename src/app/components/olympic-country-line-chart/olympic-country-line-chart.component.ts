import { Component, Input, OnInit } from '@angular/core'
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts'
import Participation from 'src/app/core/models/Participation'
import OlympicConfig from 'src/app/core/OlympicConfig'

@Component({
  selector: 'app-olympic-country-line-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './olympic-country-line-chart.component.html',
  styleUrl: './olympic-country-line-chart.component.scss',
})
export class OlympicCountryLineChartComponent implements OnInit {
  @Input({ required: true }) participations: Participation[] = []

  public chartOptions: ApexOptions

  constructor() {
    this.chartOptions = {
      chart: {
        type: 'line',
        zoom: { enabled: false },
        toolbar: { show: false },
      },
      grid: {
        xaxis: {
          lines: { show: true },
        },
        yaxis: {
          lines: { show: true },
        },
      },
      colors: OlympicConfig.getColors(),
      labels: [
        $localize`Medals`,
      ],
      legend: { show: false, floating: false },
      series: [],
      stroke: { curve: 'straight' },
      title: {
        text: '',
      },
      tooltip: {
        enabled: true,
        x: {
          format: 'yyyy',
        },
      },
      xaxis: {
        type: 'datetime',
        labels: {
          show: true,
          datetimeUTC: false,
          format: 'yyyy',
        },
        title: {
          text: $localize`Dates`,
          style: { cssClass: 'axis-x-title' },
        },
        tooltip: {
          enabled: false,
        },
      },
      yaxis: {
        min: 0,
        max: (): number => {
          const maxMedals: number = this.getMaxValueForMedals()
          const percentPadding = 0.15
          /** Add 15% padding-top on Y axis */
          return Math.round(maxMedals + maxMedals * percentPadding)
        },
        labels: {
          // No Float on X axis labels
          formatter(val: number): string | string[] {
            return String(Math.round(val))
          },
        },
      },
    }
  }

  ngOnInit(): void {
    this.updatePieChartData(this.participations)
  }

  private updatePieChartData(participations: Participation[]): void {
    this.chartOptions.series = []
    this.chartOptions.series.push({
      name: 'Medals this year',
      type: 'line',
      data: participations.map((participation: Participation) => {
        return {
          x: new Date(String(participation.year)),
          y: participation.medalsCount,
          // fill?: ApexFill;
          // fillColor?: string;
          // strokeColor?: string;
          // meta?: any;
          // goals?: any;
          // barHeightOffset?: number;
          // columnWidthOffset?: number;
        }
      }),
    } as never)
  }

  private getMaxValueForMedals(): number {
    return this.participations
      .map(participation => participation.medalsCount)
      .reduce((prev, curr) => Math.max(prev, curr))
  }
}
