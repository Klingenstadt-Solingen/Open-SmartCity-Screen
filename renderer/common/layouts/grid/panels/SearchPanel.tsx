/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-duplicate-string */
import React, { useCallback, useEffect, useState } from 'react'
import Parse from 'parse'
import Select from 'react-select'
import LoupeIcon from '../../../icons/LoupeIcon'
import Markdown from 'react-markdown'

interface Props {
  preSelectedIndex?: string
  setAccessabilityCode?: (number) => void
  keyboardChange?: string
  toggleKeyboard?: (s: boolean, v: string) => void
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
SearchPanel.displayName = 'SearchPanel'
export default function SearchPanel(props: Props): React.JSX.Element {
  const [indices, setIndices] = useState<Array<{ label: string; value: Array<string> }>>()
  const [selectedIndex, setSelectedIndex] = useState<{ label: string; value: Array<string> }>()
  const [query, setQuery] = useState<string>()
  const [results, setResults] = useState<{
    data: Array<{
      index: string
      // attributes: Record<
      //   string,
      //   | string
      //   | {
      //       __component: string
      //       text?: string
      //       content?: string
      //       title?: string
      //       publicName?: string
      //       phoneNumber?: string
      //       strapi_import?: { organisation?: { title?: string } }
      //     }
      // >
      attributes: Record<string, any>
    }>
  }>()
  const [openedElements, setOpenedElements] = useState<Array<number>>([])

  useEffect(() => {
    setQuery(props.keyboardChange)
  }, [props.keyboardChange])

  useEffect(() => {
    setIndices([
      {
        label: 'Solingen',
        value: ['solingen-person', 'solingen-dienstleistung', 'solingen-inhaltsseite']
      },
      {
        label: 'Inhaltsseite',
        value: ['solingen-inhaltsseite']
      },
      {
        label: 'Person',
        value: ['solingen-person']
      },
      {
        label: 'Dienstleistung',
        value: ['solingen-dienstleistung']
      }
    ])
    if (props.preSelectedIndex) {
      setSelectedIndex(
        [
          {
            label: 'Solingen',
            value: ['solingen-person', 'solingen-dienstleistung', 'solingen-inhaltsseite']
          },
          {
            label: 'Inhaltsseite',
            value: ['solingen-inhaltsseite']
          },
          {
            label: 'Person',
            value: ['solingen-person']
          },
          {
            label: 'Dienstleistung',
            value: ['solingen-dienstleistung']
          }
        ].find((i) => i.label.includes(props.preSelectedIndex))
      )
    }
  }, [])

  // useEffect(() => {
  //   const fetchIndices = async () => {
  //     const res = await Parse.Cloud.run('hcms-elastic-indices')
  //     setIndices(res)
  //     if (props.preSelectedIndex) {
  //       setSelectedIndex(res.find((i) => i.label.includes(props.preSelectedIndex)))
  //     }
  //   }
  //   fetchIndices()
  // }, [])

  const search = useCallback(async () => {
    const res = await Parse.Cloud.run('hcms-elastic', {
      query: props.keyboardChange,
      indices: selectedIndex.value
    })

    setResults(res)
  }, [selectedIndex, query, props.keyboardChange])

  return (
    <div className="h-full overflow-hidden">
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
                onFocus={() => {
                  props.toggleKeyboard(true, query)
                }}
                onBlur={() => {
                  props.toggleKeyboard(false, query)
                }}
                type="search"
                id="query"
                className="flex items-center h-full w-full p-3 ps-12 text-3xl text-primary-color border border-gray-300 rounded-xl bg-gray-50"
                placeholder="Suchbegriff eingeben"
                value={query}
                readOnly
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
          results.data
            .filter(
              (r) =>
                r.index === 'solingen-inhaltsseite' ||
                r.index === 'solingen-person' ||
                r.index === 'solingen-dienstleistung'
            )
            .map((item, index) => {
              if (item.index == 'solingen-inhaltsseite') {
                return (
                  <div key={index} className="border-b-2 border-secondary-color p-4">
                    <div className="flex justify-between ">
                      <span
                        onClick={() => {
                          if (
                            Object.values(item.attributes)?.find((a) => {
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
                          Object.values(item.attributes)?.find((a) => {
                            return a?.__component === 'website-maintenance.headline'
                          })?.text
                        }
                      </span>
                      {Object.values(item.attributes)?.find((a) => {
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
              } else if (item.index === 'solingen-person') {
                return (
                  <div key={index} className="border-b-2 border-secondary-color p-4">
                    <div className="flex justify-between ">
                      <span
                        onClick={() => {
                          if (item.attributes.phoneNumber) {
                            if (openedElements.includes(index)) {
                              setOpenedElements(openedElements.filter((e) => e !== index))
                            } else {
                              setOpenedElements([...openedElements, index])
                            }
                          }
                        }}
                        className="text-primary-color font-bold text-4xl text-left"
                      >
                        {item.attributes.publicName as string}
                      </span>
                      {item.attributes.phoneNumber && (
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
                        <b>{item.attributes.strapi_import.organisation.title}</b> <br />
                        {item.attributes.phoneNumber && (
                          <>
                            Tel.: {item.attributes.phoneNumber as string} <br />
                          </>
                        )}
                        {item.attributes.strapi_import.publicEmail && (
                          <>Email.: {item.attributes.strapi_import.publicEmail as string}</>
                        )}
                      </div>
                    )}
                  </div>
                )
              } else if (item.index === 'solingen-dienstleistung') {
                return (
                  <div key={index} className="border-b-2 border-secondary-color p-4">
                    <div className="flex justify-between ">
                      <span
                        onClick={() => {
                          if (item.attributes.strapi_import.productInformation) {
                            if (openedElements.includes(index)) {
                              setOpenedElements(openedElements.filter((e) => e !== index))
                            } else {
                              setOpenedElements([...openedElements, index])
                            }
                          }
                        }}
                        className="text-primary-color font-bold text-4xl text-left"
                      >
                        {item.attributes.title}
                      </span>
                      {item.attributes.strapi_import.productInformation && (
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
                        <Markdown>{item.attributes.strapi_import.productInformation}</Markdown>
                      </div>
                    )}
                  </div>
                )
              }
            })}
      </div>
    </div>
  )
}
