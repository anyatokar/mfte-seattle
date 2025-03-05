import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ManageListingsPage from "./ManageListings";
import { useAuth } from "../contexts/AuthContext";
import { useAllListings } from "../hooks/useListings";
import { useAllBuildings } from "../hooks/useAllBuildings";
import { accountTypeEnum, listingStatusEnum } from "../types/enumTypes";
import { BrowserRouter } from "react-router-dom";

jest.mock("../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../hooks/useListings", () => ({
  useAllListings: jest.fn(),
}));

const mockBuildings = [
  {
    buildingID: "buildingID-1",
    buildingName: "building 1",
    streetAddress: "34 street address",
    amiData: [{ unitSize: "studio", percentAmis: [60, 75] }],
  },
  {
    buildingID: "buildingID-2",
    buildingName: "building 2",
    streetAddress: "34 street address",
    amiData: [{ unitSize: "studio", percentAmis: [60, 75] }],
  },
];

jest.mock("../hooks/useAllBuildings", () => ({
  useAllBuildings: jest.fn().mockImplementation((shouldFetch) => {
    return shouldFetch ? [[mockBuildings], false] : [[], false];
  }),
}));

const mockAvailData = [
  {
    unitSize: "studio",
    maxRent: 2000,
  },
];

const mockListings = [
  {
    listingID: "listingID-1",
    listingStatus: listingStatusEnum.ACTIVE,
    buildingName: "building 1",
    availData: mockAvailData,
    buildingID: "buildingID-1",
    expiryDate: "2024-12-10",
    managerID: "managerID",
  },
  {
    listingID: "listingID-2",
    listingStatus: listingStatusEnum.ARCHIVED,
    buildingName: "building 2",
    availData: mockAvailData,
    buildingID: "buildingID-2",
    expiryDate: "2024-12-10",
    managerID: "managerID",
  },
];

const renderComponent = () =>
  render(
    <BrowserRouter>
      <ManageListingsPage name="Manage Listings Page" />
    </BrowserRouter>
  );

describe("ManageListingsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should not render for non-manager users", () => {
    useAuth.mockReturnValue({
      currentUser: { uid: "userID" },
      accountType: accountTypeEnum.RENTER,
    });

    useAllListings.mockReturnValue([[], false]);
    useAllBuildings.mockReturnValue([[], false]);

    renderComponent();

    expect(screen.queryByText(/Manage Listings/i)).toBeNull();
  });

  test("should render for manager users", () => {
    useAuth.mockReturnValue({
      currentUser: { uid: "userID" },
      accountType: accountTypeEnum.MANAGER,
    });

    useAllListings.mockReturnValue([[], false]);
    useAllBuildings.mockReturnValue([[], false]);

    renderComponent();

    expect(screen.getByText(/Manage Listings/i)).toBeInTheDocument();
  });

  test("should open and close the confirmation modal", async () => {
    useAuth.mockReturnValue({
      currentUser: { uid: "userID" },
      accountType: accountTypeEnum.MANAGER,
    });

    useAllListings.mockReturnValue([[], false]);

    /** True/False depending on whether Add Listing is open and on whether allBuildings have already been fetched.  */
    let shouldFetch = true;
    useAllBuildings.mockReturnValue(
      shouldFetch ? [[mockBuildings], false] : [[], false]
    );

    renderComponent();

    // Open modal
    const addListings = screen.getAllByRole("button", { name: /Add Listing/i });
    fireEvent.click(addListings[0]);

    // Simulate clicking on a listing to trigger the modal
    const cancelAddListingButtons = screen.getAllByRole("button", {
      name: /Cancel/i,
    });
    fireEvent.click(cancelAddListingButtons[0]);

    expect(screen.getByText(/Are you sure/i)).toBeInTheDocument();

    // Close modal
    fireEvent.click(screen.getByRole("button", { name: /Go Back/i }));
    await waitFor(() => expect(screen.queryByText(/Are you sure/i)).toBeNull());
  });

  test('should display "No current listings" when there are no listings', () => {
    useAuth.mockReturnValue({
      currentUser: { uid: "userID" },
      accountType: accountTypeEnum.MANAGER,
    });

    useAllListings.mockReturnValue([[], false]);
    useAllBuildings.mockReturnValue([[], false]);

    renderComponent();

    expect(screen.getByText(/No current listings/i)).toBeInTheDocument();
  });

  test("should filter and display active listings", () => {
    useAuth.mockReturnValue({
      currentUser: { uid: "userID" },
      accountType: accountTypeEnum.MANAGER,
    });

    useAllListings.mockReturnValue([mockListings, false]);
    useAllBuildings.mockReturnValue([[], false]);

    renderComponent();

    // Check that active and archived listings render
    expect(screen.getByText(/building 1/i)).toBeInTheDocument(); // Active listing
    expect(screen.getByText(/building 2/i)).toBeInTheDocument(); // Archived listing
  });
});
