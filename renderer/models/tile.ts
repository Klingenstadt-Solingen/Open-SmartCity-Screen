import { Base } from './base'

export interface Tile extends Base {
  position: 1 | 2 | 3 | 4
  tile: { tileType: TileType }
}

export interface TileType {
  name: string
}
