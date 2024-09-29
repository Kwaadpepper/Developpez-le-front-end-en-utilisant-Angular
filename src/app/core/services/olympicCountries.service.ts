import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { cloneDeep } from 'lodash-es'
import { BehaviorSubject, catchError, Observable, Subject, tap } from 'rxjs'
import OlympicCountry from '../models/OlympicCountry'
import { ToastService } from './toast.service'

export type OlympicCountriesServiceData = OlympicCountry[]
export type OlympicCountryServiceData = OlympicCountry

@Injectable({
  providedIn: 'root',
})

export class OlympicService {
  /** Unique source of data for now */
  private olympicUrl = './assets/mock/generated.json'
  /** Fetch list of olympic countries */
  private olympicCountries$ = new BehaviorSubject<OlympicCountriesServiceData>([])

  private olympicCountries: OlympicCountriesServiceData = []

  private olympicCountry$ = new Subject<OlympicCountryServiceData>()

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
          // * Per
          this.olympicCountries = value
          this.olympicCountries$.next(cloneDeep(value))
        }),
        catchError((error, caught) => {
          this.toastService.error($localize`Error while fetching olympic countries from server`)
          console.debug(error)
          this.olympicCountries$.next([])
          return caught
        }),
      )
  }

  /** Get the olympic country list */
  getOlympicCountries(): Observable<OlympicCountriesServiceData> {
    return this.olympicCountries$.asObservable()
  }

  /** Get a specific olympic country */
  getOlympicCountry(id: number): Observable<OlympicCountryServiceData> {
    // * Simulate async call so we could replace it with a server call
    setTimeout(() => {
      const olympicCountry = this.olympicCountries.find(olympicCountry => olympicCountry.id === id)
      console.log(`get '${id}'`, olympicCountry, this.olympicCountries)
      if (olympicCountry === undefined) {
        this.olympicCountry$.error(`Olympic country id '${id}' not found`)
        return
      }
      this.olympicCountry$.next(olympicCountry)
    }, 200)
    return this.olympicCountry$.asObservable()
  }
}
