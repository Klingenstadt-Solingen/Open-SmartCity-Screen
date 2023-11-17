import React from 'react'
import { PressRelease } from '../../../../models/press-release'
import dayjs from 'dayjs'

interface Props {
  pressRelease: PressRelease
}

export default function PressReleasePanel(props: Props): React.JSX.Element {
  return (
    <>
      <div className="text-primary-color text-5xl font-bold text-left py-4 mt-12 px-14 flex w-full justify-between items-center">
        <span className="line-clamp-3 h-full">{props.pressRelease.title}</span>
        <div className="flex justify-self-end mx-10">
          <div className="flex flex-col justify-center">
            <span className="text-3xl font-black">
              {dayjs(new Date(props.pressRelease.date.iso)).format('DD')}
            </span>
            <span className="text-3xl font-black">
              {dayjs(new Date(props.pressRelease.date.iso)).format('MMM')}.
            </span>
          </div>
          <div>
            <span className="text-6xl text-secondary-color font-black">
              {'’'}
              {dayjs(new Date(props.pressRelease.date.iso)).format('YY')}
            </span>
          </div>
        </div>
      </div>
      <div className="w-full h-full p-12">
        <img className="float-right m-5 w-1/3" src={props.pressRelease.imageUrl} />
        <div
          className="text-2xl text-left h-full overflow-wrap scrollbar-hide pressRelease"
          dangerouslySetInnerHTML={{
            __html: props.pressRelease.content
          }}
        ></div>
      </div>
    </>
  )
}
