import { Base } from './base'
import { Tile } from './tile'

export interface Grid extends Base {
  tiles: Tile[]
}
