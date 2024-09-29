import SlAlert from '@shoelace-style/shoelace/dist/components/alert/alert.component'

type PartialOptions = Partial<Pick<SlAlert, 'duration'>>
export type SlAlertOptions = Pick<SlAlert, 'variant' | 'closable' | 'innerHTML'> & PartialOptions
