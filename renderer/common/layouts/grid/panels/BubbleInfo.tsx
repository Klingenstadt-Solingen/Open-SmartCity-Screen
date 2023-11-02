import React from 'react'

interface Props {
  information: {
    address: string
    city: string
    district: string
    name: string
    zip: string
    homePage: string
    tel: string
    symbolName: string
  }
}

export default function BubbleInfo(props: Props): React.JSX.Element {
  let iconName: string
  switch (props.information?.symbolName) {
    case 'XE_Unterkunft':
      iconName = 'hotel.svg'
      break
    case 'XE_Autoverkehr_ECarLadestation':
      iconName = 'gasstation.svg'
      break
    case 'XE_Behoerde':
      iconName = 'cityhall.svg'
      break
    case 'XE_TechnischesBauwerk_Freifunk':
      iconName = 'wifi2.svg'
      break
    case 'XE_Autoverkehr_Baustelle':
      iconName = 'construction.svg'
      break
    case 'XE_Tourismus_Touristische_Infrastruktur':
      iconName = 'maproute.svg'
      break
  }

  return (
    <div className="w-screen max-w-lg flex-auto overflow-hidden rounded-3xl bg-secondary-color text-2xl leading-6 shadow-lg ring-1 ring-gray-900/5">
      <div className="p-6">
        <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
          <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
            {iconName && <img src={'/images/svg/' + iconName} width={25} />}
          </div>
          <div className="w-full text-left">
            <a href="#" className="font-semibold text-gray-900 text-3xl">
              {props.information?.name}
              <span className="absolute inset-0"></span>
            </a>
            <p className="mt-1 text-gray-600"></p>
          </div>
        </div>
        <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
          <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg"></div>
          <div className="w-full text-left">
            <a href="#" className="font-semibold text-gray-900">
              Adresse:
              <span className="absolute inset-0"></span>
            </a>
            <p className="mt-1 text-gray-600">{props.information?.address}</p>
          </div>
        </div>
        <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
          <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg"></div>
          <div className="w-full text-left">
            <a href="#" className="font-semibold text-gray-900">
              Stadtteil:
              <span className="absolute inset-0"></span>
            </a>
            <p className="mt-1 text-gray-600">{props.information?.district}</p>
          </div>
        </div>
        <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
          <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg"></div>
          <div className="w-full text-left">
            <a href="#" className="font-semibold text-gray-900">
              Postleitzahl:
              <span className="absolute inset-0"></span>
            </a>
            <p className="mt-1 text-gray-600">{props.information?.zip}</p>
          </div>
        </div>
        <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
          <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg"></div>
          <div className="w-full text-left">
            <a href="#" className="font-semibold text-gray-900">
              Stadt:
              <span className="absolute inset-0"></span>
            </a>
            <p className="mt-1 text-gray-600">{props.information?.city}</p>
          </div>
        </div>
      </div>
      {(props.information?.homePage || props.information?.tel) && (
        <div className="grid grid-cols-1 divide-x divide-gray-900/5 bg-primary-color break-all p-6 leading-8">
          {props.information?.homePage && (
            <>
              <a href="#" className="flex text-left gap-x-2.5 font-semibold text-on-primary">
                <img src="/images/svg/internet.svg" width={25} className="ml-5 mr-3" />
                {props.information?.homePage}
              </a>
              <br />
            </>
          )}
          {props.information?.tel && (
            <a className="flex text-left gap-x-2.5 font-semibold text-on-primary">
              <img src="/images/svg/telephone.svg" width={25} className="ml-5 mr-3 -mt-1" />
              {props.information?.tel}
            </a>
          )}
        </div>
      )}
    </div>
  )
}
