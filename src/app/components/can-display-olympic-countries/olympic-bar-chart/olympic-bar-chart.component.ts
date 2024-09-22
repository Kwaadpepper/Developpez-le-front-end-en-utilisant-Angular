import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import type { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexTitleSubtitle } from 'ng-apexcharts'
import { NgApexchartsModule } from 'ng-apexcharts'
import CanDisplayOlympicCountries from 'src/app/core/components/CanDisplayOlympicCountries'
import OlympicCountry from 'src/app/core/models/OlympicCountry'
import OlympicConfig from 'src/app/core/OlympicConfig'

/** A selected data of an apex bar chart */
interface DataPointSelectionOption {
  dataPointIndex: number
  selectedDataPoints: number[]
  seriesIndex: number
}
/** This represents a js instance of an ApexChart, no definition is provided */
type ApexChartJsInstance = object

@Component({
  selector: 'app-olympic-bar-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './olympic-bar-chart.component.html',
  styleUrl: './olympic-bar-chart.component.scss',
})

/** Apex BarChartComponent wrapper */
export class OlympicBarChartComponent extends CanDisplayOlympicCountries implements OnInit, OnChanges {
  public chartOptions: {
    labels: string[]
    series: ApexAxisChartSeries
    chart: ApexChart
    plotOptions: ApexPlotOptions
    title: ApexTitleSubtitle
    dataLabels: ApexDataLabels
    colors: Color[]
  }

  constructor() {
    super()
    this.chartOptions = {
      labels: [
        $localize`Countries`,
      ],
      series: [],
      chart: {
        type: 'bar',
        events: {
          dataPointSelection: (e: MouseEvent, chart: ApexChartJsInstance, option: DataPointSelectionOption) => {
            const country = this.olympicCountries.at(option.dataPointIndex)
            if (country === undefined) {
              throw new Error(`Failed to fetch country from list as index '${option.dataPointIndex}'`)
            }
            this.selectedCountryEvent(country)
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      title: {
        text: $localize`Medals per Country`,
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: OlympicConfig.getColors(),
        },
      },
      colors: OlympicConfig.getColors(),
    }
  }

  ngOnInit(): void {
    this.updatePieChartData(this.olympicCountries)
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['olympicCountries']) {
      this.updatePieChartData(changes['olympicCountries'].currentValue)
    }
  }

  private selectedCountryEvent(country: OlympicCountry): void {
    this.selected.emit(country)
  }

  private updatePieChartData(olympicCountries: typeof this.olympicCountries): void {
    this.chartOptions.series = []

    olympicCountries.forEach((olympicCountry) => {
      this.chartOptions.series.push({
        name: olympicCountry.country,
        data: [olympicCountry.participations
          .map(participation => participation.medalsCount)
          .reduce((prev, curr) => prev + curr)],
      })
    })
  }
}
