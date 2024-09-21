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
      {streetNum} {street}
      <br />
      {city}, {state} {zip}
      <a
        id="addressLink"
        href={mapViewUrl}
        target="_blank"
        rel="noreferrer"
        className="address-phone-link"
      >
        <div> View on Google Maps</div>
      </a>
      <>
        {phone && (
          <div className="first-phone-num">
            <a
              className="address-phone-link"
              href={phone1Ref}
              title={`Call ${buildingName}`}
            >
              {phone}
            </a>
          </div>
        )}
        {phone2 && (
          <>
            <a
              className="address-phone-link"
              href={phone2Ref}
              title={`Call ${buildingName}`}
            >
              {phone2}
            </a>
          </>
        )}
      </>
    </div>
  );
};

export { AddressAndPhone };
