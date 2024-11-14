import { Outlet, Navigate } from "react-router-dom";

export default function AdminRoute() {
  const currentUser = localStorage.getItem("token");

  return currentUser ? <Outlet /> : <Navigate to="/" />;
}
