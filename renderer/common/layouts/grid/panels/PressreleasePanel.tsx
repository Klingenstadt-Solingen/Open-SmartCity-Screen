import React from 'react'
import { PressRelease } from '../../../../models/press-release'

interface Props {
  pressRelease: PressRelease
}

export default function PressReleasePanel(props: Props): React.JSX.Element {
  return (
    <>
      <div className="text-solingen-yellow text-xl font-bold text-left py-4 px-10 bg-solingen-blue h-[5vh]">
        {new Intl.DateTimeFormat('de-DE').format(props.pressRelease.date)}
      </div>
      <div className="text-white text-2xl font-bold text-left py-4 px-10 bg-solingen-blue h-[5vh]">
        {props.pressRelease.title}
      </div>
      <div
        className="bg-white text-xl text-left py-4 px-10 h-[46vh]"
        dangerouslySetInnerHTML={{ __html: props.pressRelease.content }}
      ></div>
    </>
  )
}
