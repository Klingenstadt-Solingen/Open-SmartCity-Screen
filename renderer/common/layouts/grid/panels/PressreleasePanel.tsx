import React from 'react'
import { PressRelease } from '../../../../models/press-release'
import dayjs from 'dayjs'

interface Props {
  pressRelease: PressRelease
}

export default function PressReleasePanel(props: Props): React.JSX.Element {
  return (
    <>
      <div className="text-primary-color text-5xl font-bold text-left py-4 mt-12 px-14 h-[5vh] flex w-full justify-between items-center">
        <span>{props.pressRelease.title}</span>
        <div className="flex justify-self-end">
          <div className="flex flex-col">
            <span className="text-[24px] font-black days">
              {dayjs(new Date(props.pressRelease.date.iso)).format('DD')}
            </span>
            <span className="text-[24px] font-black month">
              {dayjs(new Date(props.pressRelease.date.iso)).format('MMM')}.
            </span>
          </div>
          <div>
            <span className="text-[54px] text-secondary-color font-black">
              {'’'}
              {dayjs(new Date(props.pressRelease.date.iso)).format('YY')}
            </span>
          </div>
        </div>
      </div>
      <div
        className="text-2xl text-left mt-8 px-14 h-[55vh] overflow-y-scroll pressRelease"
        dangerouslySetInnerHTML={{ __html: props.pressRelease.content }}
      ></div>
    </>
  )
}
