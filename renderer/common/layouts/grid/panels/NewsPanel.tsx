import React from 'react'
import { News } from '../../../../models/news'

interface Props {
  news: News
}

export default function NewsPanel(props: Props): React.JSX.Element {
  return (
    <>
      <div
        id="newsTimeInCenter"
        className="text-solingen-yellow text-md font-bold text-left py-4 px-10 bg-solingen-blue"
      >
        {props.news.time}
      </div>
      <div
        id="newsTitleInCenter"
        className="text-white text-2xl font-bold text-left py-4 px-10 bg-solingen-blue"
      >
        {props.news.title}
      </div>
      <div
        id="newsTextInCenter"
        className="bg-white text-base text-left py-4 px-10"
        dangerouslySetInnerHTML={{ __html: props.news.content }}
      ></div>
    </>
  )
}
