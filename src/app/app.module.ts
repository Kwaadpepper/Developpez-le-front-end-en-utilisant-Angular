import { provideHttpClient } from '@angular/common/http'
import { LOCALE_ID, ErrorHandler as NgErrorHandler, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { TitleStrategy } from '@angular/router'
import { NgApexchartsModule } from 'ng-apexcharts'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { OlympicCountryLineChartComponent } from './components/olympic-country-line-chart/olympic-country-line-chart.component'
import { OlympicPieChartComponent } from './components/olympic-pie-chart/olympic-pie-chart.component'
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
    OlympicCountryLineChartComponent,
    NgApexchartsModule,
  ],
  providers: [
    provideHttpClient(),
    {
      provide: LOCALE_ID, useValue: 'EN-en',
    },
    { provide: NgErrorHandler, useClass: ErrorHandler },
    { provide: TitleStrategy, useClass: DynamicTitleStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
