import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

export default function AddMovie() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    release_date: "",
    trailer: "",
    created_by: "",
    posters: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    setSuccessMessage("");
  };

  // Handle submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    // Basic validation
    if (!form.title.trim() || !form.release_date || !form.created_by.trim()) {
      setError("Title, Release Date, and Created By are required fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/movies`,
        form,
        { withCredentials: true }
      );

      toast.success("Movie added successfully!", { position: "top-right" });
      setForm({
        title: "",
        description: "",
        release_date: "",
        trailer: "",
        created_by: "",
        posters: "",
      });
      setSuccessMessage("Movie added successfully!");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "An unexpected error occurred. Please try again."
      );
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
          Add New Movie
        </Typography>

        <Paper
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            maxWidth: "600px",
            width: "95%",
            borderRadius: 3,
            boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Error message */}
          {error && (
            <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
              {error}
            </Typography>
          )}

          {/* Success message */}
          {successMessage && (
            <Typography
              color="success.main"
              sx={{ mb: 2, textAlign: "center" }}
            >
              {successMessage}
            </Typography>
          )}

          {/* Title */}
          <TextField
            required
            fullWidth
            margin="normal"
            name="title"
            label="Movie Title"
            type="text"
            variant="outlined"
            value={form.title}
            onChange={handleChange}
            disabled={loading}
          />

          {/* Description */}
          <TextField
            fullWidth
            margin="normal"
            name="description"
            label="Description"
            type="text"
            multiline
            rows={3}
            variant="outlined"
            value={form.description}
            onChange={handleChange}
            disabled={loading}
          />

          {/* Release Date */}
          <TextField
            required
            fullWidth
            margin="normal"
            name="release_date"
            label="Release Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={form.release_date}
            onChange={handleChange}
            disabled={loading}
          />

          {/* Trailer */}
          <TextField
            fullWidth
            margin="normal"
            name="trailer"
            label="Trailer URL (YouTube)"
            type="url"
            variant="outlined"
            value={form.trailer}
            onChange={handleChange}
            disabled={loading}
          />

          {/* Created By */}
          <TextField
            required
            fullWidth
            margin="normal"
            name="created_by"
            label="Created By"
            type="text"
            variant="outlined"
            value={form.created_by}
            onChange={handleChange}
            disabled={loading}
          />

          {/* Poster URL */}
          <TextField
            fullWidth
            margin="normal"
            name="posters"
            label="Poster URL"
            type="url"
            variant="outlined"
            value={form.posters}
            onChange={handleChange}
            disabled={loading}
          />

          {/* Submit Button */}
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
              "Add Movie"
            )}
          </Button>
        </Paper>
      </Box>
      <ToastContainer />
    </>
  );
}
