import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { checkAuth } from "../store/profileSlice";

function AuthPersist() {
  const dispatch = useDispatch();
  const location = useLocation();
  const userData = useSelector((state) => state.profile.userData);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    const verifyAuth = async () => {
      try {
        await dispatch(checkAuth()).unwrap();
      } catch {
        // checkAuth clears the authenticated state when verification fails.
      } finally {
        if (active) setChecking(false);
      }
    };

    verifyAuth();
    return () => { active = false; };
  }, [dispatch]);

  if (checking) return null;
  if (!userData.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (userData.role === "customer" && location.pathname !== "/profile") {
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
}

export default AuthPersist;
