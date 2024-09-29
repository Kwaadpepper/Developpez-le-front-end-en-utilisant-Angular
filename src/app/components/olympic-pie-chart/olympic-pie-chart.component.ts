import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core'
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts'
import OlympicCountry from 'src/app/core/models/OlympicCountry'
import Participation from 'src/app/core/models/Participation'
import OlympicConfig from 'src/app/core/OlympicConfig'

/** A selected data of an apex pie chart */
interface DataPointSelectionOption {
  dataPointIndex: number
  selectedDataPoints: number[]
  seriesIndex: number
}
/** This represents a js instance of an ApexChart, no definition is provided */
type ApexChartJsInstance = object

enum SortWay {
  natural = 'natural',
  ascending = 'ascending',
  descending = 'descending',
}

const chartLineMinHeight = 45
const chartLineMaxHeight = 70

const chartMinRatio = 0.6
const chartMaxRatio = 1.6
const chartStepRatio = 0.2

const chartFontMinRatio = 0.8
const chartFontMaxRatio = 1.3
const chartFontStepRatio = 0.05

@Component({
  selector: 'app-olympic-pie-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './olympic-pie-chart.component.html',
  styleUrl: './olympic-pie-chart.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

/** Apex PieChartComponent wrapper */
export class OlympicPieChartComponent implements OnInit, OnDestroy, OnChanges {
  @Input({ required: true }) olympicCountries: OlympicCountry[] = []

  @Output() selected = new EventEmitter<OlympicCountry>()

  chartOptions: ApexOptions

  private sortByMedals: SortWay = SortWay.natural
  private originalIndexes: number[] = []
  private chartHeightPerCountryRatio = 1
  private chartfontRatio = 1

  /** Used as references for responsive chart font sizes */
  private fontSizes: Record<string | number, string> = {
    default: '16px',
    540: '14px',
    720: '14px',
    960: '16px',
  }

  private canAddMedalsCountToApexYLabels = false
  private shortestWidthForLabels = 100

  constructor() {
    this.chartOptions = {
      chart: {
        type: 'bar',
        toolbar: { show: false },
        events: {
          xAxisLabelClick: (e: MouseEvent, chart: ApexChartJsInstance, option: DataPointSelectionOption): void => {
            const country = this.olympicCountries.at(option.dataPointIndex)
            if (country === undefined) {
              throw new Error(`Failed to fetch country from list as index '${option.dataPointIndex}'`)
            }
            this.onSelectedCountryEvent(country)
          },
          dataPointSelection: (e: MouseEvent, chart: ApexChartJsInstance, option: DataPointSelectionOption): void => {
            const country = this.olympicCountries.at(option.dataPointIndex)
            if (country === undefined) {
              throw new Error(`Failed to fetch country from list as index '${option.dataPointIndex}'`)
            }
            this.onSelectedCountryEvent(country)
          },
        },
      },
      dataLabels: { enabled: false },
      labels: [],
      legend: {
        show: false,
      },
      noData: {
        text: 'Loading...',
      },
      plotOptions: {
        bar: {
          horizontal: true,
          distributed: true,
        },
      },
      responsive: [
        {
          breakpoint: 540,
          options: {
            dataLabels: { enabled: true },
            tooltip: { enabled: false },
            yaxis: {
              labels: {
                show: true,
                minWidth: this.shortestWidthForLabels,
                maxWidth: 150,
                style: { fontSize: this.fontSizes[540] },
              },
            },
          },
        },
        {
          breakpoint: 720,
          options: {
            yaxis: {
              labels: {
                show: true,
                minWidth: 200,
                maxWidth: 250,
                style: { fontSize: this.fontSizes[720] },
              },
            },
          },
        },
        {
          breakpoint: 960,
          options: {
            yaxis: {
              labels: {
                show: true,
                minWidth: 250,
                maxWidth: 300,
                style: { fontSize: this.fontSizes[960] },
              },
            },
          },
        },
      ],
      series: [],

      yaxis: [{
        forceNiceScale: false,
        labels: {
          show: true,
          minWidth: 350,
          maxWidth: 350,
          style: { cssClass: 'yaxis-country-label', fontSize: this.fontSizes['default'] },
        },
      }],
    }
  }

  ngOnInit(): void {
    this.refreshChartWith(this.olympicCountries)
  }

  ngOnDestroy(): void {
    this.chartOptions = {}
    this.olympicCountries = []
    this.originalIndexes = []
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['olympicCountries']) {
      const countries: OlympicCountry[] = changes['olympicCountries'].currentValue
      this.originalIndexes = countries.map(country => country.id)
      // NOTE: Apex emits a warning if there are too many items to display using bar chart, 100 is the limit on apex's code
      this.canAddMedalsCountToApexYLabels = this.olympicCountries.length < 100
      this.refreshChartWith(countries)
    }
  }

  @HostListener('window:resize')
  onViewPortResize(): void {
    this.refreshChartWith(this.olympicCountries)
  }

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
    this.sortByMedals = sortWays.at(0) ?? SortWay.natural
    this.refreshChartWith(this.olympicCountries)
  }

  onZoomIn(): void {
    const originalRatio = this.chartHeightPerCountryRatio
    this.chartHeightPerCountryRatio = Math.min(
      chartMaxRatio,
      this.chartHeightPerCountryRatio + chartStepRatio,
    )

    const originalFontRatio = this.chartfontRatio
    this.chartfontRatio = Math.min(
      chartFontMaxRatio,
      this.chartHeightPerCountryRatio + chartFontStepRatio,
    )

    if (
      this.chartHeightPerCountryRatio !== originalRatio
      || this.chartfontRatio !== originalFontRatio
    ) {
      this.refreshChartWith(this.olympicCountries)
    }
  }

  onZoomOut(): void {
    const originalRatio = this.chartHeightPerCountryRatio
    this.chartHeightPerCountryRatio = Math.max(
      chartMinRatio,
      this.chartHeightPerCountryRatio - chartStepRatio,
    )

    const originalFontRatio = this.chartfontRatio
    this.chartfontRatio = Math.max(
      chartFontMinRatio,
      this.chartHeightPerCountryRatio - chartFontStepRatio,
    )

    if (
      this.chartHeightPerCountryRatio !== originalRatio
      || this.chartfontRatio !== originalFontRatio
    ) {
      this.refreshChartWith(this.olympicCountries)
    }
  }

  private onSelectedCountryEvent(country: OlympicCountry): void {
    this.selected.emit(country)
  }

  private refreshChartWith(olympicCountries: OlympicCountry[]): void {
    this.updatePieChartData(olympicCountries)
    this.adaptChartSettingsWith(olympicCountries)
    this.adaptChartFontsSettingsWith(this.chartfontRatio)
  }

  private updatePieChartData(olympicCountries: OlympicCountry[]): void {
    // * Assign country names
    this.chartOptions.labels = olympicCountries
      .sort(this.sortOlympicCountries.bind(this))
      /**
       * NOTE: Force stype as package types does not match actual js API
       * @see https://apexcharts.com/docs/multiline-text-and-line-breaks-in-axes-labels/
       */
      .map(olympicCountry => this.getFormattedCountryName(olympicCountry) as never)

    // * Assign medal totals
    this.chartOptions.series = [{
      name: $localize`Total number of medals won for all participations`,
      type: 'bar',
      data: olympicCountries
        .sort(this.sortOlympicCountries.bind(this))
        .map((olympicCountry, index) => {
          return {
            x: olympicCountry.country,
            y: olympicCountry.participations
              .map(participation => participation.medalsCount)
              .reduce((prev, curr) => prev + curr),
            fillColor: OlympicConfig.getColors().at(index % OlympicConfig.getColors().length),
          } as never
        }),
    }]
  }

  /**
   * Olympic country sorter function
   */
  private sortOlympicCountries(a: OlympicCountry, b: OlympicCountry): number {
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
    let output: string[] = [olympicCountry.country.trim()]

    /** Split a string in two equal groups of words */
    const splitStrInHalf = (str: string): string[] => {
      const words = str.split(' ')

      const chunkSize = Math.ceil(words.length / 2)
      return [...Array(2)]
        .map((value, index) => words.slice(index * chunkSize, (index + 1) * chunkSize))
        .map(a => a.join(' '))
        // Ignore empty lines
        .filter(a => a.length)
    }

    if (
      window.innerWidth < (this.chartOptions.responsive!.at(0)!.breakpoint ?? 540)
      && olympicCountry.country.length
      > Math.round(this.shortestWidthForLabels / 6)
    ) {
      output = splitStrInHalf(olympicCountry.country)
    }
    if (!this.canAddMedalsCountToApexYLabels) {
      output.push($localize`Medals: ${this.sumTotalMedalsForAll(olympicCountry.participations)}`)
    }
    return output
  }

  /**
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
    let newLineHeight = Math.round(372 / window.screen.width * chartLineMaxHeight)
    newLineHeight = Math.max(chartLineMinHeight, newLineHeight)
    newLineHeight = Math.min(chartLineMaxHeight, newLineHeight)
    newLineHeight = Math.round(newLineHeight * this.chartHeightPerCountryRatio)
    this.chartOptions.chart!.height = newLineHeight * olympicCountries.length

    this.chartOptions.responsive!.at(0)!.options!.dataLabels.enabled = this.canAddMedalsCountToApexYLabels
  }

  /**
   * Adapt chart fonts settings using ratio
   * @param chartFontStepRatio
   */
  private adaptChartFontsSettingsWith(chartFontStepRatio: number): void {
    const getFontUsingRatio = (pixels: string): string =>
      `${Math.ceil(chartFontStepRatio * Number.parseInt(pixels))}px`

    const updateFontSizeConfig = (
      yAxis: typeof this.chartOptions.yaxis,
      fontSizeIdx: keyof typeof this.fontSizes,
    ): void => {
      if (yAxis instanceof Array) {
        yAxis.at(0)!.labels!.style!.fontSize = getFontUsingRatio(this.fontSizes[fontSizeIdx])
      }
      else {
        yAxis!.labels!.style!.fontSize = getFontUsingRatio(this.fontSizes['default'])
      }
    }

    const updateResponsiveFontSizeConfig = (responsiveConfigIdx: number): void => {
      const breakpoint = this!.chartOptions!.responsive!.at(responsiveConfigIdx)!.breakpoint
      const yAxis: typeof this.chartOptions.yaxis | undefined
        = this!.chartOptions!.responsive!.at(responsiveConfigIdx)!.options!.yaxis
      if (breakpoint === undefined) {
        throw new Error('Responsive config is missing breakpoint')
      }

      updateFontSizeConfig(yAxis, breakpoint)
    }

    // Chart config
    updateFontSizeConfig(this!.chartOptions!.yaxis, 'default')

    // Chart responsive config
    updateResponsiveFontSizeConfig(0)
    updateResponsiveFontSizeConfig(1)
    updateResponsiveFontSizeConfig(2)
  }
}
