import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import OlympicCountry from '../models/OlympicCountry';
import { OlympicService } from '../services/olympicCountries.service';

export const olympicCountryResolver: ResolveFn<OlympicCountry | null> = (route): Observable<OlympicCountry> => {
  const router = inject(Router);

  const olympicService = inject(OlympicService);
  const countryId = route.paramMap.get('olympicCountryId');
  if (countryId === null) {
    router.navigate(['/missing-page']);
    return EMPTY;
  }
  console.debug(`country id ${countryId}`)
  const olympicCountry = olympicService.getOlympicCountry(Number.parseInt(countryId));
  console.log(olympicCountry?.country)
  if (olympicCountry === null) {
    router.navigate(['/missing-page']);
    return EMPTY;
  }
  return of(olympicCountry);
};
