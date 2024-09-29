import { HttpClient } from '@angular/common/http'
import { Injectable, signal } from '@angular/core'
import { cloneDeep } from 'lodash-es'
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs'
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
  private olympicCountries = signal<OlympicCountriesServiceData>([])
  private olympics$ = new BehaviorSubject<OlympicCountriesServiceData>([])

  constructor(
    private http: HttpClient,
    private toastService: ToastService,
  ) { }

  /** Attempt to load olympic countries from server */
  loadInitialData(): Observable<OlympicCountriesServiceData> {
    return this.http
      .get<OlympicCountriesServiceData>(this.olympicUrl)
      .pipe(
        tap(value => this.olympics$.next(value)),
        catchError((error, caught) => {
          this.toastService.error($localize`Error while fetching olympic countries from server`)
          console.debug(error)
          this.olympics$.next([])
          return caught
        }),
      )
  }

  /** Get the olympic country list */
  getOlympicCountries(): Observable<OlympicCountriesServiceData> {
    return this.olympics$.asObservable()
  }

  /** Get a specific olympic country */
  getOlympicCountry(id: number): OlympicCountryServiceData | null {
    for (const olympicCountry of this.olympicCountries()) {
      if (olympicCountry.id === id) {
        return cloneDeep(olympicCountry)
      }
    }
    return null
  }
}
