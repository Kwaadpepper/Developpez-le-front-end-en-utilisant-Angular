import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, HostListener, Input, OnChanges, OnDestroy, Output, SimpleChange, SimpleChanges, ViewChild } from '@angular/core'
import { cloneDeep } from 'lodash-es'
import { ApexAxisChartSeries, ChartComponent, NgApexchartsModule } from 'ng-apexcharts'
import { SortWay } from 'src/app/core/enums/sort-way'
import OlympicCountry from 'src/app/core/models/olympic-country.interface'
import Participation from 'src/app/core/models/participation.interface'
import OlympicConfig from 'src/app/core/OlympicConfig'
import { ApexChartJsInstance } from 'src/app/core/types/apex-charts/apex-chart-js-instance.type'
import { CustomTooltip } from 'src/app/core/types/apex-charts/apex-tooltip-custom.type'
import { DataPointSelectionOption } from 'src/app/core/types/apex-charts/event-data-point-selection-option.type'
import { xAxisLabelClickOption } from 'src/app/core/types/apex-charts/event-x-axis-label-click-option.type'
import { PickApexOptions } from 'src/app/core/types/apex-charts/pick-apex-options.type'

/** Max zoom step for the chart */
const CHART_MIN_RATIO = 0.6
/** Min zoom step for the chart */
const CHART_MAX_RATIO = 1.6
/** Zoom step for the chart */
const CHART_STEP_RATIO = 0.2

/** Max height for a chart bar on zoom */
const CHART_LINE_MIN_HEIGHT = 45
/** Min height for a chart bar on zoom */
const CHART_LINE_MAX_HEIGHT = 70

/** Min font size multiplier for a x axis label on zoom */
const CHART_FONT_MIN_RATIO = 0.8
/** Max font size multiplier for a x axis label on zoom */
const CHART_FONT_MAX_RATIO = 1.3
/** Font size zoom step */
const CHART_FONT_STEP_RATIO = 0.05

/** Used as references for responsive chart font sizes */
const FONT_SIZES: Record<string | number, string> = {
  default: '16px',
  540: '14px',
  720: '14px',
  960: '16px',
}

