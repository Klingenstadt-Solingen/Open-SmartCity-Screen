import React from 'react'
import { News } from '../../../../models/news'
import NewsPanel from '../panels/NewsPanel'

type setCenter = (panel: React.JSX.Element) => void
interface Props {
  news: News[]
  setCenter: setCenter
}

export default function NewsTile(props: Props): React.JSX.Element {
  let tmpTitle = ''
  return (
    <div className="w-full p-12">
      <div className="text-6xl text-left font-bold mb-8 tracking-wide text-solingen-blue">
        Neues aus Solingen.
      </div>
      <div id="news_container">
        {props.news.map((news) => {
          if (news.title.length > 100) {
            tmpTitle = news.title.substring(0, 90) + ' ...'
          } else {
            tmpTitle = news.title.substring(0, 100)
          }
          return (
            <div key={news.id} className="text-left font-bold mb-12">
              <div
                className="text-xl font-thin museo-sans border-l-2 border-solingen-yellow text-black"
                style={{ paddingLeft: '10px', marginLeft: '-5px' }}
              >
                {news.time}
              </div>
              <div className="mb-4 text-2xl text-solingen-blue">{tmpTitle}</div>
              <button
                className="text-base w-32 h-10 rounded-lg bg-solingen-yellow text-solingen-blue"
                onClick={() => props.setCenter(<NewsPanel news={news}></NewsPanel>)}
              >
                mehr lesen
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
