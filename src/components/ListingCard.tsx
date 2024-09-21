import { Button } from "react-bootstrap";
import IListing from "../interfaces/IListing";

interface ListingCardProps {
  areListingsOn: boolean;
  listing: IListing | undefined;
  isMarker: boolean;
}

export default function ListingCard(props: ListingCardProps) {
  const { areListingsOn, listing, isMarker } = props;

  const generateSummaryString = (): string => {
    let summaryString = "";

    if (!areListingsOn || !listing) {
      summaryString = "Contact building for current availability.";
    } else if (listing) {
      if (listing.hasAnyAvailability && isMarker) {
        summaryString = "Apartments available!";
      }

      if (listing.hasAnyAvailability && !isMarker) {
        summaryString = "MFTE apartments are available!";
      }

      if (!listing.hasAnyAvailability) {
        summaryString = "No MFTE apartments available at this time.";
      }
    }

    return summaryString;
  };

  return (
    <>
      <div>{generateSummaryString()}</div>
      {listing?.url && (
        <Button
          className="diy-solid-info-button mt-2"
          size="sm"
          id="leasing-page-url"
          href={listing.url}
          title={`Open new tab: ${listing.url}`}
          target="_blank"
          rel="noreferrer"
          variant="primary"
        >
          Leasing Page
        </Button>
      )}
    </>
  );
}
