import { Button } from "react-bootstrap";
import IListing from "../interfaces/IListing";
import { listingStatusEnum } from "../types/enumTypes";

// TODO: If listing URL is the same as the website, don't show it?

interface ListingButtonProps {
  listing: IListing | undefined;
  isMarker: boolean;
}

export default function ListingButton(props: ListingButtonProps) {
  const { listing, isMarker } = props;

  return (
    <>
      {listing?.listingStatus === listingStatusEnum.ACTIVE && listing?.url && (
        <Button
          size="sm"
          id="listing-page-url"
          href={listing.url}
          title={`Open new tab: ${listing.url}`}
          target="_blank"
          rel="noreferrer"
          variant="success"
        >
          {isMarker ? "View Listings" : "Listings"}
        </Button>
      )}
    </>
  );
}
