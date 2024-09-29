import { Injectable, ErrorHandler as NgErrorHanlder } from '@angular/core'
import { ToastService } from './services/toast.service'

@Injectable()
export class ErrorHandler implements NgErrorHanlder {
  constructor(private toastService: ToastService) {}

  // NOTE: Forced type any from core/angular
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleError(error: any): void {
    if (error instanceof Error) {
      // ! Unmanaged error occured
      const message = $localize`Sorry an error occured`
      console.error(message, error?.message)
      this.toastService.error(message)
    }
    console.debug(error)
  }
}
