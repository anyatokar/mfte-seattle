import { Button } from "react-bootstrap";
import IListing from "../interfaces/IListing";

interface ListingCardProps {
  areListingsOn: boolean;
  listing: IListing | undefined;
  isMarker: boolean;
  urlForBuilding: string;
}

export default function ListingCard(props: ListingCardProps) {
  const { areListingsOn, listing, isMarker, urlForBuilding } = props;

  const generateSummaryString = (): string => {
    let summaryString = "";

    if (!areListingsOn || !listing) {
      summaryString =
        "Current availability unknown. Contact the building directly.";
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
          className="diy-solid-info-button mt-1"
          size="sm"
          id="leasing-page-url"
          href={listing.url}
          title={`Open new tab: ${listing.url}`}
          target="_blank"
          rel="noreferrer"
        >
          Leasing Page
        </Button>
      )}
    </>
  );
}
