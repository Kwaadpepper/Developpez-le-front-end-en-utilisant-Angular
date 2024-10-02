import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AsyncPipe } from '@angular/common'
import { provideHttpClient } from '@angular/common/http'
import { AppComponent } from 'src/app/app.component'
import { HomeComponent } from './home.component'

describe('HomeComponent', () => {
  let component: HomeComponent
  let fixture: ComponentFixture<HomeComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent, HomeComponent],
      imports: [AsyncPipe],
      providers: [provideHttpClient()],
    })
      .compileComponents()

    fixture = TestBed.createComponent(HomeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
