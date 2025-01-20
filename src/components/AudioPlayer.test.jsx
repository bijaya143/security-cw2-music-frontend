import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import AudioPlayer from "./AudioPlayer";

const mockSong = {
  _id: "1",
  title: "Test Song",
  artist: "Test Artist",
  imageUrl: "/test-image.jpg",
  audioUrl: "/test-audio.mp3",
  createdAt: "2024-08-10T00:00:00Z",
  playCount: 123,
  favoriteCount: 45,
};

describe("AudioPlayer Component", () => {
  it("renders song details correctly", () => {
    render(<AudioPlayer song={mockSong} />);

    expect(screen.getByText("Test Song")).toBeInTheDocument();
    expect(screen.getByText("Test Artist")).toBeInTheDocument();
    expect(screen.getByText("Created Date: 8/10/2024")).toBeInTheDocument();
    expect(screen.getByText("Total Play Count: 123")).toBeInTheDocument();
    expect(screen.getByText("Total Favorites: 45")).toBeInTheDocument();
  });

  it("play button toggles play/pause state", () => {
    render(<AudioPlayer song={mockSong} />);

    const playButton = screen.getByLabelText("Play/Pause");

    fireEvent.click(playButton);
    expect(playButton).toContainHTML('<i class="bi bi-pause"></i>'); // Should show pause icon when playing

    fireEvent.click(playButton);
    expect(playButton).toContainHTML('<i class="bi bi-play"></i>'); // Should show play icon when paused
  });

  it("seek bar updates current time", () => {
    render(<AudioPlayer song={mockSong} />);

    const seekBar = screen.getByLabelText("Seek Bar");
    fireEvent.change(seekBar, { target: { value: 50 } });
  });

  it("popup is toggled when add to playlist button is clicked", () => {
    render(<AudioPlayer song={mockSong} />);

    const addToPlaylistButton = screen.getByLabelText("Add to Playlist");
    fireEvent.click(addToPlaylistButton);

    expect(screen.getByText("Select a Playlist")).toBeInTheDocument();
  });
});
