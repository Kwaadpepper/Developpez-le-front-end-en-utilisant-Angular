import { Injectable } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { RouterStateSnapshot, TitleStrategy } from '@angular/router'

@Injectable({ providedIn: 'root' })
export class DynamicTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title) {
    super()
  }

  override updateTitle(routerState: RouterStateSnapshot): void {
    const title = this.buildTitle(routerState) ?? this.title.getTitle()
    const appName = $localize`Olympic Games App`

    this.title.setTitle($localize`${title} - ${appName}`)
  }
}
