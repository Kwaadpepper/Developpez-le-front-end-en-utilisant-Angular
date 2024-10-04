import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { AppComponent } from 'src/app/app.component'
import { OlympicCountryLineChartComponent } from 'src/app/components/olympic-country-line-chart/olympic-country-line-chart.component'
import { DetailsComponent } from './details.component'

import { default as olympicJson } from './../../../assets/mock/olympic.json'

describe('DetailsComponent', () => {
  let component: DetailsComponent
  let fixture: ComponentFixture<DetailsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent, DetailsComponent],
      imports: [OlympicCountryLineChartComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                olympicCountry: olympicJson[0],
              },
            },
          },
        },
      ],
    })
      .compileComponents()

    fixture = TestBed.createComponent(DetailsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
