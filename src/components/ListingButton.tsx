import { Button } from "react-bootstrap";
import IListing from "../interfaces/IListing";
import { listingStatusEnum } from "../types/enumTypes";

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
