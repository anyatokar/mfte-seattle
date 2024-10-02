import { Profiler, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { isProfilerOn } from "../config/config";
import IPage from "../interfaces/IPage";

import { useSavedBuildings } from "../hooks/useSavedBuildings";
import { useAllListings } from "../hooks/useAllListings";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import { getRepsListingIDs } from "../utils/firestoreUtils";
import IListing from "../interfaces/IListing";
import ListingCard from "../components/ListingCard";
import Spinner from "react-bootstrap/esm/Spinner";

const ManageListingsPage: React.FunctionComponent<
  IPage & RouteComponentProps<any>
> = ({ name }) => {
  const { currentUser } = useAuth();
  const [allListings, isLoadingAllListings] = useAllListings();

  const [repsListings, setRepsListings] = useState<IListing[]>([]);
  const [isLoadingRepsListings, setIsLoadingRepsListings] = useState(true);

  useEffect(() => {
    const fetchRepsListings = async () => {
      if (!currentUser) return;

      console.log("Filtering listings.");

      setIsLoadingRepsListings(true);
      // For now, rep's entry has an array of listing IDs.
      const listingIDs = await getRepsListingIDs(currentUser.uid);

      if (listingIDs) {
        const foundListings = allListings.filter((listing) =>
          listingIDs.includes(listing.listingID)
        );
        setRepsListings(foundListings);
      }

      setIsLoadingRepsListings(false);
    };

    fetchRepsListings();
  }, [allListings]);

  if (!currentUser) {
    return null;
  }

  let isLoading = isLoadingAllListings || isLoadingRepsListings;

  return (
    <Profiler
      id={name}
      onRender={(
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime
      ) => {
        if (isProfilerOn) {
          console.log({
            id,
            phase,
            actualDuration,
            baseDuration,
            startTime,
            commitTime,
          });
        }
      }}
    >
      <Container className="all-pages diy-jumbotron">
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            <div className="display-5">Manage Listings</div>
            <hr className="my-4 break-line-light" />
            <Row>
              {/* top margin size 3 for all screens (xs and up) | top margin size of 0 for large screens and up */}
              <Col className="mt-2 mt-lg-0"></Col>
            </Row>
            {isLoading && (
              <Spinner animation="border" variant="secondary" size="sm" />
            )}
            {!isLoading && repsListings.length === 0 && (
              <>
                <p>Empty for now!</p>
              </>
            )}
            {!isLoading &&
              repsListings.length > 0 &&
              repsListings.map((listing) => (
                <ListingCard
                  key={listing.listingID}
                  availData={listing.availData}
                  buildingName={listing.buildingName}
                  isApproved={listing.isApproved}
                  url={listing.url}
                />
              ))}
          </Col>
        </Row>
      </Container>
    </Profiler>
  );
};

export default withRouter(ManageListingsPage);
