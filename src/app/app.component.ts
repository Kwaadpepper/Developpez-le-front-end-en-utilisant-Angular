import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { take } from 'rxjs'
import { OlympicService } from './core/services/olympic-countries.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public title = 'olympic-games-starter'

  constructor(
    private olympicService: OlympicService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.router.setUpLocationChangeListener()
    this.olympicService
      .loadInitialData()
      .pipe(take(1))
      .subscribe()
  }
}
