import React, { useState } from 'react'
import ContentBox from './ContentBox'
import ContentCenter from './ContentCenter'
import { WeatherContext } from '../utils/Context'

const contentInWeather = 'Bitte Hier Klicken für Wetter in Aachen' // in Context Provider Value to WeatherComponent
let contentPassToCenter = ''

export default function ContentPanel() {
  const contents = [
    {
      num: 1,
      text: 'TEXT_1.',
      test_news: []
    },
    {
      num: 2,
      text: 'Über Local Nachricht',
      test_news: [
        {
          id: 1,
          time: '18. Juli. 2023',
          title:
            'Zweiter Anmeldetag für weiterführende Schulen Individuelle Termin-Absprache für den 9. März an der gewünschten Schule erforderlich',
          contentOfNews:
            '<html><head></head><body><p><strong>Individuelle Termin-Absprache für den 9. März an der gewünschten Schule erforderlich</strong></p><p>Rund 1300 Solinger Kinder wechseln im Sommer an eine weiterführende Schule. Mitte Februar hat die erste Anmelde-Runde stattgefunden. Da nicht bei allen Kindern die erste Wahl erfüllt werden konnte, gibt es nun einen Nachmeldetermin an den Schulen, die noch über freie Plätze verfügen. Am MITTWOCH, 9. März, haben die Eltern die Möglichkeit, ihr Kind an einer der folgenden Schulen für die fünfte Klasse anzumelden:</p><ul><li>Sekundarschule Central</li><li>Gesamtschule Höhscheid</li><li>Geschwister-Scholl-Gesamtschule</li><li>Albert-Schweitzer-Realschule</li><li>Realschule Vogelsang</li></ul><p>Die Eltern werden gebeten, sich über die jeweilige Homepage über das Angebot der gewünschten Schule zu informieren und einen individuellen Anmeldetermin für den 9. März zu vereinbaren, damit spätestens am Folgetag alle Viertklässler:innen wissen, wo es für sie ab dem Sommer weitergeht.</p></body></html>'
        },
        {
          id: 2,
          time: '01. Juli. 2023',
          title: 'Wupperbrücke wieder frei',
          contentOfNews:
            '<html><head></head><body><p><strong>Erste Verbindung in Richtung Leichlingen</strong></p><p>Vom Hochwasser der Wupper sind auch mehrere Brücken betroffen. Sie werden jetzt, sobald sie wegen der Überflutung wieder erreichbar sind, auf mögliche Beschädigungen überprüft. Auch wichtige Verkehrsverbindungen sind deshalb bisher unterbrochen, unter anderem die neue Wupperbrücke an der Leichlinger Straße. Sie wurde nicht beschädigt, muss aber zunächst gereinigt werden. Außerdem ist die Zufahrt noch überflutet. </p><p>Als erste Verbindung in Richtung Leichlingen wird ab 15 Uhr/ab sofort die Wupperbrücke Balkhauser Weg wieder freigegeben. In diesem Bereich ist das Wasser auf dem Rückzug. Das Bauwerk wurde bereits kontrolliert und gereinigt, umgestürzte Bäume auf der Zufahrt wurden entfernt.</p></body></html>'
        },
        {
          id: 3,
          time: '09. Dezember. 2022',
          title: 'Wegen Glatteis: Müllabfuhr verzögert',
          contentOfNews:
            '<html><head></head><body><p><strong>Fragen bis 5. Dezember einreichen</strong></p><p>Zu Beginn der nächsten Ratssitzung findet eine Fragestunde für Einwohnerinnen und Einwohner statt. Der Rat tagt am Donnerstag, 15. Dezember, ab 17 Uhr im Theater und Konzerthaus, Großer Konzertsaal.</p><p>Die Fragen müssen den Aufgabenbereich der Stadt Solingen betreffen und bis zum 5. Dezember schriftlich oder per E-Mail bei der Stadt Solingen eingereicht werden.</p><p>Die gestellten Fragen beantwortet der Oberbürgermeister in der Sitzung mündlich, eine Aussprache findet nicht statt. Die Fragestunde ist auf maximal eine Stunde begrenzt.</p></body></html>'
        }
      ]
    },
    {
      num: 3,
      text: 'TEXT_3.',
      test_news: []
    },
    {
      num: 4,
      text: 'TEXT_4.',
      test_news: []
    }
  ]

  const isOpenState = [
    { animation: 'openTopAnimation 0.5s 1 forwards' },
    { animation: 'openBottomAnimation 0.5s 1 forwards' }
  ]

  const boxOrder = [
    [{ order: '1' }, { order: '2' }, { order: '3' }, { order: '4' }],
    [{ order: '2' }, { order: '4' }, { order: '1' }, { order: '3' }],
    [{ order: '4' }, { order: '3' }, { order: '2' }, { order: '1' }],
    [{ order: '3' }, { order: '1' }, { order: '4' }, { order: '2' }]
  ]

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [orderStatus, setOrderStatus] = useState<number>(0)
  // const [isShowInCenter, setIsShowInCenter] = useState<boolean>(false)

  function showMessage(msg: string): void {
    // setIsShowInCenter((isShownInCenter) => !isShownInCenter)
    if (!isOpen) setIsOpen((isOpen) => !isOpen)
    contentPassToCenter = msg
  }

  function handleClick(): void {
    if (isOpen) setIsOpen((isOpen) => !isOpen)
  }

  function handleButtonClick(event: React.FormEvent): void {
    event.stopPropagation()
    if (orderStatus === 3) setOrderStatus(0)
    else setOrderStatus(orderStatus + 1)
  }

  return (
    <WeatherContext.Provider value={contentInWeather}>
      <div id="content_panel" onClick={handleClick}>
        {contents.map((content, index) => (
          <ContentBox
            key={content.num}
            openStatus={isOpen}
            orderCss={boxOrder[orderStatus][index]}
            openCss={Number(boxOrder[orderStatus][index].order) < 3 ? isOpenState[0] : isOpenState[1]}
            {...content}
            showSomething={showMessage}
          >
            {/* <Weather showSomething={showMessage} /> */}
          </ContentBox>
        ))}
        <ContentCenter openStatus={isOpen} contentInCenter={contentPassToCenter}></ContentCenter>
        <button id="rotation_btn" onClick={handleButtonClick} style={isOpen ? { display: 'none' } : {}}></button>
      </div>
    </WeatherContext.Provider>
  )
}
