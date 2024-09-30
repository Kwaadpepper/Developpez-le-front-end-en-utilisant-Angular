import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { Router } from '@angular/router'
import { Observable, of, Subscription, take } from 'rxjs'
import { OlympicPieChartComponent } from 'src/app/components/olympic-bar-chart/olympic-bar-chart.component'
import OlympicCountry from 'src/app/core/models/olympic-country.interface'
import { OlympicCountriesServiceData, OlympicService } from 'src/app/core/services/olympic-countries.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('olympicPieChart', { static: false }) pieChart!: OlympicPieChartComponent
  public olympicCountries$: Observable<OlympicCountriesServiceData> = of([])

  public olympicCountries: OlympicCountry[] = []
  public canTryToReloadData = false

  private olympicCountries$Sub: Subscription | null = null

  constructor(
    private titleService: Title,
    private router: Router,
    private olympicService: OlympicService,
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle($localize`Medals per Country`)
    this.olympicCountries$ = this.olympicService.getOlympicCountries()
    this.olympicCountries$Sub = this.olympicCountries$.subscribe({
      next: (value: OlympicCountriesServiceData): void => {
        this.canTryToReloadData = false
        this.olympicCountries = value
      },
      error: () => {
        this.canTryToReloadData = true
      },
    })
  }

  ngOnDestroy(): void {
    this.olympicCountries$Sub?.unsubscribe()
    this.pieChart.ngOnDestroy()
  }

  onTryToReload(): void {
    this.olympicService.loadInitialData()
      .pipe(take(1))
      .subscribe()
  }

  onSelectAnOlympicCountryStats(olympicCountry: OlympicCountry): void {
    this.router.navigateByUrl(`details/${olympicCountry.id}`)
  }
}
