import { ComponentFixture, TestBed } from '@angular/core/testing'

import { OlympicBarChartComponent } from './olympic-bar-chart.component'

describe('PieChartComponent', () => {
  let component: OlympicBarChartComponent
  let fixture: ComponentFixture<OlympicBarChartComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OlympicBarChartComponent],
    })
      .compileComponents()

    fixture = TestBed.createComponent(OlympicBarChartComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
