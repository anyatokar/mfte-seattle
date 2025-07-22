import { Address, Contact } from "../../interfaces/IBuilding";
import { PartialAddress, PartialContact } from "../../interfaces/IListing";
import { TableParentEnum } from "../../types/enumTypes";

interface AddressAndPhoneProps {
  buildingName: string;
  address: Address | PartialAddress;
  contact: Contact | PartialContact;
  parentElement: TableParentEnum;
}

const AddressAndPhone: React.FC<AddressAndPhoneProps> = ({
  buildingName,
  address,
  contact,
  parentElement,
}) => {
  const { streetAddress, city, state, zip } = address;
  const { phone, phone2 } = contact;

  const mapViewUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${streetAddress}, ${city}, ${state} ${zip}`)}`;
  const phone1Ref = `tel:${phone}`;
  const phone2Ref = `tel:${phone2}`;

  return (
    <div className="mt-2">
      {parentElement !== TableParentEnum.MARKER && (
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
        </div>
      )}

      {parentElement === TableParentEnum.MARKER && (
        <div>
          <a
            id="addressLink"
            href={mapViewUrl}
            target="_blank"
            rel="noreferrer"
            className="address-phone-link"
          >
            {streetAddress}
          </a>
        </div>
      )}

      {parentElement !== TableParentEnum.LISTING_CARD ? (
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
