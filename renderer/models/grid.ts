import { Relation } from 'parse'
import { Base } from './base'
import { Tile } from './tile'

export interface Grid extends Base {
  tiles: Relation<Parse.Object<Tile>>
}
