import React from 'react'
import { PressRelease } from '../../../../models/press-release'

interface Props {
  pressRelease: PressRelease
}

export default function PressReleasePanel(props: Props): React.JSX.Element {
  return (
    <>
      <div
        id="newsTimeInCenter"
        className="text-solingen-yellow text-xl font-bold text-left py-4 px-10 bg-solingen-blue"
      >
        {new Intl.DateTimeFormat('de-DE').format(props.pressRelease.date)}
      </div>
      <div
        id="newsTitleInCenter"
        className="text-white text-3xl font-bold text-left py-4 px-10 bg-solingen-blue"
      >
        {props.pressRelease.title}
      </div>
      <div
        id="newsTextInCenter"
        className="bg-white text-xl text-left py-4 px-10"
        dangerouslySetInnerHTML={{ __html: props.pressRelease.content }}
      ></div>
    </>
  )
}
