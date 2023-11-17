import React from 'react'
import QRCode from 'react-qr-code'
import Route from '../../../icons/Route'

export default function BubbleInfo(props: any): React.JSX.Element {
  return (
    <>
      <MainInfo information={props.information}></MainInfo>
      {props.information?.poi?.details?.find((el) => el.title === 'Sie Sind Hier') ===
        undefined && (
        <button
          onMouseDown={() => {
            props.tripTo(props?.information?.coordinates[0], props?.information?.coordinates[1])
          }}
          className="w-full pl-[2rem] left-[-2rem] h-[12rem] rounded-3xl text-on-primary-color text-xl relative bg-primary-color shadow-xl shadow-gray-500 flex justify-center items-center"
        >
          <div className="h-full w-full flex py-2 px-2">
            <Route></Route>
          </div>
        </button>
      )}
    </>
  )
}

function MainInfo(props: any): React.JSX.Element {
  function getAttribute(attribute: string) {
    return props.information?.poi?.details?.find((el) => el.title === attribute)
  }

  return (
    props.information?.poi?.details && (
      <div
        className="overflow-hidden text-left gap-4 p-4 grid grid-flow-row gap-x-5 box-border rounded-3xl bg-secondary-color text-on-secondary-color shadow-xl shadow-gray-500 z-50"
        style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0,1fr)' }}
      >
        {getAttribute('Sie Sind Hier') && (
          <InfoLine content={getAttribute('Sie Sind Hier')} name="Sie Sind Hier"></InfoLine>
        )}
        {getAttribute('Name') && <InfoLine content={getAttribute('Name')} name="Name"></InfoLine>}
        {getAttribute('Bezeichnung') && (
          <InfoLine content={getAttribute('Bezeichnung')} name="Bezeichnung"></InfoLine>
        )}

        {/* ------------------------- */}
        {getAttribute('Baustelle') && (
          <InfoLine content={getAttribute('Baustelle')} name="Baustelle"></InfoLine>
        )}
        {getAttribute('Baustatus') && (
          <InfoLine content={getAttribute('Baustatus')} name="Baustatus"></InfoLine>
        )}
        {getAttribute('Baubeginn') && (
          <InfoLine content={getAttribute('Baubeginn')} name="Baubeginn"></InfoLine>
        )}
        {getAttribute('Bauende') && (
          <InfoLine content={getAttribute('Bauende')} name="Bauende"></InfoLine>
        )}
        {/* ------------------------- */}
        {getAttribute('Onlinestatus') && (
          <InfoLine content={getAttribute('Onlinestatus')} name="Onlinestatus"></InfoLine>
        )}

        {/* ------------------------- */}
        {getAttribute('Angebot') && (
          <InfoLine content={getAttribute('Angebot')} name="Angebot"></InfoLine>
        )}
        {/* ------------------------- */}
        {getAttribute('Parkplatztyp') && (
          <InfoLine content={getAttribute('Parkplatztyp')} name="Parkplatztyp"></InfoLine>
        )}
        {getAttribute('Leistung') && (
          <InfoLine content={getAttribute('Leistung')} name="Leistung"></InfoLine>
        )}
        {getAttribute('Standard') && (
          <InfoLine content={getAttribute('Standard')} name="Standard"></InfoLine>
        )}
        {getAttribute('Zugänglich') && (
          <InfoLine content={getAttribute('Zugänglich')} name="Zugänglich"></InfoLine>
        )}
        {getAttribute('Betreiber') && (
          <InfoLine content={getAttribute('Betreiber')} name="Betreiber"></InfoLine>
        )}
        {getAttribute('Freie Plätze') && (
          <InfoLine content={getAttribute('Freie Plätze')} name="Freie Plätze"></InfoLine>
        )}

        {/* ------------------------- */}
        {getAttribute('Branche') && (
          <InfoLine content={getAttribute('Branche')} name="Branche"></InfoLine>
        )}
        {getAttribute('Versand') && (
          <InfoLine content={getAttribute('Versand')} name="Versand"></InfoLine>
        )}
        {getAttribute('Lieferung') && (
          <InfoLine content={getAttribute('Lieferung')} name="Lieferung"></InfoLine>
        )}
        {getAttribute('Abholung') && (
          <InfoLine content={getAttribute('Abholung')} name="Abholung"></InfoLine>
        )}
        {getAttribute('Hinweise') && (
          <InfoLine content={getAttribute('Hinweise')} name="Hinweise"></InfoLine>
        )}
        {getAttribute('Nachhaltigkeit') && (
          <InfoLine content={getAttribute('Nachhaltigkeit')} name="Nachhaltigkeit"></InfoLine>
        )}
        {getAttribute('Zertifikate') && (
          <InfoLine content={getAttribute('Zertifikate')} name="Zertifikate"></InfoLine>
        )}
        {/* ------------------------- */}

        {getAttribute('Unterkunftsart') && (
          <InfoLine content={getAttribute('Unterkunftsart')} name="Unterkunftsart"></InfoLine>
        )}

        {/* ------------------------- */}

        {getAttribute('Telefon') && (
          <InfoLine content={getAttribute('Telefon')} name="Telefon"></InfoLine>
        )}
        {getAttribute('Email') && (
          <InfoLine content={getAttribute('Email')} name="Email"></InfoLine>
        )}
        {getAttribute('Website') && (
          <InfoLine content={getAttribute('Website')} name="Website"></InfoLine>
        )}
        {getAttribute('Homepage') && (
          <InfoLine content={getAttribute('Homepage')} name="Homepage"></InfoLine>
        )}
      </div>
    )
  )
}

function InfoLine(props: any): React.JSX.Element {
  if (props.content.iconName === 'telefonicon') {
    props.content.iconName = 'mobileicon'
  }

  return (
    <div
      className="grid justify-center items-start"
      style={{
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 4fr)',
        overflow: 'hidden',
        overflowWrap: 'normal'
      }}
    >
      {props.content.iconName && (
        <img
          src={props.content.iconPath + '/' + props.content.iconName + props.content.iconMimetype}
        />
      )}
      {!props.content.iconName && <div></div>}
      <div className="text-xl font-bold">
        <div className="text-xl mt-1">
          {props.name}
          {props.name !== 'Sie Sind Hier' ? ':' : ''}
        </div>
        <div
          className="font-normal text-lg line-clamp-2 max-w-full"
          onMouseDown={(event) => event.currentTarget.classList.remove('line-clamp-2')}
        >
          {props.content.value}

          <div className="w-full flex justify-center items-end">
            {props.name === 'Email' && <QR link={`mailto:${props.content.value}`} />}

            {props.name === 'Telefon' && <QR link={`tel:${props.content.value}`} />}

            {(props.name === 'Website' || props.name === 'Homepage') && (
              <QR link={`${props.content.value}`} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function QR(props: any): React.JSX.Element {
  return (
    <div
      className="w-1/5 transition-all duration-app-speed flex"
      onMouseDown={(event) => {
        if (event.currentTarget.classList.contains('w-full')) {
          event.currentTarget.classList.remove('w-full')
          event.currentTarget.classList.add('w-1/5')
        } else {
          event.currentTarget.classList.remove('w-1/5')

          event.currentTarget.classList.add('w-full')
        }
      }}
    >
      <QRCode className="w-full h-min" value={props.link}></QRCode>
    </div>
  )
}
