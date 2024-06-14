import { Button } from "react-bootstrap";
import IListing from "../interfaces/IListing";

interface ListingCardProps {
  isAdvertisingOn: boolean;
  listing: IListing | undefined;
}

export function ListingCard(props: ListingCardProps) {
  const { isAdvertisingOn, listing } = props;

  const generateSummaryString = (): string => {
    let summaryString = "";

    if (!isAdvertisingOn || (isAdvertisingOn && !listing)) {
      summaryString = "Contact building for current availability.";
    }

    if (isAdvertisingOn && listing && listing.hasAnyAvailability) {
      summaryString = "MFTE apartments are available!";
    }

    if (isAdvertisingOn && listing && !listing.hasAnyAvailability) {
      summaryString = "No MFTE apartments available at this time.";
    }

    return summaryString;
  };

  return (
    <>
      <div>{generateSummaryString()}</div>
      {isAdvertisingOn && listing ? (
        <Button className="diy-solid-info-button mt-2" size="sm">
          View Leasing Page
        </Button>
      ) : null}
    </>
  );
}
