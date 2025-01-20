import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import ProfileSetting from "./ProfileSetting";

// Mock useLocation hook
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () => ({ pathname: "/profile" }),
}));

describe("ProfileSetting Component", () => {
  it("renders ProfileSettings and links", () => {
    render(
      <Router>
        <ProfileSetting />
      </Router>
    );

    expect(screen.getByText(/Profile Settings/i)).toBeInTheDocument();
    expect(screen.getByText(/Account/i)).toBeInTheDocument();
    expect(screen.getByText(/Change Password/i)).toBeInTheDocument();
  });

  it("highlights active link based on location", () => {
    render(
      <Router>
        <ProfileSetting />
      </Router>
    );

    expect(screen.getByText(/Account/i)).toHaveClass("active");
    expect(screen.getByText(/Change Password/i)).not.toHaveClass("active");
  });
});
