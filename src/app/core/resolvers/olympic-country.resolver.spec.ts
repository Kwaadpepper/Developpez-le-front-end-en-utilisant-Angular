import { TestBed } from '@angular/core/testing'
import { ResolveFn } from '@angular/router'

import OlympicCountry from '../models/olympic-country.interface'
import { olympicCountryResolver } from './olympic-country.resolver'

describe('olympicCountryResolver', () => {
  const executeResolver: ResolveFn<OlympicCountry | null> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => olympicCountryResolver(...resolverParameters))

  beforeEach(() => {
    TestBed.configureTestingModule({})
  })

  it('should be created', () => {
    expect(executeResolver).toBeTruthy()
  })
})
