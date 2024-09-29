import { Component, OnDestroy, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { Router } from '@angular/router'
import { Observable, of, Subscription } from 'rxjs'
import OlympicCountry from 'src/app/core/models/OlympicCountry'
import { OlympicCountriesServiceData, OlympicService } from 'src/app/core/services/olympicCountries.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public olympicCountries$: Observable<OlympicCountriesServiceData> = of([])
  private olympicCountries$Sub: Subscription | null = null

  public olympicCountries: OlympicCountry[] = []

  constructor(
    private titleService: Title,
    private router: Router,
    private olympicService: OlympicService,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle($localize`Medals per Country`)
    this.olympicCountries$ = this.olympicService.getOlympicCountries()
    this.olympicCountries$Sub = this.olympicCountries$.subscribe({
      next: (value: OlympicCountriesServiceData): void => {
        this.olympicCountries = value
      },
    })
  }

  ngOnDestroy(): void {
    this.olympicCountries$Sub?.unsubscribe()
  }

  onSelectAnOlympicCountryStats(olympicCountry: OlympicCountry): void {
    this.router.navigateByUrl(`details/${olympicCountry.id}`)
  }
}
