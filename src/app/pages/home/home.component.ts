import { Component, OnDestroy, OnInit } from '@angular/core';
import { cloneDeep } from 'lodash';
import { Observable, of, Subscription } from 'rxjs';
import OlympicCountry from 'src/app/core/models/OlympicCountry';
import { OlympicService, OlympicServiceData } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private olympics$: Observable<OlympicServiceData> = of([]);
  private olympicsSub: Subscription|null = null;

  public olympicCountries: Array<OlympicCountry> = [];

  public pieChartOptions: {
    scheme: string;
    legend: boolean;
    labels: boolean;
  } = {
      legend: false,
      labels: true,
      scheme: 'cool'
  };

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.olympicsSub = this.olympics$.subscribe((olympicCountryArray) => {
      this.olympicCountries = cloneDeep(olympicCountryArray);
    })
  }

  ngOnDestroy(): void {
    this.olympicsSub?.unsubscribe();
  }
}
