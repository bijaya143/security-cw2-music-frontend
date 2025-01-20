import React, { useEffect, useState } from "react";
import "../../css/AdminCustomer.css";
import AdminSidebar from "../../../components/AdminSidebar";
import {
  addGenreApi,
  deleteGenreApi,
  getGenresApi,
  updateGenreApi,
} from "../../../apis/Api";
import { toast } from "react-toastify";
import GenreModal from "../../../components/GenreModal";

const AdminGenre = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [customers, setCustomers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editGenre, setEditGenre] = useState(null);

  useEffect(() => {
    getGenresApi()
      .then((res) => {
        setCustomers(res.data.data.genre);
      })
      .catch((err) => {});
  }, []);

  const handleAddClick = () => {
    setEditGenre(null);
    setModalOpen(true);
  };

  const handleEditClick = (genre) => {
    setEditGenre(genre);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = (formData) => {
    if (editGenre) {
      updateGenreApi(editGenre._id, formData)
        .then(() => {
          toast.success("Genre has been updated.");
          setModalOpen(false);
        })
        .catch((err) => {
          toast.error("Genre was not updated.");
        });
    } else {
      addGenreApi(formData)
        .then(() => {
          toast.success("Genre has been added.");
          setModalOpen(false);
        })
        .catch((err) => {
          toast.error("Genre was not added.");
        });
    }
  };

  const handleDelete = (id) => {
    const confirmDialog = window.confirm("Are you sure want to delete?");
    if (confirmDialog) {
      deleteGenreApi(id)
        .then((res) => {
          toast.success("Genre has been deleted.");
        })
        .catch((err) => {
          toast.error("Genre was not deleted.");
        });
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h1>Genre List</h1>
            <div className="header-actions">
              <input
                type="text"
                placeholder="Search by name"
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
                <th onClick={() => requestSort("name")}>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedCustomers
                .slice(indexOfFirstItem, indexOfLastItem)
                .map((customer) => (
                  <tr key={customer._id}>
                    <td>{customer._id}</td>
                    <td>{customer.name}</td>
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
      <GenreModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        genre={editGenre}
      />
    </div>
  );
};

export default AdminGenre;
