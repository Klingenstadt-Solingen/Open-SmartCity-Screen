export interface Tile {
  type: TileType
}

export enum TileType {
  MAP = 'MAP',
  POI = 'POI',
  PRESSRELEASES = 'PRESSRELEASES',
  WEATHER = 'WEATHER'
}
