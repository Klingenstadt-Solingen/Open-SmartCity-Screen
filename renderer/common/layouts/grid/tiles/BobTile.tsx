import React from 'react'
import ReactPlayer from 'react-player'

interface Props {
  config?: any
}

export default function BobTile(props: Props): React.JSX.Element {
  return (
    <div className="w-full h-full bg-secondary-color">
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
