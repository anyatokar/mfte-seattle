import { render, screen } from "@testing-library/react";
import Profile from "./Profile";
import { useAuth } from "../contexts/AuthContext";
import { accountTypeEnum } from "../types/enumTypes";

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

  test("renders manager information for manager account", () => {
    // Arrange
    const mockUser = {
      displayName: "company rep name",
      email: "company-rep@email.com",
      jobTitle: "test job title",
      companyName: "test company",
    };

    useAuth.mockReturnValue({
      currentUser: mockUser,
      accountType: accountTypeEnum.MANAGER,
    });

    // Act
    render(
      <Profile
        jobTitle={mockUser.jobTitle}
        companyName={mockUser.companyName}
      />
    );

    // Assert
    expect(screen.getByText(/Name:/i)).toBeInTheDocument();
    expect(screen.getByText(/company rep name/i)).toBeInTheDocument();
    expect(screen.getByText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByText(/company-rep@email.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Job Title:/i)).toBeInTheDocument();
    expect(screen.getByText(/test job title/i)).toBeInTheDocument();
    expect(screen.getByText(/Company:/i)).toBeInTheDocument();
    expect(screen.getByText(/test company/i)).toBeInTheDocument();
  });

  test("does not render anything when currentUser is not available", () => {
    // Arrange
    useAuth.mockReturnValue({ currentUser: null });

    // Act
    const { container } = render(<Profile />);

    // Assert
    expect(container).toBeEmptyDOMElement();
  });

  test("does not render manager fields for non-manager account", () => {
    // Arrange
    const mockUser = {
      displayName: "Jane Doe",
      email: "jane.doe@example.com",
    };

    useAuth.mockReturnValue({
      currentUser: mockUser,
      accountType: accountTypeEnum.RENTER,
    });

    // Act
    render(<Profile />);

    // Assert
    expect(screen.getByText(/Name:/i)).toBeInTheDocument();
    expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByText(/jane.doe@example.com/i)).toBeInTheDocument();
    expect(screen.queryByText(/Job Title:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Company Name:/i)).not.toBeInTheDocument();
  });
});
