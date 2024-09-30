import { inject } from '@angular/core'
import { RedirectCommand, ResolveFn, Router } from '@angular/router'
import { map, Observable, of, take } from 'rxjs'
import OlympicCountry from '../models/olympic-country.interface'
import { OlympicService } from '../services/olympic-countries.service'

export const olympicCountryResolver: ResolveFn<OlympicCountry | RedirectCommand> = (route): Observable<OlympicCountry | RedirectCommand> => {
  const olympicService = inject(OlympicService)
  const countryId = route.paramMap.get('olympicCountryId')
  const router = inject(Router)
  const urlTree = router.parseUrl('/missing-page')

  if (countryId === null) {
    return of(new RedirectCommand(urlTree, { skipLocationChange: true }))
  }

  const olympicCountry$ = olympicService.getOlympicCountry(Number.parseInt(countryId))

  return olympicCountry$
    // * Resolve the olympic country or Goto missing page
    .pipe(
      take(1),
      map((olympicCountry) => {
        if (olympicCountry !== null) {
          return olympicCountry
        }

        // * Goto missing page if not olympic country is found
        return new RedirectCommand(urlTree, { skipLocationChange: true })
      }))
}
