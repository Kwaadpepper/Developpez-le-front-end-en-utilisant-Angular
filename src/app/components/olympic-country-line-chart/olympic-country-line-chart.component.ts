import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges, ViewChild } from '@angular/core'
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts'
import Participation from 'src/app/core/models/participation.interface'
import OlympicConfig from 'src/app/core/OlympicConfig'
import { CustomTooltip } from 'src/app/core/types/apex-charts/apex-tooltip-custom.type'
import { PickApexOptions } from 'src/app/core/types/apex-charts/pick-apex-options.type'

/** Zoom step in years */
const ZOOM_STEP = 4

@Component({
  selector: 'app-olympic-country-line-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './olympic-country-line-chart.component.html',
  styleUrl: './olympic-country-line-chart.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OlympicCountryLineChartComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('chartComponent', { static: false }) chartComponent?: ChartComponent

  @Input({ required: true }) participations: Participation[] = []

  public chart: PickApexOptions<'chart'>
  public colors: PickApexOptions<'colors'>
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

  public panLeftLabel: string = $localize`Pan left`
  public panRightLabel: string = $localize`Pan right`
  public zoomOutLabel: string = $localize`Zoom out`
  public zoomInLabel: string = $localize`Zoom in`
  public zoomResetLabel: string = $localize`Zoom reset`

  private startDate: Date
  private endDate: Date
  private minDate: Date
  private maxDate: Date

  constructor() {
    this.chart = {
      type: 'line',
      stacked: false,
      height: 350,
      zoom: { enabled: false },
      selection: { enabled: false },
      toolbar: { show: false },
    }
    this.colors = OlympicConfig.getColors()
    this.dataLabels = { enabled: false }
    this.grid = {
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
    }
    this.labels = [$localize`Medals`]
    this.legend = { show: false, floating: false }
    this.series = []
    this.stroke = { curve: 'straight' }
    this.tooltip = {
      enabled: true,
      x: { format: 'yyyy' },
      custom: this.tooltipFormatter.bind(this),
    }
    this.yaxis = {
      min: 0,
      max: (): number => {
        const maxMedals: number = [0, ...this.participations
          .map(participation => participation.medalsCount)]
          .reduce((prev, curr) => Math.max(prev, curr))
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

    this.xaxis = {
      type: 'datetime',
      labels: {
        show: true,
      },
    }

    this.startDate = new Date()
    this.endDate = new Date()
    this.minDate = new Date()
    this.maxDate = new Date()
  }

  ngOnInit(): void {
    this.updateChartData()
  }

  ngOnChanges(changes: SimpleChanges): void {
    const participationsChanges: SimpleChange | undefined = changes['participations']
    if (participationsChanges) {
      const participations: Participation[] = participationsChanges.currentValue
      if (participationsChanges.firstChange) {
        this.participations = participations
      }

      this.startDate = new Date(`${this.participations.at(0)?.year}-01-01`)
      this.endDate = new Date(`${this.participations.at(this.participations.length - 1)?.year}-01-01`)
      this.minDate = new Date(this.startDate.getTime())
      this.maxDate = new Date(this.endDate.getTime())

      this.xaxis = {
        min: this.startDate.getTime(),
        max: this.endDate.getTime(),
        type: 'datetime',
        labels: { show: true },
      }
    }
  }

  ngOnDestroy(): void {
    this.chartComponent?.resetSeries()
    this.chartComponent?.destroy()
    this.chartComponent?.ngOnDestroy()

    delete this.chartComponent
  }

  onResetZoom(): void {
    this.minDate.setFullYear(this.startDate.getFullYear())
    this.maxDate.setFullYear(this.endDate.getFullYear())
    this.updateChartOptions()
  }

  onZoomIn(): void {
    this.minDate.setFullYear(this.minDate.getFullYear() + ZOOM_STEP)
    this.maxDate.setFullYear(this.maxDate.getFullYear() - ZOOM_STEP)
    this.updateChartOptions()
  }

  onZoomOut(): void {
    this.minDate.setFullYear(this.minDate.getFullYear() - ZOOM_STEP)
    this.maxDate.setFullYear(this.maxDate.getFullYear() + ZOOM_STEP)
    this.updateChartOptions()
  }

  onPanLeft(): void {
    this.minDate.setFullYear(this.minDate.getFullYear() - ZOOM_STEP)
    this.maxDate.setFullYear(this.maxDate.getFullYear() - ZOOM_STEP)
    this.updateChartOptions()
  }

  onPanRight(): void {
    this.minDate.setFullYear(this.minDate.getFullYear() + ZOOM_STEP)
    this.maxDate.setFullYear(this.maxDate.getFullYear() + ZOOM_STEP)
    this.updateChartOptions()
  }

  private updateChartOptions(): void {
    this.chartComponent?.updateOptions({
      xaxis: {
        min: this.minDate.getTime(),
        max: this.maxDate.getTime(),
        type: 'datetime',
        labels: { show: true },
      },
    })
  }

  /** Update chart labels and series */
  private updateChartData(): void {
    const participations: Participation[] = this.participations
    this.series = [
      {
        name: $localize`Medals this year`,
        type: 'line',
        data: participations.map((participation: Participation) => [
          (new Date(`${participation.year}-01-01`)), participation.medalsCount,
        ]),
      } as never,
    ]
  }

  /** Format tooltips text */
  private tooltipFormatter(
    { series, seriesIndex, dataPointIndex }:
      Omit<CustomTooltip, 'series'> & { series: number[][] },
  ): string {
    const serie = series[seriesIndex]
    const dataString: number = serie instanceof Array ? serie[dataPointIndex] : 0
    const dataLabel = $localize`${dataString} \u{1F3C5}\u{00A0} Medal${dataString ? 's' : ''} won `
    const yean = this.participations.at(dataPointIndex)?.year

    const div = document.createElement('div')
    div.classList.add('olympic-tooltip')
    const spanCountry = document.createElement('span')
    spanCountry.innerText = dataLabel
    const spanMedals = document.createElement('span')
    // U+1F3C5 = 🏅  U+00A0 = &nbsp;
    spanMedals.innerText = `in ${yean}`

    div.appendChild(spanCountry)
    div.appendChild(spanMedals)

    return div.outerHTML
  }
}
