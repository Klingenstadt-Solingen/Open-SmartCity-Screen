import { Relation } from 'parse'
import { Base } from './base'
import { DiashowObject } from './diashowObject'

export interface Diashow extends Base {
  diashowObjects: Relation<Parse.Object<DiashowObject>>
}
