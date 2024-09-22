import { Component, effect, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import OlympicCountry from 'src/app/core/models/OlympicCountry'
import { OlympicService } from 'src/app/core/services/olympicCountries.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympicCountries: OlympicCountry[] = []

  constructor(private router: Router, private olympicService: OlympicService) {
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
}
