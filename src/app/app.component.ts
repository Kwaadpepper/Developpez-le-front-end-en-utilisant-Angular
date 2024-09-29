import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { OlympicService } from './core/services/olympicCountries.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private olympic$Sub: Subscription | null = null

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympic$Sub = this.olympicService.loadInitialData().subscribe()
  }

  ngOnDestroy(): void {
    this.olympic$Sub?.unsubscribe()
  }
}
