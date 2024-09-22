import { ErrorHandler as NgErrorHanlder } from '@angular/core'

export class ErrorHandler implements NgErrorHanlder {
  handleError(error: any) {
    // TODO: show toast error
    console.error('Sorry an error occured', error?.message)
    console.debug(error)
  }
}
