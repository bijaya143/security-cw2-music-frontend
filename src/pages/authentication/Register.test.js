import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import Register from "./Register";
import { toast } from "react-toastify";
import { registerUserApi } from "../../apis/Api";
import { MemoryRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Mock Api.js file
jest.mock("../../apis/Api");

describe("Register component", () => {
  // Clear all mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should display error toast on registration failure", async () => {
    render(
      <MemoryRouter>
        <GoogleOAuthProvider clientId="GOOGLE_CLIENT_ID">
          <Register />
        </GoogleOAuthProvider>
      </MemoryRouter>
    );

    const mockRes = {
      data: {
        success: false,
        message: "User Already Exists!",
      },
    };

    // Mock the API call
    registerUserApi.mockResolvedValue(mockRes);

    // Mock the toast.error method
    toast.error = jest.fn();

    // Find elements by their placeholder text
    const firstName = await screen.findByPlaceholderText("Enter First Name");
    const lastName = await screen.findByPlaceholderText("Enter Last Name");
    const email = await screen.findByPlaceholderText("Enter Email");
    const password = await screen.findByPlaceholderText("Enter Password");
    const registerBtn = screen.getByText("Register");

    // Simulate user input and click event
    fireEvent.change(firstName, { target: { value: "Bijaya" } });
    fireEvent.change(lastName, { target: { value: "Majhi" } });
    fireEvent.change(email, { target: { value: "a@gmail.com" } });
    fireEvent.change(password, { target: { value: "password" } });
    fireEvent.click(registerBtn);

    // Verify the API call and toast messages
    await waitFor(() => {
      expect(registerUserApi).toHaveBeenCalledWith({
        firstName: "Bijaya",
        lastName: "Majhi",
        email: "a@gmail.com",
        password: "password",
      });
      expect(toast.error).toHaveBeenCalledWith("User Already Exists!");
    });
  });
});
