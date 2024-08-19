import React from 'react'
import { PressRelease } from '../../../../models/press-release'
import dayjs from 'dayjs'

interface Props {
  pressRelease: PressRelease
}

export default function PressReleasePanel(props: Props): React.JSX.Element {
  return (
    <div className="p-12 flex flex-col justify-between gap-y-12">
      <div className="text-primary-color text-5xl font-bold text-left flex w-full justify-between items-center">
        <span className="line-clamp-3">{props.pressRelease.title}</span>
        <div className="flex justify-self-end">
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
      <div className="w-full overflow-y-scroll overflow-x-wrap h-full scrollbar-hide">
        <img className="float-right w-1/2 m-8" src={props.pressRelease.imageUrl} />
        <div
          className="text-2xl text-left scrollbar-hide h-[55rem] [&>p]:mb-5"
          dangerouslySetInnerHTML={{
            __html: props.pressRelease.content
          }}
        />
      </div>
    </div>
  )
}
