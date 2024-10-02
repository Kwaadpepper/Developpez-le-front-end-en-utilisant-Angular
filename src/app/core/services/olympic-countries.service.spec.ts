import { TestBed } from '@angular/core/testing'

import { provideHttpClient } from '@angular/common/http'
import { OlympicService } from './olympic-countries.service'

describe('OlympicService', () => {
  let service: OlympicService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    })
    service = TestBed.inject(OlympicService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
