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
      {listing?.url && (
        <Button
          className={isMarker ? "" : "mt-3"}
          size={isMarker ? "sm" : undefined}
          id="leasing-page-url"
          href={listing.url}
          title={`Open new tab: ${listing.url}`}
          target="_blank"
          rel="noreferrer"
          variant="success"
        >
          View Leasing Page
        </Button>
      )}
    </>
  );
}
