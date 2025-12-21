import React from "react";
import useRole from "../hooks/useRole";
import useAuth from "../hooks/useAuth";
import LoadingSpinner from "../components/Loading/LoadingSpinner";
import Forbidden from "../components/Forbidden/Forbidden";

const DecoratorRoutes = ({ children }) => {
  const { role, roleLoading } = useRole();
  const { user, loading } = useAuth();
  console.log(role);
  if (loading || !user || roleLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  if (role !== "rider") {
    return <Forbidden></Forbidden>;
  }
  return children;
};

export default DecoratorRoutes;
