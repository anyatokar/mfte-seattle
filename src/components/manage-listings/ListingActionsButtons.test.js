import { render, screen, fireEvent } from "@testing-library/react";
import ListingActionsButtons from "./ListingActionsButtons";
import { useAuth } from "../../contexts/AuthContext";
import {
  deleteListingFirestore,
  updateListingFirestore,
} from "../../utils/firestoreUtils";
import { listingStatusEnum } from "../../types/enumTypes";

// Mocks
jest.mock("../utils/firestoreUtils", () => ({
  deleteListingFirestore: jest.fn(),
  updateListingFirestore: jest.fn(),
}));

jest.mock("../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

const mockToggleFormCallback = jest.fn();

describe("ListingActionsButtons Component", () => {
  const mockUser = { uid: "userID" };

  beforeEach(() => {
    useAuth.mockReturnValue({ currentUser: mockUser });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders Add Listing button when not an existing listing", () => {
    render(
      <ListingActionsButtons
        listing={{
          listingID: "",
          buildingName: "123 Broadway",
          expiryDate: "2024-12-10",
        }}
        editListingID=""
        isFormVisible={false}
        toggleFormCallback={mockToggleFormCallback}
      />
    );

    const addButton = screen.getByRole("button", { name: /Add Listing/i });
    expect(addButton).toBeInTheDocument();
  });

  test("renders action dropdown for existing listing", () => {
    render(
      <ListingActionsButtons
        listing={{
          listingID: "listingID",
          buildingName: "123 Broadway",
          expiryDate: "2024-12-10",
          listingStatus: listingStatusEnum.ACTIVE,
        }}
        editListingID=""
        isFormVisible={false}
        toggleFormCallback={mockToggleFormCallback}
      />
    );

    const dropdownButton = screen.getByRole("button", { name: /Actions/i });
    expect(dropdownButton).toBeInTheDocument();

    fireEvent.click(dropdownButton);

    const editOption = screen.getByText(/Edit/i);
    expect(editOption).toBeInTheDocument();
  });

  test("calls delete function on delete click", () => {
    render(
      <ListingActionsButtons
        listing={{
          listingID: "listingID",
          buildingName: "123 Broadway",
          expiryDate: "2024-12-10",
          listingStatus: listingStatusEnum.ACTIVE,
        }}
        editListingID=""
        isFormVisible={false}
        toggleFormCallback={mockToggleFormCallback}
      />
    );

    const dropdownButton = screen.getByRole("button", { name: /Actions/i });
    fireEvent.click(dropdownButton);

    const deleteOption = screen.getByTestId("dropdown-delete");
    fireEvent.click(deleteOption);

    expect(screen.getByText(/Are you sure/i)).toBeInTheDocument();

    // Confirm delete
    fireEvent.click(screen.getByTestId("modal-confirm"));

    expect(deleteListingFirestore).toHaveBeenCalledWith(
      "listingID",
      "123 Broadway"
    );
  });

  test("calls update function on renew click", () => {
    render(
      <ListingActionsButtons
        listing={{
          listingID: "listingID",
          buildingName: "123 Broadway",
          expiryDate: "2024-12-10",
          listingStatus: listingStatusEnum.ACTIVE,
        }}
        editListingID=""
        isFormVisible={false}
        toggleFormCallback={mockToggleFormCallback}
      />
    );

    const dropdownButton = screen.getByRole("button", { name: /Actions/i });
    fireEvent.click(dropdownButton);

    const renewOption = screen.getByText(/Renew/i);
    fireEvent.click(renewOption);

    expect(updateListingFirestore).toHaveBeenCalledWith(
      { expiryDate: expect.any(String) },
      "listingID"
    );
  });

  test("calls toggleFormCallback on cancel click", () => {
    render(
      <ListingActionsButtons
        listing={{
          listingID: "listingID",
          buildingName: "123 Broadway",
          expiryDate: "2024-12-10",
          listingStatus: listingStatusEnum.ACTIVE,
        }}
        editListingID="listingID"
        isFormVisible={true}
        toggleFormCallback={mockToggleFormCallback}
      />
    );

    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    fireEvent.click(cancelButton);

    expect(mockToggleFormCallback).toHaveBeenCalledWith("listingID", false);
  });
});
