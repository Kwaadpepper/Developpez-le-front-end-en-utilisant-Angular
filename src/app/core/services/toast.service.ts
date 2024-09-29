import { Injectable } from '@angular/core'
import type { SlAlert } from 'src/dependencies'
import { SlAlertOptions } from '../types/sl-alert-props.type'

@Injectable({
  providedIn: 'root',
})

/** Displays toast using shoelace alert */
export class ToastService {
  notify(
    message: string,
    variant: SlAlertOptions['variant'] = 'primary',
    duration: number | undefined = undefined,
  ): void {
    this.launchAlert({
      variant,
      closable: true,
      duration: duration,
      innerHTML: this.escapeHtml(message),
    })
  }

  error(
    message: string,
    closable = false,
  ): void {
    this.launchAlert({
      variant: 'danger',
      closable,
      innerHTML: this.escapeHtml(message),
    })
  }

  private launchAlert(props: SlAlertOptions): void {
    const alert: SlAlert = Object.assign(document.createElement('sl-alert'), props)

    document.body.append(alert)
    alert.toast()
  }

  private escapeHtml(html: string): string {
    const div = document.createElement('div')
    div.textContent = html
    const output = div.innerHTML
    div.remove()
    return output
  }
}
