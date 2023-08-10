export interface Tile {
  type: TileType
}

interface TileType {
  name: 'MAP' | 'POI' | 'PRESSRELEASES' | 'WEATHER' | 'DIASHOW'
}
