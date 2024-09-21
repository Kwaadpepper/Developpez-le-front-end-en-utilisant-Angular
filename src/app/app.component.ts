import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { OlympicService } from './core/services/olympicCountries.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private olympicService: OlympicService) { }

  private olympicServiceSub: Subscription|null = null;

  ngOnInit(): void {
    this.olympicServiceSub = this.olympicService.loadCountryList();
  }

  ngOnDestroy(): void {
    this.olympicServiceSub?.unsubscribe();
  }
}
