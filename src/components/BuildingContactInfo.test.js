import { render, screen } from "@testing-library/react";
import { BuildingName, AddressAndPhone } from "./BuildingContactInfo";

describe("BuildingName Component", () => {
  test("renders building name with correct link and title", () => {
    const mockProps = {
      buildingName: "Test Building",
      urlForBuilding: "https://example.com",
    };

    render(<BuildingName {...mockProps} />);

    const buildingLink = screen.getByText(/Test Building/i);
    expect(buildingLink).toBeInTheDocument();
    expect(buildingLink).toHaveAttribute("href", mockProps.urlForBuilding);
    expect(buildingLink).toHaveAttribute(
      "title",
      `Open new tab: ${mockProps.urlForBuilding}`
    );
  });
});

describe("AddressAndPhone Component", () => {
  test("renders address and phone numbers correctly with links", () => {
    const mockProps = {
      buildingName: "Test Building",
      streetNum: "123",
      street: "Test St",
      city: "Test City",
      state: "TS",
      zip: "12345",
      phone: "555-1234",
      phone2: "555-5678",
    };

    render(<AddressAndPhone {...mockProps} />);

    const addressLink = screen.getByText(/123 Test St/i);
    expect(addressLink).toBeInTheDocument();
    expect(addressLink).toHaveAttribute(
      "href",
      `https://www.google.com/maps/search/?api=1&query=123%20Test%20St%2C%20Test%20City%2C%20TS%2012345`
    );
    expect(addressLink).toHaveAttribute(
      "title",
      `Open new tab: Test Building on Google Maps`
    );

    const phone1Link = screen.getByText(/555-1234/i);
    expect(phone1Link).toBeInTheDocument();
    expect(phone1Link).toHaveAttribute("href", `tel:${mockProps.phone}`);

    const phone2Link = screen.getByText(/555-5678/i);
    expect(phone2Link).toBeInTheDocument();
    expect(phone2Link).toHaveAttribute("href", `tel:${mockProps.phone2}`);
  });

  test("renders address without secondary phone number if not provided", () => {
    const mockProps = {
      buildingName: "Test Building",
      streetNum: "123",
      street: "Test St",
      city: "Test City",
      state: "TS",
      zip: "12345",
      phone: "555-1234",
      phone2: "",
    };

    render(<AddressAndPhone {...mockProps} />);

    const phone2Link = screen.queryByText(/555-5678/i);
    expect(phone2Link).toBeNull();
  });
});
