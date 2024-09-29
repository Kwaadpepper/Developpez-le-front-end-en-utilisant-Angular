import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { cloneDeep } from 'lodash-es'
import { BehaviorSubject, catchError, Observable, Subject, tap } from 'rxjs'
import OlympicCountry from '../models/olympic-country.interface'
import { ToastService } from './toast.service'

export type OlympicCountriesServiceData = OlympicCountry[]
export type OlympicCountryServiceData = OlympicCountry

@Injectable({
  providedIn: 'root',
})

export class OlympicService {
  // * Unique source of data for now
  private olympicUrl = './assets/mock/generated.json'
  // * Olympic countries fetcher
  private olympicCountries$ = new BehaviorSubject<OlympicCountriesServiceData>([])
  // * Olympic country fetcher
  private olympicCountry$ = new Subject<OlympicCountryServiceData | null>()

  // * Local pool of olympic countries
  private olympicCountries: OlympicCountriesServiceData = []

  constructor(
    private http: HttpClient,
    private toastService: ToastService,
  ) { }

  /** Attempt to load olympic countries from server */
  loadInitialData(): Observable<OlympicCountriesServiceData> {
    return this.http
      .get<OlympicCountriesServiceData>(this.olympicUrl)
      .pipe(
        tap((value) => {
          // * Keep Countries to locally resolve a specific country
          this.olympicCountries = value
          this.olympicCountries$.next(cloneDeep(value))
        }),
        catchError((error, caught) => {
          const message = $localize`Error while fetching olympic countries from server`
          this.toastService.error(message)
          this.olympicCountries$.next([])
          this.olympicCountries$.error(message)
          return caught
        }),
      )
  }

  /** Get the olympic country list */
  getOlympicCountries(): Observable<OlympicCountriesServiceData> {
    return this.olympicCountries$.asObservable()
  }

  /** Get a specific olympic country */
  getOlympicCountry(id: OlympicCountryServiceData['id']): Observable<OlympicCountryServiceData | null> {
    // * Resolve the olympic country afterward
    setTimeout(() => {
      // ? Do we have any country data ?
      if (this.olympicCountries.length === 0) {
        this // ! No
        // * So Fetch countries from server
          .loadInitialData()
        // * Then look for the country
          .pipe(tap(() => this.findOlympicCountry(id)))
      }
      else {
      // ! Yes
      // * Then just look for the country
        this.findOlympicCountry(id)
      }
    }, 100)

    return this.olympicCountry$
  }

  /** Look for the olympic country on our local repository */
  private findOlympicCountry(id: OlympicCountryServiceData['id']): void {
    const olympicCountry = this.olympicCountries.find(olympicCountry => olympicCountry.id === id)
    this.olympicCountry$.next(olympicCountry ?? null)
  }
}
