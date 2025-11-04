import {
  Paper,
  Table,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  IconButton,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // dialogs
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ fullname: "", email: "" });

  //  Open dialogs
  const openViewDialog = (user) => setViewUser(user);
  const closeViewDialog = () => setViewUser(null);

  const openEditDialog = (user) => {
    setEditUser(user);
    setEditForm({ fullname: user.fullname, email: user.email });
  };
  const closeEditDialog = () => setEditUser(null);

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  //  Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get("http://localhost:5000/api/admin/users");
        setUsers(res.data);
      } catch (err) {
        setError(
          `Failed to load users: ${err.response?.data?.error || err.message}`
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  //  Edit user
  const handleEditSave = async () => {
    if (!editUser) return;
    try {
      const res = await axios.put(
        `http://localhost:5000/api/admin/users/${editUser.id}`,
        editForm
      );
      setUsers((prev) =>
        prev.map((u) => (u.id === editUser.id ? res.data : u))
      );
      closeEditDialog();
    } catch (err) {
      alert(
        `Failed to update user: ${err.response?.data?.error || err.message}`
      );
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert(
        `Failed to delete user: ${err.response?.data?.error || err.message}`
      );
    }
  };

  // Loading or error states
  if (loading)
    return (
      <CircularProgress sx={{ display: "block", margin: "auto", mt: 5 }} />
    );
  if (error)
    return (
      <Typography color="error" textAlign="center" mt={5}>
        {error}
      </Typography>
    );

  // UI
  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #f5f6fa 0%, #e3eafc 100%)",
        minHeight: "100vh",
        width: "100%",
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", mb: 3 }}>
        All Users
      </Typography>

      <Paper
        sx={{
          p: 2,
          maxWidth: "900px",
          margin: "0 auto",
          width: "95%",
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <Box sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.fullname}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="View">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => openViewDialog(user)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          color="secondary"
                          size="small"
                          onClick={() => openEditDialog(user)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDelete(user.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>
      </Paper>

      {/* Edit User Dialog */}
      <Dialog open={!!editUser} onClose={closeEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="fullname"
            label="Full Name"
            type="text"
            fullWidth
            variant="outlined"
            value={editForm.fullname}
            onChange={handleEditFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={editForm.email}
            onChange={handleEditFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/*  View User Dialog */}
      <Dialog open={!!viewUser} onClose={closeViewDialog} maxWidth="sm" fullWidth>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {viewUser && (
            <Box>
              <Typography variant="body1" gutterBottom>
                <strong>Full Name:</strong> {viewUser.fullname}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Email:</strong> {viewUser.email}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Role:</strong> {viewUser.role}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>ID:</strong> {viewUser.id}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeViewDialog} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
