import { provideHttpClient } from '@angular/common/http'
import { ErrorHandler as NgErrorHandler, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { TitleStrategy } from '@angular/router'
import { NgApexchartsModule } from 'ng-apexcharts'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { OlympicBarChartComponent } from './components/can-display-olympic-countries/olympic-bar-chart/olympic-bar-chart.component'
import { OlympicPieChartComponent } from './components/can-display-olympic-countries/olympic-pie-chart/olympic-pie-chart.component'
import { DynamicTitleStrategy } from './core/DynamicTitleStrategy'
import { ErrorHandler } from './core/ErrorHandler'
import { DetailsComponent } from './pages/details/details.component'
import { HomeComponent } from './pages/home/home.component'
import { NotFoundComponent } from './pages/not-found/not-found.component'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DetailsComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    OlympicPieChartComponent,
    OlympicBarChartComponent,
    NgApexchartsModule,
  ],
  providers: [
    provideHttpClient(),
    { provide: NgErrorHandler, useClass: ErrorHandler },
    { provide: TitleStrategy, useClass: DynamicTitleStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
