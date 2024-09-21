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
  phone: string | null;
  phone2: string | null;
}

const BuildingName: React.FC<buildingNameProps> = ({
  buildingName,
  urlForBuilding,
}) => {
  return (
    <div>
      <a
        id="buildingLink"
        href={urlForBuilding}
        title={`Open new tab: ${urlForBuilding}`}
        target="_blank"
        rel="noreferrer"
      >
        {buildingName}
      </a>
    </div>
  );
};

const AddressAndPhone: React.FC<addressAndPhoneProps> = ({
  buildingName,
  streetNum,
  street,
  city,
  state,
  zip,
  phone,
  phone2,
}) => {
  const mapViewUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${streetNum} ${street}, ${city}, ${state} ${zip}`)}`;
  const phone1Ref = `tel:${phone}`;
  const phone2Ref = `tel:${phone2}`;

  return (
    <div className="address-phone-block">
      <a
        id="addressLink"
        href={mapViewUrl}
        title={`Open new tab: ${buildingName} on Google Maps`}
        target="_blank"
        rel="noreferrer"
      >
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
};

export { BuildingName, AddressAndPhone };
