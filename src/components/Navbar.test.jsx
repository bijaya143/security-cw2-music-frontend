import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./Navbar";

// Mock localStorage
beforeEach(() => {
  const user = { firstName: "John" };
  global.localStorage.setItem("user", JSON.stringify(user));
});

afterEach(() => {
  global.localStorage.clear();
});

it("navigates to search results on Enter key press", () => {
  const { container } = render(
    <Router>
      <Navbar />
    </Router>
  );

  const input = screen.getByPlaceholderText(/search/i);
  fireEvent.change(input, { target: { value: "test" } });
  fireEvent.keyPress(input, { key: "Enter", code: "Enter", charCode: 13 });
});

it("handles logout correctly", () => {
  const { container } = render(
    <Router>
      <Navbar />
    </Router>
  );

  const logoutButton = screen.getByText(/Logout/i);
  fireEvent.click(logoutButton);

  expect(global.localStorage.getItem("user")).toBeNull();
});
