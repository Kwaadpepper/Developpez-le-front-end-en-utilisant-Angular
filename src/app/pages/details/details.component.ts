import { Component, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute } from '@angular/router'
import { cloneDeep } from 'lodash-es'
import OlympicCountry from 'src/app/core/models/olympic-country.interface'
import Participation from 'src/app/core/models/participation.interface'

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit {
  public olympicCountry: OlympicCountry
  public participations: Participation[]

  constructor(private titleService: Title, private route: ActivatedRoute) {
    this.olympicCountry = cloneDeep(this.route.snapshot.data['olympicCountry'])
    this.participations = []
    this.titleService.setTitle($localize`${this.olympicCountry.country} details`)
  }

  ngOnInit(): void {
    this.reloadResults()
  }

  /** Total of all medals ever won for this country */
  getTotalMedals(): number {
    return this.participations
      .map(participation => participation.medalsCount)
      .reduce((prev, curr) => prev + curr)
  }

  /** Total of presented athletes of all participations for this country */
  getTotalAthtletes(): number {
    return this.participations
      .map(participation => participation.athleteCount)
      .reduce((prev, curr) => prev + curr)
  }

  reloadResults(): void {
    this.participations = []
    this.participations = this.olympicCountry.participations
  }
}
