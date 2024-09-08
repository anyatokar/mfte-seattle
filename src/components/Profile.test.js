import { render, screen } from "@testing-library/react";
import Profile from "./Profile";
import { useAuth } from "../contexts/AuthContext";

// Mock the useAuth hook
jest.mock("../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

describe("Profile Component", () => {
  test("renders user information when currentUser is available", () => {
    // Arrange
    const mockUser = {
      displayName: "John Doe",
      email: "john.doe@example.com",
    };

    useAuth.mockReturnValue({ currentUser: mockUser });

    // Act
    render(<Profile />);

    // Assert
    expect(screen.getByText(/Name:/i)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByText(/john.doe@example.com/i)).toBeInTheDocument();
  });

  test("does not render anything when currentUser is not available", () => {
    // Arrange
    useAuth.mockReturnValue({ currentUser: null });

    // Act
    const { container } = render(<Profile />);

    // Assert
    expect(container).toBeEmptyDOMElement();
  });
});
