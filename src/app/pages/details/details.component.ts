import { Component, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute } from '@angular/router'
import OlympicCountry from 'src/app/core/models/OlympicCountry'
import Participation from 'src/app/core/models/Participation'

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit {
  public olympicCountry: OlympicCountry
  public participations: Participation[] = []

  constructor(private titleService: Title, private route: ActivatedRoute) {
    this.olympicCountry = this.route.snapshot.data['olympicCountryId']
    this.titleService.setTitle($localize`${this.olympicCountry.country} details`)
  }

  ngOnInit(): void {
    console.debug(this.olympicCountry)
    this.participations = this.olympicCountry.participations
    console.debug(this.olympicCountry)
  }
}
