import { inject } from '@angular/core'
import { ResolveFn, Router } from '@angular/router'
import { EMPTY, Observable } from 'rxjs'
import OlympicCountry from '../models/OlympicCountry'
import { OlympicService } from '../services/olympicCountries.service'

export const olympicCountryResolver: ResolveFn<OlympicCountry> = (route): Observable<OlympicCountry> => {
  const router = inject(Router)

  const olympicService = inject(OlympicService)
  const countryId = route.paramMap.get('olympicCountry')
  if (countryId === null) {
    router.navigate(['/missing-page'])
    return EMPTY
  }
  console.debug(`country id ${countryId}`)
  return olympicService.getOlympicCountry(Number.parseInt(countryId))
}
