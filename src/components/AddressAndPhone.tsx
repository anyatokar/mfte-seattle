import { Address, Contact } from "../interfaces/IBuilding";

interface addressAndPhoneProps {
  buildingName: string;
  address: Address;
  contact: Contact;
  withLinks: boolean;
}

const AddressAndPhone: React.FC<addressAndPhoneProps> = ({
  buildingName,
  address,
  contact,
  withLinks,
}) => {
  const { streetNum, street, city, state, zip } = address;
  const { phone, phone2 } = contact;

  const mapViewUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${streetNum} ${street}, ${city}, ${state} ${zip}`)}`;
  const phone1Ref = `tel:${phone}`;
  const phone2Ref = `tel:${phone2}`;

  return (
    <div>
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
      {withLinks ? (
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
      ) : (
        <>
          {phone && <div className="first-phone-num">{phone}</div>}
          {phone2 && <>{phone2}</>}
        </>
      )}
    </div>
  );
};

export { AddressAndPhone };
