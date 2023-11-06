interface buildingNameProps {
  urlForBuilding: string;
  buildingName: string;
}

interface addressAndPhoneProps {
  buildingName: string;
  streetNum: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  phone2: string;
}

export function BuildingName(props: buildingNameProps) {
  const { buildingName, urlForBuilding } = props;

  return (
    <div>
      <a id="buildingLink" href={urlForBuilding} title={`Open new tab: ${urlForBuilding}`} target="_blank" rel="noreferrer">
        {buildingName}
      </a>
    </div>
  );
}

export function AddressAndPhone(props: addressAndPhoneProps) {
  const { buildingName, streetNum, street, city, state, zip, phone, phone2 } = props;

  const mapViewUrl = `https://www.google.com/maps/search/?api=1&query=${streetNum}+${street}+${city}+${state}+${zip}`;
  const phone1Ref = `tel:${phone}`;
  const phone2Ref = `tel:${phone2}`;

  return (
    <div className="address-phone-block">
      <a id="addressLink" href={mapViewUrl} title={`Open new tab: ${buildingName} on Google Maps`} target="_blank" rel="noreferrer">
        {streetNum} {street}
        <br />
        {city}, {state} {zip}
      </a>
      <>
        {phone && (
          <div className="first-phone-num">
            <a href={phone1Ref} title={`Call ${buildingName}`}>
              {phone}
            </a>
          </div>
        )}
        {phone2 && (
          <>
            <a href={phone2Ref} title={`Call ${buildingName}`}>
              {phone2}
            </a>
          </>
        )}
      </>
    </div>
  );
}
