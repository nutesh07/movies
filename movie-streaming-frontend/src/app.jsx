import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AdminSidebar from "./admin/sidebar";
import Dashboard from "./admin/dashboard";
import UserList from "./admin/user/userList";
import AddMovie from "./admin/movies/AddMovie";      
import MovieList from "./admin/movies/MovieList";    
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <AuthProvider>
      <Router>
        {/* Navbar always visible */}
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <Routes>
          {/* Admin Panel Layout */}
          <Route
            path="/admin/*"
            element={
              <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="users" element={<UserList />} />
                  <Route path="movies" element={<MovieList />} />       
                  <Route path="movies/add" element={<AddMovie />} />     
                </Routes>
              </AdminSidebar>
            }
          />

          {/* Public Default Route */}
          <Route
            path="*"
            element={
              <h2 style={{ textAlign: "center", marginTop: "50px" }}>
                Welcome to Movie Streaming Website 
              </h2>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
