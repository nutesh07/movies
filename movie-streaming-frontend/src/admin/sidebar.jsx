import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext"; // your auth context
import { NavLink, useNavigate } from "react-router-dom";
import {
  List,
  Collapse,
  Divider,
  Box,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
  Drawer,
} from "@mui/material";

import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  List as ListIcon,
  Movie as MovieIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  ExpandLess,
  ExpandMore,
  Logout as LogoutIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

const drawerWidth = 240;

export default function AdminSidebar({ sidebarOpen, setSidebarOpen, children }) {
  const { logoutuser } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  // Collapse states
  const [usersOpen, setUsersOpen] = useState(false);
  const [moviesOpen, setMoviesOpen] = useState(false);

  const handleLogout = () => {
    logoutuser();
    navigate("/");
  };

  const handleUsersClick = () => setUsersOpen((prev) => !prev);
  const handleMoviesClick = () => setMoviesOpen((prev) => !prev);

  // Sidebar Header
  const drawerHeader = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        minHeight: "64px",
      }}
    >
      <Typography variant="h6">🎬 Movie Admin</Typography>
      {!isDesktop && (
        <IconButton onClick={() => setSidebarOpen(false)}>
          <CloseIcon />
        </IconButton>
      )}
    </Box>
  );

  // Sidebar Items
  const drawer = (
    <div>
      {drawerHeader}
      <Divider />
      <List>
        {/* Dashboard */}
        <ListItem disablePadding>
          <ListItemButton
            component={NavLink}
            to="/admin/dashboard"
            sx={{ "&.active": { backgroundColor: "#e0e0e0" } }}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>

        {/* Users Section */}
        <ListItem disablePadding>
          <ListItemButton onClick={handleUsersClick}>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
            {usersOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={usersOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {/* List Users */}
            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/admin/users"
                sx={{
                  pl: 4,
                  "&.active": { backgroundColor: "#e0e0e0" },
                }}
              >
                <ListItemIcon>
                  <ListIcon />
                </ListItemIcon>
                <ListItemText primary="List Users" />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>

        {/* Movies Section */}
        <ListItem disablePadding>
          <ListItemButton onClick={handleMoviesClick}>
            <ListItemIcon>
              <MovieIcon />
            </ListItemIcon>
            <ListItemText primary="Movies" />
            {moviesOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={moviesOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {/* List Movies */}
            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/admin/movies"
                sx={{
                  pl: 4,
                  "&.active": { backgroundColor: "#e0e0e0" },
                }}
              >
                <ListItemIcon>
                  <VisibilityIcon />
                </ListItemIcon>
                <ListItemText primary="All Movies" />
              </ListItemButton>
            </ListItem>

            {/* Add Movie */}
            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/admin/movies/add"
                sx={{
                  pl: 4,
                  "&.active": { backgroundColor: "#e0e0e0" },
                }}
              >
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="Add Movie" />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>

        {/* Logout */}
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="persistent"
        open={sidebarOpen}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {drawer}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: sidebarOpen ? `${drawerWidth}px` : 0,
          transition: "margin 0.3s",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
