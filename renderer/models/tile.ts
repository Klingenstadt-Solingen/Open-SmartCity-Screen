export interface Tile {
  type: TileType
}

export interface TileType {
  name: 'MAP' | 'POI' | 'PRESSRELEASES' | 'WEATHER' | 'DIASHOW'
}
