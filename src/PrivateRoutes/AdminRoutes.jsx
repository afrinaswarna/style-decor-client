import React from "react";
import useAuth from "../hooks/useAuth";
import LoadingSpinner from "../components/Loading/LoadingSpinner";
import Forbidden from "../components/Forbidden/Forbidden";
import useRole from "../hooks/useRole";

const AdminRoutes = ({ children }) => {
  const { role, roleLoading } = useRole();
  const { loading } = useAuth();

  if (loading || roleLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  if (role !== "admin") {
    return <Forbidden></Forbidden>;
  }
  return children;
};

export default AdminRoutes;
