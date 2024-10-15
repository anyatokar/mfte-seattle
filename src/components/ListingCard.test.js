import { render, screen } from "@testing-library/react";
import { ListingCard } from "./ListingCard";

describe("ListingCard Component", () => {
  test("renders the card header element when form is visible", () => {
    const mockProps = {
      isFormVisible: true,
    };

    render(<ListingCard {...mockProps} />);

    // Check if the Card.Header element with data-testid is rendered
    const headerElement = screen.getByTestId("listing-card-header");

    expect(headerElement).toBeInTheDocument();
  });
});
