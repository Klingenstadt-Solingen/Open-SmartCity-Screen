export interface Tile {
  type: TileType
}

export enum TileType {
  MAP = 'MAP',
  POI = 'POI',
  NEWS = 'NEWS',
  WEATHER = 'WEATHER'
}
