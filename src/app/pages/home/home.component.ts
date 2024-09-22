import { Component, effect, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { Router } from '@angular/router'
import OlympicCountry from 'src/app/core/models/OlympicCountry'
import { OlympicService } from 'src/app/core/services/olympicCountries.service'

export enum HomeDisplayableGraphType {
  PIE,
  BAR,
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  HomeDisplayableGraphType = HomeDisplayableGraphType

  public olympicCountries: OlympicCountry[]
  public graphTypeToDisplay: HomeDisplayableGraphType

  constructor(
    private titleService: Title,
    private router: Router,
    private olympicService: OlympicService,
  ) {
    this.olympicCountries = []
    this.graphTypeToDisplay = HomeDisplayableGraphType.PIE

    this.titleService.setTitle($localize`Medals per Country`)
    // * Listen for signal changes
    effect(() => {
      this.olympicCountries = this.olympicService.getOlympicCountries()
    })
  }

  ngOnInit(): void {
    this.reloadResults()
  }

  displayStatsForAnOlympicCountry(olympicCountry: OlympicCountry) {
    this.router.navigateByUrl(`details/${olympicCountry.id}`)
  }

  reloadResults() {
    this.olympicService.loadCountryList()
  }

  setGraphTypeToDisplay(type: typeof this.graphTypeToDisplay) {
    this.graphTypeToDisplay = type
  }
}
