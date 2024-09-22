import { Button } from "react-bootstrap";
import IListing from "../interfaces/IListing";

interface ListingCardProps {
  listing: IListing | undefined;
  isMarker: boolean;
}

export default function ListingCard(props: ListingCardProps) {
  const { listing, isMarker } = props;

  return (
    <>
      {listing?.url && (
        <Button
          className={isMarker ? "" : "mt-3"}
          size={isMarker ? "sm" : undefined}
          id="leasing-page-url"
          href={listing.url}
          title={`Open new tab: ${listing.url}`}
          target="_blank"
          rel="noreferrer"
          variant="outline-success"
        >
          View Leasing Page
        </Button>
      )}
    </>
  );
}
