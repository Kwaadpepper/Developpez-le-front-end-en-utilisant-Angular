import { ComponentFixture, TestBed } from '@angular/core/testing'

import { OlympicPieChartComponent } from './olympic-pie-chart.component'

describe('PieChartComponent', () => {
  let component: OlympicPieChartComponent
  let fixture: ComponentFixture<OlympicPieChartComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OlympicPieChartComponent],
    })
      .compileComponents()

    fixture = TestBed.createComponent(OlympicPieChartComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
