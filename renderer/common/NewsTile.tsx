import React from 'react'

interface news {
  id: number
  time: string
  title: string
  contentOfNews: string
}

type showSomething = (msg: string) => void

interface Props {
  details: news[]
  showSomething: showSomething
}

export default function NewsTile(props: Props): React.JSX.Element {
  let tmpTitle = ''
  return (
    <div className="p-12">
      <div id="textInNewsTile_1" className="text-6xl text-left font-bold mb-8 tracking-wide">
        Neues aus Solingen.
      </div>
      <div id="news_container">
        {props.details.map((news) => {
          if (news.title.length > 80) {
            tmpTitle = news.title.substring(0, 80) + ' ...'
          } else {
            tmpTitle = news.title.substring(0, 80)
          }
          return (
            <div key={news.id} className="text-left font-bold mb-12">
              <div
                className="textInNewsTile_2 text-lg font-thin museo-sans"
                style={{ paddingLeft: '10px', marginLeft: '-5px', borderLeft: '2px solid #ffbf00' }}
              >
                {news.time}
              </div>
              <div className="textInNewsTile_3 mb-4 text-xl">{tmpTitle}</div>
              <button
                className="btnInNewsTile text-base w-32 h-10 rounded-lg"
                onClick={() =>
                  props.showSomething(news.time + '&&&&&$$$$$' + news.title + '&&&&&$$$$$' + news.contentOfNews)
                }
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
