import "./Navbar.css";
import { useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const { isAuthenticated, logoutuser, user } = useContext(AuthContext);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");
  const drawerWidth = 240;

  return (
    <nav
      className="navbar"
      style={{
        marginLeft: isAdminRoute && sidebarOpen ? drawerWidth : 0,
        background: "#1e1e2f",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 20px",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Menu Icon for Sidebar (visible on admin routes) */}
      {isAdminRoute && (
        <IconButton
          edge="start"
          color="inherit"
          aria-label={sidebarOpen ? "close sidebar" : "open sidebar"}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          sx={{ color: "#fff", mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Website Title */}
      <h1
        className="navbar-title"
        style={{
          marginLeft: isAdminRoute && sidebarOpen ? 10 : 0,
          transition: "margin-left 0.3s",
          fontSize: "1.5rem",
        }}
      >
        MovieStream
      </h1>

      {/* Navigation Links */}
      {!isAdminRoute && (
        <div className="navbar-links" style={{ display: "flex", gap: "1rem" }}>
          {/* Home */}
          <NavLink to="/" className="nav_btn" style={{ color: "#fff" }}>
            Home
          </NavLink>

          {/* Movies */}
          <NavLink to="/movies" className="nav_btn" style={{ color: "#fff" }}>
            Movies
          </NavLink>

          {/* About */}
          <NavLink to="/about" className="nav_btn" style={{ color: "#fff" }}>
            About
          </NavLink>

          {/* Contact */}
          <NavLink to="/contact" className="nav_btn" style={{ color: "#fff" }}>
            Contact
          </NavLink>

          {/* Auth Buttons */}
          {!isAuthenticated ? (
            <>
              <NavLink to="/signup" className="nav_btn" style={{ color: "#fff" }}>
                Sign Up
              </NavLink>
              <NavLink to="/signin" className="nav_btn" style={{ color: "#fff" }}>
                Sign In
              </NavLink>
            </>
          ) : (
            <>
              {/* If Admin, show Dashboard Link */}
              {user?.role === "admin" && (
                <NavLink
                  to="/admin/dashboard"
                  className="nav_btn"
                  style={{ color: "#fff" }}
                >
                  Admin Panel
                </NavLink>
              )}

              {/* Logout */}
              <button
                onClick={logoutuser}
                className="nav_btn"
                style={{
                  color: "#fff",
                  background: "transparent",
                  border: "1px solid #fff",
                  borderRadius: "5px",
                  padding: "5px 10px",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
