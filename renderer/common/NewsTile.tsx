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
    <>
      <div id="textInNewsTile_1" className="text-5xl text-left font-bold p-4">
        Neues aus
        <br />
        Solingen.
      </div>
      <div id="news_container">
        {props.details.map((news) => {
          if (news.title.length > 80) {
            tmpTitle = news.title.substring(0, 80) + ' ...'
          } else {
            tmpTitle = news.title.substring(0, 80)
          }
          return (
            <div key={news.id} className="text-left p-4 font-bold">
              <div className="textInNewsTile_2 text-sm">{news.time}</div>
              <div className="textInNewsTile_3 text-basic mb-4">{tmpTitle}</div>
              <button
                className="btnInNewsTile text-sm w-32 h-9 rounded-lg"
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
    </>
  )
}
