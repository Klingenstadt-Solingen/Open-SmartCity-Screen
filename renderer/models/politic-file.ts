export interface PoliticFile {
  id: string
  name: string
  fileName: string
  text: string
  date: Date
  size: number
  sha512Checksum: string
  mimeType: string
  accessUrl: string
  downloadUrl: string
}
