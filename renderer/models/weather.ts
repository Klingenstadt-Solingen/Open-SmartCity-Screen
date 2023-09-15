import { GeoPoint } from 'parse'
import { Base } from './base'

export interface Weather extends Base {
  objectId?: string
  values:
    | {
        windrichtung: Measurement
        eisprozent_avg: Measurement
        lufttemperatur: Measurement
        globalstrahlung: Measurement
        windrichtung_avg: Measurement
        lufttemperatur_avg: Measurement
        globalstrahlung_avg: Measurement
        realtiver_luftdruck: Measurement
        versorgungsspannung: Measurement
        relative_luftfeuchte: Measurement
        realtiver_luftdruck_avg: Measurement
        versorgungsspannung_avg: Measurement
        windgeschwindigkeit_kmh: Measurement
        niederschlagsintensitaet: Measurement
        relative_luftfeuchte_avg: Measurement
        windgeschwindigkeit_kmh_avg: Measurement
        niederschlagsintensitaet_avg: Measurement
        wasserfilmhoehe_auf_oberflaeche_avg: Measurement
        fahrbahn_oberflaechen_temperatur_avg: Measurement
      }
    | Record<string, never>
  geopoint: GeoPoint
  shortName: string
  dateObserved: { iso: string }
}

interface Measurement {
  name: string
  unit: string
  value: number
}
