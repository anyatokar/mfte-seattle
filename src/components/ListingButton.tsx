import { Button } from "react-bootstrap";
import IListing from "../interfaces/IListing";

interface ListingButtonProps {
  listing: IListing | undefined;
  isMarker: boolean;
}

export default function ListingButton(props: ListingButtonProps) {
  const { listing, isMarker } = props;

  return (
    <>
      {listing?.isApproved && listing?.url && (
        <Button
          className={isMarker ? "" : "mt-3"}
          size={isMarker ? "sm" : undefined}
          id="listing-page-url"
          href={listing.url}
          title={`Open new tab: ${listing.url}`}
          target="_blank"
          rel="noreferrer"
          variant="success"
        >
          View Listing Page
        </Button>
      )}
    </>
  );
}
