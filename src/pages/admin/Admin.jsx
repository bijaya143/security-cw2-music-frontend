import React from "react";
import AdminSidebar from "../../components/AdminSidebar";

const Admin = () => {
  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: "20px" }}></div>
    </div>
  );
};

export default Admin;
