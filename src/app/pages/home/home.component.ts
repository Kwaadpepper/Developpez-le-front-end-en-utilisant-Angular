import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { Router } from '@angular/router'
import { catchError, delay, Observable, of, Subject, take, tap } from 'rxjs'
import { OlympicPieChartComponent } from 'src/app/components/olympic-bar-chart/olympic-bar-chart.component'
import OlympicCountry from 'src/app/core/models/olympic-country.interface'
import { OlympicService } from 'src/app/core/services/olympic-countries.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('olympicPieChart', { static: false }) pieChart!: OlympicPieChartComponent

  public canTryToReloadData = false
  public numberOfJOs = 0

  public olympicCountries$: Observable<OlympicCountry[]> = of([])

  private destroyOlympicCountries$!: Subject<boolean>

  constructor(
    private titleService: Title,
    private router: Router,
    private olympicService: OlympicService,
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle($localize`Medals per Country`)

    this.destroyOlympicCountries$ = new Subject<boolean>()
    this.olympicCountries$ = this.olympicService
      .getOlympicCountries()
      .pipe(
        // ! Prevent modifying view while rendering
        delay(0),
        tap((olympicCountries) => {
          this.setCanTryReload(olympicCountries.length === 0)
          this.numberOfJOs = this.countNumberOfJoFrom(olympicCountries)
        }),
        catchError((error, caught) => {
          this.setCanTryReload(true)
          return caught
        }),
      )
  }

  ngOnDestroy(): void {
    this.destroyOlympicCountries$.next(true)
  }

  onTryToReload(): void {
    this.olympicService.loadInitialData()
      .pipe(take(1))
      .subscribe()
  }

  onSelectAnOlympicCountryStats(olympicCountry: OlympicCountry): void {
    this.router.navigateByUrl(`details/${olympicCountry.id}`)
  }

  private setCanTryReload(canTry: boolean): void {
    this.canTryToReloadData = canTry
  }

  private countNumberOfJoFrom(countries: OlympicCountry[]): number {
    return countries
      .map(country => country.participations.length)
      .reduce(nbParticipations => Math.max(nbParticipations))
  }
}
