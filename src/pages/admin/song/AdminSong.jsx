import React, { useEffect, useState } from "react";
import "../../css/AdminCustomer.css";
import AdminSidebar from "../../../components/AdminSidebar";
import {
  addSongApi,
  deleteSongApi,
  getSongsApi,
  updateSongApi,
} from "../../../apis/Api";
import SongModal from "../../../components/SongModal";
import { toast } from "react-toastify";

const AdminSong = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [songs, setSongs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editSong, setEditSong] = useState(null);

  useEffect(() => {
    getSongsApi(currentPage)
      .then((res) => {
        setSongs(res.data.data.song);
      })
      .catch((err) => {});
  }, []);

  const handleAddClick = () => {
    setEditSong(null);
    setModalOpen(true);
  };

  const handleEditClick = (song) => {
    setEditSong(song);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = (formData) => {
    if (editSong) {
      // Update existing song
      updateSongApi(editSong._id, formData)
        .then(() => {
          // Refetch or update the songs list
          toast.success("Song has been updated.");
          setModalOpen(false);
        })
        .catch((err) => {
          toast.error("Song was not updated.");
        });
    } else {
      // Add new song
      addSongApi(formData)
        .then(() => {
          // Refetch or update the songs list
          toast.success("Song has been added.");
          setModalOpen(false);
        })
        .catch((err) => {
          toast.error("Song was not added.");
        });
    }
  };

  const handleDelete = (id) => {
    const confirmDialog = window.confirm("Are you sure want to delete?");
    if (confirmDialog) {
      deleteSongApi(id)
        .then((res) => {
          toast.success("Song has been deleted.");
        })
        .catch((err) => {
          toast.error("Song was not deleted.");
        });
    }
  };

  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSongs.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const sortedSongs = [...filteredSongs].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="customer-table-container">
      <AdminSidebar />
      <div className="customer-table-content">
        <header className="header">
          <div className="header-top">
            <h1>Song List</h1>
            <div className="header-actions">
              <input
                type="text"
                placeholder="Search by song title"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
              />
              <button className="btn-add" onClick={handleAddClick}>
                Add
              </button>
            </div>
          </div>
        </header>
        <div className="table-wrapper">
          <table className="customer-table">
            <thead>
              <tr>
                <th onClick={() => requestSort("_id")}>ID</th>
                <th>Image</th>
                <th onClick={() => requestSort("title")}>Title</th>
                <th onClick={() => requestSort("artist")}>Artist</th>
                <th onClick={() => requestSort("genre")}>Genre</th>
                <th onClick={() => requestSort("favoriteCount")}>
                  Favorite Count
                </th>
                <th onClick={() => requestSort("playCount")}>Play Count</th>

                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedSongs
                .slice(indexOfFirstItem, indexOfLastItem)
                .map((song) => (
                  <tr key={song._id}>
                    <td>{song._id}</td>
                    <td>
                      <img
                        height={50}
                        width={50}
                        src={`${process.env.REACT_APP_BACKEND_IMAGE_BASE_URL}${song.imageUrl}`}
                        alt=""
                        srcset=""
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null; // prevents looping
                          currentTarget.src =
                            "/assets/images/default_image.png";
                        }}
                        style={{ objectFit: "cover" }}
                      />{" "}
                    </td>
                    <td>{song.title}</td>
                    <td>{song.artist}</td>
                    <td>{song.genre}</td>
                    <td>{song.favoriteCount}</td>
                    <td>{song.playCount}</td>
                    <td>
                      <div className="actions">
                        <button
                          className="btn-edit"
                          onClick={() => handleEditClick(song)}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(song._id)}
                          className="btn-delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          {Array.from(
            { length: Math.ceil(filteredSongs.length / itemsPerPage) },
            (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`pagination-button ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
      </div>
      <SongModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        song={editSong}
      />
    </div>
  );
};

export default AdminSong;
