import { render, screen } from "@testing-library/react";
import ListingCard from "./ListingCard";
import { useAuth } from "../contexts/AuthContext";
import { accountTypeEnum, listingStatusEnum } from "../types/enumTypes";
import { Timestamp } from "firebase/firestore";

// Mock the useAuth hook
jest.mock("../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

const mockToggleFormCallback = jest.fn();

// Constants for mock data
const mockListing = {
  listingID: "listingID",
  listingStatus: listingStatusEnum.ACTIVE,
  buildingName: "123 Broadway",
  url: "test-url.com",
  description: "Apts available",
  availData: [],
  buildingID: "buildingID",
  dateCreated: Timestamp.fromDate(new Date("08-10-2024")),
  dateUpdated: Timestamp.fromDate(new Date("01-14-2024")),
  expiryDate: "2024-12-10",
  managerID: "managerID",
};

const mockProps = {
  listing: mockListing,
  isFormVisible: false,
  toggleFormCallback: mockToggleFormCallback,

  editListingID: "editID",
};

const mockUser = {
  displayName: "company rep name",
  email: "company-rep@email.com",
  jobTitle: "test job title",
  companyName: "test company",
};

describe("ListingCard Component", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      currentUser: mockUser,
      accountType: accountTypeEnum.MANAGER,
    });
  });

  test("for simple card with no form visible, renders expected labels and fields", () => {
    render(<ListingCard {...mockProps} />);

    // Assert header is rendered
    expect(screen.getByTestId("listing-card-header")).toBeInTheDocument();

    // Assert body is rendered and form is not visible
    expect(
      screen.getByTestId("body-form-not-visible-existing-listing")
    ).toBeInTheDocument();
    expect(screen.queryByTestId("body-form-visible")).not.toBeInTheDocument();

    // Assert listing details
    expect(screen.getByText(/123 Broadway/i)).toBeInTheDocument();
    expect(screen.getByText(/URL:/i)).toBeInTheDocument();
    expect(screen.getByText(/test-url.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Expires:/i)).toBeInTheDocument();
    expect(screen.getByText(/12\/10\/2024/i)).toBeInTheDocument();
    expect(screen.getByText(/Description:/i)).toBeInTheDocument();
    expect(screen.getByText(/Apts available/i)).toBeInTheDocument();
    expect(screen.getByText(/Last update:/i)).toBeInTheDocument();
    expect(screen.getByText(/1\/14\/2024/i)).toBeInTheDocument();
  });
});
