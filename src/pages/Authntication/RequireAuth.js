import { Navigate, Outlet } from "react-router";
import Cookies from "universal-cookie";

export default function RequireAuth() {
  const cookie = new Cookies();
  return cookie.get("userAccessToken") ? <Outlet /> : <Navigate to="/" />;
}
