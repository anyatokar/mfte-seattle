import { Profiler, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { isProfilerOn } from "../config/config";
import IPage from "../interfaces/IPage";
import { listingStatusEnum } from "../types/enumTypes";

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

  function getCount(label: listingStatusEnum): number {
    return repsListings.filter((listing) => listing.listingStatus === label)
      .length;
  }

  const summaryTableRows = [
    { label: "Active", listingStatus: listingStatusEnum.ACTIVE },
    {
      label: "Pending Review",
      listingStatus: listingStatusEnum.PENDING_REVIEW,
    },
    {
      label: "Needs Attention",
      listingStatus: listingStatusEnum.NEEDS_ATTENTION,
    },
    { label: "Archived", listingStatus: listingStatusEnum.ARCHIVED },
    { label: "Expiring Soon", listingStatus: listingStatusEnum.EXPIRING_SOON },
    { label: "Expired", listingStatus: listingStatusEnum.EXPIRED },
  ];

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

            <p className="lead">Summary</p>

            <Row>
              <Col xs={12} sm={6} lg={4} className="pb-4">
                <Table responsive bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaryTableRows.map((tableRow) => (
                      <tr key={tableRow.listingStatus}>
                        <td>{tableRow.label}</td>
                        <td>{getCount(tableRow.listingStatus)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>

            {!isLoading && repsListings.length === 0 && <p>Empty for now!</p>}
            <Row>
              <Col>
                <p className="lead">Listings</p>
                {isLoading && (
                  <Spinner animation="border" variant="secondary" />
                )}
                {!isLoading &&
                  repsListings.length > 0 &&
                  repsListings.map((listing) => (
                    <Col className="pb-2">
                      <ListingCard
                        key={listing.listingID}
                        availData={listing.availData}
                        buildingName={listing.buildingName}
                        isApproved={listing.isApproved}
                        url={listing.url}
                        listingID={listing.listingID}
                      />
                    </Col>
                  ))}
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </Profiler>
  );
};

export default withRouter(ManageListingsPage);
