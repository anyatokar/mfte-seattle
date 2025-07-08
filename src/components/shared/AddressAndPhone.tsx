import { Address, Contact } from "../../interfaces/IBuilding";
import { PartialAddress, PartialContact } from "../../interfaces/IListing";

interface AddressAndPhoneProps {
  buildingName: string;
  address: Address | PartialAddress;
  contact: Contact | PartialContact;
  withLinks: boolean;
}

const AddressAndPhone: React.FC<AddressAndPhoneProps> = ({
  buildingName,
  address,
  contact,
  withLinks,
}) => {
  const { streetAddress, city, state, zip } = address;
  const { phone, phone2 } = contact;

  const mapViewUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${streetAddress}, ${city}, ${state} ${zip}`)}`;
  const phone1Ref = `tel:${phone}`;
  const phone2Ref = `tel:${phone2}`;

  return (
    <div>
      {streetAddress}
      <br />
      {city}, {state} {zip}
      <br />
      <a
        id="addressLink"
        href={mapViewUrl}
        target="_blank"
        rel="noreferrer"
        className="address-phone-link"
      >
        View on Google Maps
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
