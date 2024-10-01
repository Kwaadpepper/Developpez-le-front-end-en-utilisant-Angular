import { ApexOptions } from 'ng-apexcharts'

export interface CustomTooltip {
  series: Pick<ApexOptions, 'series'>
  seriesIndex: number
  dataPointIndex: number
  w: {
    config: ApexOptions
    globals: object & {
      labels: string[] | string[][]
    }
  }
}
