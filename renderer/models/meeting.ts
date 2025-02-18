import { PoliticFile } from './politic-file'

export interface Meeting {
  id: string
  endDateTime: string
  meetingState: string
  name: string
  startDateTime: string
  webUrl: string
  invitationFile?: PoliticFile
  resultsProtocolFile?: PoliticFile
  verbatimProtocolFile?: PoliticFile
}
