import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Typography,
  Paper,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

export default function CreateUser() {
  const [createUserForm, setCreateUserForm] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle input change
  const handleCreateUserFormChange = (event) => {
    const { name, value } = event.target;
    setCreateUserForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
    setError("");
    setSuccessMessage("");
  };

  // Submit new user
  const handleCreateUserSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    // Basic validation
    if (
      !createUserForm.fullname.trim() ||
      !createUserForm.email.trim() ||
      !createUserForm.password
    ) {
      setError("Full name, email and password are required");
      return;
    }

    if (createUserForm.password !== createUserForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (createUserForm.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(createUserForm.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const newUserPayload = {
        fullName: createUserForm.fullname,
        email: createUserForm.email,
        password: createUserForm.password,
        role: createUserForm.role,
      };

      //  Backend endpoint(MySQL Table)
      const response = await axios.post(
        "http://localhost:5000/api/admin/createUser",
        newUserPayload
      );

      if (response.data.success) {
        toast.success("User created successfully!", { position: "top-right" });
        setCreateUserForm({
          fullname: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "user",
        });
      } else {
        setError(response.data.message || "Error creating user");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          background: "linear-gradient(135deg, #f5f6fa 0%, #e3eafc 100%)",
          minHeight: "calc(100vh - 64px)",
          width: "100%",
          py: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ mb: 3, textAlign: "center" }}
        >
          Create New User
        </Typography>

        <Paper
          component="form"
          onSubmit={handleCreateUserSubmit}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            maxWidth: "600px",
            width: "95%",
            borderRadius: 3,
            boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)",
          }}
        >
          {error && (
            <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
              {error}
            </Typography>
          )}
          {successMessage && (
            <Typography
              color="success.main"
              sx={{ mb: 2, textAlign: "center" }}
            >
              {successMessage}
            </Typography>
          )}

          <TextField
            required
            fullWidth
            margin="normal"
            name="fullname"
            label="Full Name"
            type="text"
            variant="outlined"
            value={createUserForm.fullname}
            onChange={handleCreateUserFormChange}
            disabled={loading || !!successMessage}
          />

          <TextField
            required
            fullWidth
            margin="normal"
            name="email"
            label="Email"
            type="email"
            variant="outlined"
            value={createUserForm.email}
            onChange={handleCreateUserFormChange}
            disabled={loading || !!successMessage}
          />

          <TextField
            required
            fullWidth
            margin="normal"
            name="password"
            label="Password"
            type="password"
            variant="outlined"
            value={createUserForm.password}
            onChange={handleCreateUserFormChange}
            disabled={loading || !!successMessage}
          />

          <TextField
            required
            fullWidth
            margin="normal"
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            variant="outlined"
            value={createUserForm.confirmPassword}
            onChange={handleCreateUserFormChange}
            disabled={loading || !!successMessage}
          />

          <FormControl
            fullWidth
            margin="normal"
            disabled={loading || !!successMessage}
          >
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              name="role"
              value={createUserForm.role}
              label="Role"
              onChange={handleCreateUserFormChange}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, py: 1.5, fontSize: "1rem" }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Create User"
            )}
          </Button>
        </Paper>
      </Box>
      <ToastContainer />
    </>
  );
}
