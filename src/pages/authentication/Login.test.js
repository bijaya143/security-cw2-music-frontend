import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./Login";
import { toast } from "react-toastify";
import { loginUserApi } from "../../apis/Api";

// Mock Api.js file
jest.mock("../../apis/Api");

describe("Login component", () => {
  // Clearing all mock test
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should display error toast on login failure", async () => {
    render(
      <MemoryRouter>
        <GoogleOAuthProvider clientId="GOOGLE_CLIENT_ID">
          <Login />
        </GoogleOAuthProvider>
      </MemoryRouter>
    );

    const mockRes = {
      data: {
        success: false,
        message: "Incorrect Password!",
      },
    };

    // Resolving with mocked data
    loginUserApi.mockResolvedValue(mockRes);

    // Making toast.error
    toast.error = jest.fn();

    // Find elements
    const email = await screen.findByPlaceholderText("Enter Email");
    const password = await screen.findByPlaceholderText("Enter Password");
    const loginBtn = screen.getByText("Login");

    // Fire Event
    fireEvent.change(email, {
      target: {
        value: "a@gmail.com",
      },
    });
    fireEvent.change(password, {
      target: {
        value: "password",
      },
    });
    fireEvent.click(loginBtn);

    // Ensure expected result
    await waitFor(() => {
      expect(loginUserApi).toHaveBeenCalledWith({
        email: "a@gmail.com",
        password: "password",
      });
      expect(toast.error).toHaveBeenCalledWith("Incorrect Password!");
    });
  });
});
