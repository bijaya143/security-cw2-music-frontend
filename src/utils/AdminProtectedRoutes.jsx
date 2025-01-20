// AdminRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // Redirect to login if not authenticated or not an admin
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (currentUser.userType !== "admin") {
    return <Navigate to="/unauthorized" />; // Redirect to an unauthorized page or another route
  }

  // Render children if the user is an admin
  return children;
};

export default AdminProtectedRoute;
