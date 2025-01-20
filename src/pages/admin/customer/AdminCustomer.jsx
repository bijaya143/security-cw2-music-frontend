import React, { useEffect, useState } from "react";
import "../../css/AdminCustomer.css";
import AdminSidebar from "../../../components/AdminSidebar";
import { getCustomersApi } from "../../../apis/Api";

const AdminCustomer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    getCustomersApi()
      .then((res) => {
        setCustomers(res.data.data.users);
      })
      .catch((err) => {});
  }, []);

  const filteredCustomers = customers.filter((customer) =>
    // customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h1>Customer List</h1>
            <div className="header-actions">
              <input
                type="text"
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
              />
              <button className="btn-add">Add</button>
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
                <th onClick={() => requestSort("firstName")}>First Name</th>
                <th onClick={() => requestSort("lastName")}>Last Name</th>
                <th onClick={() => requestSort("gender")}>Gender</th>
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
                    <td>{customer.email}</td>
                    <td>{customer.firstName}</td>
                    <td>{customer.lastName}</td>
                    <td>{customer.gender}</td>
                    <td>
                      <div className="actions">
                        <button className="btn-edit">Edit</button>
                        <button className="btn-delete">Delete</button>
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
    </div>
  );
};

export default AdminCustomer;
