import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ActivatedRoute } from '@angular/router'
import { AppComponent } from 'src/app/app.component'
import { DetailsComponent } from './details.component'

describe('DetailsComponent', () => {
  let component: DetailsComponent
  let fixture: ComponentFixture<DetailsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent, DetailsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                olympicCountry: {
                  id: 2,
                  country: 'Spain',
                  participations: [
                    {
                      id: 1,
                      year: 2012,
                      city: 'Londres',
                      medalsCount: 20,
                      athleteCount: 315,
                    },
                  ],
                },
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
