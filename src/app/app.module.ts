import { provideHttpClient } from '@angular/common/http'
import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, ErrorHandler as NgErrorHandler, NgModule, provideExperimentalZonelessChangeDetection } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { TitleStrategy } from '@angular/router'
import { NgApexchartsModule } from 'ng-apexcharts'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { OlympicBarChartComponent } from './components/olympic-bar-chart/olympic-bar-chart.component'
import { OlympicCountryLineChartComponent } from './components/olympic-country-line-chart/olympic-country-line-chart.component'
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
    OlympicBarChartComponent,
    OlympicCountryLineChartComponent,
    NgApexchartsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    provideHttpClient(),
    // * This is needed for ApexChart to refresh
    // SEE: https://github.com/apexcharts/ng-apexcharts/pull/358/commits/31979a48396130c760efd688cac948564197b698
    provideExperimentalZonelessChangeDetection(),
    {
      provide: LOCALE_ID, useValue: 'EN-en',
    },
    { provide: NgErrorHandler, useClass: ErrorHandler },
    { provide: TitleStrategy, useClass: DynamicTitleStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
