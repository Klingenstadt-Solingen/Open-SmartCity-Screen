import React, { useCallback, useEffect, useState } from 'react'
import Parse from 'parse'
import Select from 'react-select'
import LoupeIcon from '../../../icons/LoupeIcon'
import Markdown from 'react-markdown'

interface Props {
  preSelectedIndex?: string
}

const styles = {
  menuList: (base) => ({
    ...base,

    '::-webkit-scrollbar': {
      width: '4px',
      height: '0px'
    },
    '::-webkit-scrollbar-track': {
      background: '#f1f1f1'
    },
    '::-webkit-scrollbar-thumb': {
      background: '#888'
    },
    '::-webkit-scrollbar-thumb:hover': {
      background: '#555'
    }
  })
}

export default function SearchPanel(props: Props): React.JSX.Element {
  const [indices, setIndices] = useState<Array<{ label: string; value: Array<string> }>>()
  const [selectedIndex, setSelectedIndex] = useState<{ label: string; value: Array<string> }>()
  const [query, setQuery] = useState<string>()
  const [results, setResults] = useState<{
    data: Array<{
      index: string
      attributes: Record<string, { __component: string; text?: string; content?: string }>
    }>
  }>()
  const [openedElements, setOpenedElements] = useState<Array<number>>([])

  useEffect(() => {
    const fetchIndices = async () => {
      const res = await Parse.Cloud.run('hcms-elastic-indices')
      return res.map((r) => {
        return { label: r.label, value: r.value.split(',') }
      })
    }

    fetchIndices().then((r) => {
      setIndices(r)
      if (props.preSelectedIndex) {
        setSelectedIndex(r.find((i) => i.label.includes(props.preSelectedIndex)))
      }
    })
  }, [])

  const search = useCallback(async () => {
    const res = await Parse.Cloud.run('hcms-elastic', {
      query: query,
      indices: selectedIndex.value
    })
    console.log(res)
    setResults(res)
  }, [selectedIndex, query])

  return (
    <div className="h-full">
      <div className="w-full bg-secondary-color font-bold text-5xl p-6 text-primary-color flex flex-col gap-5">
        <div className="flex flex-col pb-4 text-6xl">
          <span>Suchen und Finden</span>
        </div>
        <div className="flex justify-between gap-5 items-end">
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="query" className="text-left text-3xl">
              Was suchen Sie?
            </label>
            <label htmlFor="query" className="mb-2 text-sm font-medium text-primary-color sr-only ">
              Suchen
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <LoupeIcon width="100%" height="60%"></LoupeIcon>
              </div>
              <input
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                id="query"
                className="flex items-center h-full w-full p-3 ps-12 text-3xl text-primary-color border border-gray-300 rounded-xl bg-gray-50"
                placeholder="Suchbegriff eingeben"
                required
              />
              <button
                onClick={() => search()}
                type="submit"
                className="text-white absolute end-2.5 bottom-2.5 bg-primary-color rounded-lg text-sm px-4 py-2"
              >
                Suchen
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-2/3 !text-primary-color">
            <label htmlFor="query" className="text-right text-3xl">
              Wo wollen Sie suchen?
            </label>
            <Select
              styles={styles}
              classNames={{
                control: () => '!rounded-xl !w-full !p-1 !text-4xl',
                menu: () => '!text-4xl !h-[200%] !min-h-[500px]',
                menuList: () => '!text-4xl !h-[200%] !min-h-[500px]',
                option: () => '!text-2xl'
              }}
              placeholder="Suchen in..."
              value={selectedIndex}
              options={indices}
              onChange={(o) => {
                setSelectedIndex(o)
              }}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col justify-start text-left p-10 pb-14 gap-5 overflow-y-scroll scrollbar-hide h-full">
        {!results && (
          <div className="text-4xl text-primary-color">
            Bitte geben Sie einen Suchbegriff ein und wählen Sie eine Kategorie aus.
          </div>
        )}
        {results && results.data.length === 0 && (
          <div className="text-4xl text-primary-color">Es wurden keine Ergebnisse gefunden.</div>
        )}
        {results &&
          results.data.map((item, index) => {
            if (item.index !== 'solingen-person')
              return (
                <div key={index} className="border-b-2 border-secondary-color p-4">
                  <div className="flex justify-between ">
                    <span
                      onClick={() => {
                        if (
                          Object.values(item.attributes).find((a) => {
                            return a?.__component === 'basic.text-field'
                          })
                        ) {
                          if (openedElements.includes(index)) {
                            setOpenedElements(openedElements.filter((e) => e !== index))
                          } else {
                            setOpenedElements([...openedElements, index])
                          }
                        }
                      }}
                      className="text-primary-color font-bold text-4xl text-left"
                    >
                      {
                        Object.values(item.attributes).find((a) => {
                          return a?.__component === 'website-maintenance.headline'
                        })?.text
                      }
                    </span>
                    {Object.values(item.attributes).find((a) => {
                      return a?.__component === 'basic.text-field'
                    }) && (
                      <a
                        className={`text-secondary-color font-bold text-4xl transition-all duration-200 ease-linear ${openedElements.includes(index) ? 'rotate-90' : ''}`}
                        onClick={() => {
                          if (openedElements.includes(index)) {
                            setOpenedElements(openedElements.filter((e) => e !== index))
                          } else {
                            setOpenedElements([...openedElements, index])
                          }
                        }}
                      >
                        {'>'}
                      </a>
                    )}
                  </div>
                  {openedElements.includes(index) && (
                    <div className="bg-gray-200 rounded-2xl p-4 mt-2">
                      <Markdown>
                        {
                          Object.values(item.attributes).find((a) => {
                            return a?.__component === 'basic.text-field'
                          })?.content
                        }
                      </Markdown>
                    </div>
                  )}
                </div>
              )
          })}
      </div>
    </div>
  )
}
