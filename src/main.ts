/// <reference types="@angular/localize" />

import { registerLocaleData } from '@angular/common'
import * as en from '@angular/common/locales/en'
import { enableProdMode } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import '@shoelace-style/shoelace/dist/shoelace.js'
import { AppModule } from './app/app.module'
import { environment } from './environments/environment'

if (environment.production) {
  // For shoelace using lit, see: https://github.com/lit/lit/discussions/3671#discussioncomment-4977000
  enableProdMode()
}

registerLocaleData(en.default)

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err))
