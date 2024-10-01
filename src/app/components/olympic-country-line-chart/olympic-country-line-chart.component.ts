import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts'
import Participation from 'src/app/core/models/participation.interface'
import { PickApexOptions } from 'src/app/core/types/apex-charts/pick-apex-options.type'

@Component({
  selector: 'app-olympic-country-line-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './olympic-country-line-chart.component.html',
  styleUrl: './olympic-country-line-chart.component.scss',
})
export class OlympicCountryLineChartComponent implements OnInit, OnDestroy {
  @ViewChild('chartComponent', { static: false }) chartComponent?: ChartComponent

  @Input({ required: true }) participations: Participation[] = []

  public chart: PickApexOptions<'chart'>
  public dataLabels: PickApexOptions<'dataLabels'>
  public grid: PickApexOptions<'grid'>
  public labels: PickApexOptions<'labels'>
  public legend: PickApexOptions<'legend'>
  public series: PickApexOptions<'series'>
  public stroke: PickApexOptions<'stroke'>
  public tooltip: PickApexOptions<'tooltip'>
  public yaxis: PickApexOptions<'yaxis'>
  public xaxis: PickApexOptions<'xaxis'>

  public responsive: PickApexOptions<'responsive'>

  constructor() {
    this.chart = {
      type: 'line',
      stacked: false,
      height: 350,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: false,
        allowMouseWheelZoom: true,
      },
      selection: { enabled: false },
      toolbar: {
        autoSelected: 'pan',
        tools: {
          zoom: false,
          zoomin: '<img src="/assets/images/zoom-in.png" width="28">',
          zoomout: '<img src="/assets/images/zoom-out.png" width="28">',
          reset: '<img src="/assets/images/zoom-reset.png" width="25">',
          selection: false,
          download: false,
          pan: true,
        },
      },
    }
    this.dataLabels = { enabled: false }
    this.grid = {
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
    }
    this.labels = [$localize`Medals`]
    this.legend = { show: false, floating: false }
    this.series = []
    this.stroke = { curve: 'straight' }
    this.tooltip = { enabled: true, x: { format: 'yyyy' } }
    this.yaxis = {
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
    }
    this.xaxis = { categories: [] }
  }

  ngOnInit(): void {
    this.updatePieChartData(this.participations)
  }

  ngOnDestroy(): void {
    this.chartComponent?.resetSeries()
    this.chartComponent?.destroy()
    this.chartComponent?.ngOnDestroy()

    delete this.chartComponent
  }

  private updatePieChartData(participations: Participation[]): void {
    this.xaxis!.categories = participations
      .map((participation: Participation) => participation.year)
    this.series = [
      {
        name: 'Medals this year',
        type: 'line',
        data: participations.map((participation: Participation) => participation.medalsCount),
      } as never,
    ]
  }

  private getMaxValueForMedals(): number {
    return this.participations
      .map(participation => participation.medalsCount)
      .reduce((prev, curr) => Math.max(prev, curr))
  }
}
