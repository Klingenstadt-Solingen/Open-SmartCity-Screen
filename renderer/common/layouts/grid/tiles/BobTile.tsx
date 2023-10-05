import React from 'react'
import ReactPlayer from 'react-player'

export default function BobTile(): React.JSX.Element {
  return (
    <div className="w-full h-full bg-solingen-yellow">
      <ReactPlayer
        url="/videos/bob.mp4"
        loop={true}
        playing={true}
        controls={false}
        muted={true}
        width="100%"
        height="100%"
      />
    </div>
  )
}
