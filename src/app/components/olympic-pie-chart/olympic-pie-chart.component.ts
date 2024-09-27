import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core'
import { ApexChart, ApexDataLabels, ApexNonAxisChartSeries, ApexTitleSubtitle, NgApexchartsModule } from 'ng-apexcharts'
import OlympicCountry from 'src/app/core/models/OlympicCountry'
import OlympicConfig from 'src/app/core/OlympicConfig'

/** A selected data of an apex pie chart */
interface DataPointSelectionOption {
  dataPointIndex: number
  selectedDataPoints: number[]
  seriesIndex: number
}
/** This represents a js instance of an ApexChart, no definition is provided */
type ApexChartJsInstance = object

@Component({
  selector: 'app-olympic-pie-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './olympic-pie-chart.component.html',
  styleUrl: './olympic-pie-chart.component.scss',
})

/** Apex PieChartComponent wrapper */
export class OlympicPieChartComponent implements OnInit, OnChanges {
  @Input({ required: true }) olympicCountries: OlympicCountry[] = []

  @Output() selected = new EventEmitter<OlympicCountry>()

  public chartOptions: {
    labels: string[]
    series: ApexNonAxisChartSeries
    chart: ApexChart
    title: ApexTitleSubtitle
    dataLabels: ApexDataLabels
    colors: Color[]
  }

  constructor() {
    this.chartOptions = {
      labels: [],
      series: [],
      chart: {
        type: 'pie',
        events: {
          dataPointSelection: (e: MouseEvent, chart: ApexChartJsInstance, option: DataPointSelectionOption): void => {
            const country = this.olympicCountries.at(option.dataPointIndex)
            if (country === undefined) {
              throw new Error(`Failed to fetch country from list as index '${option.dataPointIndex}'`)
            }
            this.onSelectedCountryEvent(country)
          },
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['olympicCountries']) {
      this.updatePieChartData(changes['olympicCountries'].currentValue)
    }
  }

  private onSelectedCountryEvent(country: OlympicCountry): void {
    this.selected.emit(country)
  }

  private updatePieChartData(olympicCountries: typeof this.olympicCountries): void {
    this.chartOptions.labels = []
    this.chartOptions.series = []
    olympicCountries.forEach((olympicCountry) => {
      this.chartOptions.labels.push(olympicCountry.country)
      this.chartOptions.series.push(
        olympicCountry.participations
          .map(participation => participation.medalsCount)
          .reduce((prev, curr) => prev + curr),
      )
    })
  }
}