@Component({
  selector: 'app-olympic-bar-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './olympic-bar-chart.component.html',
  styleUrl: './olympic-bar-chart.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

/** Apex PieChartComponent wrapper */
export class OlympicBarChartComponent implements OnDestroy, OnChanges {
  @ViewChild('chartComponent') chartComponent?: ChartComponent

  @Input({
    required: true,
    transform: (countries: OlympicCountry[]) => cloneDeep(countries),
  }) olympicCountries: OlympicCountry[] = []

  @Output() selected = new EventEmitter<OlympicCountry>()

  public chart: PickApexOptions<'chart'>
  public dataLabels: PickApexOptions<'dataLabels'>
  public labels: PickApexOptions<'labels'>
  public legend: PickApexOptions<'legend'>
  public plotOptions: PickApexOptions<'plotOptions'>
  public series: PickApexOptions<'series'>
  public responsive: PickApexOptions<'responsive'>
  public tooltip: PickApexOptions<'tooltip'>
  public yaxis: PickApexOptions<'yaxis'>

  private sortByMedals: SortWay = SortWay.natural
  private originalIndexes: number[] = []
  private chartHeightPerCountryRatio = 1
  private chartfontRatio = 1

  private canAddMedalsCountToApexYLabels = false

  constructor() {
    this.chart = {
      type: 'bar',
      toolbar: { show: false },
      events: {
        xAxisLabelClick: this.onXAxisLabelClick.bind(this),
        dataPointSelection: this.onBarClick.bind(this),
      },
    }
    this.dataLabels = { enabled: false }
    this.labels = []
    this.legend = { show: false }
    this.plotOptions = { bar: { horizontal: true, distributed: true } }
    this.series = []
    this.responsive = [
      {
        breakpoint: 540,
        options: {
          dataLabels: { enabled: true },
          yaxis: {
            labels: {
              show: true,
              style: { cssClass: 'yaxis-country-label', fontSize: FONT_SIZES[540] },
            },
          },
        },
      },
      {
        breakpoint: 720,
        options: {
          tooltip: { enabled: false },
          yaxis: {
            labels: {
              show: true,
              style: { cssClass: 'yaxis-country-label', fontSize: FONT_SIZES[720] },
            },
          },
        },
      },
      {
        breakpoint: 960,
        options: {
          tooltip: { enabled: true },
          yaxis: {
            labels: {
              show: true,
              minWidth: 250,
              maxWidth: 350,
              style: { cssClass: 'yaxis-country-label', fontSize: FONT_SIZES[960] },
            },
          },
        },
      },
    ]
    this.tooltip = {
      enabled: true,
      followCursor: true,
      custom: this.tooltipFormatter,
    }
    this.yaxis = [{
      forceNiceScale: false,
      labels: {
        show: true,
        minWidth: 250,
        maxWidth: 350,
        style: { cssClass: 'yaxis-country-label', fontSize: FONT_SIZES['default'] },
      },
    }]
  }

  ngOnDestroy(): void {
    this.olympicCountries = []
    this.originalIndexes = []
    this.chartComponent?.resetSeries()
    this.chartComponent?.destroy()
    this.chartComponent?.ngOnDestroy()

    delete this.chartComponent
  }

  ngOnChanges(changes: SimpleChanges): void {
    const olympicCountriesChanges: SimpleChange | undefined = changes['olympicCountries']
    if (olympicCountriesChanges) {
      const countries: OlympicCountry[] = olympicCountriesChanges.currentValue
      if (olympicCountriesChanges.firstChange) {
        this.originalIndexes = countries.map(country => country.id)
      }
      // NOTE: Apex emits a warning if there are too many items to display using bar chart, 100 is the limit on apex's code
      this.canAddMedalsCountToApexYLabels = this.olympicCountries.length < 100
      this.refreshChartConfig()
    }
  }

  @HostListener('window:resize')
  onViewPortResize(): void {
    this.refreshChartConfig()
  }

  /** When user wants sort countries */
  onSortCountriesByMedals(): void {
    const sortWays = Object.values(SortWay)

    const sortWayIdx = sortWays.indexOf(this.sortByMedals)

    if (sortWayIdx === -1 || !sortWays.length) {
      return
    }

    let i = -1
    do {
      // Rotate sortways
      const tmp = sortWays.shift()
      if (tmp === undefined) continue
      sortWays.push(tmp)
    } while (++i < sortWayIdx)
    this.sortByMedals = sortWays[0] ?? SortWay.natural
    this.refreshChartConfig()
  }

  /** When user wants to zoom in */
  onZoomIn(): void {
    const originalRatio = this.chartHeightPerCountryRatio
    this.chartHeightPerCountryRatio = Math.min(
      CHART_MAX_RATIO,
      this.chartHeightPerCountryRatio + CHART_STEP_RATIO,
    )

    const originalFontRatio = this.chartfontRatio
    this.chartfontRatio = Math.min(
      CHART_FONT_MAX_RATIO,
      this.chartHeightPerCountryRatio + CHART_FONT_STEP_RATIO,
    )

    if (
      this.chartHeightPerCountryRatio !== originalRatio
      || this.chartfontRatio !== originalFontRatio
    ) {
      this.refreshChartConfig()
    }
  }

  /** When user wants to zoom out */
  onZoomOut(): void {
    const originalRatio = this.chartHeightPerCountryRatio
    this.chartHeightPerCountryRatio = Math.max(
      CHART_MIN_RATIO,
      this.chartHeightPerCountryRatio - CHART_STEP_RATIO,
    )

    const originalFontRatio = this.chartfontRatio
    this.chartfontRatio = Math.max(
      CHART_FONT_MIN_RATIO,
      this.chartHeightPerCountryRatio - CHART_FONT_STEP_RATIO,
    )

    if (
      this.chartHeightPerCountryRatio !== originalRatio
      || this.chartfontRatio !== originalFontRatio
    ) {
      this.refreshChartConfig()
    }
  }

  /** A bar has been selected */
  private onBarClick(e: MouseEvent, chart: ApexChartJsInstance, option: DataPointSelectionOption): void {
    const country = this.olympicCountries[option.dataPointIndex]
    if (country === undefined) {
      throw new Error(`Failed to fetch country from list as index '${option.dataPointIndex}'`)
    }
    this.emitCountrySelected(country)
  }

  /** A X axis (they are inverted for this chart) label has been selected */
  private onXAxisLabelClick(e: MouseEvent, chart: ApexChartJsInstance, option: xAxisLabelClickOption): void {
    const country = this.olympicCountries[option.labelIndex]
    if (country === undefined) {
      throw new Error(`Failed to fetch country from list as index '${option.labelIndex}'`)
    }
    this.emitCountrySelected(country)
  }

  /** Emmit a country selected event */
  private emitCountrySelected(country: OlympicCountry): void {
    this.selected.emit(country)
  }

  /** Refresh chart configuration */
  private refreshChartConfig(): void {
    this.updateChartData(this.olympicCountries)
    this.adaptChartSettingsWith(this.olympicCountries)
    this.adaptChartFontSize()
  }

  /** Update chart labels and series */
  private updateChartData(olympicCountries: OlympicCountry[]): void {
    // * Assign country names
    this.labels = olympicCountries
      .sort(this.olympicCountrySorter.bind(this))
      /**
       * NOTE: Force type as package types does not actually match the js API
       * @see https://apexcharts.com/docs/multiline-text-and-line-breaks-in-axes-labels/
       */
      .map(olympicCountry => this.getFormattedCountryName(olympicCountry) as never)

    // * Assign medal totals
    this.series = [{
      name: $localize`Total number of medals won for all participations`,
      type: 'bar',
      data: olympicCountries
        .sort(this.olympicCountrySorter.bind(this))
        .map((olympicCountry, index) => {
          return {
            x: olympicCountry.country,
            y: olympicCountry.participations
              .map(participation => participation.medalsCount)
              .reduce((prev, curr) => prev + curr),
            fillColor: OlympicConfig.getColors()[index % OlympicConfig.getColors().length],
          } as never
        }),
    }]
  }

  /** Olympic country sorter function */
  private olympicCountrySorter(a: OlympicCountry, b: OlympicCountry): number {
    switch (this.sortByMedals) {
      case SortWay.ascending: return this.sumTotalMedalsForAll(a.participations)
        - this.sumTotalMedalsForAll(b.participations)
      case SortWay.descending: return this.sumTotalMedalsForAll(b.participations)
        - this.sumTotalMedalsForAll(a.participations)
      default:
        this.sortByMedals satisfies SortWay.natural
        return this.originalIndexes.indexOf(a.id) - this.originalIndexes.indexOf(b.id)
    }
  }

  /**
   * Format country infos to display on Y axis
   * @param olympicCountry
   * @returns Lines to display the country info on Y axis
   */
  private getFormattedCountryName(olympicCountry: OlympicCountry): string[] {
    const output: string[] = [olympicCountry.country.trim()]

    if (!this.canAddMedalsCountToApexYLabels) {
      const medalsAmount = this.sumTotalMedalsForAll(olympicCountry.participations)
      output.push($localize`Medals: ${medalsAmount}`)
    }

    return output
  }

  /** Format tooltips text */
  private tooltipFormatter(
    { series, seriesIndex, dataPointIndex, w }:
      Omit<CustomTooltip, 'series'> & { series: ApexAxisChartSeries },
  ): string {
    const serie = series[seriesIndex]
    const dataString = serie instanceof Array ? serie[dataPointIndex] : 0
    const dataLabel
      = [...w.globals.labels[dataPointIndex]]
        .join(' ')
        .replace($localize`Medals: ${dataString}`, '')

    const div = document.createElement('div')
    div.classList.add('olympic-tooltip')
    const spanCountry = document.createElement('span')
    spanCountry.innerText = dataLabel
    const spanMedals = document.createElement('span')
    // U+1F3C5 = 🏅  U+00A0 = &nbsp;
    spanMedals.innerText = `\u{1F3C5}\u{00A0}${dataString}`

    div.appendChild(spanCountry)
    div.appendChild(spanMedals)

    return div.outerHTML
  }

  /**
   * Get the total medal count for all participations
   * @param participations Each country participations
   * @returns The total medals for every all country participations
   */
  private sumTotalMedalsForAll(participations: Participation[]): number {
    return participations
      .map(participation => participation.medalsCount)
      .reduce((prev, curr) => prev + curr)
  }

  /**
   * Adapt chart settings in order to dispay these data
   * @param olympicCountries All countries used to display stats
   */
  private adaptChartSettingsWith(olympicCountries: OlympicCountry[]): void {
    let newLineHeight = Math.round(372 / window.screen.width * CHART_LINE_MAX_HEIGHT)
    newLineHeight = Math.max(CHART_LINE_MIN_HEIGHT, newLineHeight)
    newLineHeight = Math.min(CHART_LINE_MAX_HEIGHT, newLineHeight)
    newLineHeight = Math.round(newLineHeight * this.chartHeightPerCountryRatio)
    this.chart!.height = newLineHeight * olympicCountries.length

    this.responsive![0]!.options!.dataLabels.enabled = this.canAddMedalsCountToApexYLabels
  }

  /**
   * Adapt chart font size using font ratio
   */
  private adaptChartFontSize(): void {
    const getFontUsingRatio = (pixels: string): string =>
      `${Math.ceil(this.chartfontRatio * Number.parseInt(pixels))}px`

    /** Update an yAxis config  */
    const updateFontSizeConfig = (
      yAxis: typeof this.yaxis,
      breakpoint: keyof typeof FONT_SIZES,
    ): void => {
      const axis = yAxis instanceof Array ? yAxis[0] : yAxis
      axis!.labels!.style!.fontSize = getFontUsingRatio(FONT_SIZES[breakpoint])
    }

    // * Chart config
    updateFontSizeConfig(this!.yaxis, 'default')

    // * Chart responsive config
    this!.responsive!.forEach((config, idx) => {
      {
        const breakpoint = this!.responsive![idx]!.breakpoint
        const yAxis: typeof this.yaxis = this!.responsive![idx]!.options!.yaxis

        if (yAxis === undefined) {
          throw new Error('Responsive yAxis is missing breakpoint')
        }
        if (breakpoint === undefined) {
          throw new Error('Responsive config is missing breakpoint')
        }

        updateFontSizeConfig(yAxis, breakpoint)
      }
    })
  }
}
