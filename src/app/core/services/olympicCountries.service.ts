import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { cloneDeep } from 'lodash';
import OlympicCountry from '../models/OlympicCountry';

export type OlympicCountriesServiceData = Array<OlympicCountry>;
export type OlympicCountryServiceData = OlympicCountry;

@Injectable({
  providedIn: 'root',
})

export class OlympicService {
  /** Unique source of data for now */
  private olympicUrl = './assets/mock/olympic.json';
  /** Fetch list of olympic countries */
  private olympicCountries = signal<OlympicCountriesServiceData>([]);

  constructor(private http: HttpClient) {}

  loadCountryList() {
    return this.http.get<OlympicCountriesServiceData>(this.olympicUrl).subscribe({
      next: (dataResponse) => this.olympicCountries.set(dataResponse),
      error: (error) => {
        this.olympicCountries.set([]);
        console.debug(error);
        throw new Error('Error while fetching olympic countries from server');
      }
    });
  }

  getOlympicCountries(): OlympicCountriesServiceData {
    return this.olympicCountries();
  }

  getOlympicCountry(id: number): OlympicCountryServiceData|null {
    console.debug(`loadOlympicCountry ${id}`);
    for (const olympicCountry of this.olympicCountries()) {
      if (olympicCountry.id === id) {
        return cloneDeep(olympicCountry);
      }
    }
    return null;
  }
}
