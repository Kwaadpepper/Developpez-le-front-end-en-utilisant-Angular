import { SlAlert } from 'src/dependencies'

type PartialOptions = Partial<Pick<SlAlert, 'duration'>>
export type SlAlertOptions = Pick<SlAlert, 'variant' | 'closable' | 'innerHTML'> & PartialOptions
