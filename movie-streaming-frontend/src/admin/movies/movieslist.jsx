import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Avatar,
  Alert,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // dialogs
  const [viewMovie, setViewMovie] = useState(null);
  const [editMovie, setEditMovie] = useState(null);

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    release_date: "",
    trailer: "",
    posters: "",
    created_by: "",
  });

  const openViewDialog = (movie) => setViewMovie(movie);
  const closeViewDialog = () => setViewMovie(null);

  const openEditDialog = (movie) => {
    setEditMovie(movie);
    setEditForm({
      title: movie.title,
      description: movie.description,
      release_date: movie.release_date,
      trailer: movie.trailer,
      posters: movie.posters,
      created_by: movie.created_by,
    });
  };
  const closeEditDialog = () => setEditMovie(null);

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch movies from backend
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/movies`,
          { withCredentials: true }
        );
        setMovies(res.data.movies || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch movies.");
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // Save edited movie
  const handleEditSave = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/admin/movies/${editMovie.id}`,
        editForm,
        { withCredentials: true }
      );
      setMovies((prev) =>
        prev.map((m) =>
          m.id === editMovie.id ? { ...m, ...editForm } : m
        )
      );
      closeEditDialog();
    } catch (err) {
      alert("Failed to update movie: " + err.message);
    }
  };

  // Delete movie
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/admin/movies/${id}`,
        { withCredentials: true }
      );
      setMovies((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      alert("Failed to delete movie: " + err.message);
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Alert severity="error" sx={{ textAlign: "center", mt: 5 }}>
        {error}
      </Alert>
    );

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #f5f6fa 0%, #e3eafc 100%)",
        minHeight: "100vh",
        py: 4,
        px: { xs: 1, sm: 3 },
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Movies List
      </Typography>

      <Paper
        elevation={3}
        sx={{
          maxWidth: "1000px",
          mx: "auto",
          p: 2,
          borderRadius: 3,
          overflowX: "auto",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Poster</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Release Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No movies found.
                </TableCell>
              </TableRow>
            ) : (
              movies.map((movie) => (
                <TableRow key={movie.id}>
                  <TableCell>
                    <Avatar
                      src={movie.posters}
                      variant="square"
                      sx={{ width: 50, height: 70, borderRadius: 2 }}
                    />
                  </TableCell>
                  <TableCell>{movie.title}</TableCell>
                  <TableCell>{movie.release_date}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="View">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => openViewDialog(movie)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        color="secondary"
                        size="small"
                        onClick={() => openEditDialog(movie)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(movie.id)}
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
      </Paper>

      {/* View Movie Dialog */}
      <Dialog open={!!viewMovie} onClose={closeViewDialog} fullWidth>
        <DialogTitle>Movie Details</DialogTitle>
        <DialogContent dividers>
          {viewMovie && (
            <Box>
              <Typography variant="subtitle1">
                <strong>Title:</strong> {viewMovie.title}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Description:</strong> {viewMovie.description}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Release Date:</strong> {viewMovie.release_date}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Trailer:</strong> {viewMovie.trailer}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Created By:</strong> {viewMovie.created_by}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeViewDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Movie Dialog */}
      <Dialog open={!!editMovie} onClose={closeEditDialog} fullWidth>
        <DialogTitle>Edit Movie</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            name="title"
            value={editForm.title}
            onChange={handleEditFormChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            name="description"
            value={editForm.description}
            onChange={handleEditFormChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Release Date"
            name="release_date"
            type="date"
            value={editForm.release_date}
            onChange={handleEditFormChange}
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Trailer Link"
            name="trailer"
            value={editForm.trailer}
            onChange={handleEditFormChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Poster URL"
            name="posters"
            value={editForm.posters}
            onChange={handleEditFormChange}
            fullWidth
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
