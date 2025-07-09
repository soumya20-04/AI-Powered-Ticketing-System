import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function CheckAuth({ children, protected: isProtected }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

    if (isProtected) {
      // Protected route (tickets, admin, etc.)
      if (!token) {
        navigate("/login");
      } else if (location.pathname === "/admin" && user?.role !== "admin") {
        navigate("/tickets");
      } else {
        setLoading(false);
      }
    } else {
      // Public routes like /login
      if (location.pathname === "/login" && token) {
        navigate("/tickets");
      } else {
        // /signup should NEVER redirect
        setLoading(false);
      }
    }
  }, [isProtected, navigate, location.pathname]);

  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
}

export default CheckAuth;
