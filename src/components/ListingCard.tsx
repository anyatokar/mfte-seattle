import { Button } from "react-bootstrap";
import IListing from "../interfaces/IListing";

interface ListingCardProps {
  areListingsOn: boolean;
  listing: IListing | undefined;
}

export function ListingCard(props: ListingCardProps) {
  const { areListingsOn, listing } = props;

  const generateSummaryString = (): string => {
    let summaryString = "";

    if (!areListingsOn || (areListingsOn && !listing)) {
      summaryString = "Contact building for current availability.";
    }

    if (areListingsOn && listing && listing.hasAnyAvailability) {
      summaryString = "MFTE apartments are available!";
    }

    if (areListingsOn && listing && !listing.hasAnyAvailability) {
      summaryString = "No MFTE apartments available at this time.";
    }

    return summaryString;
  };

  return (
    <>
      <div>{generateSummaryString()}</div>
      {areListingsOn && listing ? (
        <Button className="diy-solid-info-button mt-2" size="sm">
          View Leasing Page
        </Button>
      ) : null}
    </>
  );
}
