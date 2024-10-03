import { Profiler, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { isProfilerOn } from "../config/config";
import { listingStatusEnum } from "../types/enumTypes";
import { useAllListings } from "../hooks/useAllListings";
import { getRepsListingIDsFirestore } from "../utils/firestoreUtils";
import ListingCard from "../components/ListingCard";

import IListing from "../interfaces/IListing";
import IPage from "../interfaces/IPage";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
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
      const listingIDs = await getRepsListingIDsFirestore(currentUser.uid);

      if (listingIDs) {
        const foundListings = allListings.filter((listing) =>
          listingIDs.includes(listing.listingID)
        );
        setRepsListings(foundListings);
      }

      setIsLoadingRepsListings(false);
    };

    fetchRepsListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      label: "In Review",
      listingStatus: listingStatusEnum.IN_REVIEW,
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

            <h4>Summary</h4>

            <Row>
              <Col xs={12} sm={6} lg={4} className="pb-4">
                <Table responsive bordered hover size="sm" className="mt-0">
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

            <h4>Listings</h4>
            <Row>
              <Col>
                {isLoading && (
                  <Spinner animation="border" variant="secondary" />
                )}
                {!isLoading && repsListings.length === 0 && (
                  <p>Empty for now!</p>
                )}
                {!isLoading &&
                  repsListings.length > 0 &&
                  repsListings.map((listing) => (
                    <Col className="pb-2" key={listing.listingID}>
                      <ListingCard
                        availData={listing.availData}
                        buildingName={listing.buildingName}
                        listingStatus={listing.listingStatus}
                        url={listing.url}
                        listingID={listing.listingID}
                        expiryDate={listing.expiryDate}
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
