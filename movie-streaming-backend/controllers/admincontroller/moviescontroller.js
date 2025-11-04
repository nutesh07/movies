import { db } from "../../config/db.js";

// ---------------- CREATE MOVIE ----------------
export const createMovie = async (req, res) => {
  try {
    const { title, description, release_date, trailer, created_by, posters } = req.body;

    // Basic validation
    if (!title || !release_date || !created_by) {
      return res.status(400).json({
        error: "Title, release date, and created_by are required fields.",
      });
    }

    const query = `
      INSERT INTO movies (title, description, release_date, trailer, created_by, posters)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db
      .promise()
      .query(query, [title, description, release_date, trailer, created_by, posters]);

    res.status(201).json({
      message: "Movie created successfully!",
      movie: {
        id: result.insertId,
        title,
        description,
        release_date,
        trailer,
        created_by,
        posters,
      },
    });
  } catch (err) {
    console.error("Error creating movie:", err.message);
    res.status(500).json({ error: "Server error while creating movie." });
  }
};

// ---------------- READ ALL MOVIES ----------------
export const getMovies = async (req, res) => {
  try {
    const [movies] = await db
      .promise()
      .query("SELECT * FROM movies ORDER BY release_date DESC");

    res.status(200).json({
      total: movies.length,
      movies,
    });
  } catch (err) {
    console.error("Error fetching movies:", err.message);
    res.status(500).json({ error: "Error fetching movie list." });
  }
};

// ---------------- EDIT MOVIE ----------------
export const editMovie = async (req, res) => {
  try {
    const { title, description, release_date, trailer, created_by, posters } = req.body;
    const { id } = req.params;

    const query = `
      UPDATE movies
      SET title=?, description=?, release_date=?, trailer=?, created_by=?, posters=?
      WHERE id=?
    `;

    await db
      .promise()
      .query(query, [title, description, release_date, trailer, created_by, posters, id]);

    res.status(200).json({ message: "Movie updated successfully!" });
  } catch (err) {
    console.error("Error updating movie:", err.message);
    res.status(500).json({ error: "Server error while updating movie." });
  }
};

// ---------------- DELETE MOVIE ----------------
export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    await db.promise().query("DELETE FROM movies WHERE id=?", [id]);

    res.status(200).json({ success: true, message: "Movie deleted successfully!" });
  } catch (err) {
    console.error("Error deleting movie:", err.message);
    res.status(500).json({ error: "Server error while deleting movie." });
  }
};
