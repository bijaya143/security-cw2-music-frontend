import React, { useEffect, useState } from "react";
import "../../css/AdminCustomer.css";
import AdminSidebar from "../../../components/AdminSidebar";
import {
  addArtistApi,
  deleteArtistApi,
  getArtistsApi,
  updateArtistApi,
} from "../../../apis/Api";
import { toast } from "react-toastify";
import ArtistModal from "../../../components/ArtistModal";

const AdminArtist = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [customers, setCustomers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editArtist, setEditArtist] = useState(null);

  useEffect(() => {
    getArtistsApi()
      .then((res) => {
        setCustomers(res.data.data.artist);
      })
      .catch((err) => {});
  }, []);

  const handleAddClick = () => {
    setEditArtist(null);
    setModalOpen(true);
  };

  const handleEditClick = (artist) => {
    setEditArtist(artist);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = (formData) => {
    if (editArtist) {
      updateArtistApi(editArtist._id, formData)
        .then(() => {
          toast.success("Artist has been updated.");
          setModalOpen(false);
        })
        .catch((err) => {
          toast.error("Artist was not updated.");
        });
    } else {
      addArtistApi(formData)
        .then(() => {
          toast.success("Artist has been added.");
          setModalOpen(false);
        })
        .catch((err) => {
          toast.error("Artist was not added.");
        });
    }
  };

  const handleDelete = (id) => {
    const confirmDialog = window.confirm("Are you sure want to delete?");
    if (confirmDialog) {
      deleteArtistApi(id)
        .then((res) => {
          toast.success("Artist has been deleted.");
        })
        .catch((err) => {
          toast.error("Artist was not deleted.");
        });
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.email &&
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCustomers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
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
            <h1>Artist List</h1>
            <div className="header-actions">
              <input
                type="text"
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
              />
              <button className="btn-add" onClick={() => handleAddClick()}>
                Add
              </button>
            </div>
          </div>
        </header>
        <div className="table-wrapper">
          <table className="customer-table">
            <thead>
              <tr>
                <th onClick={() => requestSort("id")}>ID</th>
                <th>Image</th>
                <th onClick={() => requestSort("email")}>Email</th>
                <th onClick={() => requestSort("displayName")}>Display Name</th>
                <th onClick={() => requestSort("streamCount")}>Stream Count</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedCustomers
                .slice(indexOfFirstItem, indexOfLastItem)
                .map((customer) => (
                  <tr key={customer._id}>
                    <td>{customer._id}</td>
                    <td>
                      <img
                        height={50}
                        width={50}
                        src={`${process.env.REACT_APP_BACKEND_IMAGE_BASE_URL}${customer.imageUrl}`}
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
                    <td>{customer.email || ""}</td>
                    <td>{customer.displayName}</td>
                    <td>{customer.streamCount}</td>
                    <td>
                      <div className="actions">
                        <button
                          className="btn-edit"
                          onClick={() => handleEditClick(customer)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(customer._id)}
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
            { length: Math.ceil(filteredCustomers.length / itemsPerPage) },
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
      <ArtistModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        artist={editArtist}
      />
    </div>
  );
};

export default AdminArtist;
