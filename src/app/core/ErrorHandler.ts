import { ErrorHandler as NgErrorHanlder } from '@angular/core'

export class ErrorHandler implements NgErrorHanlder {
  // Forced type any from core/angular
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleError(error: any) {
    if (error instanceof Error) {
      // TODO: show toast error
      console.error('Sorry an error occured', error?.message)
    }
    console.debug(error)
  }
}
