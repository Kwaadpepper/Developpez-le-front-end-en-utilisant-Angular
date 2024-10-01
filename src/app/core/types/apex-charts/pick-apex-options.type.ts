import { ApexOptions } from 'ng-apexcharts'

export type PickApexOptions<U extends keyof ApexOptions> = Pick<ApexOptions, U>[U]
