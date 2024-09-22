import { Directive, EventEmitter, Input, Output } from '@angular/core'
import OlympicCountry from '../models/OlympicCountry'

@Directive()
export default abstract class CanDisplayOlympicCountries {
  @Input({ required: true }) olympicCountries: OlympicCountry[] = []

  @Output() selected = new EventEmitter<OlympicCountry>()
}
