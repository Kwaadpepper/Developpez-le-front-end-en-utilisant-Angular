import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import OlympicCountry from '../models/OlympicCountry';

export type OlympicServiceData = Array<OlympicCountry>;

@Injectable({
  providedIn: 'root',
})

export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<OlympicServiceData>([]);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<OlympicServiceData>(this.olympicUrl).pipe(
      tap((dataResponse) => this.olympics$.next(dataResponse)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next([]);
        return caught;
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }
}
