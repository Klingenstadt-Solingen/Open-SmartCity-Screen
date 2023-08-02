import React from 'react'
import NewsTile from './NewsTile'
import MapTile from './MapTile'
import POITile from './POITile'
import WeatherTile from './WeatherTile'
import { TileType } from '../../../../models/tile'
import { News } from '../../../../models/news'
interface Props {
  isOpen: boolean
  position: number
  setCenter: (panel: React.JSX.Element) => void
  type: TileType
}

export default function BaseTile(props: Props): React.JSX.Element {
  const test_news: News[] = [
    {
      id: 1,
      time: '18. Juli. 2023',
      title:
        'Zweiter Anmeldetag für weiterführende Schulen Individuelle Termin-Absprache für den 9. März an der gewünschten Schule erforderlich',
      content:
        '<html><head></head><body><p><strong>Individuelle Termin-Absprache für den 9. März an der gewünschten Schule erforderlich</strong></p><p>Rund 1300 Solinger Kinder wechseln im Sommer an eine weiterführende Schule. Mitte Februar hat die erste Anmelde-Runde stattgefunden. Da nicht bei allen Kindern die erste Wahl erfüllt werden konnte, gibt es nun einen Nachmeldetermin an den Schulen, die noch über freie Plätze verfügen. Am MITTWOCH, 9. März, haben die Eltern die Möglichkeit, ihr Kind an einer der folgenden Schulen für die fünfte Klasse anzumelden:</p><ul><li>Sekundarschule Central</li><li>Gesamtschule Höhscheid</li><li>Geschwister-Scholl-Gesamtschule</li><li>Albert-Schweitzer-Realschule</li><li>Realschule Vogelsang</li></ul><p>Die Eltern werden gebeten, sich über die jeweilige Homepage über das Angebot der gewünschten Schule zu informieren und einen individuellen Anmeldetermin für den 9. März zu vereinbaren, damit spätestens am Folgetag alle Viertklässler:innen wissen, wo es für sie ab dem Sommer weitergeht.</p></body></html>'
    },
    {
      id: 2,
      time: '01. Juli. 2023',
      title: 'Wupperbrücke wieder frei',
      content:
        '<html><head></head><body><p><strong>Erste Verbindung in Richtung Leichlingen</strong></p><p>Vom Hochwasser der Wupper sind auch mehrere Brücken betroffen. Sie werden jetzt, sobald sie wegen der Überflutung wieder erreichbar sind, auf mögliche Beschädigungen überprüft. Auch wichtige Verkehrsverbindungen sind deshalb bisher unterbrochen, unter anderem die neue Wupperbrücke an der Leichlinger Straße. Sie wurde nicht beschädigt, muss aber zunächst gereinigt werden. Außerdem ist die Zufahrt noch überflutet. </p><p>Als erste Verbindung in Richtung Leichlingen wird ab 15 Uhr/ab sofort die Wupperbrücke Balkhauser Weg wieder freigegeben. In diesem Bereich ist das Wasser auf dem Rückzug. Das Bauwerk wurde bereits kontrolliert und gereinigt, umgestürzte Bäume auf der Zufahrt wurden entfernt.</p></body></html>'
    },
    {
      id: 3,
      time: '09. Dezember. 2022',
      title: 'Wegen Glatteis: Müllabfuhr verzögert',
      content:
        '<html><head></head><body><p><strong>Fragen bis 5. Dezember einreichen</strong></p><p>Zu Beginn der nächsten Ratssitzung findet eine Fragestunde für Einwohnerinnen und Einwohner statt. Der Rat tagt am Donnerstag, 15. Dezember, ab 17 Uhr im Theater und Konzerthaus, Großer Konzertsaal.</p><p>Die Fragen müssen den Aufgabenbereich der Stadt Solingen betreffen und bis zum 5. Dezember schriftlich oder per E-Mail bei der Stadt Solingen eingereicht werden.</p><p>Die gestellten Fragen beantwortet der Oberbürgermeister in der Sitzung mündlich, eine Aussprache findet nicht statt. Die Fragestunde ist auf maximal eine Stunde begrenzt.</p></body></html>'
    }
  ]

  let cssAnimation: React.CSSProperties
  let tile: React.JSX.Element
  const closeTopAnimation = { animation: 'closeAnimation 0.5s ease 0s 1 forwards' }
  const closeBottomAnimation = { animation: 'closeAnimation 0.5s ease 0s 1 forwards' }
  const openTopAnimation = { animation: 'openTopAnimation 0.5s ease 0s 1 forwards' }
  const openBottomAnimation = { animation: 'openBottomAnimation 0.5s ease 0s 1 forwards' }

  if (props.isOpen) {
    if (props.position < 3) {
      cssAnimation = { ...openTopAnimation }
    } else {
      cssAnimation = { ...openBottomAnimation }
    }
  } else {
    if (props.position < 3) {
      cssAnimation = { ...{ marginTop: '-28vh' }, ...closeTopAnimation }
    } else {
      cssAnimation = { ...{ marginTop: '56vh' }, ...closeBottomAnimation }
    }
  }

  switch (props.type) {
    case TileType.MAP:
      tile = <MapTile setCenter={props.setCenter} />
      break
    case TileType.NEWS:
      tile = <NewsTile news={test_news} setCenter={props.setCenter} />
      break
    case TileType.POI:
      tile = <POITile setCenter={props.setCenter} />
      break
    case TileType.WEATHER:
      tile = <WeatherTile setCenter={props.setCenter} />
      break
  }

  return (
    <div id={props.type} className="tile z-10" style={{ order: props.position, ...cssAnimation }}>
      {tile}
    </div>
  )
}
