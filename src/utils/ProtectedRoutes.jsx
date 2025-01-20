import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (currentUser && (!currentUser.genres || currentUser.genres.length === 0)) {
    return <Navigate to="/genres" />;
  }

  return children;
};

export default ProtectedRoute;
