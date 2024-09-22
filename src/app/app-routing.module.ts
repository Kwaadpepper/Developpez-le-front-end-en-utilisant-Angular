import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { olympicCountryResolver } from './core/resolver/olympicCountry.resolver'
import { DetailsComponent } from './pages/details/details.component'
import { HomeComponent } from './pages/home/home.component'
import { NotFoundComponent } from './pages/not-found/not-found.component'

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'details/:olympicCountryId',
    component: DetailsComponent,
    resolve: {
      olympicCountryId: olympicCountryResolver,
    },
  },
  {
    path: 'missing-page', // wildcard
    component: NotFoundComponent,
  },
  {
    path: '**', // wildcard
    component: NotFoundComponent,
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    bindToComponentInputs: true,
    enableViewTransitions: true,
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
