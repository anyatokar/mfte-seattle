import { Dispatch, useContext, useState } from "react";
import SearchInput from "./SearchInput";
import FilterSwitch from "./checkboxes/FilterSwitch";
import BedroomDropdown from "./searchAndFilter/BedroomDropdown";
import NeighborhoodDropdown from "./searchAndFilter/NeighborhoodDropdown";
import AmiDropdown from "./searchAndFilter/AmiDropdown";
import { ActiveFilters } from "../utils/buildingsFilter";
import { FilterAction } from "../reducers/filterReducer";
import { BedroomsKeyEnum } from "../types/enumTypes";
import { ModalContext, ModalState } from "../contexts/ModalContext";
import { useAuth } from "../contexts/AuthContext";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";

type SearchAndFilterProps = {
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  allNeighborhoods: Set<string>;
  allAmi: Set<string>;
  activeFilters: ActiveFilters;
  dispatch: Dispatch<FilterAction>;
};

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  setSearchQuery,
  allNeighborhoods,
  allAmi,
  activeFilters,
  dispatch,
}) => {
  // Handler for Avail Switch
  const handleAvailOnlyToggle = () => {
    dispatch({ type: "toggleSwitch", category: "isAvailOnly" });
  };

  const [, /* modalState */ setModalState] = useContext(ModalContext);
  const { currentUser } = useAuth();
  // Handler for Saved Switch
  const handleSavedOnlyToggle = () => {
    if (!currentUser) return setModalState(ModalState.LOGIN);
    dispatch({ type: "toggleSwitch", category: "isSavedOnly" });
  };

  // Handler for Bedrooms
  const handleBedroomsChange = (checkbox: BedroomsKeyEnum): void => {
    if (activeFilters.bedrooms.has(checkbox)) {
      dispatch({ type: "unchecked", category: "bedrooms", checkbox });
    } else {
      dispatch({ type: "checked", category: "bedrooms", checkbox });
    }
  };

  // Handler for Neighborhoods
  const handleNeighborhoodsChange = (checkbox?: string): void => {
    if (!checkbox) {
      dispatch({ type: "clearAll", category: "neighborhoods" });
    } else if (activeFilters.neighborhoods.has(checkbox)) {
      dispatch({ type: "unchecked", category: "neighborhoods", checkbox });
    } else {
      dispatch({ type: "checked", category: "neighborhoods", checkbox });
    }
  };

  // Handler for Amis
  const handleAmiChange = (checkbox?: string): void => {
    if (!checkbox) {
      dispatch({ type: "clearAll", category: "ami" });
    } else if (activeFilters.ami.has(checkbox)) {
      dispatch({ type: "unchecked", category: "ami", checkbox });
    } else {
      dispatch({ type: "checked", category: "ami", checkbox });
    }
  };

  return (
    <Container fluid>
      <Row className="p-0 mt-0 mb-1">
        {/* search */}
        <Col
          sm={7}
          md={6}
          lg={4}
          className="d-flex align-items-center mb-md-0 pe-md-0"
        >
          <SearchInput setSearchQuery={(query) => setSearchQuery(query)} />
        </Col>

        {/* filter for large screens */}
        <Col className="mb-1">
          <div className="d-flex overflow-x-auto flex-nowrap">
            <Stack direction="horizontal" gap={1}>
              <NeighborhoodDropdown
                onNeighborhoodsChange={handleNeighborhoodsChange}
                allNeighborhoods={allNeighborhoods}
                activeFilters={activeFilters}
              />
              <BedroomDropdown onBedroomsChange={handleBedroomsChange} />
              <AmiDropdown
                onAmiChange={handleAmiChange}
                allAmi={allAmi}
                activeFilters={activeFilters}
              />
              <FilterSwitch
                onCheckboxChange={handleAvailOnlyToggle}
                type="knownOnly"
              />
              <FilterSwitch
                onCheckboxChange={handleSavedOnlyToggle}
                type="savedOnly"
              />
            </Stack>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SearchAndFilter;
