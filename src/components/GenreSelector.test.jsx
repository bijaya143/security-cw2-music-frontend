import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import GenreSelector from "./GenreSelector";
import { getGenresApi } from "../apis/Api";

jest.mock("../apis/Api", () => ({
  getGenresApi: jest.fn(),
}));

describe("GenreSelector Component", () => {
  const mockGenres = [
    { _id: "1", name: "Rock" },
    { _id: "2", name: "Pop" },
    { _id: "3", name: "Jazz" },
  ];

  it("renders genres after fetching from API", async () => {
    getGenresApi.mockResolvedValue({
      data: { data: { genre: mockGenres } },
    });

    render(<GenreSelector onSelect={jest.fn()} />);

    await waitFor(() => {
      expect(screen.getByText("Rock")).toBeInTheDocument();
      expect(screen.getByText("Pop")).toBeInTheDocument();
      expect(screen.getByText("Jazz")).toBeInTheDocument();
    });
  });

  it("handles genre selection and deselection", async () => {
    getGenresApi.mockResolvedValue({
      data: { data: { genre: mockGenres } },
    });
    const mockOnSelect = jest.fn();

    render(<GenreSelector onSelect={mockOnSelect} />);

    await waitFor(() => {
      const rockGenre = screen.getByText("Rock");
      const popGenre = screen.getByText("Pop");

      fireEvent.click(rockGenre);
      expect(rockGenre.parentElement).toHaveClass("selected");
      expect(mockOnSelect).toHaveBeenCalledWith(["1"]);

      fireEvent.click(popGenre);
      expect(popGenre.parentElement).toHaveClass("selected");
      expect(mockOnSelect).toHaveBeenCalledWith(["1", "2"]);

      fireEvent.click(rockGenre);
      expect(rockGenre.parentElement).not.toHaveClass("selected");
      expect(mockOnSelect).toHaveBeenCalledWith(["2"]);
    });
  });

  it("handles API error gracefully", async () => {
    getGenresApi.mockRejectedValue(new Error("API Error"));

    console.error = jest.fn();

    render(<GenreSelector onSelect={jest.fn()} />);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Failed to fetch genres:",
        expect.any(Error)
      );
    });
  });
});
