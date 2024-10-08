import { ComponentFixture, TestBed } from '@angular/core/testing'
import { default as olympicJson } from './../../../assets/mock/olympic.json'
import { OlympicCountryLineChartComponent } from './olympic-country-line-chart.component'

describe('OlympicCountryLineChartComponent', () => {
  let component: OlympicCountryLineChartComponent
  let fixture: ComponentFixture<OlympicCountryLineChartComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OlympicCountryLineChartComponent],
    })
      .compileComponents()

    fixture = TestBed.createComponent(OlympicCountryLineChartComponent)
    component = fixture.componentInstance
    component.participations = olympicJson[0]?.participations
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
